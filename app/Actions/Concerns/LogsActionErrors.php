<?php

namespace App\Actions\Concerns;

use Illuminate\Support\Facades\Log;

trait LogsActionErrors
{
    /**
     * Log an error with context information.
     *
     * @param  string  $action  Action name (e.g., 'CreateArticleAction::execute')
     * @param  \Exception  $exception  The exception that occurred
     * @param  array  $context  Additional context data
     */
    protected function logError(string $action, \Exception $exception, array $context = []): void
    {
        Log::error("Error in {$action}", [
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'context' => $context,
        ]);
    }

    /**
     * Log a warning with context information.
     *
     * @param  string  $action  Action name
     * @param  string  $message  Warning message
     * @param  array  $context  Additional context data
     */
    protected function logWarning(string $action, string $message, array $context = []): void
    {
        Log::warning("Warning in {$action}: {$message}", [
            'context' => $context,
        ]);
    }

    /**
     * Log an info message with context information.
     *
     * @param  string  $action  Action name
     * @param  string  $message  Info message
     * @param  array  $context  Additional context data
     */
    protected function logInfo(string $action, string $message, array $context = []): void
    {
        Log::info("Info from {$action}: {$message}", [
            'context' => $context,
        ]);
    }
}
