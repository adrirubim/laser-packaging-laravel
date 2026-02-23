<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Process;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('test:all', function () {
    $this->info('Running PHP tests (PHPUnit)...');
    // Subprocess must use APP_ENV=testing so CSRF/session behave like "php artisan test" (avoids 419)
    $result = Process::path(base_path())
        ->forever()
        ->env(['APP_ENV' => 'testing'])
        ->run(
            'php artisan test',
            fn ($type, $out) => $this->getOutput()->write($out)
        );

    if ($result->failed()) {
        $this->error('PHP tests failed.');
        return $result->exitCode();
    }

    $this->newLine();
    $this->info('Running frontend tests (Vitest)...');
    $resultFrontend = Process::path(base_path())->forever()->run(
        'npm run test -- --run',
        fn ($type, $out) => $this->getOutput()->write($out)
    );

    if ($resultFrontend->failed()) {
        $this->error('Frontend tests failed.');
        return $resultFrontend->exitCode();
    }

    $this->newLine();
    $this->info('All tests passed.');
    return 0;
})->purpose('Run PHPUnit and Vitest (Planning/frontend tests)');
