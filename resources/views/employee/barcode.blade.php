<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
        }
        .barcode {
            margin: 20px 0;
        }
        .code {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="barcode">
            {!! $barcode !!}
        </div>
        <p class="code">{{ $code }}</p>
    </div>
</body>
</html>
