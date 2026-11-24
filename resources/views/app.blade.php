<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="color-scheme" content="dark">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @fonts
        @viteReactRefresh
        @vite(['resources/css/globals.css', 'resources/js/app.jsx'])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body>
        <x-inertia::app />
    </body>
</html>
