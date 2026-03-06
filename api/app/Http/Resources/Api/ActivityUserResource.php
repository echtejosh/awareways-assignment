<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use App\Domain\Users\Entities\ActivityUser;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ActivityUser
 */
final class ActivityUserResource extends JsonResource
{
    /**
     * @return array<string, string>
     */
    public function toArray(Request $request): array
    {
        /** @var ActivityUser $user */
        $user = $this->resource;

        return [
            'id' => $user->id->toString(),
            'name' => $user->name,
        ];
    }
}
