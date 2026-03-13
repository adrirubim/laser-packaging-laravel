<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIC;
use App\Repositories\ArticleRepository;

class StoreArticleICAction
{
    public function __construct(
        protected ArticleRepository $articleRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): ArticleIC
    {
        /** @var ArticleIC $instruction */
        $instruction = ArticleIC::query()->create($data);

        $this->articleRepository->clearFormOptionsCache();

        return $instruction;
    }
}
