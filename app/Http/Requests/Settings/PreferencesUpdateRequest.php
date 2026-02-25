<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class PreferencesUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'theme' => 'nullable|string|in:light,dark,system',
            'locale' => 'nullable|string|in:it,es,en',
            'timezone' => 'nullable|string|max:50',
            'date_format' => 'nullable|string|in:d/m/Y,m/d/Y,Y-m-d',
        ];
    }
}
