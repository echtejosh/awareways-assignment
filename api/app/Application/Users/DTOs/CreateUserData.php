<?php

declare(strict_types=1);

namespace App\Application\Users\DTOs;

final readonly class CreateUserData
{
    public function __construct(
        public string $name,
    ) {
    }

    /**
     * @param array<string, mixed> $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            name: (string) $validated['name'],
        );
    }
}
