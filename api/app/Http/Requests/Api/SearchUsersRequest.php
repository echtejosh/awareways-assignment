<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

final class SearchUsersRequest extends ApiRequest
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
            'search' => ['sometimes', 'string', 'max:120'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:25'],
        ];
    }
}
