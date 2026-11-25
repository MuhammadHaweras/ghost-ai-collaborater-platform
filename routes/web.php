<?php

use App\Http\Controllers\ProfileSettingsController;
use App\Http\Controllers\SocialLoginController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

Route::get('/', function (Request $request): RedirectResponse {
    return to_route($request->user() ? 'editor' : 'login');
});

Route::prefix('auth/{provider}')->whereIn('provider', ['google', 'github'])->group(function (): void {
    Route::get('redirect', [SocialLoginController::class, 'redirect'])->name('social.redirect');
    Route::get('callback', [SocialLoginController::class, 'callback'])->name('social.callback');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/editor', fn (): Response => Inertia::render('Editor'))->name('editor');
    Route::get('/profile', ProfileSettingsController::class)->name('profile');
});
