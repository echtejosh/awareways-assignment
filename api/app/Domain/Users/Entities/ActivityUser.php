<?php

declare(strict_types=1);

namespace App\Domain\Users\Entities;

use App\Domain\Events\ValueObjects\Uuid;

final readonly class ActivityUser
{
    public function __construct(
        public Uuid $id,
        public string $name,
    ) {
    }
}
