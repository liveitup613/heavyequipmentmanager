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
    <meta name="description" content="Machinary Hunters Platform">
    <meta name="keywords"
        content="admin template, Oculux admin template, dashboard template, flat admin template, responsive admin template, web app, Light Dark version">
    <meta name="author" content="GetBootstrap, design by: puffintheme.com">

    <link rel="icon" type="image/png" href="/favicon.png"/>
    <!-- VENDOR CSS -->
    <link rel="stylesheet"
        href="<?php echo base_url('assets/vendor/bootstrap/css/bootstrap.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet"
        href="<?php echo base_url('assets/vendor/font-awesome/css/font-awesome.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet"
        href="<?php echo base_url('assets/vendor/animate-css/vivify.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet"
        href="<?php echo base_url('assets/vendor/intlTelInput/css/intlTelInput.css'); ?>?<?php echo time(); ?>">


    <link rel="stylesheet"
        href="<?php echo base_url('assets/vendor/jquery-datatable/dataTables.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet"
        href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedcolumns.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet"
        href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedheader.bootstrap4.min.css'); ?>?<?php echo time(); ?>">

    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/c3/c3.min.css'); ?>?<?php echo time(); ?>" />
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/morrisjs/morris.css'); ?>?<?php echo time(); ?>" />

    <!-- MAIN CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/site.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/toastr.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet"
        href="<?php echo base_url('assets/vendor/bootstrap-datepicker/css/bootstrap-datepicker3.min.css'); ?>?<?php echo time(); ?>">
    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/management.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/lead-management.css'); ?>?<?php echo time(); ?>">

    <style>
    #left-sidebar {
        background : #22252a;    
    }
    </style>
</head>

