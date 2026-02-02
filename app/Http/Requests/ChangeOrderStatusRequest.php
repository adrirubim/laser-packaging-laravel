<?php

namespace App\Http\Requests;

use App\Enums\OrderStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeOrderStatusRequest extends FormRequest
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
        $order = $this->route('order');
        $currentStatus = $order->status ?? null;
        $newStatus = $this->input('status');

        $rules = [
            'status' => ['required', 'integer', Rule::in(OrderStatus::values())],
        ];

        // Si el nuevo estado es SOSPESO, requerir motivazione
        if ($newStatus == OrderStatus::SOSPESO->value) {
            $rules['motivazione'] = ['required', 'string', 'max:1000'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Lo stato è obbligatorio.',
            'status.integer' => 'Lo stato deve essere un numero intero.',
            'status.in' => 'Lo stato selezionato non è valido.',
            'motivazione.required' => 'La motivazione è obbligatoria per sospendere un ordine.',
            'motivazione.string' => 'La motivazione deve essere un testo.',
            'motivazione.max' => 'La motivazione non può superare i 1000 caratteri.',
        ];
    }
}
