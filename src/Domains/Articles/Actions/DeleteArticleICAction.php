<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIC;
use App\Repositories\ArticleRepository;

class DeleteArticleICAction
{
    public function __construct(
        protected ArticleRepository $articleRepository,
    ) {}

    public function execute(ArticleIC $instruction): void
    {
        $instruction->update(['removed' => true]);

        $this->articleRepository->clearFormOptionsCache();
    }
}
