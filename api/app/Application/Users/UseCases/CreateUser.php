<?php

declare(strict_types=1);

namespace App\Application\Users\UseCases;

use App\Application\Users\DTOs\CreateUserData;
use App\Domain\Users\Contracts\UserDirectoryRepository;
use App\Domain\Users\Entities\ActivityUser;

/**
 * Creates a new selectable activity user entry for the UI and ingestion flow.
 */
final readonly class CreateUser
{
    public function __construct(
        private UserDirectoryRepository $userDirectoryRepository,
    ) {
    }

    /**
     * Trims the incoming name and delegates UUID generation to the repository layer.
     */
    public function __invoke(CreateUserData $data): ActivityUser
    {
        return $this->userDirectoryRepository->create(trim($data->name));
    }
}
