@php
    $pdfConfig = config('pdf');
    $companyName = $pdfConfig['company']['name'];
    $companyLogo = $pdfConfig['company']['logo'];
    // Normalizar la ruta del logo (remover / inicial si existe para public_path)
    $logoPath = ltrim($companyLogo, '/');
    $companyAddress = $pdfConfig['company']['address'];
    $companyPhone = $pdfConfig['company']['phone'];
    $companyEmail = $pdfConfig['company']['email'];
    $companyWebsite = $pdfConfig['company']['website'];
    $style = $pdfConfig['style'];
    $colors = $pdfConfig['colors'];
    
    // Ajustar colores según el estilo
    if ($style === 'monochrome') {
        $primaryColor = '#000000';
        $secondaryColor = '#000000';
        $accentColor = '#f0f0f0';
        $textColor = '#000000';
        $textLightColor = '#666666';
        $borderColor = '#000000';
        $tableHeaderBg = '#f0f0f0';
    } elseif ($style === 'grayscale') {
        $primaryColor = '#2c3e50';
        $secondaryColor = '#34495e';
        $accentColor = '#ecf0f1';
        $textColor = '#333333';
        $textLightColor = '#666666';
        $borderColor = '#999999';
        $tableHeaderBg = '#f0f0f0';
    } else {
        $primaryColor = $colors['primary'];
        $secondaryColor = $colors['secondary'];
        $accentColor = $colors['accent'];
        $textColor = $colors['text'];
        $textLightColor = $colors['text_light'];
        $borderColor = $colors['primary'];
        $tableHeaderBg = $accentColor;
    }
