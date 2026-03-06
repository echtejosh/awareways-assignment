<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Application\Events\DTOs\IngestEventData;
use App\Application\Events\UseCases\IngestEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\IngestEventRequest;
use App\Http\Resources\Api\ActivityResource;
use Illuminate\Http\JsonResponse;

final class EventIngestionController extends Controller
{
    public function __invoke(
        IngestEventRequest $request,
        IngestEvent $ingestEvent,
    ): JsonResponse {
        $validated = $request->validated();
        $validated['payload'] = (array) $request->input('payload', []);

        $event = $ingestEvent(IngestEventData::fromValidated($validated));

        return response()->json([
            'data' => (new ActivityResource($event))->toArray($request),
        ], 201);
    }
}
