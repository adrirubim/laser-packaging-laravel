<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMachineryRequest extends FormRequest
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
        $machinery = $this->route('machinery');

        return [
            'cod' => [
                'required',
                'string',
                'max:255',
                Rule::unique('machinery', 'cod')->ignore($machinery->id),
            ],
            'description' => 'required|string|max:255',
            'parameter' => 'nullable|string|max:255',
            'value_type_uuid' => 'nullable|integer|exists:valuetypes,id',
        ];
    }
}
