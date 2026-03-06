<?php

declare(strict_types=1);

namespace App\Application\Users\UseCases;

use App\Domain\Users\Contracts\UserDirectoryRepository;

/**
 * Normalizes directory search input before querying the activity user directory.
 */
final readonly class SearchUsers
{
    public function __construct(
        private UserDirectoryRepository $userDirectoryRepository,
    ) {
    }

    /**
     * Lowercases and trims the optional search term so repository matching stays predictable.
     *
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
