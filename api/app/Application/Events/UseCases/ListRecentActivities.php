<?php

declare(strict_types=1);

namespace App\Application\Events\UseCases;

use App\Application\Events\DTOs\ActivityQuery;
use App\Domain\Events\Contracts\EventReadRepository;
use App\Domain\Events\ValueObjects\Uuid;
use DateTimeImmutable;
use DateTimeZone;

/**
 * Coordinates the recent-activity read model for a single user.
 */
final readonly class ListRecentActivities
{
    public function __construct(
        private EventReadRepository $eventReadRepository,
    ) {
    }

    /**
     * Normalizes request filters and returns the recent activity slice.
     *
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

    /**
     * Ensures optional filter timestamps are evaluated in UTC.
     */
    private static function toUtcDateTime(string $value): DateTimeImmutable
    {
        return (new DateTimeImmutable($value))->setTimezone(new DateTimeZone('UTC'));
    }
}
