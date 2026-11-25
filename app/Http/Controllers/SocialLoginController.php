<?php

namespace App\Http\Controllers;

use App\Actions\Fortify\ResolveSocialUser;
use DomainException;
use Exception;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Socialite;

class SocialLoginController extends Controller
{
    public function redirect(Request $request, string $provider): RedirectResponse
    {
        $request->session()->put('social_flow', ['provider' => $provider, 'member' => $request->user()?->id]);

        return Socialite::driver($provider)->redirect();
    }

    public function callback(Request $request, string $provider, ResolveSocialUser $accounts): RedirectResponse
    {
        $member = $request->user();
        $returnRoute = $member ? 'profile' : 'login';
        $flow = $request->session()->pull('social_flow');
        if ($flow !== ['provider' => $provider, 'member' => $member?->id] || ! $request->filled('code') || $request->has('error')) {
            return to_route($returnRoute)->withErrors(['social' => 'Sign-in was cancelled or expired. Please try again.']);
        }

        try {
            $identity = Socialite::driver($provider)->user();
        } catch (Exception) {
            return to_route($returnRoute)->withErrors(['social' => 'Could not authenticate with the provider. Please try again.']);
        }

        try {
            $user = $accounts->resolve($provider, $identity, $member);
        } catch (DomainException $exception) {
            return to_route($returnRoute)->withErrors(['social' => $exception->getMessage()]);
        } catch (UniqueConstraintViolationException) {
            return to_route($returnRoute)->withErrors(['social' => 'The account connection changed. Please try again.']);
        }

        if ($member) {
            return to_route('profile')->with('socialStatus', ucfirst($provider).' connected.');
        }
        if ($user->two_factor_confirmed_at) {
            return to_route('login')->withErrors(['social' => 'Use your password and second factor to sign in.']);
        }

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('editor'));
    }
}
