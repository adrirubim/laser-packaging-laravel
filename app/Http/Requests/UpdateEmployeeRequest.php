<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
     */
    public function rules(): array
    {
        $employee = $this->route('employee');

        return [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'matriculation_number' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($employee) {
                    $exists = \App\Models\Employee::where('matriculation_number', $value)
                        ->where('id', '!=', $employee->id)
                        ->where('removed', false)
                        ->exists();
                    if ($exists) {
                        $fail(__('validation.matriculation_exists'));
                    }
                },
            ],
            'password' => 'nullable|string|min:6',
            'portal_enabled' => 'nullable|boolean',
        ];
    }
}
