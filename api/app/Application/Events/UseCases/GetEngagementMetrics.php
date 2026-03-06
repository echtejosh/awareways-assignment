<?php

declare(strict_types=1);

namespace App\Application\Events\UseCases;

use App\Application\Events\DTOs\MetricsQuery;
use App\Domain\Events\Contracts\EventReadRepository;
use App\Domain\Events\Entities\EngagementMetrics;
use App\Domain\Events\ValueObjects\Uuid;
use DateInterval;
use DateTimeImmutable;
use DateTimeZone;

final readonly class GetEngagementMetrics
{
    public function __construct(
        private EventReadRepository $eventReadRepository,
    ) {
    }

    public function __invoke(MetricsQuery $query): EngagementMetrics
    {
        $to = $query->to !== null
            ? self::toUtcDateTime($query->to)
            : new DateTimeImmutable('now', new DateTimeZone('UTC'));

        $from = $query->from !== null
            ? self::toUtcDateTime($query->from)
            : $to->sub(new DateInterval('P30D'));

        return $this->eventReadRepository->getEngagementMetrics(
            userId: Uuid::fromString($query->userId),
            from: $from,
            to: $to,
        );
    }

    private static function toUtcDateTime(string $value): DateTimeImmutable
    {
        return (new DateTimeImmutable($value))->setTimezone(new DateTimeZone('UTC'));
    }
}

