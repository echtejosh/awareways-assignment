<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Users\Contracts\UserDirectoryRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentUserDirectoryRepository;
use Illuminate\Support\ServiceProvider;

final class UserDirectoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserDirectoryRepository::class, EloquentUserDirectoryRepository::class);
    }
}
