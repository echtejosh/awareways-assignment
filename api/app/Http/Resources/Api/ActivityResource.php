<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use App\Domain\Events\Entities\ActivityEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ActivityEvent
 */
final class ActivityResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ActivityEvent $event */
        $event = $this->resource;

        return [
            'id' => $event->id->toString(),
            'user_id' => $event->userId->toString(),
            'event_type' => $event->eventType->value,
            'occurred_at' => $event->occurredAt->format(DATE_ATOM),
            'payload' => $event->payload,
            'ingested_at' => $event->ingestedAt->format(DATE_ATOM),
        ];
    }
}
