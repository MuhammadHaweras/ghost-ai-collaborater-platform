<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * @param  Request  $request
     */
    public function toResponse(mixed $request): JsonResponse|RedirectResponse
    {
        $request->session()->forget('url.intended');

        return $request->wantsJson() ? new JsonResponse('', 201) : to_route('editor');
    }
}
