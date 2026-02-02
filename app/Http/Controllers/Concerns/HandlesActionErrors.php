<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

trait HandlesActionErrors
{
    /**
     * Handle action result that may contain an error.
     * If the result is an error array, redirect back with errors.
     * Otherwise, return null to continue with normal flow.
     *
     * @param  mixed  $result  The result from an Action class
     */
    protected function handleActionError($result): ?RedirectResponse
    {
        if (is_array($result) && isset($result['error']) && $result['error']) {
            return back()->withErrors([
                $result['field'] => $result['message'],
            ])->withInput();
        }

        return null;
    }

    /**
     * Handle JSON response errors for AJAX endpoints.
     *
     * @param  \Closure  $callback  The callback that may throw exceptions
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleJsonErrors(\Closure $callback)
    {
        try {
            return $callback();
        } catch (ValidationException $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
