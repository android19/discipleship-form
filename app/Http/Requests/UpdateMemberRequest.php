<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMemberRequest extends FormRequest
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
            'age' => ['required', 'integer', 'min:1', 'max:120'],
            'sex' => ['required', 'in:Male,Female'],
            'contact_number' => ['required', 'string', 'max:255'],
            'lifestage' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'date_launched' => ['required', 'date'],
            'status' => ['required', 'in:Active,Inactive'],
            'victory_group_id' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if ($value !== null && $value !== 'none' && !\App\Models\VictoryGroup::where('id', $value)->exists()) {
                    $fail('The selected victory group does not exist.');
                }
            }],
            'discipleship_classes' => ['sometimes', 'array'],
            'discipleship_classes.*.selected' => ['sometimes', 'accepted'],
            'discipleship_classes.*.date_started' => ['nullable', 'date', 'before_or_equal:today'],
            'discipleship_classes.*.date_finished' => ['nullable', 'date', 'after_or_equal:discipleship_classes.*.date_started'],
            'existing_classes' => ['sometimes', 'array'],
            'existing_classes.*.delete' => ['sometimes', 'accepted'],
            'existing_classes.*.date_started' => ['nullable', 'date', 'before_or_equal:today'],
            'existing_classes.*.date_finished' => ['nullable', 'date', 'after_or_equal:existing_classes.*.date_started'],
            'existing_classes.*.is_completed' => ['sometimes', 'accepted'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'age.required' => 'Age is required.',
            'age.integer' => 'Age must be a number.',
            'age.min' => 'Age must be at least 1.',
            'age.max' => 'Age cannot be more than 120.',
            'sex.required' => 'Sex is required.',
            'sex.in' => 'Sex must be either Male or Female.',
            'contact_number.required' => 'Contact number is required.',
            'lifestage.required' => 'Life stage is required.',
            'address.required' => 'Address is required.',
            'date_launched.required' => 'Date launched is required.',
            'date_launched.date' => 'Date launched must be a valid date.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either Active or Inactive.',
            'victory_group_id.exists' => 'The selected victory group does not exist.',
            'discipleship_classes.*.date_started.before_or_equal' => 'Start date cannot be in the future.',
            'discipleship_classes.*.date_finished.after_or_equal' => 'Finish date must be after or equal to start date.',
            'existing_classes.*.date_started.before_or_equal' => 'Start date cannot be in the future.',
            'existing_classes.*.date_finished.after_or_equal' => 'Finish date must be after or equal to start date.',
        ];
    }
}
