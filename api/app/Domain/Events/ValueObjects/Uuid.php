<?php

declare(strict_types=1);

namespace App\Domain\Events\ValueObjects;

use InvalidArgumentException;
use Ramsey\Uuid\Uuid as RamseyUuid;

final readonly class Uuid
{
    private function __construct(
        private string $value,
    ) {
    }

    public static function new(): self
    {
        return new self(RamseyUuid::uuid4()->toString());
    }

    public static function fromString(string $value): self
    {
        if (! RamseyUuid::isValid($value)) {
            throw new InvalidArgumentException('Invalid UUID provided.');
        }

        return new self(strtolower($value));
    }

    public function toString(): string
    {
        return $this->value;
    }
}

