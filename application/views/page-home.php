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
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
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

    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/toastr.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap-datepicker/css/bootstrap-datepicker3.min.css'); ?>?<?php echo time(); ?>">
    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/management.css'); ?>?<?php echo time(); ?>">

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
            <div class="container-fluid">

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

                            <li><a href="<?php echo base_url('Login/log_out'); ?>" 
                                class="icon-menu"><i class="icon-power"></i></a></li>
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
                <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo" class="img-fluid logo"><span class="sidebar-logo-title">HEM</span></a>
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
                        <li class='active'>
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
                                <li><a href="<?php echo base_url('Sales/statistics'); ?>"><?php echo lang('Statistics');?></a></li>                              
                                <li><a href="<?php echo base_url('Incentive'); ?>"><?php echo lang('Incentives');?></a></li>
                                <li><a href="<?php echo base_url('Incentive/mine'); ?>"><?php echo lang('My Incentives');?></a></li>             
                            </ul>
                        </li> -->
                    </ul>
                </nav>
            </div>
        </div>
        <div class="loading-box"><img src="<?php echo base_url('assets/images/spinner.gif'); ?>" id="pdf-loading"></div>

        <div id="main-content">
            <div class="container-fluid">
                <div class="block-header">
                    <div class="row clearfix">
                        <div class="col-lg-12">
                            <h1><?php echo lang('Home');?></h1>
                            <input type="hidden" value="<?php echo $PERMISSION; ?>" id="permission">
                        </div>
                    </div>
                </div>  

                <div class='row clearfix'>      
                    <div class="col-lg-3 col-md-6">
                        <div class="card">
                            <div class="body">
                                <div>
                                </div>
                                <h6 class="mb-4"><i class="icon-basket"></i> <?php 
                                    date_default_timezone_set('America/Phoenix');
                                    $month = date('F');           
                                    if ($Lang == 'english')
                                        echo lang($month) . ' ' . lang('Sales');
                                    else if ($Lang == 'spanish')
                                        echo lang('Sales') . ' ' . lang($month);
                                ?></h6>
                                <div class="card-value text-success" id='SalesCountForMonth' style='margin-bottom: 32px;'>0</div>                                
                                <div class="font-12" id='SalesByUser'>
                                </div>                                
                            </div>
                        </div>
                        <div class="card">
                            <div class="body" style="height: 160px;">
                                <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang('Open Opportunities');?></h6>
                                <div class="card-value text-success float-left mr-3 pr-2 border-right" id='OppOppsCount'>0</div>
                                <div class="font-12"><?php echo lang('New');?> <span class="float-right" id='NewOppsCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Assigned');?> <span class="float-right" id='AssignedOppsCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Pending');?> <span class="float-right" id='PendingOppsCount'>0</span></div>
                            </div>
                        </div>
                    </div>  
                    <div class='col-lg-9 col-md-6'>
                        <div class='row clearfix'>                           
                            
                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="body" style='height: 160px;'>
                                        <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang("Updated Leads");?></h6>
                                        <div class="card-value text-info float-left mr-3 pr-2 border-right" id='UpdatedLead' style='height: 80px;'>0</div>
                                        <div class="font-12"><?php echo lang('Opportunity');?> <span class="float-right" id='OpportunityCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('Info');?> <span class="float-right" id='InfoCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('No Lead');?> <span class="float-right" id='NoLeadCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('New Added Today');?> <span class="float-right" id='TodayAddedLeads'>0</span></div>
                                    </div>
                                </div>
                            </div>       
                            
                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="body" style='height: 160px;'>
                                        <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang("Scheduled Customer Follow Ups");?></h6>
                                        <div class="card-value text-danger float-left mr-3 pr-2 border-right" id='ScheduledCFUCount'>0</div>
                                        <div class="font-12"><?php echo lang('For Today');?> <span class="float-right" id='ScheduledForTodayCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('Expired');?> <span class="float-right" id='ScheduledExpiredCount'>0</span></div>
                                    </div>
                                </div>
                            </div> 
                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="body" style='height: 160px;'>
                                        <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang('Updated Customer Follow Ups');?></h6>
                                        <div class="card-value text-info float-left mr-3 pr-2 border-right" id='UpdatedCFUCount'>0</div>
                                        <div class="font-12"><?php echo lang('Scheduled');?> <span class="float-right" id='ScheduledCFUTodayCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('Opportunity');?> <span class="float-right" id='OpportunityCFUTodayCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('Closed');?> <span class="float-right" id='ClosedCFUTodayCount'>0</span></div>
                                    </div>
                                </div>
                            </div> 
                            
                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="body">
                                        <h6 class="mb-4"><i class="fa fa-gavel"></i> <?php echo lang('Added Deals');?></h6>
                                        <div class="card-value text-info float-left mr-3 pr-2 border-right" id='AddedDealsCount' style='height: 80px;'>0</div>
                                        <div class="font-12"><?php echo lang('Auction');?> <span class="float-right" id='AddedAuctionCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('For Sale');?> <span class="float-right" id='AddedFor SaleCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('Consignment');?> <span class="float-right" id='AddedConsignmentCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('Inventory');?> <span class="float-right" id='AddedInventoryCount'>0</span></div>
                                    </div>
                                </div>
                            </div>  
                            
                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="body" style='height: 160px;'>
                                        <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang('Opportunities Waiting Contact');?></h6>
                                        <div class="card-value text-danger float-left mr-3 pr-2 border-right" id='WaitingContactCount'>0</div>
                                        <div class="font-12"><?php echo lang('No Contact');?> <span class="float-right" id='NoContactCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('Contacts for Today');?> <span class="float-right" id='TodayContactCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('Expired Contacts');?> <span class="float-right" id='ExpiredContactCount'>0</span></div>
                                    </div>
                                </div>
                            </div> 

                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="body" style='height: 160px;'>
                                        <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang('Updated Opportunities');?></h6>
                                        <div class="card-value text-info float-left mr-3 pr-2 border-right" id='UpdatedOppsCount'>0</div>
                                        <div class="font-12"><?php echo lang('Closed');?> <span class="float-right" id='ClosedOppsCount'>0</span></div>
                                        <div class="font-12"><?php echo lang('Still Interested');?> <span class="float-right" id='StillInterestedOppCount'>0</span></div>                                        
                                    </div>
                                </div>
                            </div> 

                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="body" style='height: 160px;'>
                                        <h6 class="mb-4"><i class="icon-basket"></i> <?php echo lang('Sales Collection for Ready Deals');?></h6>
                                        <div class="card-value text-info float-left mr-3 pr-2 border-right" id='ReadyStatusSalesCount'>0</div>
                                        <div class="font-12">USD <span class="float-right" id='USDRemainingAmount'>0</span></div>
                                        <div class="font-12">MXN <span class="float-right" id='MXNRemainingAmount'>0</span></div>                                        
                                    </div>
                                </div>

                                <div class="card">
                                    <div class="body" style='height: 160px;'>
                                        <h6 class="mb-4"><i class="icon-basket"></i> <?php echo lang('Active Buy');?></h6>
                                        <div class="card-value text-info float-left mr-3 pr-2 border-right" id='ActiveBuyCount'>0</div>
                                        <div class="font-12"><?php echo lang('Remaining');?> <span class="float-right" id='USDRemainingAmountForBuy'>0</span></div>                                   
                                    </div>
                                </div>
                            </div>          
                            
                            <div class='col-lg-8'>
                                <div class='card'>
                                    <div class='body'>
                                        <div>
                                            <h6 class="mb-4"><i class="icon-graph"></i> <?php echo lang('Today\'s Activity');?></h6>
                                        </div>
                                        <div id="flotChart" class="flot-chart" style="height: 265px;"></div>
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
    <script src="<?php echo base_url('assets/vendor/bootstrap/js/bootstrap.min.js'); ?>?<?php echo time(); ?>"></script>

    <!-- Javascript -->
    <script src="<?php echo base_url('assets/bundles/libscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/vendorscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/lightgallery.bundle.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/vendor/jquery-validation/jquery.validate.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/bundles/flotscripts.bundle.js');?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/c3.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/knob.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/mainscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/index6.js'); ?>?<?php echo time(); ?>"></script>

    <!-- <script src="<?php echo base_url('assets/vendor/jspdf.debug.js'); ?>"></script> -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>
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


    <script src="<?php echo base_url('assets/bundles/datatablescripts.bundle.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/vendor/toastr.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/js/pages/session_timer.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/config.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/localization.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/home.js'); ?>?<?php echo time(); ?>"></script>

</body>

</html>