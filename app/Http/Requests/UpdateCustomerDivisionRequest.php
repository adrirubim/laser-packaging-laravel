<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerDivisionRequest extends FormRequest
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
        return [
            'customer_uuid' => 'required|uuid|exists:customer,uuid',
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'contacts' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'customer_uuid.required' => __('validation.customer_required'),
            'customer_uuid.exists' => __('validation.customer_exists'),
            'name.required' => __('validation.name_required'),
            'email.email' => __('validation.email_valid'),
        ];
    }
}
