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
            'etichette.required' => __('validation.semaforo_etichette_required'),
            'etichette.in' => __('validation.semaforo_etichette_in'),
            'packaging.required' => __('validation.semaforo_packaging_required'),
            'packaging.in' => __('validation.semaforo_packaging_in'),
            'prodotto.required' => __('validation.semaforo_prodotto_required'),
            'prodotto.in' => __('validation.semaforo_prodotto_in'),
        ];
    }
}
