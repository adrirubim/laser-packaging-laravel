<?php

namespace App\Enums;

enum OrderLabelStatus: int
{
    case NO = 0;
    case YES = 1;
    case PARTIAL = 2;

    /**
     * Get the human-readable label for the status.
     * Valores según legacy order.php
     */
    public function label(): string
    {
        return match ($this) {
            self::NO => 'Non presenti',
            self::YES => 'Da stampare',
            self::PARTIAL => 'Da ricevere',
        };
    }

    /**
     * Get all status values as array for validation.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all status cases as array with labels.
     */
    public static function options(): array
    {
        return array_map(
            fn ($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
