<?php

declare(strict_types=1);

namespace App\Domain\Events\Contracts;

use App\Domain\Events\Entities\EngagementMetrics;
use App\Domain\Events\ValueObjects\Uuid;
use DateTimeImmutable;

interface EventReadRepository
{
    /**
     * Returns the most recent activity slice for a user within an optional time window.
     *
     * @return array<int, \App\Domain\Events\Entities\ActivityEvent>
     */
    public function listRecentActivities(
        Uuid $userId,
        ?DateTimeImmutable $from,
        ?DateTimeImmutable $to,
        int $limit,
    ): array;

    /**
     * Builds the aggregate metrics view consumed by the dashboard summary cards.
     */
    public function getEngagementMetrics(
        Uuid $userId,
        DateTimeImmutable $from,
        DateTimeImmutable $to,
    ): EngagementMetrics;
}
