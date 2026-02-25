<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
            'code' => 'required|string|max:255|unique:customer,code',
            'company_name' => 'required|string|max:255',
            'vat_number' => 'nullable|string|max:255|regex:/^\d{11}$/',
            'co' => 'nullable|string|max:255',
            'street' => 'required|string|max:255',
            'postal_code' => 'nullable|string|size:5|regex:/^\d{5}$/',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|size:2|regex:/^[A-Z]{2}$/',
            'country' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'code.required' => __('validation.code_customer_required'),
            'code.unique' => __('validation.code_customer_unique'),
            'company_name.required' => __('validation.company_name_required'),
            'vat_number.regex' => __('validation.vat_regex'),
            'street.required' => __('validation.street_required'),
            'postal_code.size' => __('validation.postal_code_size'),
            'postal_code.regex' => __('validation.postal_code_regex'),
            'province.size' => __('validation.province_size'),
            'province.regex' => __('validation.province_regex'),
        ];
    }
}
