<!doctype html>
<html lang="en">

<head>
    <title>HEM</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="description" content="Heavy Equipment Manager">
    <meta name="keywords" content="admin template, Oculux admin template, dashboard template, flat admin template, responsive admin template, web app, Light Dark version">
    <meta name="author" content="GetBootstrap, design by: puffintheme.com">

    <link rel="icon" type="image/png" href="/favicon.png"/>
    <!-- VENDOR CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap/css/bootstrap.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/font-awesome/css/font-awesome.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/animate-css/vivify.min.css'); ?>?<?php echo time(); ?>">


    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/dataTables.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedcolumns.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedheader.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-steps/jquery.steps.css'); ?>?<?php echo time(); ?>">

    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/c3/c3.min.css'); ?>?<?php echo time(); ?>" />
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap-datepicker/css/bootstrap-datepicker3.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/morrisjs/morris.css'); ?>?<?php echo time(); ?>" />

    <!-- MAIN CSS -->   

    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/chartist/css/chartist.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/chartist-plugin-tooltip/chartist-plugin-tooltip.css'); ?>?<?php echo time(); ?>">
    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/site.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/statistic.css'); ?>?<?php echo time(); ?>">
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

                            <li><a href="<?php echo base_url('Login/log_out'); ?>" class="icon-menu"><i class="icon-power"></i></a></li>
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
                        <a href="javascript:void(0);" class="user-name" data-toggle="dropdown" style="margin-top: 10px;"><strong><?php echo $FULLNAME; ?></strong></a>
                        <span style="font-size: 10px; display:none;"><?php echo $PERMISSION; ?></span><input type="hidden" id="usernameInput" value="<?php echo $USERNAME; ?>" />
                    </div>
                </div>

                <nav id="left-sidebar-nav" class="sidebar-nav">
                    <ul id="main-menu" class="metismenu">
                        <?php if ($PERMISSION == 'admin') { ?>
                        <li>
                            <a href = "<?php echo base_url('Home');?>"><i class='icon-home'></i><span><?php echo lang('Home');?></span></a>
                        <?php }?>

                        <li>
                            <a href="#myPage" class="has-arrow"><i class="fa fa-gavel"></i><span><?php echo lang('Deals');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Deals'); ?>"><?php echo lang('Deals');?></a></li>
                                <li><a href="<?php echo base_url('Deals/watchlist'); ?>"><?php echo lang('Watch List');?></a></li>
                                <?php if ($PERMISSION == 'admin' || $PERMISSION == "editable" || $PERMISSION == 'uploader') { ?>
                                    <li><a href="<?php echo base_url('Deals/addNewDeal'); ?>"><?php echo lang('Add New Deal');?></a></li>
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
                        <li class="active open">
                            <a href="#myPage" class="has-arrow"><i class="fa fa-users"></i><span><?php echo lang('Demand');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Leads'); ?>"><?php echo lang('Leads');?></a></li>
                                <li><a href="<?php echo base_url('Opportunities'); ?>"><?php echo lang('Opportunities');?></a></li>
                                <li><a href="<?php echo base_url('Opportunities/mine'); ?>"><?php echo lang('My Opportunities');?></a></li>
                                <!-- <li><a href="<?php echo base_url('CFU');?>"><?php echo lang('Customer Follow Up');?></a></li> -->
                                <li class="active"><a href="<?php echo base_url('Leads/statistic'); ?>"><?php echo lang('Statistics');?></a></li>                                
                                <li><a href="<?php echo base_url('Customers');?>"><?php echo lang('Customers');?></a></li>
                            </ul>
                        </li>
                        <!-- <li>
                            <a href="#myPage" class="has-arrow"><i class="icon-basket"></i><span><?php echo lang('Sales');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Sales'); ?>"><?php echo lang('Sales');?></a></li>
                                <li><a href="<?php echo base_url('Sales/mine'); ?>"><?php echo lang('My Sales');?></a></li>
                                <li><a href="<?php echo base_url('Sales/statistics'); ?>"><?php echo lang('Statistics');?></a></li>                              
                                <li><a href="<?php echo base_url('Incentive'); ?>"><?php echo lang('Incentives');?></a></li>
                                <li><a href="<?php echo base_url('Incentive/mine'); ?>"><?php echo lang('My Incentives');?></a></li>             
                            </ul>
                        </li> -->
                    </ul>
                </nav>


            </div>
        </div>

        <div id="main-content">
        <div class="container-fluid">                        
            <div class="block-header">
                <div class="row clearfix">
                    <div class="col-12">
                        <h1><?php echo lang('Statistics');?></h1>
                    </div>
                </div>
            </div>


            <div class="row clearfix">
                <div class="col-xl-6">     
                    <div class="card">
                        <div class="header">
                            <h2><?php echo lang('Opportunities by Status');?></h2>
                        </div>
                        <div class="body">
                            <div class="dateselection-box">
                                <select class="custom-select" id="oppsStatusDateSelector">        
                                    <option value='-3'><?php echo lang('Active');?></option>
                                    <option value="0"><?php echo lang('Today');?></option>
                                    <option value="1"><?php echo lang('Yesterday');?></option>
                                    <option value="7"><?php echo lang('Last 7 Days');?></option>
                                    <option value="30"><?php echo lang('Last 30 Days');?></option>
                                    <option value="-1"><?php echo lang('All Time');?></option>
                                    <option value="-2"><?php echo lang('Custom');?></option>
                                </select>
                                <hr>
                            </div>
                            <div id="oppsStatusDatePickerBox" style="display:hidden;">
                                <div class="datepicker-box">
                                    <div>
                                        <span><?php echo lang('Start Date');?> : </span>
                                        <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="oppStatusStartDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                    </div>
                                    &nbsp;&nbsp;&nbsp;
                                    <div>
                                        <span><?php echo lang('End Date');?> : </span>
                                        <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="oppStatusEndDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                    </div>                                                                   
                                </div>    
                                <hr>                          
                            </div>
                            <div>
                                <div class="big-text">
                                    <h2 id="total_Opps_Status_Count"></h2>
                                </div>
                                <div id="detail_statistic_opps_status_box">
                                </div>
                            </div>
                        </div>
                    </div>                  
                    <div class="card">
                        <div class="header">
                            <h2><?php echo lang('Leads by Source');?></h2>
                        </div>
                        <div class="body">
                            <!-- <div class="row clearfix"> -->
                                <div class="col-12">
                                    <div class='dateselection-box'>
                                        <select class="custom-select" id="leadsDateSelector">
                                            <option value="0"><?php echo lang('Today');?></option>
                                            <option value="1"><?php echo lang('Yesterday');?></option>
                                            <option value="7"><?php echo lang('Last 7 Days');?></option>
                                            <option value="30"><?php echo lang('Last 30 Days');?></option>
                                            <option value="-1"><?php echo lang('All Time');?></option>
                                            <option value="-2"><?php echo lang('Custom');?></option>
                                        </select>
                                        <hr>
                                    </div>
                                    <div id = "leadsDatePickerBox">
                                        <div class="datepicker-box">
                                            <div>
                                                <span><?php echo lang('Start Date');?> : </span>
                                                <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="startLeadsDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            &nbsp;&nbsp;&nbsp;
                                            <div>
                                                <span><?php echo lang('End Date');?> : </span>
                                                <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="endLeadsDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>                                                                          
                                        </div>    
                                        <hr>                        
                                    </div>
                                    <div class="tab-content">
                                        <div class="tab-pane active show">
                                            <div class="big-text" style='display:flex; flex-direction : row;'>
                                                <h2 id="total_Count_by_user"></h2>
                                                <h3 style='display:inline; margin-top : 45px;' id="OppTotalCountByUser">agadfadf</h3>
                                            </div>
                                            <div id="detail_statistic_user_box">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- </div> -->
                        </div>
                    </div> 
                    <div class="card">
                        <div class="header">
                            <h2><?php echo lang('Direct Opportunities by Users');?></h2>
                        </div>
                        <div class="body">
                            <!-- <div class="row clearfix"> -->
                                <div class="col-12">
                                    <div class='dateselection-box'>
                                        <select class="custom-select" id="directOppDateSelector">
                                            <option value="0"><?php echo lang('Today');?></option>
                                            <option value="1"><?php echo lang('Yesterday');?></option>
                                            <option value="7"><?php echo lang('Last 7 Days');?></option>
                                            <option value="30"><?php echo lang('Last 30 Days');?></option>
                                            <option value="-1"><?php echo lang('All Time');?></option>
                                            <option value="-2"><?php echo lang('Custom');?></option>
                                        </select>
                                        <hr>
                                    </div>
                                    <div id = "directOppDatePickerBox">
                                        <div class="datepicker-box">
                                            <div>
                                                <span><?php echo lang('Start Date');?> : </span>
                                                <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="directOppStartDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            &nbsp;&nbsp;&nbsp;
                                            <div>
                                                <span><?php echo lang('End Date');?> : </span>
                                                <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="directOppEndDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>                                                                          
                                        </div>    
                                        <hr>                        
                                    </div>
                                    <div class="tab-content">
                                        <div class="tab-pane active show">
                                            <div class="big-text">
                                                <h2 id="total_Count_by_direct_opp"></h2>
                                            </div>
                                            <div id="detail_statistic_direct_opp_box">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- </div> -->
                        </div>
                    </div> 
                    <div class="card">
                        <div class="header">
                            <h2><?php echo lang('Survey Results');?></h2>
                        </div>
                        <div class="body">
                            <!-- <div class="row clearfix"> -->
                                <div class="col-12">
                                    <div class='dateselection-box'>
                                        <select class="custom-select" id="SurveyDateSelector">
                                            <option value="0"><?php echo lang('Today');?></option>
                                            <option value="1"><?php echo lang('Yesterday');?></option>
                                            <option value="7"><?php echo lang('Last 7 Days');?></option>
                                            <option value="30"><?php echo lang('Last 30 Days');?></option>
                                            <option value="-1"><?php echo lang('All Time');?></option>
                                            <option value="-2"><?php echo lang('Custom');?></option>
                                        </select>
                                        <hr>
                                    </div>
                                    <div id = "SurveyDatePickerBox">
                                        <div class="datepicker-box">
                                            <div>
                                                <span><?php echo lang('Start Date');?> : </span>
                                                <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="SurveyStartDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            &nbsp;&nbsp;&nbsp;
                                            <div>
                                                <span><?php echo lang('End Date');?> : </span>
                                                <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="SurveyEndDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>                                                                          
                                        </div>    
                                        <hr>                        
                                    </div>
                                    <div class="tab-content">
                                        <div class="tab-pane active show">
                                            <div class="big-text" style='display:flex; flex-direction : row;'>
                                                <h2 id="SurveyTotalCount"></h2>
                                            </div>
                                            <div id="SurveyResultInDetailPanel">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- </div> -->
                        </div>
                    </div>  
                </div>                 

                <div class="col-xl-6">                                    
                    <div class="card">
                        <div class="header">
                            <h2><?php echo lang('Assigned Opportunities by Users');?></h2>
                        </div>
                        <div class="body">                            
                            <div class="dateselection-box">
                                <select class="custom-select" id="userDateSelector">   
                                    <option value="-3"><?php echo lang('Active');?></option>                              
                                    <option value="0"><?php echo lang('Today');?></option>
                                    <option value="1"><?php echo lang('Yesterday');?></option>
                                    <option value="7"><?php echo lang('Last 7 Days');?></option>
                                    <option value="30"><?php echo lang('Last 30 Days');?></option>
                                    <option value="-1"><?php echo lang('All Time');?></option>
                                    <option value="-2"><?php echo lang('Custom');?></option>
                                </select>
                                <hr>
                            </div>
                            <div id = "userDatePickerBox"  style="display:hidden;">
                                <div class="datepicker-box">
                                    <div>
                                        <span><?php echo lang('Start Date');?> : </span>
                                        <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="userStartDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                    </div>
                                    &nbsp;&nbsp;&nbsp;
                                    <div>
                                        <span><?php echo lang('End Date');?> : </span>
                                        <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="userEndDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                    </div>                                                                   
                                </div>    
                                <hr>                          
                            </div>
                            <div>
                                <div class="big-text">
                                    <h2 id="total_Assigned_Opp_User_Count"></h2>
                                </div>
                                <div id="detail_Assigned_opps_user_box">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="header">
                            <h2><?php echo lang('Buying Opportunities by Equipment Category');?></h2>
                        </div>
                        <div class="body">
                            <div class="dateselection-box">
                                <select class="custom-select" id="oppsDateSelector">                                         
                                    <option value="-3"><?php echo lang('Active');?></option>                                          
                                    <option value="0"><?php echo lang('Today');?></option>
                                    <option value="1"><?php echo lang('Yesterday');?></option>
                                    <option value="7"><?php echo lang('Last 7 Days');?></option>
                                    <option value="30"><?php echo lang('Last 30 Days');?></option>
                                    <option value="-1"><?php echo lang('All Time');?></option>
                                    <option value="-2"><?php echo lang('Custom');?></option>
                                </select>
                                <hr>
                            </div>
                            <div id = "oppsDatePickerBox">
                                <div class="datepicker-box">
                                    <div>
                                        <span><?php echo lang('Start Date');?> : </span>
                                        <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="startDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                    </div>
                                    &nbsp;&nbsp;&nbsp;
                                    <div>
                                        <span><?php echo lang('End Date');?> : </span>
                                        <input data-provide="datepicker" style="width: 110px;" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="endDate" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                    </div>                                                                   
                                </div>    
                                <hr>                          
                            </div>
                            <div>
                                <div class="big-text">
                                    <h2 id="total_Opps_Count"></h2>
                                </div>
                                <div id="detail_statistic_opps_box">
                                </div>
                            </div>
                        </div>
                    </div>                       
                </div>
            </div>
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

    <script src="<?php echo base_url('assets/bundles/chartist.bundle.js');?>?<?php echo time(); ?>"></script>
    <!-- <script src="<?php echo base_url('assets/vendor/chartist/js/chartist.bundle.js'); ?>?<?php echo time(); ?>"></script> -->

    <script src="<?php echo base_url('assets/js/index6.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/js/pages/config.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/localization.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/demand/statistic.js'); ?>?<?php echo time(); ?>"></script>
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

</body>

</html>