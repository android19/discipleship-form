<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDiscipleshipUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $discipleship = $this->route('discipleship');

        return $discipleship && $discipleship->user_id === $this->user()->id;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = $this->all();

        // Transform discipleship classes boolean fields
        if (isset($data['discipleship_classes'])) {
            foreach (['church_community', 'purple_book', 'making_disciples', 'empowering_leaders', 'leadership_113'] as $field) {
                $data['discipleship_classes'][$field] = $this->transformBoolean($data['discipleship_classes'][$field] ?? null);
            }
        }

        // Transform members boolean fields
        if (isset($data['members']) && is_array($data['members'])) {
            foreach ($data['members'] as $index => $member) {
                foreach (['victory_weekend', 'purple_book', 'church_community', 'making_disciples', 'empowering_leaders'] as $field) {
                    $data['members'][$index][$field] = $this->transformBoolean($member[$field] ?? null);
                }
            }
        }

        // Transform interns boolean fields
        if (isset($data['interns']) && is_array($data['interns'])) {
            foreach ($data['interns'] as $index => $intern) {
                foreach (['victory_weekend', 'purple_book', 'church_community', 'making_disciples', 'empowering_leaders'] as $field) {
                    $data['interns'][$index][$field] = $this->transformBooleanNullable($intern[$field] ?? null);
                }
            }
        }

        $this->replace($data);
    }

    /**
     * Transform checkbox values to proper booleans.
     */
    private function transformBoolean($value): bool
    {
        if ($value === 'on' || $value === '1' || $value === 1 || $value === true) {
            return true;
        }

        // All other values (including null, 'off', '0', 0, false, '', etc.) become false
        return false;
    }

    /**
     * Transform checkbox values to proper booleans, allowing null for nullable fields.
     */
    private function transformBooleanNullable($value): ?bool
    {
        if ($value === null) {
            return null;
        }

        return $this->transformBoolean($value);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Leader Information
            'leader_name' => ['required', 'string', 'max:255'],
            'mobile_number' => ['required', 'string', 'max:255'],
            'ministry_involvement' => ['nullable', 'string', 'in:Admin,Comms,Coordinator,Kids,Music,Tech,Spirit Empowerment,Ushering'],
            'coach' => ['nullable', 'string', 'max:255'],
            'services_attended' => ['nullable', 'string', 'in:8AM,9:30AM,11AM,1:30PM,3PM,5PM'],

            // Victory Group Details
            'victory_groups_leading' => ['required', 'integer', 'min:0'],
            'victory_group_active' => ['required', 'boolean'],
            'inactive_reason' => ['nullable', 'string', 'required_if:victory_group_active,false'],
            'last_victory_group_date' => ['nullable', 'date'],
            'victory_group_types' => ['nullable', 'array'],
            'victory_group_types.*' => ['string'],
            'intern_invite_status' => ['required', 'in:yes,none'],
            'victory_group_schedule' => ['nullable', 'string', 'max:255'],
            'venue' => ['nullable', 'string', 'max:255'],
            'concerns' => ['nullable', 'string'],

            // Discipleship Classes
            'discipleship_classes.church_community' => ['required', 'boolean'],
            'discipleship_classes.purple_book' => ['required', 'boolean'],
            'discipleship_classes.making_disciples' => ['required', 'boolean'],
            'discipleship_classes.empowering_leaders' => ['required', 'boolean'],
            'discipleship_classes.leadership_113' => ['required', 'boolean'],

            // Victory Group Members
            'members' => ['nullable', 'array'],
            'members.*.name' => ['required', 'string', 'max:255'],
            'members.*.one_to_one_facilitator' => ['nullable', 'string', 'max:255'],
            'members.*.one_to_one_date_started' => ['nullable', 'date'],
            'members.*.victory_weekend' => ['required', 'boolean'],
            'members.*.purple_book' => ['required', 'boolean'],
            'members.*.church_community' => ['required', 'boolean'],
            'members.*.making_disciples' => ['required', 'boolean'],
            'members.*.empowering_leaders' => ['required', 'boolean'],
            'members.*.ministry_involvement' => ['nullable', 'string', 'in:Admin,Comms,Coordinator,Kids,Music,Tech,Spirit Empowerment,Ushering'],
            'members.*.remarks' => ['nullable', 'string'],

            // Interns
            'interns' => ['nullable', 'array'],
            'interns.*.name' => ['required', 'string', 'max:255'],
            'interns.*.one_to_one_facilitator' => ['nullable', 'string', 'max:255'],
            'interns.*.one_to_one_date_started' => ['nullable', 'date'],
            'interns.*.victory_weekend' => ['nullable', 'boolean'],
            'interns.*.purple_book' => ['nullable', 'boolean'],
            'interns.*.church_community' => ['nullable', 'boolean'],
            'interns.*.making_disciples' => ['nullable', 'boolean'],
            'interns.*.empowering_leaders' => ['nullable', 'boolean'],
            'interns.*.ministry_involvement' => ['nullable', 'string', 'in:Admin,Comms,Coordinator,Kids,Music,Tech,Spirit Empowerment,Ushering'],
            'interns.*.remarks' => ['nullable', 'string'],
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
            'leader_name.required' => 'Leader name is required.',
            'mobile_number.required' => 'Mobile number is required.',
            'victory_groups_leading.required' => 'Number of Victory Groups leading is required.',
            'victory_group_active.required' => 'Victory Group active status is required.',
            'inactive_reason.required_if' => 'Please provide a reason when Victory Group is not active.',
            'intern_invite_status.required' => 'Intern invite status is required.',
            'members.*.name.required' => 'Member name is required.',
            'interns.*.name.required' => 'Intern name is required.',
        ];
    }
}
