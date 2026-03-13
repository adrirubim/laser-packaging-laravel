<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIO;

class StoreArticleIOAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): ArticleIO
    {
        /** @var ArticleIO $instruction */
        $instruction = ArticleIO::query()->create($data);

        return $instruction;
    }
}
