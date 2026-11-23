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
