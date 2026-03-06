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

final readonly class IngestEvent
{
    public function __construct(
        private EventIngestionRepository $eventIngestionRepository,
    ) {
    }

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

    private static function toUtcDateTime(string $value): DateTimeImmutable
    {
        return (new DateTimeImmutable($value))->setTimezone(new DateTimeZone('UTC'));
    }
}

