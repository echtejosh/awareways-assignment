<?php

declare(strict_types=1);

namespace App\Domain\Users\Contracts;

use App\Domain\Users\Entities\ActivityUser;

interface UserDirectoryRepository
{
    /**
     * @return array<int, ActivityUser>
     */
    public function search(?string $search, int $limit): array;

    public function create(string $name): ActivityUser;
}
