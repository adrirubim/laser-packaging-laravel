<?php

declare(strict_types=1);

namespace Domain\Articles\Actions;

use Illuminate\Database\Eloquent\Model;

class ToggleArticleStatusAction
{
    /**
     * Generic status toggle for article-like models.
     */
    public function execute(Model $article, string $attribute = 'removed'): Model
    {
        $current = (bool) $article->getAttribute($attribute);
        $article->setAttribute($attribute, ! $current);
        $article->save();

        return $article->refresh();
    }
}
