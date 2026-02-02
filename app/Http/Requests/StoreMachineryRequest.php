<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMachineryRequest extends FormRequest
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
            'cod' => 'required|string|max:255|unique:machinery,cod',
            'description' => 'required|string|max:255',
            'parameter' => 'nullable|string|max:255',
            'value_type_uuid' => 'nullable|integer|exists:valuetypes,id',
        ];
    }
}
