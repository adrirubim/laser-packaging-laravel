<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use App\Models\ArticleIO;

class GenerateArticleIONumberAction
{
    /**
     * @return array{number: string}
     */
    public function execute(): array
    {
        $articlesIO = ArticleIO::query()
            ->where('code', 'IO')
            ->where('removed', false)
            ->get();

        $maxNumber = 0;
        foreach ($articlesIO as $article) {
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
