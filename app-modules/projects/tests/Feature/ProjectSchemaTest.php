<?php

namespace Modules\Projects\Tests\Feature;

use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Modules\Projects\Enums\ProjectStatus;
use Modules\Projects\Models\Project;
use Modules\Projects\Models\ProjectCollaborator;
use Tests\TestCase;

class ProjectSchemaTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_a_saved_project_resolves_its_owner_and_collaborators(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner, 'owner')->create();
        $collaborator = $project->collaborators()->create(['email' => 'member@example.test']);

        $project->refresh();
        $this->assertTrue($project->owner->is($owner));
        $membership = $project->collaborators->sole();
        $this->assertTrue($membership->is($collaborator));
        $this->assertTrue($membership->project->is($project));
        $this->assertNotNull($membership->created_at);
    }

    public function test_a_draft_can_be_archived_and_reference_a_canvas_snapshot(): void
    {
        $project = Project::factory()->create()->refresh();
        $this->assertSame(ProjectStatus::Draft, $project->status);
        $this->assertNull($project->canvas_json_path);

        $key = "canvas/{$project->id}.json";
        $project->update(['status' => ProjectStatus::Archived, 'canvas_json_path' => $key]);

        $project->refresh();
        $this->assertSame(ProjectStatus::Archived, $project->status);
        $this->assertSame($key, $project->canvas_json_path);
    }

    public function test_the_database_rejects_an_unknown_project_status(): void
    {
        $project = Project::factory()->create();

        $this->expectException(QueryException::class);
        Project::query()->whereKey($project->id)->update(['status' => 'UNKNOWN']);
    }

    public function test_a_collaborator_email_must_be_unique_within_a_project(): void
    {
        $membership = ProjectCollaborator::factory()->create();

        $this->expectException(UniqueConstraintViolationException::class);
        $membership->project->collaborators()->create(['email' => $membership->email]);
    }

    public function test_deleting_a_project_removes_only_its_own_membership_for_a_shared_email(): void
    {
        $membership = ProjectCollaborator::factory()->create();
        $otherMembership = ProjectCollaborator::factory()->create(['email' => $membership->email]);

        $membership->project->delete();

        $this->assertModelMissing($membership);
        $this->assertModelExists($otherMembership);
    }
}
