<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Events\Contracts\EventIngestionRepository;
use App\Domain\Events\Contracts\EventReadRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentEventIngestionRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentEventReadRepository;
use Illuminate\Support\ServiceProvider;

/**
 * Registers infrastructure bindings for the event write and read repositories.
 */
final class EventServiceProvider extends ServiceProvider
{
    /**
     * Keeps the application layer dependent on contracts while Laravel resolves Eloquent adapters.
     */
    public function register(): void
    {
        $this->app->bind(EventIngestionRepository::class, EloquentEventIngestionRepository::class);
        $this->app->bind(EventReadRepository::class, EloquentEventReadRepository::class);
    }
}
