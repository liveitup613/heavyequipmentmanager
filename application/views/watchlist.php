<?php
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
?>

<!doctype html>
<html lang="en">

<head>
    <title>Machinery Hunters Platform</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="description" content="Machinary Hunters Platform">
    <meta name="keywords" content="admin template, Oculux admin template, dashboard template, flat admin template, responsive admin template, web app, Light Dark version">
    <meta name="author" content="GetBootstrap, design by: puffintheme.com">

    <link rel="icon" type="image/png" href="/favicon.png"/>
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Oswald">
    <!-- VENDOR CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap/css/bootstrap.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/font-awesome/css/font-awesome.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/animate-css/vivify.min.css'); ?>?<?php echo time(); ?>">



    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-steps/jquery.steps.css'); ?>?<?php echo time(); ?>">

    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/c3/c3.min.css'); ?>?<?php echo time(); ?>" />
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/morrisjs/morris.css'); ?>?<?php echo time(); ?>" />

    <!-- MAIN CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/site.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/light-gallery/css/lightgallery.css'); ?>?<?php echo time(); ?>">
    <!-- dataTables-->

    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/dataTables.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedcolumns.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedheader.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/flexslider.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/toastr.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap-datepicker/css/bootstrap-datepicker3.min.css'); ?>?<?php echo time(); ?>">
    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/watchlist.css'); ?>?<?php echo time(); ?>">
    <style>
        #left-sidebar {
            background : #22252a;    
        }
    </style>
</head>

