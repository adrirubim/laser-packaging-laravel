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

        // If new status is SOSPESO, require motivazione (reason)
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
            'status.required' => __('validation.status_required'),
            'status.integer' => __('validation.status_integer'),
            'status.in' => __('validation.status_in'),
            'motivazione.required' => __('validation.motivazione_required'),
            'motivazione.string' => __('validation.motivazione_string'),
            'motivazione.max' => __('validation.motivazione_max'),
        ];
    }
}
