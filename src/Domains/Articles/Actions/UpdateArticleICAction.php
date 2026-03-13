<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIC;
use App\Repositories\ArticleRepository;

class UpdateArticleICAction
{
    public function __construct(
        protected ArticleRepository $articleRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(ArticleIC $instruction, array $data): ArticleIC
    {
        $instruction->update($data);

        $this->articleRepository->clearFormOptionsCache();

        return $instruction->refresh();
    }
}
