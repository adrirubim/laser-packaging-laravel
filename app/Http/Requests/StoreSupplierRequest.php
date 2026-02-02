<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
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
            'code' => 'required|string|max:255|unique:supplier,code',
            'company_name' => 'required|string|max:255',
            'vat_number' => 'nullable|string|max:255',
            'co' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'province' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'contacts' => 'nullable|string',
        ];
    }
}