<body class="theme-cyan font-montserrat light_version" onload='set_interval();'>

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
                        <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo"
                                class="img-fluid logo"></a>
                        <button type="button" class="btn-toggle-offcanvas"><i
                                class="lnr lnr-menu fa fa-bars"></i></button>
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

                            <li><a href="<?php echo base_url('Login/log_out'); ?>" class="icon-menu"><i
                                        class="icon-power"></i></a></li>
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
                <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo"
                        class="img-fluid logo"><span class="sidebar-logo-title">Machinery Hawkers</span></a>
                <button type="button" class="btn-toggle-offcanvas btn btn-sm float-right"><i
                        class="lnr lnr-menu icon-close"></i></button>
            </div>
            <div class="sidebar-scroll">
                <div class="user-account">
                    <div class="user_div">
                        <img src="<?php echo base_url('assets/images/avatar/' . ($PROFILEPICTURE == "" ? "default.png" : $PROFILEPICTURE)); ?>"
                            class="user-photo" alt="User Profile Picture">
                    </div>
                    <div class="dropdown">
                        <a href="javascript:void(0);" class="user-name" data-toggle="dropdown"
                            style="margin-top: 10px;"><strong><?php echo $FULLNAME; ?></strong></a>
                        <span style="font-size: 10px; display:none;"><?php echo $PERMISSION; ?></span><input
                            type="hidden" id="usernameInput" value="<?php echo $USERNAME; ?>" />
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
                                <li><a href="<?php echo base_url('User/redirectToUpdatePasswordPage'); ?>">Update
                                        Password</a></li>
                                <!-- <li><a href="<?php echo base_url('Worksheet');?>"><?php echo lang('Worksheet');?></a></li> -->
                                <?php 
                                    if ($PERMISSION == 'admin') {
                                    echo '<li><a href="'.base_url('User/configuration').'">'.lang('Settings').'</a></li>';
                                    echo '<li><a href="'.base_url('Activity').'">'.lang('Activities').'</a></li>';
                                }
                                    ?>
                            </ul>
                        </li>

                        <li class='active open'>
                            <a href="#myPage" class="has-arrow"><i class="fa fa-users"></i><span><?php echo lang('Demand');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Leads'); ?>"><?php echo lang('Leads');?></a></li>
                                <li><a href="<?php echo base_url('Opportunities'); ?>"><?php echo lang('Opportunities');?></a></li>
                                <li class='active'><a href="<?php echo base_url('Opportunities/mine'); ?>">My
                                        Opportunities</a></li>
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
            <div class="container-fluid truck-table-container">
                <div class="block-header">
                    <div class="row clearfix">
                        <div class="col-12">
                            <h1><?php echo lang('My Opportunities');?></h1>
                        </div>
                    </div>
                </div>

                <input type="hidden" id="edit-item-id" name="ID" value="">
                <img id='temp_image' src='' style='display:none'>

                <div class="modal fade" id="InfoModal" tabindex="-1" role="dialog" aria-labelledby="InfoTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="InfoTitle"><?php echo lang('Additional Info');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>
                                    <div class="form-group" style='padding-left : 20px; padding-right : 20px;'
                                        id='leadAdditionalInfoPanel'>
                                        <label style='font-weight : bolder;'><?php echo lang('Lead Info');?></label>
                                        <div>
                                            <label id='LeadAdditionalInfo'></label>
                                        </div>
                                    </div>

                                    <div class="form-group" style='padding-left : 20px; padding-right : 20px;'
                                        id='additionalInfoPanel'>
                                        <label style='font-weight : bolder;'><?php echo lang('Assignment Info');?></label>
                                        <div>
                                            <label id='AdditionalInfo'></label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="contactModal" tabindex="-1" role="dialog" aria-labelledby="ContactTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ContactTitle"><?php echo lang('Contact');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='contactForm'>
                                    <div class='from-group'>
                                        <div class='fancy-checkbox'>
                                            <label><input type="checkbox"
                                                    id='NoContact'><span><?php echo lang('No Contact');?></span></label>
                                        </div>
                                        <hr>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang('Note');?></label>
                                        <textarea class="form-control" id="note" rows='5' col='30'></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang('Keep Opportunity Open?');?></label>
                                        <select class="form-control" id="stillInterested">
                                            <option value='YES'><?php echo lang('YES');?></option>
                                            <option value='NO'><?php echo lang('NO');?></option>
                                        </select>
                                    </div>
                                    <div class="form-group" id='contactDatePanel'>
                                        <label><?php echo lang('When to Contact');?></label>
                                        <input data-provide="datepicker" data-date-autoclose="true"
                                            data-date-format="yyyy-mm-dd" id="whenToContact" class="form-control"
                                            value="" require>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Contact Channel');?></label>
                                        <div class='row'>
                                            <div class='col-6'>
                                                <div class='fancy-checkbox'>
                                                    <label><input type="checkbox"
                                                            id='ContactChannelPhoneCall'><span><?php echo lang('Phone Call');?></span></label>
                                                </div>
                                            </div>
                                            <div class='col-6'>
                                                <div class='fancy-checkbox'>
                                                    <label><input type="checkbox"
                                                            id='ContactChannelWhatsapp'><span>Whatsapp</span></label>
                                                </div>
                                            </div>
                                            <div class='col-6'>
                                                <div class='fancy-checkbox'>
                                                    <label><input type="checkbox"
                                                            id='ContactChannelVideoCall'><span><?php echo lang('Video Call');?></span></label>
                                                </div>
                                            </div>
                                            <div class='col-6'>
                                                <div class='fancy-checkbox'>
                                                    <label><input type="checkbox"
                                                            id='ContactChannelEmail'><span>Email</span></label>
                                                </div>
                                            </div>
                                            <div class='col-6'>
                                                <div class='fancy-checkbox'>
                                                    <label><input type="checkbox" id='ContactChannelOther'><span><?php echo lang('Other Contact');?></span></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Sent Items');?></label>
                                        <div class='row'>
                                            <div class='col-6'>
                                                <div class='fancy-checkbox'>
                                                    <label><input type="checkbox"
                                                            id='SendItemsCatalog'><span><?php echo lang('Catalog');?></span></label>
                                                </div>
                                            </div>
                                            <div class='col-6'>
                                                <div class='fancy-checkbox'>
                                                    <label><input type="checkbox"
                                                            id='SendItemsAuctionResults'><span><?php echo lang('Auction Results');?></span></label>
                                                </div>
                                            </div>
                                            <div class='col-6'>
                                                <div class='fancy-checkbox'>
                                                    <label><input type="checkbox"
                                                            id='SendItemsMultimedia'><span>Multimedia</span></label>
                                                </div>
                                            </div>
                                            <div class='col-6'>
                                                <div class='fancy-checkbox'>
                                                    <label><input type="checkbox"
                                                            id='SendItemsCompanyInfo'><span><?php echo lang('Company Info');?></span></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnContact"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="tagModal" tabindex="-1" role="dialog" aria-labelledby="tagTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="tagTitle"><?php echo lang('Tag Assignments');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='tagForm'>
                                    <div class="form-group">
                                        <label><?php echo lang('Add New Tag');?></label>
                                        <div class='row'>
                                            <div class='col-8'>
                                                <input class="form-control" id="TagText" type="text" required maxlength = '30'>
                                            </div>
                                            <div class='col-4'>
                                                <select class="form-control" id="TagColor">
                                                    <option value='danger'><?php echo lang('RED');?></option>
                                                    <option value='success'><?php echo lang('GREEN');?></option>
                                                    <option value='warning'><?php echo lang('YELLOW');?></option>
                                                    <option value='primary'><?php echo lang('BLUE');?></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div style='text-align:right;'>
                                    <button class='btn btn-default btn-round' id='btnAddTag'><?php echo lang('Add Tag');?></button>
                                </div>
                                <hr>
                                <div id='tagContent'>
                                    <span class='badge badge-danger'>Test Tag here</span>
                                    <span class='badge badge-danger'>Test Tag here</span>
                                    <span class='badge badge-danger'>Test Tag here</span>
                                    <span class='badge badge-danger'>Test Tag here</span>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="HistoryModal" tabindex="-1" role="dialog" aria-labelledby="HistoryTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="HistoryTitle"><?php echo lang('History');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form style='padding-left : 20px; padding-right : 20px;'>
                                    <div class="form-group">
                                        <label style='font-weight : bolder;'><?php echo lang('Assignment Info');?></label>
                                        <div class='row' id='assignmentInfoPanel'
                                            style='padding-left : 20px; padding-right : 20px;'>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Status');?>: </span><span class='badge badge-info'
                                                    id='historyStatus'>Open</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Stage');?>: </span><span id='historyStage'>No Contact</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Assigned Date');?>: </span><span id='historyAssignedDate'>2020-02-04
                                                    12:12</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span id='historyCloseExpiration'><?php echo lang('Closing Date');?>: </span><span
                                                    id='historyClosingDate'>2020-02-04 12:12</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Sales Rep');?>: </span><span id='historySalesRep'>Rodolfo</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Assigned By');?>: </span><span id='historyAssignedBy'>Rodolfo</span>
                                            </div>
                                            <div class='col-lg-6' id='historyCanceledByPanel'>
                                                <span><?php echo lang('Canceled By');?>: </span><span id='historyCanceledBy'>Rodolfo</span>
                                            </div>
                                            <div class='col-lg-12' id='historyAdditionalInfoPanel'>
                                                <div><?php echo lang('Additional Info');?></div>
                                                <div id='historyAdditionalInfo'>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group" id='historyContactLogsPanel'>
                                        <label style='font-weight : bolder;'><?php echo lang('Contact History');?></label>
                                        <div id='contactHistoryPanel' style='max-height : 300px; overflow: auto;'>
                                        </div>
                                    </div>

                                    <div class="form-gropu pull-right">
                                        <button type="button" class="btn btn-round btn-default" id='btnHistoryPrev'
                                            disabled><?php echo lang('Prev');?></button>
                                        <button type="button" class="btn btn-round btn-default"
                                            id='btnHistoryNext'><?php echo lang('Next');?></button>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="NewOppModal" tabindex="-1" role="dialog" aria-labelledby="contactModalTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document" style='max-width : 900px;'>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="contactModalTitle"><?php echo lang('Add New Opportunity');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='AddNewOppForm'>
                                    <div class='row'>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Lead Type');?></label>
                                            <select class="form-control" id="contactLeadType" name="source" required>
                                                <option value="Buying"><?php echo lang('Buying');?></option>
                                                <option value="Selling"><?php echo lang('Selling');?></option>
                                                <option value="Consignment"><?php echo lang('Consignment');?></option>
                                                <option value="Renting"><?php echo lang('Renting');?></option>
                                                <option value="Logistics"><?php echo lang('Logistics');?></option>
                                            </select>
                                        </div>
                                        <div class='form-group col-lg-6'></div>                                        
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Phone');?></label>
                                            <div style='display:flex; justify-content: space-between; align-items: center;'>
                                                <input type="text" class="form-control Phone" id="contactPhone" name="phone" required>
                                                <button type ='button' class='btn btn-default' style='width: 40px; height: 35px; padding:0px; margin-left: 8px;' onclick="refreshCustomerData();"><i class='icon-refresh'></i></button>
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Name');?></label>
                                            <input type="text" class="form-control" id="contactName" name="name"
                                                required>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Last Name');?></label>
                                            <input type="text" class="form-control" id="contactLastName" name="lastname"
                                                required>
                                        </div>                                        
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Email');?></label>
                                            <input type="text" class="form-control" id="contactEmail" name="email">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Company');?></label>
                                            <input type="text" class="form-control" id="contactCompany" name="companay">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Country');?></label>
                                            <select class="form-control" id="contactCountry"
                                                onchange="onContactCountryChange(this)">
                                                <option value="Mexico">Mexico</option>
                                                <option value="USA">USA</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('State');?></label>
                                            <select class="form-control" id="contactState" name="state">
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('City');?></label>
                                            <input type="text" class="form-control" id="contactCity" name="city">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Equipment Category');?></label>
                                            <select class="form-control" id="contactEquipmentCategory"
                                                name="eqCategory">
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Make');?></label>
                                            <input type="text" class="form-control" id="contactMake" name="make">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Model/Capacity');?></label>
                                            <input type="text" class="form-control" id="contactModel" name="model">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Min Year');?></label>
                                            <input type="number" class="form-control" id="contactMinYear"
                                                name="minYear">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Max Price');?></label>                                            
                                            <div class='space-row'>
                                                <input type="number" class="form-control" id="contactMaxPrice" name="maxPrice" style='width: 78%;'>
                                                <select class='form-control' id='contactPriceUnit' name="priceUnit" style='width: 20%;'>
                                                    <option value='USD'>USD</option>
                                                    <option value='MXN'>MXN</option>
                                                </select>
                                            </div>  
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Timeframe');?></label>
                                            <select class="form-control" id="contactTimeFrame" name="timeFrame">
                                                <option value="Now"><?php echo lang('Now');?></option>
                                                <option value="This Month"><?php echo lang('This Month');?></option>
                                                <option value="Unknown"><?php echo lang('Unkonwn');?></option>
                                            </select>
                                        </div>
                                        <div class='form-group col-lg-6'>
                                            <label><?php echo lang('Rate');?></label>
                                            <select class='form-control' id='contactRate' name='rate'>
                                                <option value="A+">A+</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Assign To');?></label>
                                            <select class="form-control" id="contactAssignTo" name="assignTo">
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Additional Info');?></label>
                                            <textarea class="form-control" id="contactAdditionalInfo" rows='5'
                                                col='30'></textarea>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <div class="form-group">
                                                <label><?php echo lang('Source');?></label>
                                                <select class="form-control" id="source" name="source">
                                                    <option value='Old Customer'><?php echo lang('Old Customer');?></option>
                                                    <option value="Call"><?php echo lang('Call');?></option>
                                                    <option value="ClickFunnels">ClickFunnels</option>
                                                    <option value="Email">Email</option>
                                                    <option value="Facebook">Facebook</option>
                                                    <option value="Instagram">Instagram</option>
                                                    <option value="Machinery Trader">Machinery Trader</option>
                                                    <option value="Marketplace">Marketplace</option>
                                                    <option value="MercadoLibre">MercadoLibre</option>
                                                    <option value="Other"><?php echo lang('Other');?></option>
                                                    <option value="Purechat">Purechat</option>
                                                    <option value="Visit"><?php echo lang('Visit');?></option>
                                                    <option value="Website">Website</option>
                                                    <option value="WhatsApp">WhatsApp</option>
                                                    <option value="YouTube">YouTube</option>
                                                </select>
                                            </div>
                                            <div class="form-group" style='display:none;' id='other-source-panel'>
                                                <label><?php echo lang('Other');?></label>
                                                <input type="text" class="form-control" id="otherSource" required>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnNewOppSave"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document" style='max-width : 900px;'>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editModalTitle"><?php echo lang('Edit');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>
                                    <div class='row'>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Phone');?></label>
                                            <div style='display:flex; justify-content: space-between; align-items: center;'>
                                                <input type="text" class="form-control Phone" id="contactPhoneEdit" name="phone" required>
                                                <button type ='button' class='btn btn-default' style='width: 40px; height: 35px; padding:0px; margin-left: 8px;' onclick="refreshCustomerDataOnEdit();"><i class='icon-refresh'></i></button>
                                            </div>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Name');?></label>
                                            <input type="text" class="form-control" id="contactNameEdit" name="name"
                                                required>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Last Name');?></label>
                                            <input type="text" class="form-control" id="contactLastNameEdit"
                                                name="lastname" required>
                                        </div>                                        
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Email');?></label>
                                            <input type="text" class="form-control" id="contactEmailEdit" name="email">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Company');?></label>
                                            <input type="text" class="form-control" id="contactCompanyEdit"
                                                name="company">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Country');?></label>
                                            <select class="form-control" id="contactCountryEdit"
                                                onchange="onContactCountryChange(this)">
                                                <option value="Mexico">Mexico</option>
                                                <option value="USA">USA</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('State');?></label>
                                            <select class="form-control" id="contactStateEdit" name="source">
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('City');?></label>
                                            <input type="text" class="form-control" id="contactCityEdit">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Equipment Category');?></label>
                                            <select class="form-control" id="contactEquipmentCategoryEdit">
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Make');?></label>
                                            <input type="text" class="form-control" id="contactMakeEdit">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Model/Capacity');?></label>
                                            <input type="text" class="form-control" id="contactModelEdit">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Min Year');?></label>
                                            <input type="number" class="form-control" id="contactMinYearEdit">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Max Price');?></label>
                                            <div class='space-row'>
                                                <input type="number" class="form-control" id="contactMaxPriceEdit" name="maxPrice" style='width: 78%;'>
                                                <select class='form-control' id='contactPriceUnitEdit' name="priceUnit" style='width: 20%;'>
                                                    <option value='USD'>USD</option>
                                                    <option value='MXN'>MXN</option>
                                                </select>
                                            </div>  
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Timeframe');?></label>
                                            <select class="form-control" id="contactTimeFrameEdit">
                                                <option value="Now"><?php echo lang('Now');?></option>
                                                <option value="This Month"><?php echo lang('This Month');?></option>
                                                <option value="Unknown"><?php echo lang('Unkonwn');?></option>
                                            </select>
                                        </div>
                                        <div class='form-group col-lg-6'>
                                            <label><?php echo lang('Rate');?></label>
                                            <select class='form-control' id='contactRateEdit' name='rate'>
                                                <option value="A+">A+</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Additional Info');?></label>
                                            <textarea class="form-control" id="contactAdditionalInfoEdit" rows='5'
                                                col='30'></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" data-dismiss="modal"
                                    id="btnContactSave"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="contactLogModal" tabindex="-1" role="dialog"
                    aria-labelledby="ContactLogTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ContactLogTitle"><?php echo lang('Assignment Stats');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>
                                    <div class="form-group" id='contactLogPanel' style='margin-left : 32px;'>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="ProposalTypeModal" tabindex="-1" role="dialog"
                    aria-labelledby="ProposalTypeTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ProposalTypeTitle"><?php echo lang('Select Equipment Type');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>
                                    <div class="form-group">
                                        <label>Equipment Type</label>
                                        <select class='form-control' id="ProposalEquipmentType">
                                            <option value='manufacturing'><?php echo lang('Manufacturing');?></option>
                                            <option value='logistics'><?php echo lang('Logistics');?></option>
                                            <option value='equipment'><?php echo lang('Equipment');?></option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Close');?></button>
                                <button type="button" class="btn btn-round btn-default" id='btnProposalEquipmentSelect'><?php echo lang('Select');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade " id="proposalModal" tabindex="-1" role="dialog"
                    aria-labelledby="proposalModalLabel" aria-hidden="true">
                    <div class="modal-dialog" style="max-width: 1200px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title h4" id="proposalModalLabel"><?php echo lang('Proposal');?>s</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="body">
                                    <ul class="nav nav-tabs">
                                        <li class="nav-item"><a class="nav-link active show" id='proposal-tab'
                                                data-toggle="tab" href="#proposal-control-box"><i
                                                    class="fa fa-picture-o"></i> <?php echo lang('Proposal');?>s</a></li>
                                        <li class="nav-item"><a class="nav-link" id='preview-tab' data-toggle="tab"
                                                href="#preview-control-box"><i class="fa fa-toggle-right"></i>
                                                <?php echo lang('Preview');?></a></li>
                                    </ul>
                                    <div class="tab-content">
                                        <div class="tab-pane show active" id='proposal-control-box'>
                                            <div class="picture-control-panel">
                                                <div class="picture-control-main-box">
                                                </div>
                                                <form class="upload-panel-section-form" enctype="multipart/form-data">
                                                    <button type="button" id="btnNewProposal"
                                                        class="btn btn-round btn-primary"><?php echo lang('New');?></button>
                                                    <button type="button" id="slider-image-delete-btn"
                                                        onclick="deleteSelectedPictureListConfirm()"
                                                        class="btn btn-round btn-primary" disabled><?php echo lang('Delete');?></button>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="tab-pane" id="preview-control-box">
                                            <div class="video-control-panel">
                                                <div class="video-control-panel-box"
                                                    style='overflow:auto; max-height : 100%;'>
                                                    <div class='prview-content'>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade " id="deleteProposalModal" tabindex="-1" role="dialog"
                    aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div class="modal-dialog" style="width: 1200px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title h4" id="myLargeModalLabel"><?php echo lang('Alert');?></h5>

                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div style="font-size: 15px; color: white; padding-left: 30px;">
                                    <?php echo lang('Delete Proposal?');?>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('NO');?></button>
                                <button type="button" class="btn btn-round btn-primary" data-dismiss="modal"
                                    onclick="deleteProposals()"><?php echo lang('YES');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class='row clearfix'>
                    <div class="col-3">
                        <div class="card">
                            <div class="body">
                                <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang('Open Opportunities');?></h6>
                                <div class="card-value text-success float-left mr-3 pr-2 border-right" id='OppOppsCount'>0</div>
                                <div class="font-12"><?php echo lang('No Contact');?> <span class="float-right" id='NoContactOppCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Contact');?> <span class="float-right" id='ContactOppCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Proposal');?> <span class="float-right" id='ProposalOppCount'>0</span></div>
                            </div>
                        </div>
                    </div>   
                    <div class="col-3">
                        <div class="card">
                            <div class="body">
                                <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang('Opportunities Waiting Contact');?></h6>
                                <div class="card-value text-danger float-left mr-3 pr-2 border-right" id='WaitingContactCount'>0</div>
                                <div class="font-12"><?php echo lang('No Contact');?> <span class="float-right" id='NoContactCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Contacts for Today');?> <span class="float-right" id='TodayContactCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Expired Contacts');?> <span class="float-right" id='ExpiredContactCount'>0</span></div>
                            </div>
                        </div>
                    </div>                     
                    <div class="col-3">
                        <div class="card">
                            <div class="body status">
                                <div class="d-flex align-items-center">
                                    <div class="icon-in-bg bg-azura text-white rounded-circle"><i
                                            class="fa fa-users"></i></div>
                                    <div class="ml-4">
                                        <span><?php echo lang('Updated Opportunities');?></span>
                                        <h4 class="mb-0 font-weight-medium" id='UpdatedOppsCount'>0</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>           
                    <div class="col-3">
                        <div class="card">
                            <div class="body status">
                                <div class="d-flex align-items-center">
                                    <div class="icon-in-bg bg-pink text-white rounded-circle" style='background:rgb(154, 154, 154);'><i
                                            class="fa fa-users"></i></div>
                                    <div class="ml-4">
                                        <span><?php echo lang('Closed Opportunities');?></span>
                                        <h4 class="mb-0 font-weight-medium" id='ClosedOppsCount'>0</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row clearfix">
                    <div class="col-12" style='width : 100%;'>
                        <div class="card">
                            <div class="body">
                                <div style="display: flex; justify-content: center; align-items: center;">
                                    <div style="display: flex; flex-grow: 1;">
                                        <div class='filter-status' style='width : 230px'>
                                            <span><?php echo lang('Status');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputStatus'
                                                onchange="refreshDatatable();">
                                                <option value='Open'><?php echo lang('Open');?></option>
                                                <option value='Closed'><?php echo lang('Closed');?></option>
                                            </select>
                                        </div>
                                        <div class='filter-stage' style='width : 230px'>
                                            <span><?php echo lang('Stage');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputStage'
                                                onchange="refreshDatatable();">
                                                <option value='All'><?php echo lang('All');?></option>
                                                <option value='No Contact'><?php echo lang('No Contact');?></option>
                                                <option value='Contact'><?php echo lang('Contact');?></option>
                                                <option value='Proposal'><?php echo lang('Proposal');?></option>
                                                <option value='Sale'><?php echo lang('Sale');?></option>
                                            </select>
                                        </div>
                                        <div class='filter-lead-type' style='width : 260px'>
                                            <span><?php echo lang('Lead Type');?>: </span>
                                            <select style='width : 150px;' class='custom-select' id='inputLeadType'
                                                onchange="refreshDatatable();">
                                                <option value='All'><?php echo lang('All');?></option>
                                                <option value='Buying'><?php echo lang('Buying');?></option>
                                                <option value='Selling'><?php echo lang('Selling');?></option>
                                                <option value='Consignment'><?php echo lang('Consignment');?></option>
                                                <option value='Renting'><?php echo lang('Renting');?></option>
                                                <option value='Logistics'><?php echo lang('Logistics');?></option>
                                            </select>
                                        </div>     
                                        <div class='filter-status' style='width : 260px; margin-left: 5px;'>
                                            <span><?php echo lang('Rate');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputRate' onchange="refreshDatatable(true);">
                                                <option value='All'>All</option>
                                                <option value="A+">A+</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </select>
                                        </div>                                     
                                    </div>
                                    <div
                                        style="width: 285px; display:flex; justify-content:space-between; align-items: center;">
                                        <div style="width: 180px; display: inline-block; ">
                                            <input type="text" id="searchInput" class="form-control"
                                                onkeyup="checkEnterkey(event)" placeholder="<?php echo lang('Enter Search Text');?>">
                                        </div>
                                        <button class="btn btn-sm btn-primary " id="searchbtn"
                                            style="width: 100px;"><?php echo lang('SearchButton')?></button>
                                    </div>
                                </div>
                                <div
                                    style="display: flex; justify-content: center; align-items: center; margin-top: 8px;">
                                    <div style="display: flex; flex-grow: 1;">
                                        <div class="endDate-filter" style="width: 380px; margin: 0px;">
                                            <span><?php echo lang('Contact Date');?>:</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true"
                                                    data-date-format="yyyy-mm-dd" id="minStartDateInput"
                                                    class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true"
                                                    data-date-format="yyyy-mm-dd" id="maxStartDateInput"
                                                    class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                            </div>
                                        </div>    
                                                                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12" style='width : 100%;'>
                        <div class="card">
                            <div class="body">
                                <div style="display:flex; justify-content:center; position: relative; height: 31px;">
                                    <div style="width: 260px; position: absolute; right: 0; top:0;">
                                        <button type="button" class="btn btn-primary btn-round mb-2"
                                            style="width : 260px;" id='btnAddNewOpp'><i class="fa fa-plus"></i>
                                            <span><?php echo lang('Add New Opportunity');?></span></button>&nbsp;
                                    </div>
                                             
                                    <div style="width: 170px; position: absolute; right: 270px; top:0;">
                                        <button class="btn btn-primary btn-round mb-2" id="excelbtn" style='width: 170px;'><?php echo lang('EXCEL');?></button>
                                    </div>
                                </div>
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
    <script src="https://apis.google.com/js/client.js"></script>
    <script src="https://www.google-analytics.com/analytics.js"></script>

    <script src="<?php echo base_url('assets/vendor/bootstrap/js/bootstrap.min.js'); ?>?<?php echo time(); ?>"></script>
    <!-- Javascript -->
    <script src="<?php echo base_url('assets/bundles/libscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/vendorscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/vendor/jquery-validation/jquery.validate.js'); ?>?<?php echo time(); ?>">
    </script><!-- Jquery Validation Plugin Css -->
    <script src="<?php echo base_url('assets/bundles/datatablescripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script
        src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/dataTables.buttons.min.js'); ?>?<?php echo time(); ?>">
    </script>
    <script
        src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.bootstrap4.min.js'); ?>?<?php echo time(); ?>">
    </script>
    <script
        src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.colVis.min.js'); ?>?<?php echo time(); ?>">
    </script>
    <script
        src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.html5.min.js'); ?>?<?php echo time(); ?>">
    </script>
    <script
        src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.print.min.js'); ?>?<?php echo time(); ?>">
    </script>
    <script
        src="<?php echo base_url('assets/vendor/jquery-inputmask/jquery.inputmask.bundle.js'); ?>?<?php echo time(); ?>">
    </script>
    <script
        src="<?php echo base_url('assets/vendor/jquery.maskedinput/jquery.maskedinput.min.js'); ?>?<?php echo time(); ?>">
    </script>
    <script
        src="<?php echo base_url('assets/vendor/intlTelInput/js/intlTelInput-jquery.min.js'); ?>?<?php echo time(); ?>">
    </script>



    <script src="<?php echo base_url('assets/bundles/c3.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/knob.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <!-- Jquery Knob-->
    <script src="<?php echo base_url('assets/bundles/mainscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/index6.js'); ?>?<?php echo time(); ?>"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>

    <!-- Custom Javascript -->
    <script type="text/javascript">
    var base_url = "<?php echo base_url(); ?>";
    var currentView = 0;
    var PendingOpps = <?php echo $PendingOpps; ?> ;
    var SearchHelpCount = <?php echo $SearchHelpCount; ?> ;
    var ExpirationStatus = <?php echo $ExpirationStatus; ?> ;
    var lang = "<?php echo $Lang;?>" ;
    /* 
     * 0 : Total Bins
     * 1 : Available Bins
     * 2 : Dispatched Bins
     * 3 : Overdue Bins
     * 4 : History
     */
    </script>

    <script
        src="<?php echo base_url('assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js'); ?>?<?php echo time(); ?>">
    </script>
    <script src="<?php echo base_url('assets/vendor/toastr.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/session_timer.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/config.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/localization.js'); ?>?<?php echo time(); ?>"></script>    
    <script src="<?php echo base_url('assets/js/pages/google-contact.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/demand/my-opportunity-management.js'); ?>?<?php echo time(); ?>">
    </script>

</body>

</html>