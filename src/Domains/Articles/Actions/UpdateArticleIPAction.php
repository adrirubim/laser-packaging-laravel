<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIP;
use App\Repositories\ArticleRepository;

class UpdateArticleIPAction
{
    public function __construct(
        protected ArticleRepository $articleRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(ArticleIP $instruction, array $data): ArticleIP
    {
        $instruction->update($data);

        $this->articleRepository->clearFormOptionsCache();

        return $instruction->refresh();
    }
}
