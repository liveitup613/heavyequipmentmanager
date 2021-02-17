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
    <link rel="stylesheet"
        href="<?php echo base_url('assets/vendor/bootstrap-datepicker/css/bootstrap-datepicker3.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/morrisjs/morris.css'); ?>?<?php echo time(); ?>" />

    <!-- MAIN CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/site.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/toastr.min.css'); ?>?<?php echo time(); ?>">
    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/management.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/lead-management.css'); ?>?<?php echo time(); ?>">

    <style>
    #left-sidebar {
        background: #22252a;
    }
    </style>
</head>

<body class="theme-cyan font-montserrat" onload='set_interval();'>

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
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown"
                                    style='min-width : 125px; width: 125px;'>
                                    <a class="dropdown-item pt-2 pb-2" href="javascript:changeLang('english');"
                                        style='color:grey;'>English</a>
                                    <a class="dropdown-item pt-2 pb-2" href="javascript:changeLang('spanish');"
                                        style='color:grey;'>Español</a>
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
                            <a href="<?php echo base_url('Home');?>"><i
                                    class='icon-home'></i><span><?php echo lang('Home');?></span></a>
                            <?php }?>
                        <li>
                            <a href="#myPage" class="has-arrow"><i
                                    class="fa fa-gavel"></i><span><?php echo lang('Deals');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Deals'); ?>"><?php echo lang('Deals');?></a></li>
                                <li><a
                                        href="<?php echo base_url('Deals/watchlist'); ?>"><?php echo lang('Watch List');?></a>
                                </li>
                                <?php if ($PERMISSION == 'admin' || $PERMISSION == "editable" || $PERMISSION == 'uploader') { ?>
                                <li><a
                                        href="<?php echo base_url('Deals/addNewDeal'); ?>"><?php echo lang('Add New Deal');?></a>
                                </li>
                                <?php } ?>
                                <li><a
                                        href="<?php echo base_url('AuctionResults'); ?>"><?php echo lang('Auction Results');?></a>
                                </li>
                                <li><a
                                        href="<?php echo base_url('Deals/statistic'); ?>"><?php echo lang('Statistics');?></a>
                                </li>
                                <li><a href="<?php echo base_url('Procurement'); ?>"><?php echo lang('Procurement');?></a></li>
                            </ul>
                        </li>

                        <li>
                            <a href="#myPage" class="has-arrow"><i
                                    class="icon-user"></i><span><?php echo lang('Users');?></span></a>
                            <ul>
                                <?php if ($PERMISSION == 'admin') { ?>
                                <li><a href="<?php echo base_url('User'); ?>"><?php echo lang('Users');?></a></li>
                                <?php } ?>
                                <li><a
                                        href="<?php echo base_url('User/redirectToUpdatePasswordPage'); ?>"><?php echo lang('Update Profile');?></a>
                                </li>
                                <li><a href="<?php echo base_url('Worksheet');?>"><?php echo lang('Worksheet');?></a>
                                </li>
                                <?php 
                                    if ($PERMISSION == 'admin') {
                                    echo '<li><a href="'.base_url('User/configuration').'">'.lang('Settings').'</a></li>';
                                    echo '<li><a href="'.base_url('Activity').'">'.lang('Activities').'</a></li>';
                                }
                                    ?>
                            </ul>
                        </li>

                        <li class='active open'>
                            <a href="#myPage" class="has-arrow"><i
                                    class="fa fa-users"></i><span><?php echo lang('Demand');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Leads'); ?>"><?php echo lang('Leads');?></a></li>
                                <li><a
                                        href="<?php echo base_url('Opportunities'); ?>"><?php echo lang('Opportunities');?></a>
                                </li>
                                <li><a
                                        href="<?php echo base_url('Opportunities/mine'); ?>"><?php echo lang('My Opportunities');?></a>
                                </li>
                                <li><a href="<?php echo base_url('CFU');?>"><?php echo lang('Customer Follow Up');?></a>
                                </li>
                                <li><a
                                        href="<?php echo base_url('Leads/statistic'); ?>"><?php echo lang('Statistics');?></a>
                                </li>
                                <li class='active'><a
                                        href="<?php echo base_url('Customers');?>"><?php echo lang('Customers');?></a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#myPage" class="has-arrow"><i
                                    class="icon-basket"></i><span><?php echo lang('Sales');?></span></a>
                            <ul>
                                <li><a href="<?php echo base_url('Sales'); ?>"><?php echo lang('Sales');?></a></li>
                                <li><a href="<?php echo base_url('Sales/mine'); ?>"><?php echo lang('My Sales');?></a>
                                </li>
                                <li><a
                                        href="<?php echo base_url('Sales/statistics'); ?>"><?php echo lang('Statistics');?></a>
                                </li>
                                <li><a href="<?php echo base_url('Incentive'); ?>"><?php echo lang('Incentives');?></a>
                                </li>
                                <li><a
                                        href="<?php echo base_url('Incentive/mine'); ?>"><?php echo lang('My Incentives');?></a>
                                </li>
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
                            <h1><?php echo lang('Customers');?></h1>
                        </div>
                    </div>
                </div>

                <input type="hidden" id="edit-item-id" name="ID" value="">

                <div class="modal fade" id="AddNewCustomer" tabindex="-1" role="dialog"
                    aria-labelledby="contactModalTitle" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document" style='max-width : 900px;'>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="contactModalTitle"><?php echo lang('Add New Customer');?>
                                </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='AddNewCustomerForm'>
                                    <div class='row'>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Phone');?></label>
                                            <input type="text" class="form-control Phone" id="Phone" name="phone"
                                                required>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Name');?></label>
                                            <input type="text" class="form-control" id="Name" name="name" required>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Last Name');?></label>
                                            <input type="text" class="form-control" id="LastName" name="lastname"
                                                required>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Email');?></label>
                                            <input type="text" class="form-control" id="Email" name="email">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Company');?></label>
                                            <input type="text" class="form-control" id="Company" name="company">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Country');?></label>
                                            <select class="form-control" id="Country" onchange="onCountryChange(this)">
                                                <option value="Mexico">Mexico</option>
                                                <option value="USA">USA</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('State');?></label>
                                            <select class="form-control" id="State" name="state">
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('City');?></label>
                                            <input type="text" class="form-control" id="City" name="city">
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary"
                                    id="btnAddCustomer"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="editCusomterModal" tabindex="-1" role="dialog"
                    aria-labelledby="EditLeadTitle" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document" style='max-width : 900px;'>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="EditLeadTitle"><?php echo lang('Edit Customer');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='editCusomterForm'>
                                    <div class='row'>
                                        <div class="form-group col-lg-6">
                                            <label>Phone</label>
                                            <input type="text" class="form-control" id="PhoneEdit" name="phone">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Name');?></label>
                                            <input type="text" class="form-control" id="NameEdit" name="name" required>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Last Name');?></label>
                                            <input type="text" class="form-control" id="LastNameEdit" name="lastname"
                                                required>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Email');?></label>
                                            <input type="text" class="form-control" id="EmailEdit" name="email">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Company');?></label>
                                            <input type="text" class="form-control" id="CompanyEdit" name="company">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Country');?></label>
                                            <select class="form-control" id="CountryEdit"
                                                onchange="onCountryEditChange(this)">
                                                <option value="Mexico">Mexico</option>
                                                <option value="USA">USA</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('State');?></label>
                                            <select class="form-control" id="StateEdit" name="state">
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('City');?></label>
                                            <input type="text" class="form-control" id="CityEdit" name="city">
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary"
                                    id="btnUpdateCustomer"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="invoiceModal" tabindex="-1" role="dialog" aria-labelledby="InvoiceTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document" style='max-width : 900px;'>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="InvoiceTitle"><?php echo lang('Invoice Data');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='incentiveForm'>
                                    <div class='row'>
                                        <div class="form-group col-lg-3">
                                            <label>RFC:</label>
                                            <input type="text" class="form-control" id="RFC" name="">
                                        </div>
                                        <div class="form-group col-lg-5">
                                            <label>Nombre/Razón Social</label>
                                            <input type="text" class="form-control" id="NombreSocial" name="">
                                        </div>
                                        <div class="form-group col-lg-4">
                                            <label>Nombre Comercial</label>
                                            <input type="text" class="form-control" id="NombreComercial" name="">
                                        </div>
                                        <div class='col-lg-12'>
                                            <hr>
                                        </div>
                                        <div class="form-group col-lg-4">
                                            <label>Teléfono</label>
                                            <input type="text" class="form-control" id="Telefono" name="">
                                        </div>
                                        <div class="form-group col-lg-8">
                                            <label>Correo Electrónico</label>
                                            <input type="text" class="form-control" id="CorreoElectronico" name="">
                                        </div>
                                        <div class="form-group col-lg-8">
                                            <label>Calle</label>
                                            <input type="text" class="form-control" id="Calle" name="">
                                        </div>
                                        <div class="form-group col-lg-2">
                                            <label>NumExt</label>
                                            <input type="number" class="form-control" id="NumExt" name="">
                                        </div>
                                        <div class="form-group col-lg-2">
                                            <label>NumInt</label>
                                            <input type="number" class="form-control" id="NumInt" name="">
                                        </div>
                                        <div class="form-group col-lg-4">
                                            <label>Colonia</label>
                                            <input type="text" class="form-control" id="Colonia" name="">
                                        </div>
                                        <div class="form-group col-lg-2">
                                            <label>CP</label>
                                            <input type="text" class="form-control" id="CP" name="">
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>Estado</label>
                                            <select class="form-control" id="Estado">
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <label>Ciudad</label>
                                            <input type="text" class="form-control" id="Ciudad" name="">
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary"
                                    id="btnUpdateInvoice"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade " id="deleteModal" tabindex="-1" role="dialog"
                    aria-labelledby="myLargeModalLabel" aria-hidden="true">
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
                                    <?php echo lang('Delete Cusomter?');?>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('NO');?></button>
                                <button type="button" class="btn btn-round btn-primary" data-dismiss="modal"
                                    onclick="deleteLead()"><?php echo lang('YES');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade " id="activityModal" tabindex="-1" role="dialog"
                    aria-labelledby="activityModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" style="width: 850px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title h4" id="activityModalLabel">
                                    <?php echo lang('Customer Activity');?></h5>
                                <input type="hidden" id="delete-item-id" value="">
                                <input type="hidden" id="delete-item-category" value="">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="body" style='margin-left: 32px;'>
                                    <ul class="timeline timeline-split" id='activity-content'>
                                        <!-- <li class="timeline-item">
                                            <div class="timeline-info">
                                                <span>Feb 15, 2015</span>
                                            </div>
                                            <div class="timeline-marker"></div>
                                            <div class="timeline-content">
                                                <h3 class="timeline-title">Parramatta WordPress Meetup</h3>
                                                <p class="text-muted mt-0 mb-0">@ 6:00 pm - 9:00 pm Bay
                                                    Area, San Francisco</p>
                                                <small>(4,325 tickets sold) <span class="text-danger">Sold
                                                        Out</span></small>
                                                <p>Welcome to the Parramatta chapter of the WP <a
                                                        href="#">Sydney</a> Meetup[...]</p>
                                                <ul class="list-unstyled team-info sm margin-0">
                                                       <li><img src="../assets/images/xs/avatar7.jpg"
                                                            alt="Avatar"></li>
                                                    <li><img src="../assets/images/xs/avatar8.jpg"
                                                            alt="Avatar"></li>
                                                    <li><img src="../assets/images/xs/avatar9.jpg"
                                                            alt="Avatar"></li>
                                                    <li><img src="../assets/images/xs/avatar2.jpg"
                                                            alt="Avatar"></li>
                                                    <li><img src="../assets/images/xs/avatar3.jpg"
                                                            alt="Avatar"></li>
                                                    <li class="ml-2"><span>5k +</span></li>
                                                </ul>
                                            </div>
                                        </li> -->
                                        
                                        <!-- <li class="timeline-item period">
                                            <div class="timeline-info"></div>
                                            <div class="timeline-marker"></div>
                                            <div class="timeline-content">
                                                <h2 class="timeline-title">March 2019</h2>
                                            </div>
                                        </li> -->
                                    </ul>
                                </div>                                
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default"
                                    data-dismiss="modal"><?php echo lang('Close');?></button>                                
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
                                        <div class="endDate-filter" style="width: 400px;">
                                            <span><?php echo lang('Date Added');?>:</span>
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

                                        <div class="endDate-filter" style="width: 400px;">
                                            <span><?php echo lang('LastOppDate');?>:</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true"
                                                    data-date-format="yyyy-mm-dd" id="minLastOppDateInput"
                                                    class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true"
                                                    data-date-format="yyyy-mm-dd" id="maxLastOppDateInput"
                                                    class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        style="width: 285px; display:flex; justify-content:space-between; align-items: center;">
                                        <div style="width: 180px; display: inline-block; ">
                                            <input type="text" id="searchInput" class="form-control"
                                                onkeyup="checkEnterkey(event)"
                                                placeholder="<?php echo lang('Enter Search Text');?>">
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
                                    <div style="width: 400px; position: absolute; right: 0; top:0;">
                                        <button type="button" class="btn btn-primary btn-round mb-2"
                                            style="width : 260px;" data-toggle="modal" data-target="#AddNewCustomer"><i
                                                class="fa fa-plus"></i>
                                            <span><?php echo lang('Add New Customer');?></span></button>&nbsp;
                                        <button type="button" class="btn btn-primary btn-round mb-2"
                                            style="width : 100px;" id='excelbtn'>
                                            <span><?php echo lang('EXCEL');?></span></button>&nbsp;
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
    <script
        src="<?php echo base_url('assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js'); ?>?<?php echo time(); ?>">
    </script>

    <!-- Custom Javascript -->
    <script type="text/javascript">
    var base_url = "<?php echo base_url(); ?>";
    var currentView = 0;
    var lang = "<?php echo $Lang;?>";
    var permission = "<?php echo $PERMISSION;?>"
    /* 
     * 0 : Total Bins
     * 1 : Available Bins
     * 2 : Dispatched Bins
     * 3 : Overdue Bins
     * 4 : History
     */
    </script>
    <script src="<?php echo base_url('assets/vendor/toastr.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/session_timer.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/config.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/localization.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/google-contact.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/demand/customer-management.js'); ?>?<?php echo time(); ?>">
    </script>

</body>

</html>