@endphp
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Autocontrollo ORDINE {{ $order_production_number }}</title>
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
            font-size: 10pt;
            line-height: 1.5;
            color: {{ $textColor }};
            background: #fff;
        }
        
        .header {
            border-bottom: 3px solid {{ $borderColor }};
            padding-bottom: 15px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
        }
        
        .logo {
            height: 50px;
            max-width: 180px;
            object-fit: contain;
        }
        
        .company-info {
            display: flex;
            flex-direction: column;
        }
        
        .company-name {
            font-size: 18pt;
            font-weight: bold;
            color: {{ $primaryColor }};
            margin-bottom: 3px;
        }
        
        .document-title {
            font-size: 16pt;
            font-weight: bold;
            color: {{ $primaryColor }};
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        
        .document-subtitle {
            font-size: 11pt;
            color: {{ $textLightColor }};
        }
        
        .header-right {
            text-align: right;
        }
        
        .order-number-badge {
            display: inline-block;
            background: {{ $accentColor }};
            border: 2px solid {{ $borderColor }};
            padding: 8px 15px;
            border-radius: 4px;
            font-size: 12pt;
            font-weight: bold;
            color: {{ $primaryColor }};
        }
        
        .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-weight: bold;
            font-size: 12pt;
            color: {{ $primaryColor }};
            background: {{ $accentColor }};
            padding: 8px 12px;
            margin-bottom: 10px;
            border-left: 4px solid {{ $secondaryColor }};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .row {
            display: flex;
            margin-bottom: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .row:last-child {
            border-bottom: none;
        }
        
        .label {
            font-weight: 600;
            width: 180px;
            flex-shrink: 0;
            color: {{ $textColor }};
        }
        
        .value {
            flex: 1;
            color: {{ $textColor }};
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        table th, table td {
            border: 1px solid {{ $borderColor }};
            padding: 8px 10px;
            text-align: left;
        }
        
        table th {
            background-color: {{ $tableHeaderBg }};
            font-weight: bold;
            color: {{ $primaryColor }};
            text-transform: uppercase;
            font-size: 9pt;
            letter-spacing: 0.5px;
        }
        
        table td {
            background-color: #fff;
        }
        
        table tr:nth-child(even) td {
            background-color: #fafafa;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid {{ $accentColor }};
            text-align: center;
            font-size: 8pt;
            color: {{ $textLightColor }};
        }
        
        .footer-info {
            margin-bottom: 5px;
        }
        
        .footer-company {
            font-weight: bold;
            color: {{ $primaryColor }};
            margin-bottom: 3px;
        }
        
        @media print {
            .header {
                page-break-after: avoid;
            }
            .section {
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
                <div class="document-title">Autocontrollo Ordine</div>
                <div class="document-subtitle">Documento di Controllo Qualità</div>
            </div>
        </div>
        <div class="header-right">
            <div class="order-number-badge">
                Ordine: {{ $order_production_number }}
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Dati Ordine</div>
        <div class="row">
            <span class="label">Numero Ordine:</span>
            <span class="value">{{ $order_production_number }}</span>
        </div>
        <div class="row">
            <span class="label">Quantità:</span>
            <span class="value">{{ $quantity }}</span>
        </div>
        <div class="row">
            <span class="label">Lotto:</span>
            <span class="value">{{ $lot }}</span>
        </div>
        <div class="row">
            <span class="label">Data Scadenza:</span>
            <span class="value">{{ $expiration_date }}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Dati Articolo</div>
        <div class="row">
            <span class="label">Codice LAS:</span>
            <span class="value">{{ $article->cod_article_las ?? '-' }}</span>
        </div>
        <div class="row">
            <span class="label">Codice Cliente:</span>
            <span class="value">{{ $cod_article_cliente }}</span>
        </div>
        <div class="row">
            <span class="label">Descrizione:</span>
            <span class="value">{{ $article_descr }}</span>
        </div>
        <div class="row">
            <span class="label">Unità di Misura:</span>
            <span class="value">{{ $um }}</span>
        </div>
        @if(!empty($additional_descr) && $additional_descr !== '-')
        <div class="row">
            <span class="label">Descrizione Aggiuntiva:</span>
            <span class="value">{{ $additional_descr }}</span>
        </div>
        @endif
    </div>

    @if(!empty($label_info) && $label_info !== '- / - / -')
    <div class="section">
        <div class="section-title">Informazioni Etichette</div>
        <div class="row">
            <span class="value">{{ $label_info }}</span>
        </div>
    </div>
    @endif

    @if(!empty($packaging_instruct) && $packaging_instruct !== ' - ')
    <div class="section">
        <div class="section-title">Istruzioni Packaging</div>
        <div class="row">
            <span class="value">{{ $packaging_instruct }}</span>
        </div>
    </div>
    @endif

    @if(!empty($palletizing_instruct) && $palletizing_instruct !== ' - ')
    <div class="section">
        <div class="section-title">Istruzioni Palletizzazione</div>
        <div class="row">
            <span class="value">{{ $palletizing_instruct }}</span>
        </div>
    </div>
    @endif

    @if(!empty($criticita) && $criticita !== '-')
    <div class="section">
        <div class="section-title">Criticità</div>
        <div class="row">
            <span class="value">{{ $criticita }}</span>
        </div>
    </div>
    @endif

    @if(!empty($article_material_list) && count($article_material_list) > 0)
    <div class="section">
        <div class="section-title">Materiali</div>
        <table>
            <thead>
                <tr>
                    <th>Codice</th>
                    <th>Descrizione</th>
                </tr>
            </thead>
            <tbody>
                @foreach($article_material_list as $material)
                <tr>
                    <td>{{ $material['cod'] }}</td>
                    <td>{{ $material['description'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if($pallet)
    <div class="section">
        <div class="section-title">Informazioni Pallet</div>
        <div class="row">
            <span class="label">Codice:</span>
            <span class="value">{{ $pallet->code ?? '-' }}</span>
        </div>
        @if(!empty($pallet->description))
        <div class="row">
            <span class="label">Descrizione:</span>
            <span class="value">{{ $pallet->description }}</span>
        </div>
        @endif
    </div>
    @endif

    @if(!empty($weight_info) && trim($weight_info) !== '')
    <div class="section">
        <div class="section-title">Informazioni Peso</div>
        <div class="row">
            <span class="value">{{ $weight_info }}</span>
        </div>
    </div>
    @endif

    @if(!empty($notes) && $notes !== '-')
    <div class="section">
        <div class="section-title">Note</div>
        <div class="row">
            <span class="value">{{ $notes }}</span>
        </div>
    </div>
    @endif

    <div class="footer">
        <div class="footer-company">{{ $companyName }}</div>
        @if($companyAddress)
        <div class="footer-info">{{ $companyAddress }}</div>
        @endif
        @if($companyPhone || $companyEmail)
        <div class="footer-info">
            @if($companyPhone)Tel: {{ $companyPhone }}@endif
            @if($companyPhone && $companyEmail) | @endif
            @if($companyEmail)Email: {{ $companyEmail }}@endif
        </div>
        @endif
        @if($companyWebsite)
        <div class="footer-info">Web: {{ $companyWebsite }}</div>
        @endif
        <div class="footer-info" style="margin-top: 8px;">
            Documento generato il {{ date('d/m/Y H:i') }}
        </div>
    </div>
</body>
</html>
