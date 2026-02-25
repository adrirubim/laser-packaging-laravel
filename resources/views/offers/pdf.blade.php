<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>{{ __('offers.pdf.title') }} {{ $offer_number }}</title>
    <style>
        @page {
            margin: 20mm;
            size: A4;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #333;
            background: #fff;
        }
        
        .header {
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        
        .header-title {
            font-size: 24pt;
            font-weight: bold;
            color: #2c3e50;
            text-align: center;
            margin-bottom: 5px;
            letter-spacing: 1px;
        }
        
        .header-subtitle {
            font-size: 12pt;
            color: #7f8c8d;
            text-align: center;
            font-weight: normal;
        }
        
        .info-section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 13pt;
            font-weight: bold;
            color: #2c3e50;
            background: #ecf0f1;
            padding: 8px 12px;
            margin-bottom: 12px;
            border-left: 4px solid #3498db;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .data-table tr {
            border-bottom: 1px solid #e0e0e0;
        }
        
        .data-table tr:last-child {
            border-bottom: 2px solid #2c3e50;
        }
        
        .data-table td {
            padding: 12px 15px;
            vertical-align: top;
        }
        
        .data-table td:first-child {
            width: 50%;
            font-weight: 600;
            color: #555;
            background: #f8f9fa;
            border-right: 1px solid #e0e0e0;
        }
        
        .data-table td:last-child {
            width: 50%;
            text-align: right;
            color: #2c3e50;
            font-weight: 500;
        }
        
        .label {
            font-weight: 600;
            color: #555;
        }
        
        .value {
            font-weight: 600;
            color: #2c3e50;
            font-size: 12pt;
        }
        
        .value-highlight {
            font-weight: bold;
            color: #2980b9;
            font-size: 13pt;
        }
        
        .value-currency {
            font-weight: bold;
            color: #27ae60;
            font-size: 12pt;
        }
        
        .spacer-row {
            height: 8px;
        }
        
        .spacer-row td {
            padding: 0;
            border: none;
            background: transparent;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #ecf0f1;
            text-align: center;
            font-size: 9pt;
            color: #95a5a6;
        }
        
        .text-center {
            text-align: center;
        }
        
        .text-right {
            text-align: right;
        }
        
        .mb-0 {
            margin-bottom: 0;
        }
        
        .mt-2 {
            margin-top: 8px;
        }
        
        .mt-3 {
            margin-top: 12px;
        }
        
        .highlight-box {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 4px;
            padding: 12px;
            margin: 15px 0;
        }
        
        .highlight-box .value {
            color: #856404;
            font-size: 14pt;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-title">{{ __('offers.pdf.header_title') }}</div>
        <div class="header-subtitle">{{ __('offers.pdf.header_subtitle') }}</div>
    </div>
    
    <!-- Informazioni Generali -->
    <div class="info-section">
        <div class="section-title">{{ __('offers.pdf.section_general') }}</div>
        <table class="data-table">
            <tr>
                <td class="label">{{ __('offers.pdf.label_offer_date') }}</td>
                <td class="value">{{ $offer_date }}</td>
            </tr>
            <tr>
                <td class="label">{{ __('offers.pdf.label_offer_number') }}</td>
                <td class="value-highlight">{{ $offer_number }}</td>
            </tr>
            <tr class="spacer-row">
                <td colspan="2"></td>
            </tr>
            <tr>
                <td class="label">{{ __('offers.pdf.label_customer_ref') }}</td>
                <td class="value">{{ $customer_ref ?: __('common.not_available') }}</td>
            </tr>
            <tr>
                <td class="label">{{ __('offers.pdf.label_description') }}</td>
                <td class="value">{{ $provisional_description ?: __('common.not_available') }}</td>
            </tr>
        </table>
    </div>
    
    <!-- Dettagli Produzione -->
    <div class="info-section">
        <div class="section-title">{{ __('offers.pdf.section_production') }}</div>
        <table class="data-table">
            <tr>
                <td class="label">{{ __('offers.pdf.label_hourly_productivity') }}</td>
                <td class="value-highlight">{{ number_format($hourly_productivity, 2, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="label">{{ __('offers.pdf.label_ls_resource_name') }}</td>
                <td class="value">{{ $ls_resource_code ?: __('common.not_available') }}</td>
            </tr>
            <tr>
                <td class="label">{{ __('offers.pdf.label_ls_resource_description') }}</td>
                <td class="value">{{ $ls_resource_description ?: __('common.not_available') }}</td>
            </tr>
        </table>
    </div>
    
    <!-- Dettagli Economici -->
    <div class="info-section">
        <div class="section-title">{{ __('offers.pdf.section_economic') }}</div>
        <table class="data-table">
            <tr>
                <td class="label">{{ __('offers.pdf.label_rate_cfz') }}</td>
                <td class="value-currency">{{ number_format($final_rate_cfz, 5, ',', '.') }} €</td>
            </tr>
            <tr>
                <td class="label">{{ __('offers.pdf.label_running_cost_cfz') }}</td>
                <td class="value">{{ number_format($running_cost_cfz, 5, ',', '.') }} €</td>
            </tr>
            <tr>
                <td class="label">{{ __('offers.pdf.label_setup_cost') }}</td>
                <td class="value">{{ number_format($setup_cost, 5, ',', '.') }} €</td>
            </tr>
            <tr>
                <td class="label">{{ __('offers.pdf.label_setup_cost_cfz') }}</td>
                <td class="value">{{ number_format($setup_cost_cfz, 5, ',', '.') }} €</td>
            </tr>
            <tr>
                <td class="label">{{ __('offers.pdf.label_other_costs_cfz') }}</td>
                <td class="value">{{ number_format($ls_other_costs, 5, ',', '.') }} €</td>
            </tr>
        </table>
    </div>
    
    <!-- Volumi -->
    <div class="info-section">
        <div class="section-title">{{ __('offers.pdf.section_volumes') }}</div>
        <table class="data-table">
            <tr>
                <td class="label">{{ __('offers.pdf.label_volumes') }}</td>
                <td class="value-highlight">{{ number_format($quantity, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>
    
    <!-- Footer -->
    <div class="footer">
        <p>{{ __('offers.pdf.footer_generated') }} {{ date('d/m/Y H:i') }}</p>
        <p>{{ __('offers.pdf.footer_valid') }}</p>
    </div>
</body>
</html>
