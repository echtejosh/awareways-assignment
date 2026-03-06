<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\Events\ValueObjects\Uuid;
use App\Domain\Users\Contracts\UserDirectoryRepository;
use App\Domain\Users\Entities\ActivityUser;
use App\Infrastructure\Persistence\Eloquent\Models\ActivityUserModel;
use Illuminate\Support\Collection;

/**
 * Eloquent-backed repository for the dedicated activity user directory.
 */
final readonly class EloquentUserDirectoryRepository implements UserDirectoryRepository
{
    /**
     * Returns a small searchable slice of directory users for picker-style UI access.
     *
     * @return array<int, ActivityUser>
     */
    public function search(?string $search, int $limit): array
    {
        $query = ActivityUserModel::query();

        if ($search !== null && $search !== '') {
            $searchPattern = '%'.$search.'%';

            $query->where(static function ($builder) use ($searchPattern): void {
                $builder
                    ->whereRaw('LOWER(name) LIKE ?', [$searchPattern])
                    ->orWhereRaw('LOWER(id) LIKE ?', [$searchPattern]);
            });
        }

        /** @var Collection<int, ActivityUserModel> $rows */
        $rows = $query
            ->orderBy('name')
            ->orderBy('id')
            ->limit($limit)
            ->get();

        return $rows
            ->map(fn (ActivityUserModel $row): ActivityUser => $this->mapToEntity($row))
            ->all();
    }

    /**
     * Creates a new directory entry with a generated UUID and persists it immediately.
     */
    public function create(string $name): ActivityUser
    {
        $user = new ActivityUser(
            id: Uuid::new(),
            name: $name,
        );

        ActivityUserModel::query()->create([
            'id' => $user->id->toString(),
            'name' => $user->name,
        ]);

        return $user;
    }

    /**
     * Rehydrates an Eloquent row into the domain entity consumed by application use cases.
     */
    private function mapToEntity(ActivityUserModel $row): ActivityUser
    {
        return new ActivityUser(
            id: Uuid::fromString((string) $row->id),
            name: (string) $row->name,
        );
    }
}
