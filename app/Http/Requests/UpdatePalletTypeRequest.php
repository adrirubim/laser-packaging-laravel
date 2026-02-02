<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePalletTypeRequest extends FormRequest
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
        $palletType = $this->route('palletType');

        return [
            'cod' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pallettype', 'cod')->ignore($palletType->id),
            ],
            'description' => 'required|string|max:255',
        ];
    }
}
