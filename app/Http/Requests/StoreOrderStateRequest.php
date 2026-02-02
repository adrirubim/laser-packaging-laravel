<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderStateRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('offerorderstate', 'name')->where(function ($query) {
                    return $query->where('removed', false);
                }),
            ],
            'sorting' => 'nullable|integer|min:0',
            'initial' => 'nullable|boolean',
            'production' => 'nullable|boolean',
        ];
    }
}
