<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @template TData
 *
 * @property array{
 *     success: bool,
 *     message: string|null,
 *     data: TData|null
 * } $resource
 */
class ApiResponseResource extends JsonResource
{
    /**
     * @param  TData|null  $data
     */
    public static function success(bool $success, ?string $message = null, mixed $data = null): self
    {
        return new self([
            'success' => $success,
            'message' => $message,
            'data' => $data,
        ]);
    }

    /**
     * @param  TData|null  $data
     */
    public static function error(string $message, mixed $data = null): self
    {
        return new self([
            'success' => false,
            'message' => $message,
            'data' => $data,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => (bool) ($this->resource['success'] ?? false),
            'message' => $this->resource['message'] ?? null,
            'data' => $this->resource['data'] ?? null,
        ];
    }
}
