<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerShippingAddressRequest extends FormRequest
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
            'customerdivision_uuid.required' => 'La Divisione è obbligatoria.',
            'customerdivision_uuid.exists' => 'La Divisione selezionata non è valida.',
            'street.required' => 'La Via è obbligatoria.',
            'postal_code.size' => 'Il CAP deve contenere esattamente 5 cifre.',
            'postal_code.regex' => 'Il CAP deve contenere solo numeri (5 cifre).',
            'province.size' => 'La Provincia deve essere un codice di 2 lettere.',
            'province.regex' => 'La Provincia deve essere un codice di 2 lettere maiuscole (es: RM, MI).',
        ];
    }
}
