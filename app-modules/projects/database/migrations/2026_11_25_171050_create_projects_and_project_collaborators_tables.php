<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('owner_id')->constrained('users');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['DRAFT', 'ARCHIVED']);
            $table->string('canvas_json_path')->nullable();
            $table->timestamps();
            $table->index(['owner_id', 'created_at']);
        });

        Schema::create('project_collaborators', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('email');
            $table->timestamp('created_at');
            $table->unique(['project_id', 'email']);
            $table->index('email');
            $table->index(['project_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_collaborators');
        Schema::dropIfExists('projects');
    }
};
