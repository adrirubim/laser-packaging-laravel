<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderArticleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'cod_article_las' => $this->cod_article_las,
            'article_descr' => $this->article_descr,
            'offer_uuid' => $this->offer_uuid,
        ];
    }
}
