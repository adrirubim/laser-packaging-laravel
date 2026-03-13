<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Generic API response wrapper.
 *
 * @template TData
 *
 * @extends JsonResource<TData|null>
 */
class ApiResponseResource extends JsonResource
{
    public function __construct(
        protected bool $success,
        protected ?string $message = null,
        mixed $data = null,
    ) {
        parent::__construct($data);
    }

    /**
     * @return array{
     *     success: bool,
     *     message: string|null,
     *     data: mixed
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => $this->success,
            'message' => $this->message,
            'data' => $this->resource,
        ];
    }

    /**
     * Build a successful API response.
     */
    public static function success(mixed $data = null, ?string $message = null, int $status = 200): JsonResponse
    {
        /** @var ApiResponseResource $resource */
        $resource = new self(true, $message, $data);

        return $resource->response()->setStatusCode($status);
    }

    /**
     * Build an error API response.
     */
    public static function error(string $message, ?array $data = null, int $status = 400): JsonResponse
    {
        /** @var ApiResponseResource $resource */
        $resource = new self(false, $message, $data);

        return $resource->response()->setStatusCode($status);
    }
}
