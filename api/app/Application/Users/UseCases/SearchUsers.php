<?php

declare(strict_types=1);

namespace App\Application\Users\UseCases;

use App\Domain\Users\Contracts\UserDirectoryRepository;

final readonly class SearchUsers
{
    public function __construct(
        private UserDirectoryRepository $userDirectoryRepository,
    ) {
    }

    /**
     * @return array<int, \App\Domain\Users\Entities\ActivityUser>
     */
    public function __invoke(?string $search, int $limit): array
    {
        $normalizedSearch = $search !== null ? strtolower(trim($search)) : null;
        if ($normalizedSearch === '') {
            $normalizedSearch = null;
        }

        return $this->userDirectoryRepository->search(
            search: $normalizedSearch,
            limit: $limit,
        );
    }
}
