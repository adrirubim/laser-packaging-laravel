<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIO;

class UpdateArticleIOAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(ArticleIO $instruction, array $data): ArticleIO
    {
        $instruction->update($data);

        return $instruction->refresh();
    }
}
