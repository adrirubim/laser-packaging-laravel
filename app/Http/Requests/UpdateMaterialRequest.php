<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMaterialRequest extends FormRequest
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
        $material = $this->route('material');

        return [
            'cod' => [
                'required',
                'string',
                'max:255',
                Rule::unique('materials', 'cod')->ignore($material->id),
            ],
            'description' => 'required|string|max:255',
        ];
    }
}
