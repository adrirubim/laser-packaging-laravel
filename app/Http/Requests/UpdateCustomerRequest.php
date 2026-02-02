<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
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
        $customer = $this->route('customer');

        return [
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('customer', 'code')->ignore($customer->id),
            ],
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
            'code.required' => 'Il Codice Cliente è obbligatorio.',
            'code.unique' => 'Questo Codice Cliente è già utilizzato.',
            'company_name.required' => 'La Ragione Sociale è obbligatoria.',
            'vat_number.regex' => 'La Partita IVA deve contenere esattamente 11 cifre.',
            'street.required' => 'La Via è obbligatoria.',
            'postal_code.size' => 'Il CAP deve contenere esattamente 5 cifre.',
            'postal_code.regex' => 'Il CAP deve contenere solo numeri (5 cifre).',
            'province.size' => 'La Provincia deve essere un codice di 2 lettere.',
            'province.regex' => 'La Provincia deve essere un codice di 2 lettere maiuscole (es: RM, MI).',
        ];
    }
}
