<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Users\Contracts\UserDirectoryRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentUserDirectoryRepository;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the infrastructure adapter behind the activity user directory contract.
 */
final class UserDirectoryServiceProvider extends ServiceProvider
{
    /**
     * Binds the directory repository interface used by user search and creation use cases.
     */
    public function register(): void
    {
        $this->app->bind(UserDirectoryRepository::class, EloquentUserDirectoryRepository::class);
    }
}
