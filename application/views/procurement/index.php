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
    <link rel="stylesheet" href="<?php echo base_url('assets/css/procurement.css'); ?>?<?php echo time(); ?>">

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
                        <input type="hidden" id="accounting" value="<?php echo $ACCOUNTING; ?>" />
                    </div>
                </div>

                <nav id="left-sidebar-nav" class="sidebar-nav">
                    <ul id="main-menu" class="metismenu">
                        <?php if ($PERMISSION == 'admin') { ?>
                        <li>
                            <a href="<?php echo base_url('Home');?>"><i
                                    class='icon-home'></i><span><?php echo lang('Home');?></span></a>
                            <?php }?>
                        <li class='open active'>
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
                                <li class='active'><a
                                        href="<?php echo base_url('Procurement'); ?>"><?php echo lang('Procurement');?></a>
                                </li>
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

                        <li class=''>
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
                                <li><a
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
                            <h1><?php echo lang('Procurement');?></h1>
                        </div>
                    </div>
                </div>

                <input type="hidden" id="edit-item-id" name="ID" value="">   

                <div class="modal fade" id="PricingInfoModal" tabindex="-1" role="dialog" aria-labelledby="PricingInfoModalTitle" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="PricingInfoModalTitle"><?php echo lang('Pricing Info');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='PrincingInfoFrom'>
                                    <div class='row'>
                                        <div class="form-group col-lg-12">
                                            <label><?php echo lang('Original Price');?></label>
                                            <input type='number' id='OriginalPrice' name='OriginalPrice' class='form-control'>
                                        </div>
                                        <div class='form-group col-lg-12'>
                                            <label><?php echo lang('Currency');?></label>
                                            <select id='Currency' class='form-control'>
                                                <option value='USD'>USD</option>
                                                <option value='MXN'>MXN</option>
                                            </select>
                                        </div>   
                                        <div class='form-group col-lg-12'>
                                            <label><?php echo lang('Buying Price');?></label>
                                            <input type='number' id='BuyingPrice' name='BuyingPrice' class='form-control'>
                                        </div>                                        
                                        <div class='form-group col-lg-12'>
                                            <label><?php echo lang('Buyer');?></label>
                                            <select id='Buyer' name='Buyer' class='form-control'>
                                            </select>
                                        </div>
                                        <div class='form-group col-lg-12'>
                                            <label><?php echo lang('Auction Account');?></label>
                                            <input type='text' name='AuctionAccount' class='form-control' id='AuctionAccount'>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                                <button type="button" class="btn btn-round btn-default" id='btnPricingInfoSave'><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>    

                <div class="modal fade" id="DepositModal" tabindex="-1" role="dialog" aria-labelledby="DepositTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="DepositTitle"><?php echo lang('Deposit');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>                            
                            <div class="modal-body text-left">
                                <form id='DepositForm'>         
                                    <input type='hidden' name="ID" id='DepositProcurementID'>
                                    <input type='hidden' name='User' id='DepositUser'>
                                    <div class='form-group'>
                                        <label><?php echo lang('Total Deposit');?>: </label>
                                        <label id="DepositTotalDeposit" class='item-info-content'>2000 USD</label>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Sales Currency');?>: </label>
                                        <label id="DepositSalesCurrency" class='item-info-content'>USD</label>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Remaining Amount');?>: </label>
                                        <label id='DepositRemainingAmount' class='item-info-content'>1500 USD</label>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Date');?></label>
                                        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="DepositDate" class="form-control" value="" name="DatePicker">
                                        <input type='hidden' id='DepositDateInput' name='Date'>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Amount');?></label>
                                        <input id="DepositAmount" class="form-control" type='number' onchange="CalculateConvertedAmount();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" name="Amount">
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Currency');?></label>
                                        <select class="form-control" id="DepositCurrency" name="Currency">
                                            <option value="USD">USD</option>   
                                            <option value="MXN">MXN</option>         
                                        </select>
                                    </div>
                                    <div class='form-group' id='DepositExchangeRatePanel'>
                                        <label><?php echo lang('Exchange Rate');?></label>
                                        <input id="DepositExchangeRate" class="form-control" type='number' onchange="CalculateConvertedAmount();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" name="ExchangeRate">
                                    </div>    
                                    <div class='form-group' id='DepositConvertedAmountPanel'>
                                        <label><?php echo lang('Converted Amount');?></label>
                                        <input id="DepositConvertedAmount" class="form-control" type='number' name="RealAmount" readonly>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Deposit Type');?></label>
                                        <select class="form-control" id="DepositType" name='Type'>
                                            <option value="Electronic"><?php echo lang('Electronic');?></option>
                                            <option value="Cash"><?php echo lang('Cash');?></option>
                                            <option value="Bank Deposit"><?php echo lang('Bank Deposit');?></option>
                                        </select>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Concept');?></label>
                                        <input id="DepositConcept" class="form-control" type='text' name='Concept'>
                                    </div>                
                                    <div class='form-group'>
                                        <label><?php echo lang('Receipt Upload');?></label>
                                        <div>                                        
                                            <input type='file' name='DepositReceiptUpload' id="DepositReceiptUpload">                                            
                                        </div>
                                    </div>                            
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnDeposit"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>      

                <div class="modal fade" id="DepositEditModal" tabindex="-1" role="dialog" aria-labelledby="DepositEditTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="DepositTitle"><?php echo lang('Deposit');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>                            
                            <div class="modal-body text-left">
                                <form id='DepositEditForm'>         
                                    <input type='hidden' name='ID' id='DepositIDEdit'>     
                                    <input type='hidden' name='User' id='DepositUserEdit'>                    
                                    <div class='form-group'>
                                        <label><?php echo lang('Date');?></label>
                                        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="DepositDateEdit" class="form-control" value="" name="DatePicker">
                                        <input type='hidden' id='DepositDateInput' name='Date'>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Amount');?></label>
                                        <input id="DepositAmountEdit" class="form-control" type='number' onchange="CalculateConvertedAmountEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" name="Amount">
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Currency');?></label>
                                        <select class="form-control" id="DepositCurrencyEdit" name="Currency">
                                            <option value="USD">USD</option>   
                                            <option value="MXN">MXN</option>         
                                        </select>
                                    </div>
                                    <div class='form-group' id='DepositExchangeRatePanelEdit'>
                                        <label><?php echo lang('Exchange Rate');?></label>
                                        <input id="DepositExchangeRateEdit" class="form-control" type='number' onchange="CalculateConvertedAmountEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" name="ExchangeRate">
                                    </div>    
                                    <div class='form-group' id='DepositConvertedAmountPanelEdit'>
                                        <label><?php echo lang('Converted Amount');?></label>
                                        <input id="DepositConvertedAmountEdit" class="form-control" type='number' name="RealAmount">
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Deposit Type');?></label>
                                        <select class="form-control" id="DepositTypeEdit" name='Type'>
                                            <option value="Electronic"><?php echo lang('Electronic');?></option>
                                            <option value="Cash"><?php echo lang('Cash');?></option>
                                            <option value="Bank Deposit"><?php echo lang('Bank Deposit');?></option>
                                        </select>
                                    </div>
                                    <div class='form-group'>
                                        <label><?php echo lang('Concept');?></label>
                                        <input id="DepositConceptEdit" class="form-control" type='text' name='Concept'>
                                    </div>                
                                    <div class='form-group'>
                                        <label><?php echo lang('Receipt Upload');?></label>
                                        <div>                                        
                                            <input type='file' name='DepositReceiptUpload' id="DepositReceiptUploadEdit">                                            
                                        </div>
                                    </div>                            
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnDepositEdit"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>  

                <div class="modal fade" id="DepositHistoryModal" tabindex="-1" role="dialog" aria-labelledby="DepositHistoryTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="DepositHistoryTitle"><?php echo lang('Deposit History');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>                            
                            <div class="modal-body text-left">                                            
                                <div>
                                    <label><?php echo lang('Total Deposit');?>: </label>
                                    <label id="DepositTotalDepositEdit" style="font-size:18px; font-weight: bold;">2000 USD</label>
                                </div>
                                <hr>
                                <div class="navigationButtonPanel row">
                                    <div class="col-6">
                                        <button class='btn btn-default btn-round' id='DepositLogPrevBtn'><?php echo lang('Prev');?></button>
                                    </div>
                                    <div class="col-6" style='text-align: right;'>
                                        <button class='btn btn-default btn-round' id='DepositLogNextBtn'><?php echo lang('Next');?></button>
                                    </div>
                                </div>
                                <hr>
                                <div class="depositHistoryPanel" style='padding : 0px 16px;'>                                    
                                </div>                                            
                            </div>
                            <div class="modal-footer">                                
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="DocumentModal" tabindex="-1" role="dialog" aria-labelledby="DocumentModalTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="DocumentModalTitle"><?php echo lang('Documents');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>                            
                            <div class="modal-body text-left">   
                                <form id='DocumentForm'>
                                    <div class='form-group'>
                                        <label><?php echo lang('Title');?></label>
                                        <input type='hidden' name='ProcurementID' id='DocumentProcurementID'>
                                        <input class="form-control" type='text' name='DocumentTitle' id="DocumentTitle" required>
                                    </div>                
                                    <div class='form-group'>
                                        <label><?php echo lang('Attach');?></label>
                                        <div>                                        
                                            <input type='file' name='DocumentAttach' id="DocumentAttach" required>                    
                                        </div>
                                    </div>  
                                </form>   
                            
                                <div style='text-align: center;'>                               
                                    <button class='btn btn-primary btn-round' id='DocumentUpload'><i class='icon-plus'></i> Upload</button>
                                </div>      
                                <hr>    
                                <div style='text-align: center; margin-top: 16px'>
                                    <h5>Documents</h5>  
                                </div>                                                            
                                <div id="DocumentPanel" style='padding : 0px 16px; text-align: center;'> 
                                </div>                                            
                            </div>
                            <div class="modal-footer">                                
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="CancelModal" tabindex="-1" role="dialog" aria-labelledby="CancelTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="CancelTitle"><?php echo lang('Cancel Buy');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='CancelForm'>                                             
                                    <div class="form-group">
                                        <label><?php echo lang('Return Amount');?></label>
                                        <input class='form-control' id='ReturnAmount' type='number'>
                                    </div> 
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnCancelSale"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class='row clearfix'>
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 142px;'>
                                <h6 class="mb-4"><i class="icon-basket"></i> <?php echo lang('Active Buy');?></h6>
                                <div class="card-value text-success float-left mr-3 pr-2 border-right" id='ActiveBuyCount'>0</div>
                                <div class="font-12"><?php echo lang('Today');?> <span class="float-right" id='TodayActiveBuyCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Last 7 Days');?> <span class="float-right" id='LastSevenActiveBuyCount'>0</span></div>                                
                                <div class="font-12"><?php echo lang('Last 30 Days');?> <span class="float-right" id='LastThirtyActiveBuyCount'>0</span></div>                                
                            </div>
                        </div>
                    </div>                         
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 142px;'>
                                <h6 class="mb-4"><i class="icon-basket"></i> <?php echo lang('Remaining Deposits');?></h6>
                                <div class="card-value text-red float-left mr-3 pr-2 border-right" id='RemainingDepositsCount'>0</div>
                                <div class="font-12"><?php echo lang('Remaining');?> <span class="float-right" id='RemainingUSDAmount'>0</span></div>
                                <div class="font-12"><?php echo lang('Remaining');?> <span class="float-right" id='RemainingMXNAmount'>0</span></div>                                
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
                                        <div class='filter-status' style='width : 220px'>
                                            <span><?php echo lang('Status');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputStatus' onchange="refreshDatatable();">                                                   
                                                <option value='Open'><?php echo lang('Open');?></option>
                                                <option value='Closed'><?php echo lang('Closed');?></option>                                                
                                            </select>
                                        </div> 
                                        <div class="endDate-filter" style="width: 400px;">
                                            <span><?php echo lang('Date Added');?>:</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true"
                                                    data-date-format="yyyy-mm-dd" id="minStartDateInput"
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true"
                                                    data-date-format="yyyy-mm-dd" id="maxStartDateInput"
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                        </div>
                                        <div class="endDate-filter" style="width: 260px;">
                                            <span><?php echo lang('Price');?>:</span>
                                            <div class="input-group" style="width: 80px;">
                                                <input id="minPriceInput" type='number'
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 80px;">
                                                <input id="maxPriceInput" type='number'
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                        </div>
                                        <div class="endDate-filter" style="width: 290px;">
                                            <span><?php echo lang('Remaining');?>:</span>
                                            <div class="input-group" style="width: 80px;">
                                                <input id="minRemainingInput" type='number'
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 80px;">
                                                <input id="maxRemainingInput" type='number'
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
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
                                    <div style="width: 100px; position: absolute; right: 0; top:0;">
                                        <!-- <button type="button" class="btn btn-primary btn-round mb-2"
                                            style="width : 260px;" data-toggle="modal" data-target="#AddNewCustomer"><i
                                                class="fa fa-plus"></i>
                                            <span><?php echo lang('Add New Customer');?></span></button>&nbsp; -->
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
    <script src="<?php echo base_url('assets/js/pages/procurement/index.js'); ?>?<?php echo time(); ?>">
    </script>

</body>

</html>