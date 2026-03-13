<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIP;
use App\Repositories\ArticleRepository;

class StoreArticleIPAction
{
    public function __construct(
        protected ArticleRepository $articleRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): ArticleIP
    {
        /** @var ArticleIP $instruction */
        $instruction = ArticleIP::query()->create($data);

        $this->articleRepository->clearFormOptionsCache();

        return $instruction;
    }
}
