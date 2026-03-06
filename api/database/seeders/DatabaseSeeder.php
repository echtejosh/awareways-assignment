<?php

namespace Database\Seeders;

use App\Domain\Events\Enums\EventType;
use App\Infrastructure\Persistence\Eloquent\Models\ActivityUserModel;
use App\Models\User;
use App\Infrastructure\Persistence\Eloquent\Models\ActivityEventModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->firstOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'password' => 'password',
            'email_verified_at' => Carbon::now(),
        ]);

        ActivityUserModel::query()->firstOrCreate([
            'id' => '52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6',
        ], [
            'name' => 'Seeded Demo User',
        ]);

        ActivityEventModel::query()->firstOrCreate([
            'id' => 'b2b96d7f-c5fd-49c4-a343-89ed7c15f4b8',
        ], [
            'user_id' => '52db9059-b2d7-4ce9-88f0-f2c26ce1b4f6',
            'event_type' => EventType::TRAINING_STARTED->value,
            'occurred_at' => Carbon::now()->subDay(),
            'payload' => [
                'training_id' => 'seed-training-101',
            ],
            'ingested_at' => Carbon::now(),
        ]);
    }
}
