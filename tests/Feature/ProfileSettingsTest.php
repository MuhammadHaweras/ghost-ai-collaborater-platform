<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ProfileSettingsTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_guests_must_sign_in_to_view_or_update_settings(): void
    {
        $this->get('/profile')->assertRedirectToRoute('login');
        $this->put('/user/profile-information')->assertRedirectToRoute('login');
        $this->put('/user/password')->assertRedirectToRoute('login');
    }

    public function test_members_can_update_their_profile_email_without_sending_a_notification(): void
    {
        Notification::fake();
        $this->withoutVite();
        $user = User::factory()->create();
        $oldResetToken = Password::broker()->createToken($user);
        $this->actingAs($user)->get('/profile')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Profile')->where('auth.user.email', $user->email));

        $this->from('/profile')->put('/user/profile-information', [
            'name' => 'Updated Name',
            'email' => 'UPDATED@example.test',
        ])->assertRedirect('/profile')->assertSessionHasNoErrors();
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.test',
            'email_verified_at' => null,
        ]);
        $this->assertFalse(Password::broker()->tokenExists($user, $oldResetToken));
        Notification::assertNothingSent();
    }

    public function test_duplicate_email_is_reported_on_the_profile_form(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $this->actingAs($user)->from('/profile')->put('/user/profile-information', [
            'name' => $user->name,
            'email' => $other->email,
        ])->assertRedirect('/profile')->assertSessionHasErrorsIn('updateProfileInformation', ['email']);
        $this->assertSame($user->email, $user->fresh()->email);
    }

    public function test_password_change_requires_the_current_password_and_a_confirmed_replacement(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->from('/profile');

        $this->put('/user/password', [
            'current_password' => 'incorrect',
            'password' => 'replacement-password',
            'password_confirmation' => 'different',
        ])->assertRedirect('/profile')->assertSessionHasErrorsIn('updatePassword', ['current_password', 'password']);
        $this->assertTrue(Hash::check('password', $user->fresh()->password));

        $this->put('/user/password', [
            'current_password' => 'password',
            'password' => 'replacement-password',
            'password_confirmation' => 'replacement-password',
        ])->assertRedirect('/profile')->assertSessionHasNoErrors();
        $this->assertTrue(Hash::check('replacement-password', $user->fresh()->password));
    }
}
