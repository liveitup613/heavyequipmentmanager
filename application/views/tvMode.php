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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="description" content="Heavy Equipment Manager">
    <meta name="keywords" content="admin template, Oculux admin template, dashboard template, flat admin template, responsive admin template, web app, Light Dark version">
    <meta name="author" content="GetBootstrap, design by: puffintheme.com">

    <link rel="icon" type="image/png" href="/favicon.png"/>
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Oswald">
    <!-- VENDOR CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap/css/bootstrap.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/font-awesome/css/font-awesome.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/animate-css/vivify.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/toastr.min.css'); ?>?<?php echo time(); ?>">
    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/tvMode.css'); ?>?<?php echo time(); ?>">
</head>

<body>
    <div class="loading-box"><img src="<?php echo base_url('assets/images/spinner.gif'); ?>?<?php echo time(); ?>" id="loading"></div>
    <div id="TVPanel">
        <!-- <img id="back-button" src="<?php echo base_url('assets/images/icon/back-button.png'); ?>?<?php echo time(); ?>"> -->
        <div id="TVMainPanel">

            <div id="imageTvMainPanel-container">
                <div id="imageTvMainPanel">
                    <div class="imageTvSlider-box">
                        <div id="image-box">
                        </div>
                    </div>
                </div>
            </div>

            <div id="detailTvMainPanel">
                <h1 class="tvmode-translate"></h1>
                <div class="tvmode-hr"></div>
                <div class="tvmode-title-block">
                    <h1 class="tvmode-title"></h1>
                    <h1 class="tvmode-model"></h1>
                </div>                
                <nav class="tvmode-detail-container">
                    <div class="tvmode-detail-box" id="tvmode-detail-box1"></div>
                    <div id="tvmode-detail-price">
                    </div>
                </nav>
            </div>

            <select id="auto-setting">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
            </select>

            <div style="width: 100px; position: absolute; right: 13px; bottom:8px;">
                <button class="btn btn-sm btn-primary btn-block" id="nextBtn" title="">NEXT</button>
            </div>
            <div style="width: 100px; position: absolute; right: 120px; bottom:8px;">
                <button class="btn btn-sm btn-primary btn-block" id="prevBtn" title="">PREV</button>
            </div>
        </div>
    </div>

    <!-- JQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>


    <!-- Custom Javascript -->
    <script type="text/javascript">
        var base_url = "<?php echo base_url(); ?>";
        var currentView = 0;
        /* 
         * 0 : Total Bins
         * 1 : Available Bins
         * 2 : Dispatched Bins
         * 3 : Overdue Bins
         * 4 : History
         */
    </script>


    <script src="<?php echo base_url('assets/vendor/toastr.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/config.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/tvMode.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/session_timer.js'); ?>?<?php echo time(); ?>"></script>
    
</body>

</html>