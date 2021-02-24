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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="description" content="Heavy Equipment Manager">
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
                        <button type="button" class="btn-toggle-offcanvas"><i
                                class="lnr lnr-menu fa fa-bars"></i></button>
                        <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo"
                                class="img-fluid logo"></a>
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
                        class="img-fluid logo"></a>
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
                                <li><a href="<?php echo base_url('Opportunities/mine'); ?>"><?php echo lang('My Opportunities');?></a></li>
                                <!-- <li class='active'><a href="<?php echo base_url('CFU');?>"><?php echo lang('Customer Follow Up');?></a></li> -->
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
                            <h1><?php echo lang("CFU_Title");?></h1>
                        </div>
                    </div>
                </div>

                <input type="hidden" id="edit-item-id" name="ID" value="">
                <input type="hidden" id="edit-lead-id" name="ID" value="">

                <div class="modal fade" id="ContactSurveyModal" tabindex="-1" role="dialog"
                    aria-labelledby="ContactSurveyTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ContactSurveyTitle"><?php echo lang("Contact Survey");?>
                                </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>
                                    <div class="form-group">
                                        <label><?php echo lang("Contact by Sales Rep");?></label>
                                        <select class="form-control" id="SurveySalesRep" name="SurveySalesRep">
                                            <option value="No Contact"><?php echo lang('No Contact');?></option>
                                            <option value="Bad"><?php echo lang('Bad');?></option>
                                            <option value="OK"><?php echo lang('OK');?></option>
                                            <option value="Great"><?php echo lang('Great');?></option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang("Offer Quality");?></label>
                                        <select class="form-control" id="SurveyOffer" name="SurveyOffer">
                                            <option value="No Offer"><?php echo lang('No Offer');?></option>
                                            <option value="Bad"><?php echo lang('Bad');?></option>
                                            <option value="OK"><?php echo lang('OK');?></option>
                                            <option value="Great"><?php echo lang('Great');?></option>
                                        </select>
                                    </div>
                                    <div class='form-group'>
                                        <div class='fancy-checkbox'>
                                            <label><input type="checkbox"
                                                    id='BoughtOutside' onclick='boughtOutsideClicked();'><span><?php echo lang('Bought Outside');?></span></label>
                                        </div>
                                        <input type='text' maxlegnth='20' class='form-control pull-right' id='OutsideCompany' style='width: 90%; display:none; '>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang("Comment");?></label>
                                        <textarea class="form-control" id="SurveyComm" rows='5' col='30'></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang("Opportunity?");?></label>
                                        <select class="form-control" id="SurveyOpportunity" name="SurveyOpportunity">
                                            <option value="Yes"><?php echo lang('YES');?></option>
                                            <option value="Later"><?php echo lang('Later');?></option>
                                            <option value="No"><?php echo lang('NO');?></option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang("Cancel");?></button>
                                <button type="button" class="btn btn-round btn-primary" data-dismiss="modal"
                                    id="btnSaveSurvey"><?php echo lang("Save");?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="VerifyModal" tabindex="-1" role="dialog" aria-labelledby="VerifyTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="VerifyTitle"><?php echo lang('Verify');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>
                                    <div class="form-group">
                                        <label><?php echo lang('Contact by Sales Rep');?></label>
                                        <select class="form-control" id="VerifySalesRep" name="SurveySalesRep">
                                            <option value="No Contact"><?php echo lang('No Contact');?></option>
                                            <option value="Bad"><?php echo lang('Bad');?></option>
                                            <option value="OK"><?php echo lang('OK');?></option>
                                            <option value="Great"><?php echo lang('Great');?></option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang('Offer Quality');?></label>
                                        <select class="form-control" id="VerifyOffer" name="SurveyOffer">
                                            <option value="No Offer"><?php echo lang('No Offer');?></option>
                                            <option value="Bad"><?php echo lang('Bad');?></option>
                                            <option value="OK"><?php echo lang('OK');?></option>
                                            <option value="Great"><?php echo lang('Great');?></option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang('Comment');?></label>
                                        <textarea class="form-control" id="VerifyComm" rows='5' col='30'></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" data-dismiss="modal"
                                    id="btnSaveVerify"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="ContactSurveyOppModal" tabindex="-1" role="dialog"
                    aria-labelledby="ContactSurveyTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ContactSurveyTitle"><?php echo lang('Contact Survey');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>
                                    <div class="form-group">
                                        <label><?php echo lang('Opportunity?');?></label>
                                        <select class="form-control" id="SurveyOpportunitySchedule"
                                            name="SurveyOpportunity">
                                            <option value="Yes"><?php echo lang('YES');?></option>
                                            <option value="Later"><?php echo lang('Later');?></option>
                                            <option value="No"><?php echo lang('NO');?></option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" data-dismiss="modal"
                                    id="btnSaveSurveyOpp"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="editLeadModal" tabindex="-1" role="dialog" aria-labelledby="EditLeadTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="EditLeadTitle">Edit Lead</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='EditLeadForm'>
                                    <div class="form-group">
                                        <label>Name</label>
                                        <input type="text" class="form-control" id="nameEdit" name="name" required>
                                    </div>
                                    <div class="form-group">
                                        <label>LastName</label>
                                        <input type="text" class="form-control" id="lastNameEdit" name="lastname"
                                            required>
                                    </div>
                                    <div class="form-group">
                                        <label>Phone</label>
                                        <input type="tel" class="form-control" id="phoneEdit" name="phone" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input type="text" class="form-control" id="emailEdit">
                                    </div>
                                    <div class="form-group">
                                        <label>Source</label>
                                        <select class="form-control" id="sourceEdit" name="source">
                                            <option value="Call">Call</option>
                                            <option value="ClickFunnels">ClickFunnels</option>
                                            <option value="Email">Email</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="Machinery Trader">Machinery Trader</option>
                                            <option value="Marketplace">Marketplace</option>
                                            <option value="Other">Other</option>
                                            <option value="Purechat">Purechat</option>
                                            <option value="User">User</option>
                                            <option value="Visit">Visit</option>
                                            <option value="Website">Website</option>
                                            <option value="WhatsApp">WhatsApp</option>
                                            <option value="YouTube">YouTube</option>
                                        </select>
                                    </div>
                                    <div class="form-group" style='display:none;' id='user-panel-edit'>
                                        <label>Users</label>
                                        <select class="form-control" id="usersEdit">
                                        </select>
                                    </div>
                                    <div class="form-group" style='display:none;' id='other-source-panel-edit'>
                                        <label>Other Source</label>
                                        <input type="text" class="form-control" id="otherSourceEdit">
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-round btn-primary"
                                    id="btnUpdateLead">Update</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="contactOppModal" tabindex="-1" role="dialog"
                    aria-labelledby="contactModalTitle" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document" style='max-width : 900px;'>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="contactModalTitle"><?php echo lang('Add New Opportunity');?>
                                </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='ContactForm'>
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
                                            <input type="text" class="form-control" id="contactCompany" name="company">
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
                                            <input type="hidden" id="ContactSource">
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
                                            <label><?php echo lang('Additional Info');?></label>
                                            <textarea class="form-control" id="contactAdditionalInfo" rows='5'
                                                col='30'></textarea>
                                        </div>
                                        <div class="form-group col-lg-6" id='contactAssignToPanel'>
                                            <label><?php echo lang('Assign To');?></label>
                                            <select class="form-control" id="contactAssignTo" name="assignTo">
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary"
                                    id="btnContacOpptSave"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="contactScheduleModal" tabindex="-1" role="dialog"
                    aria-labelledby="ContactTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ContactTitle"><?php echo lang('Schedule Contact');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='ContactScheduleForm'>
                                    <div class="form-group">
                                        <label><?php echo lang('Note');?></label>
                                        <textarea class="form-control" id="note" rows='5' col='30'></textarea>
                                    </div>
                                    <div class="form-group" id='contactDatePanel'>
                                        <label><?php echo lang('When to Contact');?></label>
                                        <input data-provide="datepicker" data-date-autoclose="true"
                                            data-date-format="yyyy-mm-dd" id="whenToContact" class="form-control"
                                            value="" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary"
                                    id="btnContactScheduleSave"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="contactInfoModal" tabindex="-1" role="dialog"
                    aria-labelledby="ContactInfoTtile" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ContactInfoTtile"><?php echo lang('Attempted Contacts');?>
                                </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left" id='contact-modal-body'>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade " id="deleteModal" tabindex="-1" role="dialog"
                    aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div class="modal-dialog" style="width: 850px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title h4" id="myLargeModalLabel">Alert</h5>
                                <input type="hidden" id="delete-item-id" value="">
                                <input type="hidden" id="delete-item-category" value="">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div style="font-size: 15px; color: white; padding-left: 30px;">
                                    Are you really going to delete this Lead?
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-round btn-primary" data-dismiss="modal"
                                    onclick="deleteLead()">Delete</button>
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
                                        <label
                                            style='font-weight : bolder;'><?php echo lang('Assignment Info');?></label>
                                        <div class='row' id='assignmentInfoPanel'
                                            style='padding-left : 20px; padding-right : 20px;'>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Status');?>: </span><span
                                                    class='badge badge-info' id='historyStatus'>Open</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Stage');?>: </span><span id='historyStage'>No
                                                    Contact</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Assigned Date');?>: </span><span
                                                    id='historyAssignedDate'>2020-02-04 12:12</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span id='historyCloseExpiration'><?php echo lang('Closing Date');?>:
                                                </span><span id='historyClosingDate'>2020-02-04 12:12</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Sales Rep');?>: </span><span
                                                    id='historySalesRep'>Rodolfo</span>
                                            </div>
                                            <div class='col-lg-6'>
                                                <span><?php echo lang('Assigned By');?>: </span><span
                                                    id='historyAssignedBy'>Rodolfo</span>
                                            </div>
                                            <div class='col-lg-6' id='historyCanceledByPanel'>
                                                <span><?php echo lang('Canceled By');?>: </span><span
                                                    id='historyCanceledBy'>Rodolfo</span>
                                            </div>
                                            <div class='col-lg-12' id='historyAdditionalInfoPanel'>
                                                <div><?php echo lang('Additional Info');?></div>
                                                <div id='historyAdditionalInfo'>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group" id='historyContactLogsPanel'>
                                        <label
                                            style='font-weight : bolder;'><?php echo lang('Contact History');?></label>
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
                                    <div class="form-group" style='padding-left : 20px; padding-right : 20px;'>
                                        <label style='font-weight : bolder;'><?php echo lang('Survey Comment');?></label>
                                        <div id='SurveyComment'>
                                        </div>
                                    </div>

                                    <div class="form-group" style='padding-left : 20px; padding-right : 20px;'>
                                        <label style='font-weight : bolder;'><?php echo lang('Verify Comment');?></label>
                                        <div id="VerifyComment">
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

                
                <div class='row clearfix'>
                    <div class="col-3">
                        <div class="card">
                            <div class="body">
                                <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang("Active Customer Follow Ups");?></h6>
                                <div class="card-value text-success float-left mr-3 pr-2 border-right" id='ActiveCFUCount'>0</div>
                                <div class="font-12"><?php echo lang("New");?> <span class="float-right" id='NewCFUCount'>0</span></div>
                                <div class="font-12"><?php echo lang("Pending");?> <span class="float-right" id='PendingCFUCount'>0</span></div>
                                <div class="font-12"><?php echo lang("Scheduled");?> <span class="float-right" id='ScheduledCount'>0</span></div>
                            </div>
                        </div>
                    </div>   
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 142px;'>
                                <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang("Scheduled Customer Follow Ups");?></h6>
                                <div class="card-value text-danger float-left mr-3 pr-2 border-right" id='ScheduledCFUCount'>0</div>
                                <div class="font-12"><?php echo lang('For Today');?> <span class="float-right" id='ScheduledForTodayCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Expired');?> <span class="float-right" id='ScheduledExpiredCount'>0</span></div>
                            </div>
                        </div>
                    </div> 
                    <div class="col-3">
                        <div class="card">
                            <div class="body">
                                <h6 class="mb-4"><i class="fa fa-users"></i> <?php echo lang('Updated Customer Follow Ups');?></h6>
                                <div class="card-value text-primary float-left mr-3 pr-2 border-right" id='UpdatedCFUCount'>0</div>
                                <div class="font-12"><?php echo lang('Scheduled');?> <span class="float-right" id='ScheduledCFUTodayCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Opportunity');?> <span class="float-right" id='OpportunityCFUTodayCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Closed');?> <span class="float-right" id='ClosedCFUTodayCount'>0</span></div>
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
                                        <div class='filter-status' style='width : 220px; margin-left: 3px;'>
                                            <span><?php echo lang("Status");?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputStatus'
                                                onchange="refreshDatatable();">
                                                <option value='Open'><?php echo lang('Open');?></option>
                                                <option value='Closed'><?php echo lang('Closed');?></option>
                                            </select>
                                        </div>
                                        <div class="endDate-filter" style="width: 370px;">
                                            <div style='margin-right : 10px;'>
                                                <span><?php echo lang("EndDate");?>:</span>
                                            </div>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true"
                                                    data-date-format="yyyy-mm-dd" id="minAucYearInput"
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true"
                                                    data-date-format="yyyy-mm-dd" id="maxAucYearInput"
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                        </div>
                                        <div class='filter-status' style='width : 260px; margin-left: 3px;'>
                                            <span><?php echo lang("Verified");?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputVerified'
                                                onchange="refreshDatatable();">
                                                <option value='ALL'><?php echo lang('All');?></option>
                                                <option value='YES'><?php echo lang('YES');?></option>
                                                <option value='NO'><?php echo lang('NO');?></option>
                                            </select>
                                        </div>
                                        <div class="endDate-filter">
                                            <div style='margin-right : 10px;'>
                                                <span><?php echo lang("Verify");?>:</span>
                                            </div>
                                            <div class="onoffswitch">
                                                <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox"
                                                    id="verifySwitch" onchange="onVerifySwitch();">
                                                <label class="onoffswitch-label" for="verifySwitch"
                                                    style='margin-bottom : 0px;'>
                                                    <span class="onoffswitch-inner"></span>
                                                    <span class="onoffswitch-switch"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        style="width: 285px; display:flex; justify-content:space-between; align-items: center;">
                                        <div style="width: 180px; display: inline-block; ">
                                            <input type="text" id="searchInput" class="form-control"
                                                onkeyup="checkEnterkey(event)"
                                                placeholder="<?php echo lang("Enter Search Text");?>">
                                        </div>
                                        <button class="btn btn-sm btn-primary " id="searchbtn"
                                            style="width: 100px;"><?php echo lang('SearchButton');?></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12" style='width : 100%;'>
                        <div class="card">
                            <div class="body">
                                <div style="display:flex; justify-content:center; position: relative; height: 31px;">                                                                                
                                    <div style="width: 170px; position: absolute; right: 0; top:0;">
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

    <!-- Javascript -->
    <script src="<?php echo base_url('assets/bundles/libscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/vendorscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>

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

    <script src="<?php echo base_url('assets/vendor/jquery-validation/jquery.validate.js'); ?>?<?php echo time(); ?>">
    </script><!-- Jquery Validation Plugin Css -->
    <script src="<?php echo base_url('assets/bundles/c3.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/knob.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <!-- Jquery Knob-->
    <script src="<?php echo base_url('assets/bundles/knob.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <!-- Jquery Knob-->
    <script src="<?php echo base_url('assets/bundles/mainscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/index6.js'); ?>?<?php echo time(); ?>"></script>

    <!-- Custom Javascript -->
    <script type="text/javascript">
    var base_url = "<?php echo base_url(); ?>";
    var isVerify = "<?php echo $VERIFY;?>";
    var isSurvey = "<?php echo $SURVEY;?>";
    var currentView = 0;
    var scheduledCount = <?php echo $ScheduledCount; ?> ;
    var lang = "<?php echo $Lang; ?>";
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
    <script src="<?php echo base_url('assets/js/pages/demand/cfu-management.js'); ?>?<?php echo time(); ?>"></script>

</body>

</html>