<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOfferOrderTypeRequest extends FormRequest
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
        $offerOrderType = $this->route('offerOrderType');

        return [
            'uuid' => [
                'sometimes',
                'uuid',
                Rule::unique('offertypeorder', 'uuid')->ignore($offerOrderType->id),
            ],
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('offertypeorder', 'code')->ignore($offerOrderType->id),
            ],
            'name' => 'required|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'uuid.uuid' => 'L\'UUID deve essere un formato UUID valido.',
            'uuid.unique' => __('validation.uuid_unique'),
            'code.required' => __('validation.code_required'),
            'code.unique' => __('validation.code_unique'),
            'name.required' => __('validation.name_required'),
        ];
    }
}
