<?php

declare(strict_types=1);

namespace App\Domain\Events\Contracts;

use App\Domain\Events\Entities\ActivityEvent;

interface EventIngestionRepository
{
    public function save(ActivityEvent $event): ActivityEvent;
}

