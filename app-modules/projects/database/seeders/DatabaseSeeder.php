<?php

namespace Modules\Projects\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Projects\Models\Project;
use Modules\Projects\Models\ProjectCollaborator;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::factory()->has(ProjectCollaborator::factory(), 'collaborators')->create();
    }
}
