<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIO;
use App\Repositories\ArticleRepository;

class DeleteArticleIOAction
{
    public function __construct(
        protected ArticleRepository $articleRepository,
    ) {}

    public function execute(ArticleIO $instruction): void
    {
        $instruction->update(['removed' => true]);

        $this->articleRepository->clearFormOptionsCache();
    }
}
