<?php
/*
@@ LEAD-MANAGEMENT.JS
@@ By Zheng
@@ 2020-02-19
*/
?>

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
    <meta name="description" content="Machinery Hawkers">
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

    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/c3/c3.min.css'); ?>?<?php echo time(); ?>" />
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/morrisjs/morris.css'); ?>?<?php echo time(); ?>" />

    <!-- MAIN CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/site.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/toastr.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap-datepicker/css/bootstrap-datepicker3.min.css'); ?>?<?php echo time(); ?>">
    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/management.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/lead-management.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/loading.css'); ?>?<?php echo time(); ?>">

    <style>
        #left-sidebar {
            background : #22252a;    
        }
    </style>
</head>

<body class="theme-cyan font-montserrat"  onload='set_interval();'>

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
            <div class="container-fluid" style='width : 100%;'>

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
                <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo" class="img-fluid logo"><span class="sidebar-logo-title">Machinery Hawkers</span></a>
                <button type="button" class="btn-toggle-offcanvas btn btn-sm float-right"><i class="lnr lnr-menu icon-close"></i></button>
            </div>
            <div class="sidebar-scroll">
                <div class="user-account">
                    <div class="user_div">
                        <img src="<?php echo base_url('assets/images/avatar/' . ($PROFILEPICTURE == "" ? "default.png" : $PROFILEPICTURE)); ?>" class="user-photo" alt="User Profile Picture">
                    </div>
                    <div class="dropdown">
                        <a href="javascript:void(0);" class="user-name" data-toggle="dropdown"  style="margin-top: 10px;"><strong><?php echo $FULLNAME; ?></strong></a>
                        <span style="font-size: 10px; display:none;" id='permission'><?php echo $PERMISSION; ?></span><input type="hidden" id="usernameInput" value="<?php echo $USERNAME; ?>" /><input type="hidden" id="accounting" value="<?php echo $ACCOUNTING; ?>" />
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

                        <li class='active open'>
                            <a href="#myPage" class="has-arrow"><i class="icon-basket"></i><span><?php echo lang('Sales');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Sales'); ?>"><?php echo lang('Sales');?></a></li>
                                <li><a href="<?php echo base_url('Sales/mine'); ?>"><?php echo lang('My Sales');?></a></li>  
                                <li><a href="<?php echo base_url('Sales/statistics'); ?>"><?php echo lang('Statistics');?></a></li>                                                              
                                <li><a href="<?php echo base_url('Incentive'); ?>"><?php echo lang('Incentives');?></a></li>
                                <li class='active'><a href="<?php echo base_url('Incentive/mine'); ?>"><?php echo lang('My Incentives');?></a></li>        
                            </ul>
                        </li>

                    </ul>
                </nav>
            </div>
        </div>

        <div class="loading-box"><img src="<?php echo base_url('assets/images/spinner.gif'); ?>" id="pdf-loading"></div>

        

        <div id="main-content">
            <div class="container-fluid truck-table-container">
                <div class="block-header">
                    <div class="row clearfix">
                        <div class="col-12">
                            <h1><?php echo lang('My Incentives');?></h1>
                        </div>
                    </div>
                </div>          

                <input type="hidden" id="edit-item-id" name="ID" value="">       
                
                <div class='row clearfix'>
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 142px;'>
                                <h6 class="mb-4"><i class="icon-basket"></i> <?php echo lang('Projected Incentives');?></h6>
                                <div class="card-value text-success float-left mr-3 pr-2 border-right" id='TotalCountonProjectedPanel'>0</div>
                                <div class="font-12">USD <span class="float-right" id='USDProjectedIncentive'>0 USD</span></div>
                                <div class="font-12">MXN <span class="float-right" id='MXNProjectedIncentive'>0 MXN</span></div>                                
                            </div>
                        </div>
                    </div>                         
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 142px;'>
                                <h6 class="mb-4"><i class="icon-basket"></i> <?php echo lang('Paid Incentives');?></h6>
                                <div class="card-value text-info float-left mr-3 pr-2 border-right" id='TotalCountonPaidPanel'>0</div>
                                <div class="font-12">USD <span class="float-right" id='USDPaidIncentive'>0 USD</span></div>
                                <div class="font-12">MXN <span class="float-right" id='MXNPaidIncentive'>0 MXN</span></div> 
                            </div>
                        </div>
                    </div> 
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 142px;'>
                                <h6 class="mb-4"><i class="icon-basket"></i> <?php echo lang('Incentives Role');?></h6>
                                <div class="card-value text-default float-left mr-3 pr-2 border-right" id='IcentiveRoleCount'>0</div>
                                <div class="font-12"><?php echo lang('Finder');?> <span class="float-right" id='FinderCount'>0 USD</span></div>
                                <div class="font-12"><?php echo lang('Buyer');?> <span class="float-right" id='BuyerCount'>0 MXN</span></div> 
                                <div class="font-12"><?php echo lang('Seller');?> <span class="float-right" id='SellerCount'>0 MXN</span></div> 
                            </div>
                        </div>
                    </div> 
                </div>

                <div class="row clearfix" id='SalesPanel'>
                    <div class="col-12" style='width : 100%;'>
                        <div class="card">
                            <div class="body">
                                <div style="display: flex; justify-content: center; align-items: center;">                                    
                                    <div style="display: flex; flex-grow: 1;">
                                        <div class='filter-status' style='width : 280px'>
                                            <span><?php echo lang('Status');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputStatus' onchange="refreshDatatable();">                                                   
                                                <option value='Open'><?php echo lang('Open');?></option>
                                                <option value='Paid'><?php echo lang('Paid');?></option>                                                
                                                <option value='Discarded'><?php echo lang('Discarded');?></option>            
                                            </select>
                                        </div>               

                                        <div class="endDate-filter" style="width: 350px;">
                                            <span><?php echo lang('Sales Date');?>:</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="minStartDateInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="maxStartDateInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                            </div>
                                        </div>   

                                        <div class='filter-status' style='width : 280px'>
                                            <span><?php echo lang('Deal Type');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputDealTypeFilter' onchange="refreshDatatable();">
                                                <option value='All'><?php echo lang('All');?></option>                                                
                                                <option value='No Deal'><?php echo lang('No Deal');?></option>
                                                <option value='Auction'><?php echo lang('Auction');?></option>
                                                <option value='Inventory'><?php echo lang('Inventory');?></option>
                                                <option value='Supplier'><?php echo lang('Supplier');?></option>
                                                <option value='Consignment'><?php echo lang('Consignment');?></option>
                                                <option value='Manufacturing'><?php echo lang('Manufacturing');?></option>
                                                <option value='Logistics'><?php echo lang('Logistics');?></option>
                                            </select>
                                        </div>

                                        <div class='filter-status' style='width : 280px'>
                                            <span><?php echo lang('Role');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputRole' onchange="refreshDatatable();">                                                   
                                                <option value='All'><?php echo lang('All');?></option>
                                                <option value='Finder'><?php echo lang('Finder');?></option>                                                
                                                <option value='Buyer'><?php echo lang('Buyer');?></option>            
                                                <option value='Seller'><?php echo lang('Seller');?></option>         
                                            </select>
                                        </div> 
                                    </div>
                                    <div style="width: 285px; display:flex; justify-content:space-between; align-items: center;">
                                        <div style="width: 180px; display: inline-block; ">
                                            <input type="text" id="searchInput" class="form-control" onkeyup="checkEnterkey(event)" placeholder="<?php echo lang('Enter Search Text');?>">
                                        </div>
                                        <button class="btn btn-sm btn-primary " id="searchbtn" style="width: 100px;"><?php echo lang('SearchButton');?></button>
                                    </div>
                                </div>                                   
                            </div>
                        </div>
                    </div>

                    <div class="col-12" style='width : 100%;'>
                        <div class="card">
                            <div class="body">                               
                                <div class="table-responsive">
                                    <table class="table" width="100%" id="lead-management-table">

                                    </table>
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

    <script src="<?php echo base_url('assets/vendor/jquery-validation/jquery.validate.js'); ?>?<?php echo time(); ?>"></script><!-- Jquery Validation Plugin Css -->
    <script src="<?php echo base_url('assets/bundles/datatablescripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/dataTables.buttons.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.bootstrap4.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.colVis.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.html5.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.print.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-inputmask/jquery.inputmask.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery.maskedinput/jquery.maskedinput.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/intlTelInput/js/intlTelInput-jquery.min.js'); ?>?<?php echo time(); ?>"></script>



    <script src="<?php echo base_url('assets/bundles/c3.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/knob.bundle.js'); ?>?<?php echo time(); ?>"></script><!-- Jquery Knob-->
    <script src="<?php echo base_url('assets/bundles/mainscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/index6.js'); ?>?<?php echo time(); ?>"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>

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

    <script src="<?php echo base_url('assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/toastr.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/session_timer.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/config.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/localization.js'); ?>?<?php echo time(); ?>"></script>    
    <script src="<?php echo base_url('assets/js/pages/sales/my-incentive.js'); ?>?<?php echo time(); ?>"></script>

</body>

</html>