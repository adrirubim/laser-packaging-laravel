<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Feature tests shouldn't fail with 419 due to missing CSRF tokens.
        // Laravel versions differ on the middleware class name.
        $csrfMiddlewareClasses = [
            \Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class,
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
            \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class,
        ];

        foreach ($csrfMiddlewareClasses as $middlewareClass) {
            if (class_exists($middlewareClass)) {
                $this->withoutMiddleware($middlewareClass);
            }
        }
    }
}
