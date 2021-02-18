

<!doctype html>
<html lang="en">

<head>
<title>HEM</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<meta name="description" content="Machinary Hunters Platform">
<meta name="author" content="GetBootstrap, design by: puffintheme.com">

<link rel="icon" type="image/png" href="/favicon.png"/>
<!-- VENDOR CSS -->
<link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap/css/bootstrap.min.css');?>">
<link rel="stylesheet" href="<?php echo base_url('assets/vendor/font-awesome/css/font-awesome.min.css');?>">
<link rel="stylesheet" href="<?php echo base_url('assets/vendor/animate-css/vivify.min.css');?>">

<!-- MAIN CSS -->
<link rel="stylesheet" href="<?php echo base_url('assets/css/site.min.css');?>">

<!-- Custom CSS -->
<link rel="stylesheet" href="<?php echo base_url('assets/css/login.css');?>?<?php echo time(); ?>">
<link rel="stylesheet" href="<?php echo base_url('assets/css/management.css');?>?<?php echo time(); ?>">

</head>
<body class="theme-cyan font-montserrat light_version">

<!-- Page Loader -->
<div class="page-loader-wrapper">
    <div class="loader">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
        <div class="bar4"></div>
        <div class="bar5"></div>
    </div>
</div>

<div class="pattern">
    <span class="red"></span>
    <span class="indigo"></span>
    <span class="blue"></span>
    <span class="green"></span>
    <span class="orange"></span>
</div>

<div class="v-header contain">
    <div class="fullscreen-video-wrap">              
    </div>
</div>

<div class='header-overlay'></div>

<div class="loading-box"><img src="<?php echo base_url('assets/images/spinner.gif'); ?>" id="pdf-loading"></div>

<div class="auth-main particles_js" style='background: white;'>    
    <div class="auth_div vivify popIn">
        <div class="auth_brand">
            <a class="navbar-brand" href="javascript:void(0);" style='color: #007bff;'>Heavy Equipment Manager</a>
        </div>
        <div class="card">
            <div class="body" style='border-width: 0px'>                         
                <div class="login-form">
                    <div class="form-group">
                        <label for="signin-email" class="control-label sr-only">Username</label>
                        <input type="email" class="form-control round" id="signin-username" name="username" onkeyup="checkEnterkey(event)" placeholder="Username">
                    </div>
                    <div class="form-group">
                        <label for="signin-password" class="control-label sr-only">Password</label>
                        <input type="password" class="form-control round" id="signin-password" name="password" onkeyup="checkEnterkey(event)" placeholder="Password">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-round btn-block" id="btn-singin">SIGN IN</button>
                    </div>
                    <input type="hidden" id="ip">
                </div>
            </div>
        </div>
    </div>
    <div id="particles-js" style="display:none;"></div>
</div>
<!-- END WRAPPER -->
    
<!-- JQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- Bundles -->
<script src="<?php echo base_url('assets/bundles/libscripts.bundle.js');?>"></script>    
<script src="<?php echo base_url('assets/bundles/vendorscripts.bundle.js');?>"></script>
<script src="<?php echo base_url('assets/bundles/mainscripts.bundle.js');?>"></script>

<!-- Custom -->
<script src="<?php echo base_url('assets/js/pages/config.js');?>?<?php echo time(); ?>"></script>
<script src="<?php echo base_url('assets/js/pages/login/login.js');?>?<?php echo time(); ?>"></script>

<!-- Custom Javascript -->
<script type="text/javascript">
    var base_url = "<?php echo base_url();?>";        
</script>

</body>
</html>
