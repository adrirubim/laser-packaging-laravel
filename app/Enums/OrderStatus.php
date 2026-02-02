<?php

namespace App\Enums;

enum OrderStatus: int
{
    case PIANIFICATO = 0;
    case IN_ALLESTIMENTO = 1;
    case LANCIATO = 2;
    case IN_AVANZAMENTO = 3;
    case SOSPESO = 4;
    case EVASO = 5;
    case SALDATO = 6;

    /**
     * Get the human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::PIANIFICATO => 'Pianificato',
            self::IN_ALLESTIMENTO => 'In Allestimento',
            self::LANCIATO => 'Lanciato',
            self::IN_AVANZAMENTO => 'In Avanzamento',
            self::SOSPESO => 'Sospeso',
            self::EVASO => 'Evaso',
            self::SALDATO => 'Saldato',
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
