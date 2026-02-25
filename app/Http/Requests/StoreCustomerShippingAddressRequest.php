<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerShippingAddressRequest extends FormRequest
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
            'customerdivision_uuid' => 'required|uuid|exists:customerdivision,uuid',
            'co' => 'nullable|string|max:255',
            'street' => 'required|string|max:255',
            'postal_code' => 'nullable|string|size:5|regex:/^\d{5}$/',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|size:2|regex:/^[A-Z]{2}$/',
            'country' => 'nullable|string|max:255',
            'contacts' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'customerdivision_uuid.required' => __('validation.division_required'),
            'customerdivision_uuid.exists' => __('validation.division_exists'),
            'street.required' => __('validation.street_required'),
            'postal_code.size' => __('validation.postal_code_size'),
            'postal_code.regex' => __('validation.postal_code_regex'),
            'province.size' => __('validation.province_size'),
            'province.regex' => __('validation.province_regex'),
        ];
    }
}
