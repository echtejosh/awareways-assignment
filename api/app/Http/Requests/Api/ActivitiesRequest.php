<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Validation\Validator;

final class ActivitiesRequest extends ApiRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'from' => $this->normalizeDateValue($this->input('from')),
            'to' => $this->normalizeDateValue($this->input('to')),
        ]);
    }

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
            'user_id' => ['required', 'uuid'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function validationData(): array
    {
        return array_merge($this->all(), [
            'user_id' => $this->route('user_id'),
        ]);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $from = $this->input('from');
            $to = $this->input('to');

            if ($from === null || $to === null) {
                return;
            }

            if (strtotime((string) $from) > strtotime((string) $to)) {
                $validator->errors()->add('from', 'The from timestamp must be before or equal to to.');
            }
        });
    }

    private function normalizeDateValue(mixed $value): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        return str_replace(' ', '+', $value);
    }
}