<body class="theme-cyan font-montserrat">

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
                        <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo" class="img-fluid logo"></a>
                        <button type="button" class="btn-toggle-offcanvas"><i class="lnr lnr-menu fa fa-bars"></i></button>
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
                                <i class="icon-power"></i>
                            </a></li>
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
                <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo" class="img-fluid logo"><span class="sidebar-logo-title">Machinery Hunters Platform</span></a>
                <button type="button" class="btn-toggle-offcanvas btn btn-sm float-right"><i class="lnr lnr-menu icon-close"></i></button>
            </div>
            <div class="sidebar-scroll">
                <div class="user-account">
                    <div class="user_div">
                        <img src="<?php echo base_url('assets/images/avatar/' . ($PROFILEPICTURE == "" ? "default.png" : $PROFILEPICTURE)); ?>" class="user-photo" alt="User Profile Picture">
                    </div>
                    <div class="dropdown">
                        <a href="javascript:void(0);" class=" user-name" data-toggle="dropdown" style="margin-top: 10px;"><strong><?php echo $FULLNAME; ?></strong></a>
                        <span style="font-size: 10px; display:none;"><?php echo $PERMISSION; ?></span><input type="hidden" id="usernameInput" value="<?php echo $USERNAME; ?>" />
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
                                <li class="active"><a href="<?php echo base_url('Deals/watchlist'); ?>"><?php echo lang('Watch List');?></a></li>
                                <?php if ($PERMISSION == 'admin' || $PERMISSION == "editable" || $PERMISSION == 'uploader') { ?>
                                    <li><a href="<?php echo base_url('Deals/addNewDeal'); ?>"><?php echo lang('Add New Deal');?></a></li>
                                <?php } ?>
                                <li><a href="<?php echo base_url('AuctionResults'); ?>"><?php echo lang('Auction Results');?></a></li>
                                <li><a href="<?php echo base_url('Deals/statistic'); ?>"><?php echo lang('Statistics');?></a></li>
                                <li><a href="<?php echo base_url('Procurement'); ?>"><?php echo lang('Procurement');?></a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#myPage" class="has-arrow"><i class="icon-user"></i><span><?php echo lang('Users');?></span></a>
                            <ul>
                                <?php if ($PERMISSION == 'admin') { ?>
                                    <li><a href="<?php echo base_url('User'); ?>"><?php echo lang('Users');?></a></li>
                                <?php } ?>
                                <li><a href="<?php echo base_url('User/redirectToUpdatePasswordPage'); ?>"><?php echo lang('Update Profile');?></a></li>
                                <li><a href="<?php echo base_url('Worksheet');?>"><?php echo lang('Worksheet');?></a></li>
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
                                <li><a href="<?php echo base_url('CFU');?>"><?php echo lang('Customer Follow Up');?></a></li>
                                <li><a href="<?php echo base_url('Leads/statistic'); ?>"><?php echo lang('Statistics');?></a></li>
                                <li><a href="<?php echo base_url('Customers');?>"><?php echo lang('Customers');?></a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#myPage" class="has-arrow"><i class="icon-basket"></i><span><?php echo lang('Sales');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Sales'); ?>"><?php echo lang('Sales');?></a></li>
                                <li><a href="<?php echo base_url('Sales/mine'); ?>"><?php echo lang('My Sales');?></a></li>
                                <li><a href="<?php echo base_url('Sales/statistics'); ?>"><?php echo lang('Statistics');?></a></li>                              
                                <li><a href="<?php echo base_url('Incentive'); ?>"><?php echo lang('Incentives');?></a></li>
                                <li><a href="<?php echo base_url('Incentive/mine'); ?>"><?php echo lang('My Incentives');?></a></li>             
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="loading-box"><img src="<?php echo base_url('assets/images/spinner.gif'); ?>" id="pdf-loading"></div>

        <div class="progress-box-layer">
            <div id="progress-box">
                <div id="progress-bar"></div><span id="progress-value"></span>
            </div>
        </div>

        <div class="socket-loading-box">
            <div class="socket-loading-btn">
                <img src="<?php echo base_url('assets/images/socket_loading.gif'); ?>" id="socket-loading">
                <div id="poster">New Post</div>
            </div>
        </div>

        <div class="tab-pane" id="banner-picture-making-panel"></div>

        <div id="main-content">
            <div class="container-fluid truck-table-container">
                <div class="block-header">
                    <div class="row clearfix">
                        <div class="col-12">
                            <h1><?php echo lang('Watch List');?></h1>
                            <input type="hidden" value="<?php echo $PERMISSION; ?>" id="permission">
                        </div>
                    </div>
                </div>

                <div class="row clearfix">
                    <div class="col-12" style="width: 100%;">
                        <div class="card">
                            <div class="body">
                                <div style="display: flex; justify-content: center; align-items: center;">
                                    <div style="display: flex; flex-grow: 1;">
                                        <div class='auction-search-group' style='width: 250px'> 
                                            <span><?php echo lang('Deal Type');?>:</span>
                                            <select class="custom-select" id="DealType" name="DealType" 
                                                onchange="onChangeDealType()" style='width: 150px;'>
                                                <option value="All Deals"><?php echo lang('All Deals');?></option>
                                                <option value="Auction"><?php echo lang('Auction');?></option>
                                                <option value="Supplier"><?php echo lang('Supplier');?></option>
                                                <option value="Consignment"><?php echo lang('Consignment');?></option>
                                                <option value="Inventory"><?php echo lang('Inventory');?></option>
                                            </select>                                                                                  
                                        </div>
                                        <div class='auction-search-group' style='width: 430px;'>
                                            <span><?php echo lang('Equipment Category');?>:</span>
                                            <select class="custom-select" id="inputEqCategory" name="EqCategory" 
                                                onchange="onChangeCategory()" style='width: 250px;'>
                                                <option value="All Equipments"><?php echo lang('All Equipment');?></option>                                        
                                            </select>
                                        </div>
                                        <div class="auction-search-group" style="width: 230px;">
                                            <span><?php echo lang('Year');?>:</span>
                                            <div class="input-group" style="width: 80px;">
                                                <input type="number" id="minYearInput" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 80px;">
                                                <input type="number" id="maxYearInput" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                        </div>                                   

                                    </div>

                                    <div style="width: 285px; display:flex; justify-content:space-between; align-items: center;">
                                        <div style="width: 180px; display: inline-block; ">
                                            <input type="text" id="searchInput" class="form-control" onkeyup="checkEnterkey(event)" placeholder="<?php echo lang('Enter Search Text');?>">
                                        </div>
                                        <button class="btn btn-sm btn-primary " id="searchbtn" style="width: 100px;"><?php echo lang('SearchButton');?></button>
                                    </div>
                                </div>

                                <div style="display: flex; justify-content: center; align-items: center; margin-top : 8px;">                                    
                                    <div style="display: flex; flex-grow: 1;">     

                                        <div class=" auction-search-group" style="width: 230px;">
                                            <span><?php echo lang('Total');?>:</span>
                                            <div class="input-group " style="width: 80px;">
                                                <input type="number" id="minTotalInput" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group " style="width: 80px;">
                                                <input type="number" id="maxTotalInput" class="form-control" onkeyup="checkEnterkey(event)" value="*">
                                            </div>
                                        </div>                                        

                                        <div class="lift-capacity" style="width: 260px;">
                                            <span><?php echo lang('Capacity');?>:</span>
                                            <div class="input-group " style="width: 80px;">
                                                <input type="number" id="minLiftCapacity" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group " style="width: 80px;">
                                                <input type="number" id="maxLiftCapacity" class="form-control" onkeyup="checkEnterkey(event)" value="*">
                                            </div>
                                        </div>

                                        <div class="endDate-filter" style="width: 360px;">
                                            <span><?php echo lang('EndDate');?>:</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="minAucYearInput" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="maxAucYearInput" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12"  style="width: 100%;">
                        <div class="card">
                            <div class="body">
                                <div style="display:flex; justify-content:center; position: relative; height: 31px;">
                                    <span class="selected-label"><?php echo lang('Selected Records');?> :&nbsp;</span>
                                    <span class="selected-label" id="selected-label-count">0</span>
                                    <span class="selected-lable">&nbsp;/&nbsp;</span>
                                    <span class="selected-label" id="selected-label-total"></span>

                                    <div style="width: 120px; position: absolute; right: 0; top:0;">
                                        <button class="btn btn-sm btn-primary btn-block" id="pdfbtn"><?php echo lang('CATALOG');?></button>
                                    </div>
                                    <div style="width: 120px; position: absolute; right: 130px; top:0;">
                                        <button class="btn btn-sm btn-primary btn-block" id="excelbtn" title=""><?php echo lang('EXCEL');?></button>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="table" width="100%" id="auction-management-table">

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="media-content">

                <div class="control-header">
                    <button id="backBtn" class="btn btn-sm btn-primary btn-round" onclick="goBack()"> <i class="fa fa-chevron-left"></i>&nbsp;&nbsp; <?php echo lang('BACK');?></button>
                    <div style="display: inline-block;">
                        <input type="hidden" id="truck-id" value="">
                        <ul class="header-dropdown dropdown custom-dropdown-menu">
                            <li class="dropdown">
                                <a href="javascript:void(0);" class="" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-cloud-download"></i>&nbsp;&nbsp; <?php echo lang('Download');?>
                                </a>
                                <ul class="dropdown-menu">
                                    <li onclick="onAllDownload(0)"><i class="fa  fa-angle-right"></i> &nbsp;<?php echo lang('Without Banner');?></li>
                                    <li onclick="onAllDownload(1)"><i class="fa  fa-angle-right"></i> &nbsp;<?php echo lang('With Banner');?></li>
                                </ul>
                            </li>
                        </ul>
                        <!-- <button class="btn btn-sm btn-primary btn-round" onclick="onMediaControlModal()"><i class="fa fa-pencil-square-o"></i>&nbsp;&nbsp;Edit</button> -->
                    </div>
                </div>

                <ul class="nav nav-tabs">
                    <li class="nav-item"><a class="nav-link active show" data-toggle="tab" href="#picture-gallery-box"><i class="fa fa-picture-o"></i> <?php echo lang('Pictures');?></a></li>
                    <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#video-gallery-box"><i class="fa fa-toggle-right"></i> <?php echo lang('Video');?></a></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane show active" id="picture-gallery-box"> </div>
                    <div class="tab-pane" id="video-gallery-box">
                        <div class="video-gallery-box-body"> </div>

                    </div>

                </div>

            </div>
        </div>
    </div>

    <div id="TVPanel">
        <img id="back-button" src="<?php echo base_url('assets/images/icon/back-button.png'); ?>">
        <div id="TVMainPanel">
            <div id="detailTvMainPanel">
                <h1 class="tvmode-title">FlexSlider 2</h1>               
                <nav>
                    <ul id="tvmode-detail-box">
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                        <li class="tvmode-item">Basic Slider</li>
                    </ul>
                </nav>
            </div>
            <div id="imageTvMainPanel-container">
                <div id="imageTvMainPanel">
                    <div class="imageTvSlider-box">
                        <div id="flexslider" class="flexslider">
                            <ul class="slides">
              
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade " id="mediaControlModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="width: 1200px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h4" id="myLargeModalLabel"><?php echo lang('Media Edit Panel');?></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="body">
                        <ul class="nav nav-tabs">
                            <li class="nav-item"><a class="nav-link active show" data-toggle="tab" href="#picture-control-box"><i class="fa fa-picture-o"></i> <?php echo lang('Pictures');?></a></li>
                            <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#video-control-box"><i class="fa fa-toggle-right"></i> <?php echo lang('Video');?></a></li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane show active" id="picture-control-box">
                                <div class="picture-control-panel">
                                    <div class="picture-control-main-box">
                                    </div>
                                    <form class="upload-panel-section-form" enctype="multipart/form-data">
                                        <input type="file" style="display:none" id="inputEditImgProfile" name="avatar[]" accept=".gif, .jpg, .png, .jpeg" multiple="multiple">
                                        <input type="hidden" id="truck-picture-view-id" name="truck_picture_id" value="">
                                        <button type="button" id="slider-image-upload-btn" class="btn btn-round btn-primary"><?php echo lang('Upload');?></button>
                                        <button type="button" id="slider-image-delete-btn" onclick="deleteSelectedPictureListConfirm()" class="btn btn-round btn-primary" disabled><?php echo lang('Delete');?></button>
                                    </form>
                                    <form id="upload-primary-image-form" enctype="multipart/form-data">
                                        <input type="hidden" id="truck2-picture-view-id" name="truck_picture_id" value="">
                                        <input type="file" style="display:none" id="inputEditPrimaryImgProfile" name="primary_picture" value="" accept=".gif, .jpg, .png, .jpeg">
                                    </form>
                                </div>
                            </div>
                            <div class="tab-pane" id="video-control-box">
                                <div class="video-control-panel">
                                    <div class="video-control-panel-box">
                                    </div>
                                    <form id="video-upload-panel-section-form" enctype="multipart/form-data">
                                        <input type="file" style="display:none" id="inputEditVideoProfile" name="avatar" accept=".mp4">
                                        <input type="hidden" id="truck-video-view-id" name="truck_video_id" value="">
                                        <button type="button" id="slider-video-upload-btn" class="btn btn-round btn-primary"><?php echo lang('Upload');?></button>
                                        <button type="button" id="slider-video-delete-btn" class="btn btn-round btn-primary" disabled><?php echo lang('Delete');?></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade " id="deletePicturesModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="width: 1200px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h4" id="myLargeModalLabel"><?php echo lang('Alert');?></h5>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="font-size: 15px; color: white; padding-left: 30px;">
                        <?php echo lang('Delete Pictures?');?>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('NO');?></button>
                    <button type="button" class="btn btn-round btn-primary" onclick="deletePictures()"><?php echo lang('YES');?></button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade " id="deleteVideoModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="width: 1200px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h4" id="myLargeModalLabel"><?php echo lang('Alert');?></h5>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="font-size: 15px; color: white; padding-left: 30px;">
                        <?php echo lang('Delete Video?');?>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('NO');?></button>
                    <button type="button" class="btn btn-round btn-primary" onclick="deleteVideo()"><?php echo lang('YES');?></button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade " id="pdfModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="width: 850px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h4" id="myLargeModalLabel"><?php echo lang('PDF Preview');?></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="table-pdf">

                    </div>
                </div>
                <div class="modal-footer">
                    <span><?php echo lang('Catalog Name');?>:</span>
                    <input class='form-control' type='text' value='<?php echo lang('CatalogMH');?>' id='CatalogName' style='width: 35%; margin-right: 30px;'>
                    <button type="button" class="btn btn-round btn-primary" onclick="printAsImage()" id="printPdfImages"><?php echo lang('Print as Image');?></button>
                    <button type="button" class="btn btn-round btn-primary" onclick="printAsPdf()" id="printPdfBtn"><?php echo lang('Print as PDF');?></button>
                    <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade " id="detailModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="width: 850px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h4" id="myLargeModalLabel"><?php echo lang('Information');?></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="detail-box">
                        <div class="detail-photo"></div>
                        <div class="detail-info-box"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade " id="editModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="width: 850px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h4" id="myLargeModalLabel"><?php echo lang('Edit Information');?></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="detail-box" id="editModalForm" enctype="multipart/form-data">
                        <input type="file" style="display:none" id="inputEditPrimaryImage" name="PrimaryImage" accept=".gif, .jpg, .png, .jpeg" multiple="multiple">
                        <input type="hidden" id="edit-item-id" name="ID" value="">
                        <input type="hidden" id="edit-item-dealType" name="DealType" value="">

                        <div class="edit-photo"></div>
                        <div class="edit-info-box"></div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                    <button type="button" class="btn btn-round btn-primary" onclick="saveDetailInfo()"><?php echo lang('Save');?></button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade " id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="width: 850px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h4" id="myLargeModalLabel"><?php echo lang('Alert');?></h5>
                    <input type="hidden" id="delete-item-id" value="">
                    <input type="hidden" id="delete-item-category" value="">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="font-size: 15px; color: white; padding-left: 30px;">
                        <?php echo lang('Delete Deal?');?>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('NO');?></button>
                    <button type="button" class="btn btn-round btn-primary" onclick="deleteTruck()"><?php echo lang('YES');?></button>
                </div>
            </div>
        </div>
    </div>



    <div class="modal fade " id="publishModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="width: 800px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title h4" id="myLargeModalLabel"><?php echo lang('Publish');?></h5>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>   
                </div>
                <div class="modal-body">
                    <div class="publish_image_box">
                        <!-- <div class="col-lg-4">
                            <button type="button" class="btn btn-default facebook_deactive" onclick="publish('facebook')" id="btnPublishToFacebook">                                
                            </button>   
                        </div> -->
                        <div class="col-lg-4">
                            <button type="button" class="btn btn-default maquinaria_deactive" onclick="publish('MaquinariaJr')" id="btnPublishToMaqui">                               
                            </button>
                        </div>                        
                    </div>
                    <div class="imageCell-post" id="publish_image_maquin" style="margin-left :  2000px; margin-top : -750px;">
                    </div>
                    <div class="publish_image_box" id="publish_image_box" style="display:none;">
                    </div>
                </div>               
            </div>
        </div>
    </div>


    <!-- JQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="<?php echo base_url('assets/vendor/bootstrap/js/bootstrap.min.js'); ?>?<?php echo time(); ?>"></script>

    <!-- Javascript -->
    <script src="<?php echo base_url('assets/bundles/libscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/vendorscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/lightgallery.bundle.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/vendor/jquery-validation/jquery.validate.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/bundles/c3.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/knob.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/mainscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/index6.js'); ?>?<?php echo time(); ?>"></script>

    <!-- <script src="<?php echo base_url('assets/vendor/jspdf.debug.js'); ?>?<?php echo time(); ?>"></script> -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>
    <script src="<?php echo base_url('assets/js/html2canvas.js'); ?>?<?php echo time(); ?>"></script>

    <!-- Custom Javascript -->
    <script type="text/javascript">
        var base_url = "<?php echo base_url(); ?>";
        var currentView = 0;
        var SearchHelpCount = <?php echo $SearchHelpCount;?>;
        var lang = "<?php echo $Lang;?>" ;
        /* 
         * 0 : Total Bins
         * 1 : Available Bins
         * 2 : Dispatched Bins
         * 3 : Overdue Bins
         * 4 : History
         */
    </script>


    <script src="<?php echo base_url('assets/bundles/datatablescripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery.flexslider.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/toastr.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/js/pages/config.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/localization.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/watchlist.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/session_timer.js'); ?>?<?php echo time(); ?>"></script>
    
</body>

</html>