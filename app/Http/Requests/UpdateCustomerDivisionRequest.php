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
            'customer_uuid.required' => 'Il Cliente è obbligatorio.',
            'customer_uuid.exists' => 'Il Cliente selezionato non è valido.',
            'name.required' => 'Il Nome è obbligatorio.',
            'email.email' => 'Inserire un indirizzo email valido.',
        ];
    }
}
