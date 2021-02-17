<?php
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
?>

<!doctype html>
<html lang="en">

<head>
    <title>Machinery Hawkers</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <meta property="og:title" content="<?php echo $OgTitle;?>" />
    <meta property="og:url" content="<?php echo $OgLink;?>" />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="<?php echo $OgDescription;?>" />

    <meta property="og:image" content="<?php echo $OgImage; ?>" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta property="og:image" content="<?php echo $primary_link; ?>" />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="300" />

    <meta property="og:image" content="<?php echo $primary_link; ?>" />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="300" />

    <meta property="og:image" content="<?php echo $primary_link; ?>" />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="300" />

    <link rel="icon" type="image/png" href="/favicon.png"/>
</head>
<body>
    <script type="text/javascript">
        location.href = "<?php echo $redirect_link; ?>";
    </script>
</body>
</html>