<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $this->withoutVite();

        $response = $this->get('/');

        $response->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Welcome'));
    }

    public function test_an_inertia_visit_to_home_returns_the_welcome_page_payload(): void
    {
        $this->withoutVite();
        $initialPage = $this->get('/')->inertiaPage();

        $response = $this->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $initialPage['version'] ?? '',
        ])->get('/');

        $response->assertOk()
            ->assertHeader('X-Inertia', 'true')
            ->assertJsonPath('component', 'Welcome');
    }
}
