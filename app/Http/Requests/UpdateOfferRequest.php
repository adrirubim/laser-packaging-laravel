<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOfferRequest extends FormRequest
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
        $offer = $this->route('offer');

        return [
            'customer_uuid' => 'required|exists:customer,uuid',
            'customerdivision_uuid' => 'nullable|exists:customerdivision,uuid',
            'offer_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('offer', 'offer_number')->ignore($offer->id),
            ],
            'offer_date' => 'required|date',
            'validity_date' => 'required|date',
            'activity_uuid' => [
                'required',
                function ($attribute, $value, $fail) {
                    if ($value && ! \Illuminate\Support\Facades\DB::table('offeractivity')->where('uuid', $value)->exists()) {
                        $fail('The selected activity uuid is invalid.');
                    }
                },
            ],
            'sector_uuid' => [
                'required',
                function ($attribute, $value, $fail) {
                    if ($value && ! \Illuminate\Support\Facades\DB::table('offersector')->where('uuid', $value)->exists()) {
                        $fail('The selected sector uuid is invalid.');
                    }
                },
            ],
            'seasonality_uuid' => [
                'required',
                function ($attribute, $value, $fail) {
                    if ($value && ! \Illuminate\Support\Facades\DB::table('offerseasonality')->where('uuid', $value)->exists()) {
                        $fail('The selected seasonality uuid is invalid.');
                    }
                },
            ],
            'order_type_uuid' => [
                'required',
                function ($attribute, $value, $fail) {
                    if ($value && ! \Illuminate\Support\Facades\DB::table('offertypeorder')->where('uuid', $value)->exists()) {
                        $fail('The selected order type uuid is invalid.');
                    }
                },
            ],
            'lasfamily_uuid' => [
                'required',
                function ($attribute, $value, $fail) {
                    if ($value && ! \Illuminate\Support\Facades\DB::table('offerlasfamily')->where('uuid', $value)->exists()) {
                        $fail('The selected lasfamily uuid is invalid.');
                    }
                },
            ],
            'lasworkline_uuid' => [
                'required',
                function ($attribute, $value, $fail) {
                    if ($value && ! \Illuminate\Support\Facades\DB::table('offerlasworkline')->where('uuid', $value)->exists()) {
                        $fail('The selected lasworkline uuid is invalid.');
                    }
                },
            ],
            'lsresource_uuid' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value && ! \Illuminate\Support\Facades\DB::table('offerlsresource')->where('uuid', $value)->exists()) {
                        $fail('The selected lsresource uuid is invalid.');
                    }
                },
            ],
            'customer_ref' => 'nullable|string|max:255',
            'article_code_ref' => 'nullable|string|max:255',
            'provisional_description' => 'nullable|string',
            'unit_of_measure' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0',
            'piece' => 'required|numeric|min:0',
            'declared_weight_cfz' => 'nullable|numeric|min:0',
            'declared_weight_pz' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'expected_workers' => 'nullable|integer|min:0',
            'expected_revenue' => 'required|numeric|min:0',
            'rate_cfz' => 'nullable|numeric',
            'rate_pz' => 'nullable|numeric',
            'rate_rounding_cfz' => 'required|numeric',
            'rate_increase_cfz' => 'required|numeric',
            'materials_euro' => 'required|numeric|min:0',
            'logistics_euro' => 'required|numeric|min:0',
            'other_euro' => 'required|numeric|min:0',
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
