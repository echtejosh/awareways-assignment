<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use App\Domain\Events\Enums\EventType;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

final class IngestEventRequest extends ApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'uuid', 'exists:activity_users,id'],
            'event_type' => ['required', Rule::enum(EventType::class)],
            'occurred_at' => ['required', 'date'],
            'payload' => ['required', 'array'],
            'payload.points' => [
                Rule::requiredIf(
                    fn (): bool => $this->input('event_type') === EventType::POINTS_SCORED->value,
                ),
                'integer',
                'min:1',
            ],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        Log::channel('ingestion')->warning('Malformed ingestion payload rejected.', [
            'errors' => $validator->errors()->toArray(),
            'payload' => $this->all(),
        ]);

        parent::failedValidation($validator);
    }
}
