<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    /** @param array<string, mixed> $input */
    public function update(User $user, array $input): void
    {
        $data = Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($user)],
        ])->validateWithBag('updateProfileInformation');

        try {
            DB::transaction(function () use ($user, $data): void {
                $member = User::lockForUpdate()->findOrFail($user->id);
                if ($member->email !== $data['email']) {
                    $broker = Password::broker(config('fortify.passwords'));
                    $broker->deleteToken($member);
                    $member->email = $data['email'];
                    $broker->deleteToken($member);
                    $member->email_verified_at = null;
                }

                $member->fill($data)->save();
            });
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['email' => __('validation.unique', ['attribute' => 'email'])])
                ->errorBag('updateProfileInformation');
        }
    }
}
