<?php

declare(strict_types=1);

namespace App\Domain\Events\Contracts;

use App\Domain\Events\Entities\ActivityEvent;

interface EventIngestionRepository
{
    /**
     * Persists a newly recorded activity event without changing its domain shape.
     */
    public function save(ActivityEvent $event): ActivityEvent;
}
