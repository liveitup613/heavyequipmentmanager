<?php
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
?>
<!doctype html>
<html lang="en">

<head>
    <title>HEM</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="Heavy Equipment Manager">
    <meta name="keywords" content="admin template, Oculux admin template, dashboard template, flat admin template, responsive admin template, web app, Light Dark version">
    <meta name="author" content="GetBootstrap, design by: puffintheme.com">

    <link rel="icon" type="image/png" href="/favicon.png"/>
    <!-- VENDOR CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap/css/bootstrap.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/font-awesome/css/font-awesome.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/animate-css/vivify.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/intlTelInput/css/intlTelInput.css'); ?>?<?php echo time(); ?>">   


    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/dataTables.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedcolumns.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedheader.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-steps/jquery.steps.css'); ?>?<?php echo time(); ?>">

    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/c3/c3.min.css'); ?>?<?php echo time(); ?>" />
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap-datepicker/css/bootstrap-datepicker3.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/morrisjs/morris.css'); ?>?<?php echo time(); ?>" />

    <!-- MAIN CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/site.min.css'); ?>?<?php echo time(); ?>">

    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/add-truck.css'); ?>?<?php echo time(); ?>">
    <style>
        #left-sidebar {
            background : #22252a;    
        }
    </style>
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

    <!-- Overlay For Sidebars -->
    <div class="overlay"></div>

    <div id="wrapper">

        <nav class="navbar top-navbar">
            <div class="container-fluid" style="width: 100%;">

                <div class="navbar-left">
                    <div class="navbar-btn">
                        <button type="button" class="btn-toggle-offcanvas"><i class="lnr lnr-menu fa fa-bars"></i></button>
                        <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo" class="img-fluid logo"></a>
                    </div>
                </div>

                <div class="navbar-right">
                    <div id="navbar-menu">
                        <ul class="nav navbar-nav">
                            <li class="dropdown language-menu">
                                <a href="javascript:void(0);" class="dropdown-toggle icon-menu" data-toggle="dropdown">
                                    <div style='display:inline;'>
                                    <?php
                                        if ($Lang == 'english')
                                            echo 'English';
                                        else if ($Lang == 'spanish')
                                            echo 'Español';
                                        ?>
                                    </div>
                                </a>                                
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown" style='min-width : 125px; width: 125px;'>
                                    <a class="dropdown-item pt-2 pb-2" href="javascript:changeLang('english');" style='color:grey;'>English</a>
                                    <a class="dropdown-item pt-2 pb-2" href="javascript:changeLang('spanish');" style='color:grey;'>Español</a>                                    
                                </div>
                            </li>

                            <li><a href="<?php echo base_url('Login/log_out'); ?>" class="icon-menu">
                                <i class="icon-power"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-bar" id="myBar"></div>
            </div>
        </nav>

        <div id="megamenu" class="megamenu particles_js">
            <div id="particles-js"></div>
        </div>

        <!-- Sidebar -->

        <div id="left-sidebar" class="sidebar">
            <div class="navbar-brand">
                <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo" class="img-fluid logo"></a>
                <button type="button" class="btn-toggle-offcanvas btn btn-sm float-right"><i class="lnr lnr-menu icon-close"></i></button>
            </div>
            <div class="sidebar-scroll">
                <div class="user-account">
                    <div class="user_div">
                        <img src="<?php echo base_url('assets/images/avatar/' . ($PROFILEPICTURE == "" ? "default.png" : $PROFILEPICTURE)); ?>" class="user-photo" alt="User Profile Picture">
                    </div>
                    <div class="dropdown">
                        <a href="javascript:void(0);" class=" user-name" data-toggle="dropdown" style="margin-top: 10px;"><strong><?php echo $FULLNAME; ?></strong></a>
                        <span style="font-size: 10px; display: none;"><?php echo $PERMISSION; ?></span><input type="hidden" id="usernameInput" value="<?php echo $USERNAME; ?>" />
                    </div>
                </div>

                <nav id="left-sidebar-nav" class="sidebar-nav">
                    <ul id="main-menu" class="metismenu">
                        <?php if ($PERMISSION == 'admin') { ?>
                        <li>
                            <a href = "<?php echo base_url('Home');?>"><i class='icon-home'></i><span><?php echo lang('Home');?></span></a>
                        <?php }?>

                        <li class="active open">
                            <a href="#myPage" class="has-arrow"><i class="fa fa-gavel"></i><span><?php echo lang('Deals');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Deals'); ?>"><?php echo lang('Deals');?></a></li>
                                <li><a href="<?php echo base_url('Deals/watchlist'); ?>"><?php echo lang('Watch List');?></a></li>
                                <?php if ($PERMISSION == 'admin' || $PERMISSION == "editable" || $PERMISSION == 'uploader') { ?>
                                    <li class="active"><a href="<?php echo base_url('Deals/addNewDeal'); ?>"><?php echo lang('Add New Deal');?></a></li>
                                <?php } ?>
                                <!-- <li><a href="<?php echo base_url('AuctionResults'); ?>"><?php echo lang('Auction Results');?></a></li> -->
                                <li><a href="<?php echo base_url('Deals/statistic'); ?>"><?php echo lang('Statistics');?></a></li>
                                <!-- <li><a href="<?php echo base_url('Procurement'); ?>"><?php echo lang('Procurement');?></a></li> -->
                            </ul>
                        </li>

                        <li>
                            <a href="#myPage" class="has-arrow"><i class="icon-user"></i><span><?php echo lang('Users');?></span></a>
                            <ul>
                                <?php if ($PERMISSION == 'admin') { ?>
                                    <li><a href="<?php echo base_url('User'); ?>"><?php echo lang('Users');?></a></li>
                                <?php } ?>
                                <li><a href="<?php echo base_url('User/redirectToUpdatePasswordPage'); ?>"><?php echo lang('Update Profile');?></a></li>
                                <!-- <li><a href="<?php echo base_url('Worksheet');?>"><?php echo lang('Worksheet');?></a></li> -->
                                <?php 
                                    if ($PERMISSION == 'admin') {
                                    echo '<li><a href="'.base_url('User/configuration').'">'.lang('Settings').'</a></li>';
                                    echo '<li><a href="'.base_url('Activity').'">'.lang('Activities').'</a></li>';
                                }
                                    ?>
                            </ul>
                        </li>
                        <li>
                            <a href="#myPage" class="has-arrow"><i class="fa fa-users"></i><span><?php echo lang('Demand');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Leads'); ?>"><?php echo lang('Leads');?></a></li>
                                <li><a href="<?php echo base_url('Opportunities'); ?>"><?php echo lang('Opportunities');?></a></li>
                                <li><a href="<?php echo base_url('Opportunities/mine'); ?>"><?php echo lang('My Opportunities');?></a></li>
                                <!-- <li><a href="<?php echo base_url('CFU');?>"><?php echo lang('Customer Follow Up');?></a></li> -->
                                <li><a href="<?php echo base_url('Leads/statistic'); ?>"><?php echo lang('Statistics');?></a></li>
                                <li><a href="<?php echo base_url('Customers');?>"><?php echo lang('Customers');?></a></li>
                            </ul>
                        </li>
                        <!-- <li>
                            <a href="#myPage" class="has-arrow"><i class="icon-basket"></i><span><?php echo lang('Sales');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Sales'); ?>"><?php echo lang('Sales');?></a></li>
                                <li><a href="<?php echo base_url('Sales/mine'); ?>"><?php echo lang('My Sales');?></a></li>                                
                            </ul>
                        </li> -->
                    </ul>
                </nav>
            </div>
        </div>

        <div id="banner-picture-making-panel"></div>

        <div id="main-content">
            <div class="loading-box"><img src="<?php echo base_url('assets/images/spinner.gif'); ?>" id="loading"></div>
            <div class="container-fluid">
                <div class="block-header">
                    <div class="row clearfix">
                        <div class="col-lg-12">
                            <h1><?php echo lang('Add New Deal');?></h1>
                            <nav aria-label="breadcrumb">
                            </nav>
                        </div>
                    </div>
                </div>

                <div class="row clearfix">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                        <div class="card">
                            <div class="body wizard_validation">

                                <form id="wizard_with_validation" enctype="multipart/form-data" method="post" action="<?php echo base_url('Deals/AddNewTruck'); ?>">
                                    <input type="hidden" id="uploadTime" value="" name="uploadTime">
                                    <input type="hidden" value="<?php echo  $this->session->userdata('ID'); ?>" name="userId">
                                    <h3><?php echo lang('Choose Deal Type');?></h3>
                                    <fieldset>
                                        <div class="row clearfix">
                                            <div class="col-lg-12 col-md-12 col-12">
                                                <div class="form-group">
                                                    <label><?php echo lang('Deal Type');?></label>
                                                    <div class="input-group mb-3">
                                                        <select class="custom-select" id="inputDealType" name="DealType" onchange="onChangeDealType()">
                                                            <option value="Auction"><?php echo lang('Auction');?></option>
                                                            <option value="For Sale"><?php echo lang('For Sale');?></option>                                                            
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-12 col-md-12  col-12">
                                                <div class="form-group">
                                                    <label><?php echo lang('Equipment Category');?></label>
                                                    <div class="input-group mb-3">
                                                        <select class="custom-select" id="inputEqCategory" name="EqCategory" onchange="onChangeCategory()">                                                            
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-12 col-md-12 col-12" id="inputAuctioneer-box">
                                                <div class="form-group">
                                                    <label><?php echo lang('Auctioneer');?></label>
                                                    <div class="input-group mb-3">
                                                        <select class="custom-select" id="inputAuctioneer" name="Auctioneer">
                                                            <option value="Ritchie Bros">Ritchie Bros</option>
                                                            <option value="Ironplanet">Ironplanet</option>
                                                            <option value="AuctionTime">AuctionTime</option>
                                                            <option value="Proxibid">Proxibid</option>
                                                            <option value="Purplewave">Purplewave</option>
                                                            <option value="EquipmentFacts">EquipmentFacts</option>
                                                            <option value="JJ Kane">JJ Kane</option>
                                                            <option value="Auctionsource">Auctionsource</option>
                                                            <option value="Housby">Housby</option>
                                                            <option value="Barnone">Barnone</option>
                                                            <option value="Bidspotter">Bidspotter</option>
                                                            <option value="BigIron">BigIron</option>
                                                            <option value="Other"><?php echo lang('Other');?></option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 col-md-12 col-12 " id="inputSubmitLink-box">
                                                <div class="form-group">
                                                    <label><?php echo lang('Submit Link');?></label>
                                                    <input type="text" class="form-control" id="inputSubmitLink" name="Link" placeholder="<?php echo lang('Submit Link Here');?>" value="" required onchange="hideLinkMessage();"
onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                                    <span class="span text-danger linkExistedMessage" style="display:none; font-size : 12px;"><?php echo lang('This link is in Database');?></span>                                                    
                                                </div>
                                            </div>
                                            <!-- <div class='col-12'>
                                                <div class='form-group'>
                                                    <label><?php echo lang('Submit Serial Number');?></label>
                                                    <input type="text" class="form-control" id="inputSubmitSN" placeholder="<?php echo lang('Submit Serial Number Here');?>" onchange="hideDuplicateMessage();"
                                                            onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                                    <span class="span text-danger snDuplicateMessage" style="display:none; font-size : 12px;"><?php echo lang('This SN is in Database');?></span>                                                    
                                                </div>
                                            </div> -->


                                    </fieldset>

                                    <h3><?php echo lang('Choose Primary Image');?></h3>
                                    <fieldset>
                                        <div class="row clearfix add-image-div">
                                            <button type="button" id="btnUploadImage" class="btn btn-primary btn-round mb-2 pull-right" style="width : 250px;" onclick="UserImageUpload();"><i class="fa fa-plus"></i> <span><?php echo lang('Upload User Image');?></span></button>
                                            <input type="hidden" id="primaryImageUrl" name="primaryImageUrl">
                                            <input type='hidden' id='scrappedImage1' name='scrappedImage1'>
                                            <input type='hidden' id='scrappedImage2' name='scrappedImage2'>
                                            <input type='hidden' id='scrappedImage3' name='scrappedImage3'>
                                        </div>
                                        <div class="row clearfix primary-image-gallery">
                                            <div class="scrapped-image-gallery">
                                                <div class="form-group image-gallery-item">
                                                    <img class="primaryImage img-fluid" src="" id="slide1" onclick="PrimaryImageSelected(this);">
                                                </div>

                                                <div class="form-group image-gallery-item">
                                                    <img class="primaryImage img-fluid" src="" id="slide2" onclick="PrimaryImageSelected(this);">
                                                </div>

                                                <div class="form-group image-gallery-item">
                                                    <img class="primaryImage img-fluid" src="" id="slide3" onclick="PrimaryImageSelected(this);">
                                                </div>
                                            </div>
                                            <p class="imageSelecionMessage"></p>
                                            <div class="user-upload-image-gallery">
                                                <div class="form-group image-gallery-item ">
                                                    <img class="primaryImage img-fluid" src="" id="slide4" onclick="PrimaryImageSelected(this);">
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <h3><?php echo lang('Equipment Information');?></h3>
                                    <fieldset>
                                        <div class='row equipment-header' id='DealAreaHeader'>
                                            <div class='col-lg-12' id='DealType'><?php echo lang('Auction');?></div>
                                        </div>
                                        <div id='deal-area-container' class='row'>
                                        </div>
                                        <div class='row equipment-header' id='LocationAreaHeader'>
                                            <div class='col-lg-12'><?php echo lang('Location Info');?></div>
                                        </div>
                                        <div id='location-area-container' class='row'>                                            
                                        </div>
                                        <div class='row equipment-header'>
                                            <div class='col-lg-12'><?php echo lang('Equipment Info');?></div>
                                            <div class="col-lg-12 col-md-12">
                                                <div class="form-group">
                                                    <input type="hidden" class="form-control" id="mkTitle" name="mkTitle" required>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 col-md-12">
                                                <div class="form-group">
                                                    <input type="hidden" class="form-control" id="mkDescription" name="mkDescription" required>
                                                </div>
                                            </div>
                                        </div>
                                        <div  id="equipment-area-container" class="row clearfix">   
                                        </div>
                                        <div class='row equipment-header' id='TruckAreaHeader'>
                                            <div class='col-lg-12'><?php echo lang('Truck Info');?></div>
                                        </div>
                                        <div id="truck-area-container" class="row">
                                        </div>
                                        <div class='row additional-header' style='font-size:20px; font-weight : bolder;margin-bottom : 10px;'>
                                            <div class='col-lg-12'><?php echo lang('Additional Info');?></div>
                                        </div>
                                        <div class='row' style='margin-bottom: 10px;'>
                                            <div class='col-lg-12'>
                                                <textarea class="form-control" id="Note" name='Note' rows='5' col='30'></textarea>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <h3><?php echo lang('Price Information');?></h3>
                                    <fieldset>
                                        <div class="row clearfix" style="margin-left : 10px; margin-bottom : 10px;">
                                            <span style="font-size : 20px;">Total : &nbsp;</span><span id="NumTotal" style="font-size: 20px;"></span>
                                            <input type="number" id="Total" name="Total" style="display:none;">
                                        </div>
                                        <div class="row clearfix price-group">                                            
                                        </div>

                                    </fieldset>
                                    <h3><?php echo lang('Preview');?></h3>
                                    <fieldset>
                                        <div class="row clearfix">
                                            <div class="col-lg-4 col-md-6 col-sm-6">
                                                <img class="img-thumbnail primaryImage" src="" id="previewPrimaryImage">
                                            </div>
                                            <div class='col-lg-8 col-md-6'>
                                                <div class='row clearfix'>
                                                    <div class="col-xl-4 col-lg-6 col-md-12 col-sm-6">
                                                        <div class='row equipment-header' id='PreviewDealAreaHeader'>
                                                            <div class='col-lg-12' id='PreviewDealType'><?php echo lang('Auction');?></div>
                                                        </div>
                                                        <div id='preview-deal-area-container'>
                                                        </div>
                                                        <div class='row equipment-header' id='PreviewLocationAreaHeader'>
                                                            <div class='col-lg-12'><?php echo lang('Location Info');?></div>
                                                        </div>
                                                        <div id='preview-location-area-container'>                                            
                                                        </div>
                                                        <div class='row equipment-header'>
                                                            <div class='col-lg-12'><?php echo lang('Equipment Info');?></div>                                                    
                                                        </div>
                                                        <div  id="preview-equipment-area-container">   
                                                        </div>
                                                        <div class='row' style='font-size:20px; font-weight : bolder; margin-bottom : 10px;'>
                                                            <div class='col-lg-12'><?php echo lang('Additional Info');?></div>
                                                        </div>
                                                        <div>
                                                            <div class="form-group">
                                                                <span><?php echo lang('Additional Info');?> : </span><br><textarea class="preview" id="previewNote"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class='col-xl-4 col-lg-6 col-md-12 col-sm-6'>
                                                        <div class='row equipment-header' id='PreviewTruckAreaHeader'>
                                                            <div class='col-lg-12'><?php echo lang('Truck Info');?></div>
                                                        </div>
                                                        <div id="preview-truck-area-container">
                                                        </div>
                                                    </div>
                                                    <div class="col-xl-4 col-lg-6 col-md-12 col-sm-6">
                                                        <div class='row equipment-header' id='PreviewTruckAreaHeader'>
                                                            <div class='col-lg-12'><?php echo lang('Price');?></div>
                                                        </div>
                                                        <div class="preview-price-group">                                              
                                                        </div>
                                                    </div>
                                                </div>                                                                                                
                                            </div>                                            
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <form method="post" id="upload-user-image-form" enctype="multipart/form-data">
                    <input type="file" id="inputNewPrimayImage" style="display:none" name="userImage" onchange="uploadImageButtonSelected(this)">
                </form>

            </div>
        </div>
    </div>

    <!-- JQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js?<?php echo time(); ?>"></script>

    <!-- Javascript -->
    <script src="<?php echo base_url('assets/bundles/libscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/vendorscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/vendor/jquery-validation/jquery.validate.js'); ?>?<?php echo time(); ?>"></script><!-- Jquery Validation Plugin Css -->
    <script src="<?php echo base_url('assets/vendor/jquery-steps/jquery.steps.js'); ?>?<?php echo time(); ?>"></script><!-- JQuery Steps Plugin Js -->

    <script src="<?php echo base_url('assets/bundles/c3.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/knob.bundle.js'); ?>?<?php echo time(); ?>"></script><!-- Jquery Knob-->
    <script src="<?php echo base_url('assets/bundles/mainscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-inputmask/jquery.inputmask.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery.maskedinput/jquery.maskedinput.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/intlTelInput/js/intlTelInput-jquery.min.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/js/index6.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/html2canvas.js'); ?>?<?php echo time(); ?>"></script>

    <!-- Custom Javascript -->
    <script type="text/javascript">
        var base_url = "<?php echo base_url(); ?>";
        var currentView = 0;
        var lang = "<?php echo $Lang;?>" ;
        /* 
         * 0 : Total Bins
         * 1 : Available Bins
         * 2 : Dispatched Bins
         * 3 : Overdue Bins
         * 4 : History
         */
    </script>

    <script src="<?php echo base_url('assets/js/pages/session_timer.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/config.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/localization.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/form-wizard.js'); ?>?<?php echo time(); ?>"></script>

    <script>
        function hideLinkMessage() {
            $('.linkExistedMessage').hide();
        }

        function hideDuplicateMessage() {
            $('.snDuplicateMessage').hide();
        }
    </script>

</body>

</html>