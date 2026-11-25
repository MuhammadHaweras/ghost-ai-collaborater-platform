<?php

namespace App\Actions\Fortify;

use App\Models\User;
use DomainException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Two\User as ProviderUser;

class ResolveSocialUser
{
    public function resolve(string $provider, ProviderUser $identity, ?User $member): User
    {
        $subject = (string) $identity->getId();

        if ($subject === '' || strlen($subject) > 255) {
            throw new DomainException('The provider did not return a valid account ID.');
        }

        return DB::transaction(function () use ($provider, $identity, $subject, $member): User {
            $identities = DB::table('social_identities')->where('provider', $provider);
            $owner = (clone $identities)->where('provider_id', $subject)->value('user_id');

            if ($owner !== null) {
                $user = User::findOrFail($owner);
                if ($member && ! $member->is($user)) {
                    throw new DomainException('That provider account is already connected to another account.');
                }

                return $user;
            }

            // Socialite obtains GitHub's primary verified email through the user:email scope.
            $email = Str::lower(trim((string) $identity->getEmail()));
            if (! filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255
                || ($provider === 'google' && ($identity->getRaw()['email_verified'] ?? false) !== true)) {
                throw new DomainException('A verified email address from the provider is required.');
            }

            $user = User::where('email', $email)->lockForUpdate()->first();
            if ($member && ! $member->is($user)) {
                throw new DomainException('Choose a provider account with the same email as your profile.');
            }
            // Google can verify a third-party mailbox once without managing its future ownership.
            $canLinkByEmail = $provider === 'github' || Str::endsWith($email, '@gmail.com')
                || filled($identity->getRaw()['hd'] ?? null);
            if ($user && ! $member && (! $user->email_verified_at || ! $canLinkByEmail)) {
                throw new DomainException('Sign in to your existing account, then connect this provider in Profile settings.');
            }
            if ($user && (clone $identities)->where('user_id', $user->id)->exists()) {
                throw new DomainException('A different account from this provider is already connected.');
            }

            if (! $user) {
                $user = new User([
                    'name' => Str::substr($identity->getName() ?: $identity->getNickname() ?: Str::before($email, '@'), 0, 255),
                    'email' => $email,
                    'password' => Str::random(64),
                ]);
            }

            $new = ! $user->exists;
            $user->email_verified_at ??= now();
            $user->save();
            DB::table('social_identities')->insert(['user_id' => $user->id, 'provider' => $provider, 'provider_id' => $subject]);
            if ($new) {
                DB::afterCommit(fn () => event(new Registered($user)));
            }

            return $user;
        });
    }
}
