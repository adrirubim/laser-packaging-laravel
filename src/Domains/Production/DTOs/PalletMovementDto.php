<?php

declare(strict_types=1);

namespace Domain\Production\DTOs;

readonly class PalletMovementDto
{
    public function __construct(
        public string $orderUuid,
        public string $employeeUuid,
    ) {}
}
