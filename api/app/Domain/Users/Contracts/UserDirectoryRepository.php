<?php

declare(strict_types=1);

namespace App\Domain\Users\Contracts;

use App\Domain\Users\Entities\ActivityUser;

interface UserDirectoryRepository
{
    /**
     * Searches the dedicated activity user directory by name or UUID.
     *
     * @return array<int, ActivityUser>
     */
    public function search(?string $search, int $limit): array;

    /**
     * Creates a selectable activity user entry backed by a generated UUID.
     */
    public function create(string $name): ActivityUser;
}
