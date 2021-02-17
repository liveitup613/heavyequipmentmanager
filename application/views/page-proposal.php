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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <meta name="description" content="Machinary Hunters Platform">
    <meta name="keywords" content="admin template, Oculux admin template, dashboard template, flat admin template, responsive admin template, web app, Light Dark version">
    <meta name="author" content="GetBootstrap, design by: puffintheme.com">

    <link rel="icon" type="image/png" href="/favicon.png"/>
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Bebas Neue">    
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
    <link rel="stylesheet" href="<?php echo base_url('assets/css/proposal.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/sale-management.css'); ?>?<?php echo time(); ?>">

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

                        <li class='active open'>
                            <a href="#myPage" class="has-arrow"><i class="fa fa-users"></i><span>Demands</span></a>
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
                            <h1><?php echo lang('Make Proposal');?></h1>
                            <input type="hidden" value="<?php echo $PERMISSION; ?>" id="permission">
                        </div>
                    </div>
                </div>

                <input type="hidden" id="edit-item-id" name="ID" value="<?php echo $AssignmentID;?>">
                <input type="hidden" id="edit-item-type" name="Type" value="<?php echo $Type;?>">

                <div class="row clearfix" style='margin-bottom: 1em;'>
                    <div class="col-12" style="width: 100%; text-align: center; position:relative;">
                        <ul id="progressbar">
                            <li class='active' id='stepChooseItem'><?php echo lang('Choose Item');?></li>
                            <li id='stepTaxInfo'><?php echo lang('Tax Info');?></li>
                            <li id='stepPreview'><?php echo lang('Preview');?></li>
                        </ul>
                    </div>
                    <div class='col-lg-6'>
                        <button class='btn btn-default btn-round' style='width: 120px;display:none;' id='btnStepPrev'><?php echo lang('Previous');?></button>
                    </div>
                    <div class='col-lg-6' style='display:flex; align-items:center; justify-content: flex-end;'>
                        <span id="SpanFileName" style='display:none;'><?php echo lang('File Name');?>:</span>&nbsp;&nbsp;
                        <input class='form-control' type='text' value='Proposal' id='ProposalName' style='width: 35%; margin-right: 30px; display:none;'>
                        <button class='btn btn-default btn-round pull-right' style='width: 120px; display:none;' id='btnStepNext'><?php echo lang('Next');?></button>
                    </div>
                </div>

                <div id='ItemSelectionPanel'>
                    <div class="row clearfix EquipmSelectPanel">
                        <div class="col-6">
                            <div class="card">
                                <div class="form-group body">
                                    <label><?php echo lang('Deal Type');?></label>
                                    <div class="input-group mb-3">
                                        <select class="custom-select" id="DealType" name="DealType" onchange="onChangeDealType()">
                                            <option value="All Deals"><?php echo lang('All');?></option>
                                            <option value="Auction"><?php echo lang('Auction');?></option>
                                            <option value="Supplier"><?php echo lang('Supplier');?></option>
                                            <option value="Consignment"><?php echo lang('Consignment');?></option>
                                            <option value="Inventory"><?php echo lang('Inventory');?></option>                                            
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card">
                                <div class="form-group body">
                                    <label><?php echo lang('Equipment Category');?></label>
                                    <div class="input-group mb-3">
                                        <select class="custom-select" id="inputEqCategory" name="EqCategory" onchange="onChangeCategory()">                                                                  
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row clearfix EquipmSelectPanel">
                        <div class="col-12" style="width: 100%;">
                            <div class="card">
                                <div class="body">
                                    <div style="display: flex; justify-content: center; align-items: center;">                                    
                                        <div style="display: flex; flex-grow: 1;">
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

                                            <div class="endDate-filter" style="width: 350px;">
                                                <span><?php echo lang('End Date');?>:</span>
                                                <div class="input-group" style="width: 110px;">
                                                    <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="minAucYearInput" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                                </div>
                                                <span>~</span>
                                                <div class="input-group" style="width: 110px;">
                                                    <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="maxAucYearInput" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                                </div>
                                            </div>

                                            <div class="lift-capacity" style="width: 250px;">
                                                <span><?php echo lang('Capacity');?>:</span>
                                                <div class="input-group " style="width: 80px;">
                                                    <input type="number" id="minLiftCapacity" class="form-control" onkeyup="checkEnterkey(event)" value="">
                                                </div>
                                                <span>~</span>
                                                <div class="input-group " style="width: 80px;">
                                                    <input type="number" id="maxLiftCapacity" class="form-control" onkeyup="checkEnterkey(event)" value="*">
                                                </div>
                                            </div>
                                        </div>

                                        <div style="width: 285px; display:flex; justify-content:space-between; align-items: center;">
                                            <div style="width: 180px; display: inline-block; ">
                                                <input type="text" id="searchInput" class="form-control" onkeyup="checkEnterkey(event)" placeholder="Enter search text">
                                            </div>
                                            <button class="btn btn-sm btn-primary " id="searchbtn" style="width: 100px;"><?php echo lang('SearchButton');?></button>
                                        </div>
                                    </div>                                
                                </div>
                            </div>
                        </div>

                        <div class="col-12"  style="width: 100%;">
                            <div class="card">
                                <div class="body">                                    
                                    <div class="table-responsive">
                                        <table class="table" width="100%" id="auction-management-table">

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class='row clearfix ManufactureSelectPanel'>
                        <div class="form-group col-md-4">
                            <label><?php echo lang('Equipment Category');?></label>
                            <select class="form-control" id="ManuEqCategory">                                            
                                <option value='Dump Truck'><?php echo lang('Dump Truck');?></option>
                                <option value='Water Truck'><?php echo lang('Water Truck');?></option>
                            </select>
                        </div>                       
                        <div id='ManuDumpTruckPanel' class='col-md-4'>
                            <div class='form-group'>
                                <label><?php echo lang('Capacity');?></label>
                                <select class="form-control" id="ManuDumpTruckCapacity">                                            
                                    <option value='7'>7</option>
                                    <option value='14'>14</option>
                                </select>
                            </div>
                        </div> 
                        <div id='ManuWaterTruckPanel' class='col-md-4'>
                            <div class='form-group'>
                                <label><?php echo lang('Capacity');?></label>
                                <select class="form-control" id="ManuWaterTruckCapacity">                                            
                                    <option value='10000'>10,000</option>
                                    <option value='12000'>12,000</option>
                                    <option value='16000'>16,000</option>
                                    <option value='18000'>18,000</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label><?php echo lang('Water Truck Type');?></label>
                                <input id="ManuWaterTruckType" class="form-control" type='text'>
                            </div>
                        </div> 
                        <div class="form-group col-md-4">
                            <label><?php echo lang('Truck Make');?></label>
                            <input id="ManuTruckMake" class="form-control" type='text'>
                        </div>
                        <div class="form-group col-md-4">
                            <label><?php echo lang('Truck Model');?></label>
                            <input id="ManuTruckModel" class="form-control" type='text'>
                        </div>
                        <div class="form-group col-md-4">
                            <label><?php echo lang('Truck Year');?></label>
                            <input id="ManuTruckYear" class="form-control" type='number'>
                        </div>
                        <div class="form-group col-md-4">
                            <label><?php echo lang('Truck Engine');?></label>
                            <input id="ManuTruckEngine" class="form-control" type='text'>
                        </div>
                        <div class="form-group col-md-4">
                            <label><?php echo lang('Truck Transmission');?></label>
                            <input id="ManuTruckTransmission" class="form-control" type='text'>
                        </div>                        
                    </div>

                    <div class='LogisticsSelectPanel'>
                        <div class='row'>
                            <div class="form-group col-lg-4">
                                <label><?php echo lang('Equipment Category');?></label>
                                <select class="form-control" id="LogisticsEqCategory" name='EqCategory'>
                                </select>
                            </div>   
                            <div class='form-group col-lg-4'>
                                <label><?php echo lang('Serial Number');?></label>
                                <input type='text' id='EqSN' name='EqSN' class='form-control'>
                            </div>
                            <input type='hidden' id='LogitsticsSalesID', name='SaleID'>
                        </div>
                        
                        <div id="LocationInfoPanel">
                            <div>
                                <h6><?php echo lang('Pick Up');?></h6>
                            </div>
                            <hr>
                            <div class='clearfix form-group row'>  
                                <div class="form-group col-lg-4">
                                <label><?php echo lang('Country');?></label>
                                <select class="form-control" id="Country" onchange="onCountryChange()" name='PickUpCountry'>
                                    <option value="USA">USA</option>
                                    <option value="Mexico">Mexico</option>                                                
                                    <option value="Canada">Canada</option>                                            
                                </select>
                                </div>
                                <div class="form-group col-lg-4">
                                    <label><?php echo lang('State');?></label>
                                    <select class="form-control" id="State" name="PickUpState">                                       
                                    </select>                                                
                                </div>
                                <div class="form-group col-lg-4">
                                    <label><?php echo lang('City');?></label>
                                    <input id="City" class="form-control" type='text' name='PickUpCity'>
                                </div>
                            </div>

                            <div>
                                <h6><?php echo lang('Final Destination');?></h6>
                            </div>
                            <hr>
                            <div class='clearfix form-group row'>  
                                <div class="form-group col-lg-4">
                                    <label><?php echo lang('Country');?></label>
                                    <select class="form-control" id="FinalCountry" onchange="onCountryChange()" name='FinalCountry'>                                                    
                                        <option value="Mexico">Mexico</option>
                                        <option value="USA">USA</option>
                                        <option value="Canada">Canada</option>                                            
                                    </select>
                                </div>
                                <div class="form-group col-lg-4">
                                    <label><?php echo lang('State');?></label>
                                    <select class="form-control" id="FinalState" name="FinalState">                                       
                                    </select>    
                                </div>
                                <div class="form-group col-lg-4">
                                    <label><?php echo lang('City');?></label>
                                    <input id="FinalCity" class="form-control" type='text' name='FinalCity'>
                                </div>
                            </div>                                        
                        </div>

                        <div id="EquipmentInfoGroup">
                            <div>
                                <h6><?php echo lang('Equipment Info');?></h6>
                            </div>
                            <hr>
                            <div class='clearfix form-group row' id='EquipmentInfoPanel'>  
                            </div>
                        </div>

                        <div id="TruckInfoGroup">
                            <div>
                                <h6><?php echo lang('Truck Info');?></h6>
                            </div>
                            <hr>
                            <div class='clearfix form-group row' id='TruckInfoPanel'>  
                            </div>
                        </div>
                    </div>
                </div>    
                
                <div id="AdditionalInfoPanel" style='display:none;'>
                    <!-- <div class='row'>
                        <div class='col-lg-3'>
                            
                        </div>
                    </div> -->

                    <div class='row clearfix'>
                        <div class='col-12' style='width:100%'>
                            <table class="table table-hover table-custom spacing8">
                                <thead>
                                    <tr>
                                        <th class="w60">#</th>
                                        <th style='width: 250px;'><?php echo lang('Photo');?></th>
                                        <th><?php echo lang('Item Info');?></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th style='width : 150px;'><?php echo lang('Total');?></th>
                                    </tr>
                                </thead>
                                <tbody id='addtionalInfoPanelBody'>                                
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class='row clearfix'>
                        <div class='col-lg-9'></div>
                        <div class='col-lg-3 col-md-6 pull-right' style='padding-right: 0px;'>
                            <div class='card'>
                                <div class='body'>
                                    <table class="table spacing8">                                    
                                        <tbody>     
                                            <tr>
                                                <td><?php echo lang('Sub Total');?></td>  
                                                <td><span id='subTotal'>25,000</span> USD</td>  
                                            </tr>
                                            <tr>
                                                <td><?php echo lang('Tax Rate');?></td>  
                                                <td>
                                                    <select class="form-control" id="taxRate">                                            
                                                        <option value="0">0%</option>
                                                        <option value="1">1%</option>
                                                        <option value="2">2%</option>
                                                        <option value="3">3%</option>
                                                        <option value="4">4%</option>
                                                        <option value="5">5%</option>
                                                        <option value="6">6%</option>
                                                        <option value="7">7%</option>
                                                        <option value="8">8%</option>
                                                        <option value="9">9%</option>
                                                        <option value="10">10%</option>
                                                        <option value="11">11%</option>
                                                        <option value="12">12%</option>
                                                        <option value="13">13%</option>
                                                        <option value="14">14%</option>
                                                        <option value="15">15%</option>
                                                        <option value="16">16%</option>
                                                    </select>
                                                </td>  
                                            </tr>
                                            <tr>
                                                <td><?php echo lang('Tax Amount');?></td>  
                                                <td><span id='taxAmount'>1,500</span> USD</td>                                                  
                                            </tr>
                                            <tr>
                                                <td><?php echo lang('Total');?></td>  
                                                <td><span id='totalAmount'>26,500</span> USD</td>  
                                            </tr>
                                        </tbody>
                                    </table>                                    
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>

                <div id="PreviewPanel" style='display:none;'>
                    <div class='pdf-content'>
                        <div class='table-pdf' style='display:flex; justify-content:center; padding: 36px;'>
                            <div class='SaleDocument' id='SaleDocument' style='left: 0px; position: relative; z-index: 0; display:block;'>
                                <div class='header'>
                                    <div class='logo'>
                                        <img src="<?php echo base_url('assets/images/icon/pdf_logo.png');?>">                            
                                    </div>
                                    <div class='detail'>
                                        <div class='title'>
                                            <p>Cotización DE <span style='color:#FF8000;' id='deal_type'>Fabricación</span></p>
                                        </div>
                                        <div class='info'>
                                            <div class='date'>
                                                <div class='title'><p>Fecha</p></div>
                                                <div class='content'><p id='SaleDate'>2020-11-11</p></div>
                                            </div>                                            
                                        </div>
                                    </div>
                                </div>
                                <div class='client-info'>
                                    <div class='title'><p>CLIENTE</p></div>
                                    <div class='content' id='client-content'>
                                        <ul>
                                            <li>Manuel Ramirez Jumara</li>
                                        </ul>  
                                    </div>
                                </div>
                                <div class='equipment-info'>
                                    <div class='title'><p>EQUIPO</p></div>
                                    <div class='content'>    
                                        <div class='portfolio' id='portfolio'>
                                            <div class="photo-cell" style="background-image: url(<?php echo base_url('assets/images/thumbImages/auctions1578241216.jpg');?>)">
                                                <img  class="auction-photo" src="<?php echo base_url('assets/images/thumbImages/auctions1578241216.jpg');?>" >           
                                            </div>
                                        </div>
                                        <div>                
                                            <div id='equipment-content'>
                                                <ul>
                                                </ul>
                                            </div>                
                                            <div class='observation'>
                                                <p>observaciones</p>                                    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class='deal-info'>
                                    <div class='title'><p>TRATO</p></div>
                                    <div class='content'>
                                        <div id='deal-content'>
                                            <ul>        
                                                <li>Price: 27,000 USD</li>
                                            </ul>
                                        </div>
                                        <div class='total-price'>
                                            <p>Total<span id='total-price' style='margin-left: 8px;'>35,100 USD</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class='signature'>
                                    <div class='sales-rep'>
                                        <div class='sign' id='sale-rep-sign'></div>
                                        <div class='name'><p>VENDEDOR</p></div>
                                    </div>
                                    <div class='customer'>
                                        <div class='sign'></div>
                                        <div class='name'><p>RECIBIDO</p></div>
                                    </div>
                                </div>
                                <div class='footer'>
                                    <p>COPYRIGHT © MAQUINARIA JR. DERECHOS RESERVADOS. MARCAS Y DISTINTIVOS PERTENECEN A SUS RESPECTIVAS MARCAS PROPIETARIAS.</p>
                                    <p id='salesrep_desc'>david nombre2 apellido1 apellido2 / OFICINA: (653) 518 7333 / WHATSAPP: (653) 518 7333 / CORREO: david@maquinariajr.com.mx / UBICACION: MAPS</p>                                    
                                </div>
                                <div class='line'></div>
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
        var lang = '<?php echo $Lang;?>';
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
    <script src="<?php echo base_url('assets/js/pages/proposal.js'); ?>?<?php echo time(); ?>"></script>

</body>

</html>