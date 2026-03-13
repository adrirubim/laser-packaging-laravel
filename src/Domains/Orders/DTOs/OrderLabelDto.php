<?php

declare(strict_types=1);

namespace Domain\Orders\DTOs;

readonly class OrderLabelDto
{
    public string $labelInfo;

    public string $criticita;

    public ?string $customerSamples;

    /**
     * @var array<int, mixed>
     */
    public array $articleMaterials;

    public string $weightInfo;

    public function __construct(
        string $labelInfo,
        string $criticita,
        ?string $customerSamples,
        array $articleMaterials,
        string $weightInfo,
    ) {
        $this->labelInfo = $labelInfo;
        $this->criticita = $criticita;
        $this->customerSamples = $customerSamples;
        $this->articleMaterials = $articleMaterials;
        $this->weightInfo = number_format((float) $weightInfo, 2, '.', '');
    }
}
