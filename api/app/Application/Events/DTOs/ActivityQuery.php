<?php

declare(strict_types=1);

namespace App\Application\Events\DTOs;

final readonly class ActivityQuery
{
    public function __construct(
        public string $userId,
        public int $limit = 20,
        public ?string $from = null,
        public ?string $to = null,
    ) {
    }
}

