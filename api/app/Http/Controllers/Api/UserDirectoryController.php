<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Application\Users\UseCases\SearchUsers;
use App\Domain\Users\Entities\ActivityUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SearchUsersRequest;
use App\Http\Resources\Api\ActivityUserResource;
use Illuminate\Http\JsonResponse;

/**
 * Exposes the activity user directory for UI search and selection flows.
 */
final class UserDirectoryController extends Controller
{
    /**
     * Returns matching users together with the applied search metadata.
     */
    public function __invoke(
        SearchUsersRequest $request,
        SearchUsers $searchUsers,
    ): JsonResponse {
        $validated = $request->validated();
        $search = isset($validated['search']) ? (string) $validated['search'] : null;
        $limit = (int) ($validated['limit'] ?? 10);

        $users = $searchUsers($search, $limit);

        return response()->json([
            'data' => array_map(
                fn (ActivityUser $user): array => (new ActivityUserResource($user))->toArray($request),
                $users,
            ),
            'meta' => [
                'search' => $search,
                'limit' => $limit,
                'count' => count($users),
            ],
        ]);
    }
}
