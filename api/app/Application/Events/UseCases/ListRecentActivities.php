<?php

declare(strict_types=1);

namespace App\Application\Events\UseCases;

use App\Application\Events\DTOs\ActivityQuery;
use App\Domain\Events\Contracts\EventReadRepository;
use App\Domain\Events\ValueObjects\Uuid;
use DateTimeImmutable;
use DateTimeZone;

final readonly class ListRecentActivities
{
    public function __construct(
        private EventReadRepository $eventReadRepository,
    ) {
    }

    /**
     * @return array<int, \App\Domain\Events\Entities\ActivityEvent>
     */
    public function __invoke(ActivityQuery $query): array
    {
        return $this->eventReadRepository->listRecentActivities(
            userId: Uuid::fromString($query->userId),
            from: $query->from !== null ? self::toUtcDateTime($query->from) : null,
            to: $query->to !== null ? self::toUtcDateTime($query->to) : null,
            limit: $query->limit,
        );
    }

    private static function toUtcDateTime(string $value): DateTimeImmutable
    {
        return (new DateTimeImmutable($value))->setTimezone(new DateTimeZone('UTC'));
    }
}

