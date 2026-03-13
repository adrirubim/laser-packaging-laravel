<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIP;
use App\Repositories\ArticleRepository;

class DeleteArticleIPAction
{
    public function __construct(
        protected ArticleRepository $articleRepository,
    ) {}

    public function execute(ArticleIP $instruction): void
    {
        $instruction->update(['removed' => true]);

        $this->articleRepository->clearFormOptionsCache();
    }
}
