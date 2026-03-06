<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

final class CreateUserRequest extends ApiRequest
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
            'name' => ['required', 'string', 'max:120', 'regex:/\S/'],
        ];
    }
}
