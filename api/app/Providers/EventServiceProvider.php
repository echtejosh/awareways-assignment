<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Events\Contracts\EventIngestionRepository;
use App\Domain\Events\Contracts\EventReadRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentEventIngestionRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentEventReadRepository;
use Illuminate\Support\ServiceProvider;

final class EventServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(EventIngestionRepository::class, EloquentEventIngestionRepository::class);
        $this->app->bind(EventReadRepository::class, EloquentEventReadRepository::class);
    }
}

