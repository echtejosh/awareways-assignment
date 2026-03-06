<?php

declare(strict_types=1);

namespace App\Domain\Events\Entities;

use App\Domain\Events\ValueObjects\Uuid;
use DateTimeImmutable;

final readonly class EngagementMetrics
{
    /**
     * @param array<string, int> $eventCounts
     */
    public function __construct(
        public Uuid $userId,
        public DateTimeImmutable $from,
        public DateTimeImmutable $to,
        public int $totalEvents,
        public array $eventCounts,
        public int $totalPoints,
        public int $completedTrainings,
        public int $startedTrainings,
        public int $progressEvents,
        public int $activeDays,
        public ?DateTimeImmutable $latestActivity,
    ) {
    }
}
