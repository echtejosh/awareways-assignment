<?php

declare(strict_types=1);

namespace App\Domain\Events\Entities;

use App\Domain\Events\Enums\EventType;
use App\Domain\Events\ValueObjects\Uuid;
use DateTimeImmutable;
use DateTimeZone;

final readonly class ActivityEvent
{
    /**
     * @param array<string, mixed> $payload
     */
    public function __construct(
        public Uuid $id,
        public Uuid $userId,
        public EventType $eventType,
        public DateTimeImmutable $occurredAt,
        public array $payload,
        public DateTimeImmutable $ingestedAt,
    ) {
    }

    /**
     * @param array<string, mixed> $payload
     */
    public static function record(
        Uuid $userId,
        EventType $eventType,
        DateTimeImmutable $occurredAt,
        array $payload,
    ): self {
        return new self(
            id: Uuid::new(),
            userId: $userId,
            eventType: $eventType,
            occurredAt: $occurredAt->setTimezone(new DateTimeZone('UTC')),
            payload: $payload,
            ingestedAt: new DateTimeImmutable('now', new DateTimeZone('UTC')),
        );
    }
}

