<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\TestWith;
use Tests\TestCase;

class WorkspaceAuthenticationTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_root_sends_guests_to_login_and_members_to_the_editor(): void
    {
        $this->get('/')->assertRedirectToRoute('login');
        $this->actingAs(User::factory()->create())->get('/')->assertRedirectToRoute('editor');
    }

    #[TestWith(['/login', 'auth/Login'])]
    #[TestWith(['/register', 'auth/Register'])]
    #[TestWith(['/forgot-password', 'auth/ForgotPassword'])]
    public function test_guest_forms_share_a_null_user_and_redirect_members(string $path, string $component): void
    {
        $this->get($path)->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component($component)->where('auth.user', null));

        $this->actingAs(User::factory()->create())->get($path)->assertRedirectToRoute('editor');
    }

    public function test_login_resumes_the_requested_editor_visit_and_shares_only_name_and_email(): void
    {
        $user = User::factory()->create();

        $this->get('/editor?view=canvas')->assertRedirectToRoute('login');
        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect('/editor?view=canvas');

        $this->assertAuthenticatedAs($user);
        $this->get('/editor')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Editor')->where('auth.user', ['name' => $user->name, 'email' => $user->email]));
    }

    public function test_direct_login_opens_editor_and_logout_revokes_access(): void
    {
        $user = User::factory()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])->assertRedirectToRoute('editor');
        $this->post('/logout')->assertRedirectToRoute('login');

        $this->assertGuest();
        $this->get('/editor')->assertRedirectToRoute('login');
    }

    public function test_failed_login_shows_an_error_and_keeps_the_workspace_protected(): void
    {
        $user = User::factory()->create();

        $this->from('/login')->post('/login', ['email' => $user->email, 'password' => 'incorrect'])
            ->assertRedirect('/login')->assertSessionHasErrors(['email' => __('auth.failed')]);

        $this->assertGuest();
        $this->get('/editor')->assertRedirectToRoute('login');
    }

    public function test_registration_opens_the_editor_even_after_requesting_profile_settings(): void
    {
        $user = User::factory()->make();
        $this->get('/profile')->assertRedirectToRoute('login');

        $this->post('/register', [
            'name' => $user->name,
            'email' => $user->email,
            'password' => 'first-password',
            'password_confirmation' => 'first-password',
        ])->assertRedirectToRoute('editor');

        $registered = User::where('email', $user->email)->sole();
        $this->assertAuthenticatedAs($registered);
        $this->assertSame($user->name, $registered->name);
        $this->assertTrue(Hash::check('first-password', $registered->password));
    }

    public function test_invalid_registration_reports_errors_and_leaves_the_visitor_signed_out(): void
    {
        $this->from('/register')->post('/register', [
            'email' => 'invalid',
            'password' => 'first-password',
            'password_confirmation' => 'does-not-match',
        ])->assertRedirect('/register')->assertSessionHasErrors(['name', 'email', 'password']);

        $this->assertDatabaseCount('users', 0);
        $this->assertGuest();
        $this->get('/editor')->assertRedirectToRoute('login');
    }

    public function test_an_emailed_reset_link_changes_the_password_and_returns_to_login(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $this->from('/forgot-password')->post('/forgot-password', ['email' => $user->email])
            ->assertRedirect('/forgot-password')->assertSessionHas('status', __('passwords.sent'));
        $this->get('/forgot-password')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('status', __('passwords.sent')));

        Notification::assertSentTo($user, ResetPassword::class);
        $notice = Notification::sent($user, ResetPassword::class)->sole();
        $this->get($notice->toMail($user)->actionUrl)->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('auth/ResetPassword')->where('token', $notice->token)->where('email', $user->email));

        $payload = [
            'token' => $notice->token,
            'email' => $user->email,
            'password' => 'replacement-password',
            'password_confirmation' => 'replacement-password',
        ];
        $this->post('/reset-password', $payload)->assertRedirectToRoute('login');
        $this->get('/login')->assertInertia(fn (AssertableInertia $page) => $page->where('status', __('passwords.reset')));
        $this->post('/reset-password', $payload)->assertSessionHasErrors(['email' => __('passwords.token')]);
        $this->post('/login', ['email' => $user->email, 'password' => 'replacement-password'])->assertRedirectToRoute('editor');
        $this->assertAuthenticatedAs($user);
    }
}
