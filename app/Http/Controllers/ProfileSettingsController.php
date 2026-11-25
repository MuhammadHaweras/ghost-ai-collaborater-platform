<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProfileSettingsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Profile', [
            'connectedProviders' => DB::table('social_identities')->where('user_id', $request->user()->id)->pluck('provider'),
            'socialStatus' => $request->session()->get('socialStatus'),
        ]);
    }
}
