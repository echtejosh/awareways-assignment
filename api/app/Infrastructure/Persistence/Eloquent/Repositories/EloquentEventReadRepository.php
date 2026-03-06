<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\Events\Contracts\EventReadRepository;
use App\Domain\Events\Entities\ActivityEvent;
use App\Domain\Events\Entities\EngagementMetrics;
use App\Domain\Events\Enums\EventType;
use App\Domain\Events\ValueObjects\Uuid;
use App\Infrastructure\Persistence\Eloquent\Models\ActivityEventModel;
use DateTimeImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final readonly class EloquentEventReadRepository implements EventReadRepository
{
    /**
     * @return array<int, ActivityEvent>
     */
    public function listRecentActivities(
        Uuid $userId,
        ?DateTimeImmutable $from,
        ?DateTimeImmutable $to,
        int $limit,
    ): array {
        $query = ActivityEventModel::query()
            ->where('user_id', $userId->toString())
            ->orderByDesc('occurred_at')
            ->limit($limit);

        if ($from !== null) {
            $query->where('occurred_at', '>=', $from);
        }

        if ($to !== null) {
            $query->where('occurred_at', '<=', $to);
        }

        /** @var Collection<int, ActivityEventModel> $rows */
        $rows = $query->get();

        return $rows
            ->map(fn (ActivityEventModel $row): ActivityEvent => $this->mapToEntity($row))
            ->all();
    }

    public function getEngagementMetrics(
        Uuid $userId,
        DateTimeImmutable $from,
        DateTimeImmutable $to,
    ): EngagementMetrics {
        $baseQuery = ActivityEventModel::query()->where('user_id', $userId->toString());
        $baseQuery = $this->applyDateRange($baseQuery, $from, $to);

        $totalEvents = (clone $baseQuery)->count();

        /** @var array<string, int> $eventCounts */
        $eventCounts = (clone $baseQuery)
            ->selectRaw('event_type, COUNT(*) as aggregate')
            ->groupBy('event_type')
            ->pluck('aggregate', 'event_type')
            ->map(fn (mixed $value): int => (int) $value)
            ->all();

        /** @var Collection<int, ActivityEventModel> $pointRows */
        $pointRows = (clone $baseQuery)
            ->where('event_type', EventType::POINTS_SCORED->value)
            ->get(['payload']);

        $totalPoints = $pointRows->sum(
            static fn (ActivityEventModel $row): int => (int) ($row->payload['points'] ?? 0),
        );

        $activeDays = (clone $baseQuery)
            ->selectRaw('COUNT(DISTINCT DATE(occurred_at)) as aggregate')
            ->value('aggregate');

        $latestOccurredAt = (clone $baseQuery)->max('occurred_at');

        return new EngagementMetrics(
            userId: $userId,
            from: $from,
            to: $to,
            totalEvents: $totalEvents,
            eventCounts: [
                EventType::TRAINING_STARTED->value => $eventCounts[EventType::TRAINING_STARTED->value] ?? 0,
                EventType::PROGRESS_MADE->value => $eventCounts[EventType::PROGRESS_MADE->value] ?? 0,
                EventType::POINTS_SCORED->value => $eventCounts[EventType::POINTS_SCORED->value] ?? 0,
                EventType::TRAINING_COMPLETED->value => $eventCounts[EventType::TRAINING_COMPLETED->value] ?? 0,
            ],
            totalPoints: $totalPoints,
            completedTrainings: $eventCounts[EventType::TRAINING_COMPLETED->value] ?? 0,
            startedTrainings: $eventCounts[EventType::TRAINING_STARTED->value] ?? 0,
            progressEvents: $eventCounts[EventType::PROGRESS_MADE->value] ?? 0,
            activeDays: (int) ($activeDays ?? 0),
            latestActivity: $latestOccurredAt !== null ? new DateTimeImmutable((string) $latestOccurredAt) : null,
        );
    }

    private function applyDateRange(
        Builder $query,
        DateTimeImmutable $from,
        DateTimeImmutable $to,
    ): Builder {
        return $query
            ->where('occurred_at', '>=', $from)
            ->where('occurred_at', '<=', $to);
    }

    private function mapToEntity(ActivityEventModel $row): ActivityEvent
    {
        return new ActivityEvent(
            id: Uuid::fromString((string) $row->id),
            userId: Uuid::fromString((string) $row->user_id),
            eventType: EventType::from((string) $row->event_type),
            occurredAt: new DateTimeImmutable($row->occurred_at->toIso8601String()),
            payload: (array) $row->payload,
            ingestedAt: new DateTimeImmutable($row->ingested_at->toIso8601String()),
        );
    }
}
