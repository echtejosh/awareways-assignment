<?php

declare(strict_types=1);

namespace App\Application\Events\DTOs;

final readonly class MetricsQuery
{
    public function __construct(
        public string $userId,
        public ?string $from = null,
        public ?string $to = null,
    ) {
    }
}

