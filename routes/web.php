<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

Route::get('/', function (): Response {
    return Inertia::render('Welcome', [
        'appName' => config('app.name', 'Laravel'),
        'laravelVersion' => app()->version(),
    ]);
});

Route::get('/editor', function (): Response {
    return Inertia::render('Editor');
})->name('editor');
