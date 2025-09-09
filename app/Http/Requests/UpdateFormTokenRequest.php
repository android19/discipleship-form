<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFormTokenRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'leader_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'expires_at' => ['required', 'date'],
            'is_active' => ['boolean'],
            'max_uses' => ['nullable', 'integer', 'min:1', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'leader_name.required' => 'Leader name is required.',
            'leader_name.max' => 'Leader name must not exceed 255 characters.',
            'description.max' => 'Description must not exceed 1000 characters.',
            'expires_at.required' => 'Expiration date is required.',
            'expires_at.date' => 'Expiration date must be a valid date.',
            'max_uses.integer' => 'Maximum uses must be a number.',
            'max_uses.min' => 'Maximum uses must be at least 1.',
            'max_uses.max' => 'Maximum uses must not exceed 1000.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
        ]);
    }
}
