<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIC;

class GenerateArticleICNumberAction
{
    /**
     * @return array{number: string}
     */
    public function execute(): array
    {
        $articlesIC = ArticleIC::query()
            ->where('code', 'IC')
            ->where('removed', false)
            ->get();

        $maxNumber = 0;
        foreach ($articlesIC as $article) {
            $currentNumber = (int) $article->number;
            if ($currentNumber > $maxNumber) {
                $maxNumber = $currentNumber;
            }
        }

        $newNumber = $maxNumber + 1;
        $number = str_pad((string) $newNumber, 4, '0', STR_PAD_LEFT);

        return ['number' => $number];
    }
}
