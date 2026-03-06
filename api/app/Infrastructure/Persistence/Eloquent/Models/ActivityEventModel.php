<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;

final class ActivityEventModel extends Model
{
    protected $table = 'activity_events';

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'event_type',
        'occurred_at',
        'payload',
        'ingested_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'payload' => 'array',
        'occurred_at' => 'immutable_datetime',
        'ingested_at' => 'immutable_datetime',
    ];
}

