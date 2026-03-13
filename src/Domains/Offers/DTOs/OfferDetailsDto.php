<?php

declare(strict_types=1);

namespace Domain\Offers\DTOs;

readonly class OfferDetailsDto
{
    public function __construct(
        public array $offer,
    ) {}
}
