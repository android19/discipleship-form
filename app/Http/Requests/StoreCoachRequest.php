<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCoachRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'middle_initial' => ['nullable', 'string', 'max:1'],
            'last_name' => ['required', 'string', 'max:255'],
            'age' => ['required', 'integer', 'min:18', 'max:120'],
            'sex' => ['required', 'string', 'in:Male,Female'],
            'contact_number' => ['required', 'string', 'max:255'],
            'lifestage' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'date_launched' => ['required', 'date'],
            'status' => ['required', 'string', 'in:Active,Inactive'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'age.required' => 'Age is required.',
            'age.min' => 'Age must be at least 18.',
            'age.max' => 'Age must not exceed 120.',
            'sex.required' => 'Sex is required.',
            'sex.in' => 'Sex must be either Male or Female.',
            'contact_number.required' => 'Contact number is required.',
            'lifestage.required' => 'Lifestage is required.',
            'address.required' => 'Address is required.',
            'date_launched.required' => 'Date launched is required.',
            'date_launched.date' => 'Date launched must be a valid date.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either Active or Inactive.',
        ];
    }
}
