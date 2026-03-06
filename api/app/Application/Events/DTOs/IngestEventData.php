<?php

declare(strict_types=1);

namespace App\Application\Events\DTOs;

final readonly class IngestEventData
{
    /**
     * @param array<string, mixed> $payload
     */
    public function __construct(
        public string $userId,
        public string $eventType,
        public string $occurredAt,
        public array $payload,
    ) {
    }

    /**
     * @param array<string, mixed> $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            userId: (string) $validated['user_id'],
            eventType: (string) $validated['event_type'],
            occurredAt: (string) $validated['occurred_at'],
            payload: (array) ($validated['payload'] ?? []),
        );
    }
}
