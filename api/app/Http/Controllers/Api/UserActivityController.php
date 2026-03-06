<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Application\Events\DTOs\ActivityQuery;
use App\Application\Events\DTOs\MetricsQuery;
use App\Application\Events\UseCases\GetEngagementMetrics;
use App\Application\Events\UseCases\ListRecentActivities;
use App\Domain\Events\Entities\ActivityEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ActivitiesRequest;
use App\Http\Requests\Api\MetricsRequest;
use App\Http\Resources\Api\ActivityResource;
use App\Http\Resources\Api\MetricsResource;
use Illuminate\Http\JsonResponse;

/**
 * Serves the read-only dashboard endpoints for activities and engagement metrics.
 */
final class UserActivityController extends Controller
{
    /**
     * Returns recent activities plus the applied query metadata.
     */
    public function activities(
        string $user_id,
        ActivitiesRequest $request,
        ListRecentActivities $listRecentActivities,
    ): JsonResponse {
        $validated = $request->validated();

        $activities = $listRecentActivities(new ActivityQuery(
            userId: $user_id,
            limit: (int) ($validated['limit'] ?? 20),
            from: isset($validated['from']) ? (string) $validated['from'] : null,
            to: isset($validated['to']) ? (string) $validated['to'] : null,
        ));

        return response()->json([
            'data' => array_map(
                fn (ActivityEvent $event): array => (new ActivityResource($event))->toArray($request),
                $activities,
            ),
            'meta' => [
                'user_id' => $user_id,
                'limit' => (int) ($validated['limit'] ?? 20),
                'from' => $validated['from'] ?? null,
                'to' => $validated['to'] ?? null,
                'count' => count($activities),
            ],
        ]);
    }

    /**
     * Returns the aggregate metrics model for the selected user and date window.
     */
    public function metrics(
        string $user_id,
        MetricsRequest $request,
        GetEngagementMetrics $getEngagementMetrics,
    ): JsonResponse {
        $validated = $request->validated();

        $metrics = $getEngagementMetrics(new MetricsQuery(
            userId: $user_id,
            from: isset($validated['from']) ? (string) $validated['from'] : null,
            to: isset($validated['to']) ? (string) $validated['to'] : null,
        ));

        return response()->json([
            'data' => (new MetricsResource($metrics))->toArray($request),
        ]);
    }
}
