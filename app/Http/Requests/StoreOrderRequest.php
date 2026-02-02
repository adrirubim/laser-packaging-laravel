<?php

namespace App\Http\Requests;

use App\Enums\OrderLabelStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
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
            'article_uuid' => 'required|exists:articles,uuid',
            'order_production_number' => 'nullable|string|max:255|unique:orderorder,order_production_number',
            'number_customer_reference_order' => 'nullable|string|max:255',
            'line' => 'nullable|integer',
            'quantity' => 'required|numeric|min:0',
            'worked_quantity' => 'nullable|numeric|min:0',
            'delivery_requested_date' => 'nullable|date',
            'customershippingaddress_uuid' => 'nullable|exists:customershippingaddress,uuid',
            'expected_production_start_date' => 'nullable|date',
            'type_lot' => 'nullable|integer',
            'lot' => 'nullable|string|max:255',
            'expiration_date' => 'nullable|date',
            'external_labels' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'pvp_labels' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'ingredients_labels' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'variable_data_labels' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'label_of_jumpers' => ['nullable', 'integer', Rule::enum(OrderLabelStatus::class)],
            'indications_for_shop' => 'nullable|string',
            'indications_for_production' => 'nullable|string',
            'indications_for_delivery' => 'nullable|string',
        ];
    }
}
