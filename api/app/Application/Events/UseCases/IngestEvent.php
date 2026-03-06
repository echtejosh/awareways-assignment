<?php

declare(strict_types=1);

namespace App\Application\Events\UseCases;

use App\Application\Events\DTOs\IngestEventData;
use App\Domain\Events\Contracts\EventIngestionRepository;
use App\Domain\Events\Entities\ActivityEvent;
use App\Domain\Events\Enums\EventType;
use App\Domain\Events\ValueObjects\Uuid;
use DateTimeImmutable;
use DateTimeZone;

/**
 * Normalizes raw ingestion input into a domain event and delegates persistence.
 */
final readonly class IngestEvent
{
    public function __construct(
        private EventIngestionRepository $eventIngestionRepository,
    ) {
    }

    /**
     * Records a new event with normalized UUID, enum, and UTC timestamp values.
     */
    public function __invoke(IngestEventData $data): ActivityEvent
    {
        $event = ActivityEvent::record(
            userId: Uuid::fromString($data->userId),
            eventType: EventType::from($data->eventType),
            occurredAt: self::toUtcDateTime($data->occurredAt),
            payload: $data->payload,
        );

        return $this->eventIngestionRepository->save($event);
    }

    /**
     * Converts incoming client timestamps to a single UTC baseline.
     */
    private static function toUtcDateTime(string $value): DateTimeImmutable
    {
        return (new DateTimeImmutable($value))->setTimezone(new DateTimeZone('UTC'));
    }
}
