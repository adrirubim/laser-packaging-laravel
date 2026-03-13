<?php

declare(strict_types=1);

namespace Domain\Orders\Actions;

use App\Models\Article;
use Domain\Orders\DTOs\OrderLabelDto;

class GetOrderLabelDataAction
{
    public function execute(Article $article): OrderLabelDto
    {
        $labelInfo = $this->getLabelInfo($article);
        $criticita = $this->getCriticita($article);
        $customerSamples = $this->getCustomerSamples($article);
        $articleMaterials = $this->getArticleMaterials($article);
        $weightInfo = $this->getWeightInfo($article);

        return new OrderLabelDto(
            labelInfo: $labelInfo,
            criticita: $criticita,
            customerSamples: $customerSamples,
            articleMaterials: $articleMaterials,
            weightInfo: $weightInfo,
        );
    }

    protected function getLabelInfo(Article $article): string
    {
        $ingredient = $this->getLabelValue($article->labels_ingredient);
        $variable = $this->getLabelValue($article->labels_data_variable);
        $jumpers = $this->getLabelValue($article->label_of_jumpers);

        return "{$ingredient} / {$variable} / {$jumpers}";
    }

    protected function getLabelValue(mixed $value): string
    {
        if ($value === null) {
            return '-';
        }

        $labels = [
            0 => __('common.no'),
            1 => __('common.yes'),
            2 => __('common.partial'),
        ];

        return $labels[$value] ?? (string) $value;
    }

    protected function getCriticita(Article $article): string
    {
        if ($article->criticalIssues === null || $article->criticalIssues->isEmpty()) {
            return '-';
        }

        return $article->criticalIssues->pluck('name')->implode(', ');
    }

    protected function getCustomerSamples(Article $article): ?string
    {
        return $article->customer_samples_list;
    }

    protected function getArticleMaterials(Article $article): array
    {
        if ($article->materials === null || $article->materials->isEmpty()) {
            return [];
        }

        return $article->materials->map(static function ($material): array {
            return [
                'uuid' => $material->uuid,
                'cod' => $material->cod ?? '-',
                'description' => $material->description ?? '-',
            ];
        })->toArray();
    }

    protected function getWeightInfo(Article $article): string
    {
        $nominal = $this->getWeightControlValue($article->nominal_weight_control);
        $unit = $article->weight_unit_of_measur ?? '';
        $value = $article->weight_value ?? '';
        $object = $this->getWeightControlValue($article->object_control_weight);

        return "{$nominal}  {$unit}  {$value}  {$object}";
    }

    protected function getWeightControlValue(mixed $value): string
    {
        if ($value === null) {
            return '';
        }

        return (string) $value;
    }
}
