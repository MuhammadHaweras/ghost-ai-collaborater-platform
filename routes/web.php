<?php

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

Route::get('/', function (Request $request): RedirectResponse {
    return to_route($request->user() ? 'editor' : 'login');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/editor', fn (): Response => Inertia::render('Editor'))->name('editor');
    Route::get('/profile', fn (): Response => Inertia::render('Profile'))->name('profile');
});
