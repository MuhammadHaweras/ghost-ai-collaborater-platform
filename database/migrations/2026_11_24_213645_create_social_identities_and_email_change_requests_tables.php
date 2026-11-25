<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_identities', function (Blueprint $table): void {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider', 16);
            $table->string('provider_id');
            $table->primary(['provider', 'provider_id']);
            $table->unique(['user_id', 'provider']);
        });

        Schema::create('email_change_requests', function (Blueprint $table): void {
            $table->foreignId('user_id')->primary()->constrained()->cascadeOnDelete();
            $table->string('email');
            $table->char('code_digest', 64);
            $table->unsignedTinyInteger('attempts');
            $table->unsignedBigInteger('sent_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_change_requests');
        Schema::dropIfExists('social_identities');
    }
};
