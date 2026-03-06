<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Application\Users\DTOs\CreateUserData;
use App\Application\Users\UseCases\CreateUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreateUserRequest;
use App\Http\Resources\Api\ActivityUserResource;
use Illuminate\Http\JsonResponse;

/**
 * Creates activity directory users that can later be selected in the UI.
 */
final class UserCreationController extends Controller
{
    /**
     * Persists a new directory entry and returns the generated identifier.
     */
    public function __invoke(
        CreateUserRequest $request,
        CreateUser $createUser,
    ): JsonResponse {
        $user = $createUser(CreateUserData::fromValidated($request->validated()));

        return response()->json([
            'data' => (new ActivityUserResource($user))->toArray($request),
        ], 201);
    }
}
