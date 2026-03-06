<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use App\Domain\Events\Entities\EngagementMetrics;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin EngagementMetrics
 */
final class MetricsResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var EngagementMetrics $metrics */
        $metrics = $this->resource;

        return [
            'user_id' => $metrics->userId->toString(),
            'from' => $metrics->from->format(DATE_ATOM),
            'to' => $metrics->to->format(DATE_ATOM),
            'total_events' => $metrics->totalEvents,
            'event_counts' => $metrics->eventCounts,
            'total_points' => $metrics->totalPoints,
            'completed_trainings' => $metrics->completedTrainings,
            'started_trainings' => $metrics->startedTrainings,
            'progress_events' => $metrics->progressEvents,
            'active_days' => $metrics->activeDays,
            'latest_activity' => $metrics->latestActivity?->format(DATE_ATOM),
        ];
    }
}
