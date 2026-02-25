<?php

declare(strict_types=1);

$baseDir = __DIR__.'/..';
$locales = ['en', 'it', 'es'];
$files = [];

foreach ($locales as $locale) {
    $path = $baseDir."/lang/{$locale}.json";
    if (! is_file($path)) {
        fwrite(STDERR, "Missing lang file for locale {$locale}: {$path}\n");
        exit(1);
    }

    $json = file_get_contents($path);
    if ($json === false) {
        fwrite(STDERR, "Unable to read lang file for locale {$locale}: {$path}\n");
        exit(1);
    }

    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        fwrite(STDERR, strtoupper($locale).' JSON error: '.json_last_error_msg()."\n");
        exit(1);
    }

    if (! is_array($data)) {
        fwrite(STDERR, "Lang file for locale {$locale} must decode to an object\n");
        exit(1);
    }

    foreach ($data as $key => $value) {
        if (! is_string($value)) {
            fwrite(
                STDERR,
                "Non-string value for key \"{$key}\" in locale {$locale} (type: ".gettype($value).")\n"
            );
            exit(1);
        }
    }

    $files[$locale] = $data;
}

$referenceLocale = $locales[0];
$referenceKeys = array_keys($files[$referenceLocale]);
sort($referenceKeys);

$hasError = false;

foreach ($locales as $locale) {
    $keys = array_keys($files[$locale]);
    sort($keys);

    $missing = array_diff($referenceKeys, $keys);
    $extra = array_diff($keys, $referenceKeys);

    if (! empty($missing)) {
        $hasError = true;
        fwrite(
            STDERR,
            "Locale {$locale} is missing keys compared to {$referenceLocale}: ".
            implode(', ', $missing)."\n"
        );
    }

    if (! empty($extra)) {
        $hasError = true;
        fwrite(
            STDERR,
            "Locale {$locale} has extra keys compared to {$referenceLocale}: ".
            implode(', ', $extra)."\n"
        );
    }
}

if ($hasError) {
    exit(1);
}

fwrite(STDOUT, "i18n check passed: all locales in sync and values are strings.\n");
