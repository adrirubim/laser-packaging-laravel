<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveSemaforoRequest extends FormRequest
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
            'etichette' => ['required', 'integer', Rule::in([0, 1, 2])],
            'packaging' => ['required', 'integer', Rule::in([0, 1, 2])],
            'prodotto' => ['required', 'integer', Rule::in([0, 1, 2])],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'etichette.required' => 'Lo stato del semaforo etichette è obbligatorio.',
            'etichette.in' => 'Lo stato del semaforo etichette deve essere 0, 1 o 2.',
            'packaging.required' => 'Lo stato del semaforo packaging è obbligatorio.',
            'packaging.in' => 'Lo stato del semaforo packaging deve essere 0, 1 o 2.',
            'prodotto.required' => 'Lo stato del semaforo prodotto è obbligatorio.',
            'prodotto.in' => 'Lo stato del semaforo prodotto deve essere 0, 1 o 2.',
        ];
    }
}
