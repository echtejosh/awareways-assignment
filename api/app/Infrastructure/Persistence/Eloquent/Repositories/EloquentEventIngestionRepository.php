<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\Events\Contracts\EventIngestionRepository;
use App\Domain\Events\Entities\ActivityEvent;
use App\Infrastructure\Persistence\Eloquent\Models\ActivityEventModel;

/**
 * Stores domain activity events in the activity_events table without re-shaping them.
 */
final readonly class EloquentEventIngestionRepository implements EventIngestionRepository
{
    /**
     * Writes the event record and returns the original domain entity unchanged.
     */
    public function save(ActivityEvent $event): ActivityEvent
    {
        ActivityEventModel::query()->create([
            'id' => $event->id->toString(),
            'user_id' => $event->userId->toString(),
            'event_type' => $event->eventType->value,
            'occurred_at' => $event->occurredAt,
            'payload' => $event->payload,
            'ingested_at' => $event->ingestedAt,
        ]);

        return $event;
    }
}
