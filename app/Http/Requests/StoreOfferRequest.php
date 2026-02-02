<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOfferRequest extends FormRequest
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
            'customer_uuid' => 'required|exists:customer,uuid',
            'customerdivision_uuid' => 'nullable|exists:customerdivision,uuid',
            'offer_number' => 'nullable|string|max:255|unique:offer,offer_number',
            'offer_date' => 'nullable|date',
            'validity_date' => 'nullable|date',
            'activity_uuid' => [
                'nullable',
                Rule::exists('offeractivity', 'uuid')->where(function ($query) {
                    return $query->where('removed', false);
                }),
            ],
            'sector_uuid' => [
                'nullable',
                Rule::exists('offersector', 'uuid')->where(function ($query) {
                    return $query->where('removed', false);
                }),
            ],
            'seasonality_uuid' => [
                'nullable',
                Rule::exists('offerseasonality', 'uuid')->where(function ($query) {
                    return $query->where('removed', false);
                }),
            ],
            'order_type_uuid' => [
                'nullable',
                Rule::exists('offertypeorder', 'uuid')->where(function ($query) {
                    return $query->where('removed', false);
                }),
            ],
            'lasfamily_uuid' => [
                'nullable',
                Rule::exists('offerlasfamily', 'uuid')->where(function ($query) {
                    return $query->where('removed', false);
                }),
            ],
            'lasworkline_uuid' => [
                'nullable',
                Rule::exists('offerlasworkline', 'uuid')->where(function ($query) {
                    return $query->where('removed', false);
                }),
            ],
            'lsresource_uuid' => [
                'nullable',
                Rule::exists('offerlsresource', 'uuid')->where(function ($query) {
                    return $query->where('removed', false);
                }),
            ],
            'customer_ref' => 'nullable|string|max:255',
            'article_code_ref' => 'nullable|string|max:255',
            'provisional_description' => 'nullable|string',
            'unit_of_measure' => 'nullable|string|max:255',
            'quantity' => 'nullable|numeric|min:0',
            'piece' => 'nullable|numeric|min:0',
            'declared_weight_cfz' => 'nullable|numeric|min:0',
            'declared_weight_pz' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'expected_workers' => 'nullable|integer|min:0',
            'expected_revenue' => 'nullable|numeric|min:0',
            'rate_cfz' => 'nullable|numeric',
            'rate_pz' => 'nullable|numeric',
            'rate_rounding_cfz' => 'nullable|numeric',
            'rate_increase_cfz' => 'nullable|numeric',
            'materials_euro' => 'nullable|numeric|min:0',
            'logistics_euro' => 'nullable|numeric|min:0',
            'other_euro' => 'nullable|numeric|min:0',
            'offer_notes' => 'nullable|string',
            'ls_setup_cost' => 'nullable|numeric|min:0',
            'ls_other_costs' => 'nullable|numeric|min:0',
            'approval_status' => 'nullable|integer|in:0,1,2',
            'operations' => 'nullable|array',
            'operations.*.offeroperation_uuid' => 'required_with:operations|exists:offeroperation,uuid',
            'operations.*.num_op' => 'required_with:operations|numeric|min:1',
        ];
    }
}
