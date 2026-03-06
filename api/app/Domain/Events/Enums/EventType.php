<?php

declare(strict_types=1);

namespace App\Domain\Events\Enums;

enum EventType: string
{
    case TRAINING_STARTED = 'training_started';
    case PROGRESS_MADE = 'progress_made';
    case POINTS_SCORED = 'points_scored';
    case TRAINING_COMPLETED = 'training_completed';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(
            static fn (self $case): string => $case->value,
            self::cases(),
        );
    }
}

