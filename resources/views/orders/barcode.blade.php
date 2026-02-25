@php
    $pdfConfig = config('pdf');
    $companyName = $pdfConfig['company']['name'];
    $companyLogo = $pdfConfig['company']['logo'];
    // Normalizar la ruta del logo (remover / inicial si existe)
    $logoPath = ltrim($companyLogo, '/');
    $style = $pdfConfig['style'];
    $colors = $pdfConfig['colors'];
    
    // Adjust colors according to style
    if ($style === 'monochrome') {
        $primaryColor = '#000000';
        $textColor = '#000000';
        $textLightColor = '#666666';
        $borderColor = '#000000';
    } elseif ($style === 'grayscale') {
        $primaryColor = '#2c3e50';
        $textColor = '#333333';
        $textLightColor = '#666666';
        $borderColor = '#999999';
    } else {
        $primaryColor = $colors['primary'];
        $textColor = $colors['text'];
        $textLightColor = $colors['text_light'];
        $borderColor = $colors['primary'];
    }
@endphp
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ __('orders.barcode.title') }} {{ $order->order_production_number }}</title>
    <style>
        @page {
            margin: 15mm;
            size: A4;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif;
            color: {{ $textColor }};
            background: #fff;
        }
        
        .header {
            border-bottom: 3px solid {{ $borderColor }};
            padding-bottom: 15px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .logo {
            height: 60px;
            max-width: 200px;
            object-fit: contain;
        }
        
        .company-info {
            display: flex;
            flex-direction: column;
        }
        
        .company-name {
            font-size: 20pt;
            font-weight: bold;
            color: {{ $primaryColor }};
            margin-bottom: 3px;
        }
        
        .document-type {
            font-size: 10pt;
            color: {{ $textLightColor }};
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: calc(100vh - 200px);
            padding: 40px 20px;
        }
        
        .barcode-container {
            background: #fff;
            border: 2px solid {{ $borderColor }};
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 25px;
        }
        
        .barcode {
            margin: 20px 0;
            text-align: center;
        }
        
        .code {
            font-size: 24px;
            font-weight: bold;
            color: {{ $primaryColor }};
            margin-top: 15px;
            letter-spacing: 2px;
        }
        
        .order-info {
            text-align: center;
            margin-top: 20px;
        }
        
        .order-number {
            font-size: 16px;
            color: {{ $textColor }};
            margin-bottom: 5px;
        }
        
        .order-label {
            font-size: 12px;
            color: {{ $textLightColor }};
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid {{ $borderColor }};
            text-align: center;
            font-size: 9pt;
            color: {{ $textLightColor }};
        }
        
        @media print {
            .header {
                page-break-after: avoid;
            }
            .container {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            @if(file_exists(public_path($logoPath)))
                <img src="{{ public_path($logoPath) }}" alt="{{ $companyName }}" class="logo">
            @endif
            <div class="company-info">
                <div class="company-name">{{ $companyName }}</div>
                <div class="document-type">{{ __('orders.barcode.document_type') }}</div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="barcode-container">
            <div class="barcode">
                {!! $barcode !!}
            </div>
            <div class="code">{{ $code }}</div>
        </div>
        
        <div class="order-info">
            <div class="order-label">{{ __('orders.barcode.order_label') }}</div>
            <div class="order-number">{{ $order->order_production_number }}</div>
        </div>
    </div>

    <div class="footer">
        <p>{{ $companyName }} - {{ __('orders.barcode.footer_generated') }} {{ date('d/m/Y H:i') }}</p>
    </div>
</body>
</html>
