<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Laravel\Socialite\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Laravel\Socialite\Two\User as ProviderUser;
use PHPUnit\Framework\Attributes\TestWith;
use Tests\TestCase;

class SocialLoginTest extends TestCase
{
    use LazilyRefreshDatabase;

    private function providerUser(?string $email = 'member@example.test', bool $verified = true): ProviderUser
    {
        return (new ProviderUser)->setRaw(['email_verified' => $verified])
            ->map(['id' => 'subject-42', 'email' => $email, 'name' => 'Provider Member']);
    }

    #[TestWith(['google'])]
    #[TestWith(['github'])]
    public function test_new_social_account_can_return_by_provider_id_after_its_email_changes(string $provider): void
    {
        Socialite::fake($provider, $this->providerUser());
        $this->get('/editor?tab=projects')->assertRedirectToRoute('login');
        $this->get("/auth/$provider/redirect")->assertRedirect("https://socialite.fake/$provider/authorize");
        $this->get("/auth/$provider/callback?code=test")->assertRedirect('/editor?tab=projects');

        $user = User::where('email', 'member@example.test')->sole();
        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->email_verified_at);
        $this->assertDatabaseHas('social_identities', ['user_id' => $user->id, 'provider_id' => 'subject-42', 'provider' => $provider]);

        $this->post('/logout');
        Socialite::fake($provider, $this->providerUser('changed@example.test'));
        $this->get("/auth/$provider/redirect");
        $this->get("/auth/$provider/callback?code=return")->assertRedirectToRoute('editor');
        $this->assertAuthenticatedAs($user);
        $this->assertDatabaseCount('users', 1);
        $this->assertSame('member@example.test', $user->fresh()->email);
    }

    public function test_verified_existing_account_is_reused(): void
    {
        $user = User::factory()->create(['email' => 'existing.member@gmail.com']);
        Socialite::fake('google', $this->providerUser($user->email));
        $this->get('/auth/google/redirect');
        $this->get('/auth/google/callback?code=ok')->assertRedirectToRoute('editor');
        $this->assertAuthenticatedAs($user);
        $this->assertDatabaseCount('users', 1);
    }

    public function test_google_third_party_mailbox_requires_an_explicit_connection_to_an_existing_account(): void
    {
        $user = User::factory()->create(['email' => 'third-party@example.test']);
        Socialite::fake('google', $this->providerUser($user->email));
        $this->get('/auth/google/redirect');
        $this->get('/auth/google/callback?code=test')->assertRedirectToRoute('login')->assertSessionHasErrors('social');
        $this->assertGuest();
        $this->assertDatabaseEmpty('social_identities');
    }

    public function test_unverified_local_account_must_sign_in_to_connect(): void
    {
        $user = User::factory()->unverified()->create();
        Socialite::fake('github', $this->providerUser($user->email));
        $this->get('/auth/github/redirect');
        $this->get('/auth/github/callback?code=first')->assertRedirectToRoute('login')->assertSessionHasErrors('social');
        $this->assertGuest();
        $this->assertDatabaseEmpty('social_identities');

        $this->actingAs($user)->get('/auth/github/redirect');
        $this->get('/auth/github/callback?code=second')->assertRedirectToRoute('profile')->assertSessionHas('socialStatus');
        $this->assertDatabaseHas('social_identities', ['provider' => 'github', 'user_id' => $user->id]);
    }

    #[TestWith(['google', 'member@example.test', false])]
    #[TestWith(['github', null, false])]
    public function test_first_sign_in_requires_a_verified_provider_email(string $provider, ?string $email, bool $verified): void
    {
        Socialite::fake($provider, $this->providerUser($email, $verified));
        $this->get("/auth/$provider/redirect");
        $this->get("/auth/$provider/callback?code=test")->assertSessionHasErrors('social');
        $this->assertDatabaseCount('users', 0);
        $this->assertGuest();
    }

    public function test_missing_state_cancellation_and_provider_failure_return_to_login(): void
    {
        $this->get('/auth/unknown/redirect')->assertNotFound();
        $this->get('/auth/google/callback?code=unexpected')->assertRedirectToRoute('login')->assertSessionHasErrors('social');
        Socialite::fake('google', function () {
            throw new InvalidStateException;
        });
        $this->get('/auth/google/redirect');
        $this->get('/auth/google/callback?error=access_denied')->assertSessionHasErrors('social');
        $this->get('/auth/google/redirect');
        $this->get('/auth/google/callback?code=expired')->assertSessionHasErrors('social');
        $this->assertGuest();
    }

    public function test_signed_in_members_cannot_claim_someone_elses_provider(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        Socialite::fake('github', $this->providerUser($owner->email));
        $this->actingAs($other)->get('/auth/github/redirect');
        $this->get('/auth/github/callback?code=different')->assertRedirectToRoute('profile')->assertSessionHasErrors('social');
        $this->assertDatabaseEmpty('social_identities');

        $this->actingAs($owner)->get('/auth/github/redirect');
        $this->get('/auth/github/callback?code=connect')->assertSessionHasNoErrors();
        $this->actingAs($other)->get('/auth/github/redirect');
        $this->get('/auth/github/callback?code=claimed')->assertSessionHasErrors('social');
        $this->assertAuthenticatedAs($other);
        $this->assertDatabaseCount('social_identities', 1);
    }
}
