<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOfferSeasonalityRequest extends FormRequest
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
        $offerSeasonality = $this->route('offerSeasonality');

        return [
            'uuid' => [
                'sometimes',
                'uuid',
                Rule::unique('offerseasonality', 'uuid')->ignore($offerSeasonality->id),
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
            'uuid.unique' => 'Questo UUID è già utilizzato.',
            'name.required' => 'Il Nome è obbligatorio.',
        ];
    }
}
