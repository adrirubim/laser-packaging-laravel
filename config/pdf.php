<?php

return [
    /*
    |--------------------------------------------------------------------------
    | PDF Company Information
    |--------------------------------------------------------------------------
    |
    | Configuration for company branding in PDF documents
    |
    */

    'company' => [
        'name' => env('PDF_COMPANY_NAME', 'Laser Packaging'),
        'logo' => env('PDF_COMPANY_LOGO', '/logo.svg'),
        'address' => env('PDF_COMPANY_ADDRESS', ''),
        'phone' => env('PDF_COMPANY_PHONE', ''),
        'email' => env('PDF_COMPANY_EMAIL', ''),
        'website' => env('PDF_COMPANY_WEBSITE', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | PDF Style Configuration
    |--------------------------------------------------------------------------
    |
    | Style options for PDF generation:
    | - 'color': Full color with company branding colors
    | - 'grayscale': Grayscale version for cost-effective printing
    | - 'monochrome': Black and white only for maximum compatibility
    |
    */

    'style' => env('PDF_STYLE', 'color'), // 'color', 'grayscale', 'monochrome'

    /*
    |--------------------------------------------------------------------------
    | PDF Color Scheme (for color style)
    |--------------------------------------------------------------------------
    */

    'colors' => [
        'primary' => env('PDF_COLOR_PRIMARY', '#2c3e50'),
        'secondary' => env('PDF_COLOR_SECONDARY', '#3498db'),
        'accent' => env('PDF_COLOR_ACCENT', '#ecf0f1'),
        'text' => env('PDF_COLOR_TEXT', '#333333'),
        'text_light' => env('PDF_COLOR_TEXT_LIGHT', '#7f8c8d'),
    ],
];
