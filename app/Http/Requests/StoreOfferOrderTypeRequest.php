<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOfferOrderTypeRequest extends FormRequest
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
            'uuid' => 'required|uuid|unique:offertypeorder,uuid',
            'code' => 'required|string|max:255|unique:offertypeorder,code',
            'name' => 'required|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'uuid.required' => 'L\'UUID è obbligatorio.',
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => 'Questo UUID è già utilizzato.',
            'code.required' => 'Il Codice è obbligatorio.',
            'code.unique' => 'Questo Codice è già utilizzato.',
            'name.required' => 'Il Nome è obbligatorio.',
        ];
    }
}
