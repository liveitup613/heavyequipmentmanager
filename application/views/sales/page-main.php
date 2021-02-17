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
    <meta name="keywords" content="admin template, Oculux admin template, dashboard template, flat admin template, responsive admin template, web app, Light Dark version">
    <meta name="author" content="GetBootstrap, design by: puffintheme.com">

    <link rel="icon" type="image/png" href="/favicon.png"/>
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Bebas Neue">    
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
    <link rel="stylesheet" href="<?php echo base_url('assets/css/sale-management.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/deposit-document.css'); ?>?<?php echo time(); ?>">

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
                                <li  class='active'><a href="<?php echo base_url('Sales'); ?>"><?php echo lang('Sales');?></a></li>
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

        <div id="main-content">
            <div class="container-fluid truck-table-container">
                <div class="block-header">
                    <div class="row clearfix">
                        <div class="col-12">
                            <h1><?php echo lang('Sales');?></h1>
                        </div>
                    </div>
                </div>          

                <input type="hidden" id="edit-item-id" name="ID" value="">          

                <div class="modal fade" id="DealModal" tabindex="-1" role="dialog" aria-labelledby="InfoTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="InfoTitle"><?php echo lang('Deal');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>                                                                                                      
                                    <div class="form-group">
                                        <label><?php echo lang('Deal Type');?></label>
                                        <select class="form-control" id="inputDealType">                                            
                                            <option value='Auction'><?php echo lang('Auction');?></option>
                                            <option value='Inventory'><?php echo lang('Inventory');?></option>
                                            <option value='Supplier'><?php echo lang('Supplier');?></option>
                                            <option value='Consignment'><?php echo lang('Consignment');?></option>
                                            <option value='Manufacturing'><?php echo lang('Manufacturing');?></option>
                                            <option value='Logistics'><?php echo lang('Logistics');?></option>
                                        </select>
                                    </div>                       
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                                <button type="button" class="btn btn-round btn-default" id='btnSelectDeal'><?php echo lang('Select Deal');?></button>
                            </div>
                        </div>
                    </div>
                </div>  

                <div class="modal fade" id="ManufacturingModal" tabindex="-1" role="dialog" aria-labelledby="ManufacturingTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ManufacturingTitle"><?php echo lang('Manufacturing');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>                                                                                                      
                                    <div class="form-group">
                                        <label><?php echo lang('Equipment Category');?></label>
                                        <select class="form-control" id="ManuEqCategory">                                            
                                            <option value='Dump Truck'><?php echo lang('Dump Truck');?></option>
                                            <option value='Water Truck'><?php echo lang('Water Truck');?></option>
                                        </select>
                                    </div>                       
                                    <div id='ManuDumpTruckPanel'>
                                        <div class='form-group'>
                                            <label><?php echo lang('Capacity');?></label>
                                            <select class="form-control" id="ManuDumpTruckCapacity">                                            
                                                <option value='7'>7</option>
                                                <option value='14'>14</option>
                                            </select>
                                        </div>
                                    </div> 
                                    <div id='ManuWaterTruckPanel'>
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
                                    <div class="form-group">
                                        <label><?php echo lang('Truck Make');?></label>
                                        <input id="ManuTruckMake" class="form-control" type='text'>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang('Truck Model');?></label>
                                        <input id="ManuTruckModel" class="form-control" type='text'>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang('Truck Year');?></label>
                                        <input id="ManuTruckYear" class="form-control" type='number'>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang('Truck Engine');?></label>
                                        <input id="ManuTruckEngine" class="form-control" type='text'>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang('Truck Transmission');?></label>
                                        <input id="ManuTruckTransmission" class="form-control" type='text'>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                                <button type="button" class="btn btn-round btn-default" id='btnManuSave'><?php echo lang('Select Deal');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="EditPriceModal" tabindex="-1" role="dialog" aria-labelledby="InfoTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="InfoTitle"><?php echo lang('Edit Price');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>                            
                                    <div class='row'>                                                                                                              
                                        <div class="form-group col-lg-6 PriceInputBox">
                                            <label><?php echo lang('Price');?></label>
                                            <input class="form-control" id="Price" type='number' onchange="CalculateForEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                        </div>                       
                                        <div class="form-group col-lg-6 BuyerPremiumInputBox">
                                            <label><?php echo lang("Buyer's Premium Amount");?></label>
                                            <input class="form-control" id="BuyPremium" type='number' onchange="CalculateForEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                        </div>                  
                                        <div class="form-group col-lg-6 ShippingInputBox">
                                            <label><?php echo lang('Shipping');?></label>
                                            <input class="form-control" id="Shipping" type='number' onchange="CalculateForEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                        </div>                  
                                        <div class="form-group col-lg-6 CustomsInputBox">
                                            <label><?php echo lang('Customs');?></label>
                                            <input class="form-control" id="Customs" type='number' onchange="CalculateForEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                        </div>                  
                                        <div class="form-group col-lg-6 CommInputBox">
                                            <label><?php echo lang('Comm');?></label>
                                            <input class="form-control" id="Comm" type='number' onchange="CalculateForEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                        </div>                  
                                        <div class="form-group col-lg-6 DiscountInputBox">
                                            <label><?php echo lang('Discount');?></label>
                                            <input class="form-control" id="Discount" type='number' onchange="CalculateForEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                        </div>     
                                        <div class="from-group col-lg-6">
                                            <label><?php echo lang('Additoinal Charge');?></label>
                                            <input class='form-control' id="Additional" type='number' onchange='CalculateForEdit();'  onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                        </div>
                                    </div>  
                                    <hr>    
                                    <div class='row'>
                                        <div class='form-group col-lg-6'>
                                            <label><?php echo lang('Tax Rate');?></label>
                                            <select class="form-control" id="TaxRate" onchange="CalculateForEdit();">
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
                                        </div>
                                        <div class='form-group col-lg-6'>
                                            <label><?php echo lang('Tax Amount');?></label><br>
                                            <label style='font-size : 16px; margin-top : 6px;'><span id='TaxAmount'>2000</span> <span class='SalesUnit'>USD<span></label>
                                        </div>
                                        <div class='form-group col-lg-6'>                                            
                                        </div>
                                        <div class='form-group col-lg-6'>
                                            <label><?php echo lang('Sub Total');?></label><br>
                                            <label style='font-size: 16px; margin-top : 6px;'><span id='SubTotal'>2000</span> <span class='SalesUnit'>USD<span></label>
                                        </div>
                                    </div>
                                    <hr>
                                    <div id='WarhousePanel'>
                                        <div class='row'>                                        
                                            <div class="form-group col-lg-6">
                                                <label><?php echo lang('Shop');?></label>
                                                <input class="form-control" id="Shop" type='number' onchange="CalculateForEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                            </div>                  
                                            <div class="form-group col-lg-6">
                                                <label><?php echo lang('Extras');?></label>
                                                <input class="form-control" id="Extras" type='number' onchange="CalculateForEdit();" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                                            </div>                                            
                                        </div>
                                        <hr>
                                    </div>  
                                    
                                    <div class='row'>
                                        <div class="form-group col-lg-6">
                                            <label><?php echo lang('Total');?></label>                                            
                                        </div>                  
                                        <div class="form-group col-lg-6">
                                            <label style='font-size : 18px;'><span id='Total'>3000</span> <span class='SalesUnit'>USD<span></label>
                                        </div> 
                                    </div>                                     
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                                <button type="button" class="btn btn-round btn-default" id='btnEditPrice'><?php echo lang('Edit');?></button>
                            </div>
                        </div>
                    </div>
                </div>     

                <div class="modal fade" id="CloseModal" tabindex="-1" role="dialog" aria-labelledby="CloseTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="CloseTitle"><?php echo lang('Close Sale');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='CloseForm'>         
                                    <input type="hidden" id="CloseID" name = "ID">
                                    <input type='hidden' id="CloseNoteEdited" name = 'Note'>
                                    <div class="form-group">
                                        <label><?php echo lang('Notes');?></label>
                                        <textarea class="form-control" id="CloseNote" rows='5' col='30'></textarea>
                                    </div>                                                       
                                    <div class='form-group'>
                                        <label><?php echo lang('Receipt Upload');?></label>
                                        <div>                                        
                                            <input type='file' name='CloseAttach' id="CloseAttach">                                            
                                        </div>
                                    </div> 
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnCloseSale"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="DealInfoModal" tabindex="-1" role="dialog" aria-labelledby="DealInfoTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="DealInfoTitle"><?php echo lang('Deal Info');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                               <div id='DealInfoContent' style='padding-left : 32px; font-size : 16px;'>
                               </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="BuyingInfoModal" tabindex="-1" role="dialog" aria-labelledby="BuyingInfoTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="BuyingInfoTitle"><?php echo lang('Buying Infomation');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>                            
                            <div class="modal-body text-left">
                                <form id='contactForm'>         
                                    <div class='form-group Buying-Info'>
                                        <label><?php echo lang('Buying Price');?></label>
                                        <input type='number' class='form-control' id='BuyingAmount'>
                                    </div>                                           
                                    <div class='from-group Buying-Info'>
                                        <label><?php echo lang('Buyer');?></label>
                                        <select class='form-control' id='BuyingUser'>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnSaveBuyingInfo"><?php echo lang('Update');?></button>
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
                                        <input type='hidden' name='SalesID' id='SalesID'>
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

                <div class="modal fade " id="deleteDepositModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
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
                                    Delete Deposit?
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('NO');?></button>
                                <button type="button" class="btn btn-round btn-primary" onclick="deleteDepositComfired()"><?php echo lang('YES');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="IncentiveModal" tabindex="-1" role="dialog" aria-labelledby="IncentiveTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="IncentiveTitle"><?php echo lang('Incentive');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>                            
                            <div class="modal-body text-left" style='padding-left: 60px;'>
                                <form id='contactForm'>         
                                    <div class='form-group'>
                                        <span class='item-info-index'><?php echo lang('Sales Total');?>: </span>         
                                        <span class='item-info-content' id='IncentiveTotal'>5,000 usd</span>                               
                                    </div>
                                    <div class='form-group'>
                                        <span class='item-info-index'><?php echo lang('Price');?>: </span>         
                                        <span class='item-info-content' id='IncentivePrice'>5,000 usd</span>                               
                                    </div>
                                    <div class='form-group'>
                                        <span class='item-info-index'><?php echo lang('Margin');?>: </span>         
                                        <span class='item-info-content' id='IncentiveMargin'>5,000 usd</span>                               
                                    </div>
                                    <div class='form-group'>
                                        <span class='item-info-index'><?php echo lang('Discount');?>: </span>         
                                        <span class='item-info-content' id='IncentiveDiscount'>5,000 usd</span>                               
                                    </div>
                                    <div class='form-group'>
                                        <span class='item-info-index'><?php echo lang('Buying Price');?>: </span>         
                                        <span class='item-info-content' id='IncentiveBuyingPrice'>5,000 usd</span>                               
                                    </div>
                                    <div class='form-group'>
                                        <span class='item-info-index'><?php echo lang('Buyer');?>: </span>         
                                        <span class='item-info-content' id='IncentiveBuyer'>5,000 usd</span>
                                    </div>                                         
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnContact"><?php echo lang('Save');?></button>
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
                                    <input type='hidden' name="ID" id='DepositSalesID'>
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
                                            <option value="MXN">MXN</option>
                                            <option value="USD">USD</option>                                            
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
                                            <option value="MXN">MXN</option>
                                            <option value="USD">USD</option>                                            
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

                <div class="modal fade" id="LogModal" tabindex="-1" role="dialog" aria-labelledby="LogTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="LogTitle"><?php echo lang('Sales Log');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form>         
                                    <div class="form-group" id='LogPanel'>
                                    </div>                
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Close');?></button>
                            </div>
                        </div>
                    </div>
                </div> 

                <div class="modal fade" id="DealStatusModal" tabindex="-1" role="dialog" aria-labelledby="DealStatusTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="DealStatusTitle"><?php echo lang('Change Deal Status');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>                            
                            <div class="modal-body text-left">
                                <form id='contactForm'>                                             
                                    <div class='form-group'>
                                        <label><?php echo lang('Deal Status');?></label>
                                        <select class="form-control" id="DealStatus" onchange="CalculateForEdit();">
                                            <option value="Pending"><?php echo lang('Pending');?></option>
                                            <option value="Shipping"><?php echo lang('Shipping');?></option>
                                            <option value="Customs"><?php echo lang('Customs');?></option>
                                            <option value="Shop"><?php echo lang('Shop');?></option>
                                            <option value="Ready"><?php echo lang('Ready');?></option>                                    
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label><?php echo lang('Notes');?></label>
                                        <textarea class="form-control" id="DealStatusNote" rows='5' col='30'></textarea>
                                    </div>            
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnChangeDealStatus"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="CancelModal" tabindex="-1" role="dialog" aria-labelledby="CancelTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="CancelTitle"><?php echo lang('Cancel Sale');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='CancelForm'>                                             
                                    <div class="form-group">
                                        <label><?php echo lang('Return Amount');?></label>
                                        <input class='form-control' id='ReturnAmount' type='tel'>
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

                <div class="modal fade" id="ChangeSalesRepModal" tabindex="-1" role="dialog" aria-labelledby="ChangeSalesRepTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ChangeSalesRepTitle"><?php echo lang('Change Sales Rep');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='CancelForm'>                                             
                                    <div class="form-group">
                                        <label><?php echo lang('Sales Rep');?></label>
                                        <select id='SalesRep' class='form-control'></select>
                                    </div> 
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnChangeSalesRep"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="DocumentPrintModal" tabindex="-1" role="dialog" aria-labelledby="DocumentPrintTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="DocumentPrintTitle"><?php echo lang('Select Document Type');?></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id='CancelForm'>                                             
                                    <div class="form-group">
                                        <label><?php echo lang('Type');?></label>
                                        <select id='DocumentType' class='form-control'>
                                            <option value='sale'><?php echo lang('Sales Document');?></option>
                                            <option value='deposit'><?php echo lang('Deposit Document');?></option>
                                        </select>
                                    </div> 
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnDocumentPrint"><?php echo lang('Print');?></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="invoiceModal" tabindex="-1" role="dialog" aria-labelledby="InvoiceTitle" aria-hidden="true">
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
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal"><?php echo lang('Cancel');?></button>
                                <button type="button" class="btn btn-round btn-primary" id="btnUpdateInvoice"><?php echo lang('Save');?></button>
                            </div>
                        </div>
                    </div>
                </div>    

                <div class='SaleDocument' id='SaleDocument'>
                    <div class='header'>
                        <div class='logo'>
                            <img src="<?php echo base_url('assets/images/icon/pdf_logo.png');?>">                            
                        </div>
                        <div class='detail'>
                            <div class='title'>
                                <p>VENTA DE <span style='color:#FF8000;' id='deal_type'>Fabricación</span></p>
                            </div>
                            <div class='info'>
                                <div class='date'>
                                    <div class='title'><p>Fecha</p></div>
                                    <div class='content'><p id='SaleDate'>2020-11-11</p></div>
                                </div>
                                <div class='sale-code'>
                                    <div class='title'><p>cÓdigo</p></div>
                                    <div class='content'><p id='SaleCode'>MHV000208</p></div>
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
                        <p>COPYRIGHT © Machinery Hunters. DERECHOS RESERVADOS. MARCAS Y DISTINTIVOS PERTENECEN A SUS RESPECTIVAS MARCAS PROPIETARIAS.</p>
                        <p id='salesrep_desc'>david nombre2 apellido1 apellido2 / OFICINA: (653) 518 7333 / WHATSAPP: (653) 518 7333 / CORREO: david@maquinariajr.com.mx / UBICACION: MAPS</p>                        
                    </div>
                    <div class='line'></div>
                </div>

                <div class='DepositDocument' id='DepositDocument'>
                    <div class='header'>
                        <div class='logo'>
                            <img src="<?php echo base_url('assets/images/icon/pdf_logo.png');?>">                            
                        </div>
                        <div class='detail'>
                            <div class='title'>
                                <p>estado de <span style='color:#FF8000;'>cuenta</span></p>
                            </div>
                            <div class='info'>
                                <div class='date'>
                                    <div class='title'><p>Fecha</p></div>
                                    <div class='content'><p id='deposit_SaleDate'>2020-11-11</p></div>
                                </div>
                                <div class='sale-code'>
                                    <div class='title'><p>cÓdigo</p></div>
                                    <div class='content'><p id='deposit_SaleCode'>MHV000208</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='info-panel'>
                        <div class='tile client'>
                            <div class='title'><p>CLIENTE</p></div>
                            <div class='content'>
                                <ul id='deposit_client_content'>
                                    <li>Nombre: Nombre 1 Nombre 2 Apellido 1 Apellido 2</li>
                                    <li>ElefonoL 4235234234</li>
                                    <li>E-mail: correo.correo@correocorreo.com</li>
                                    <li>empresa: Empresa emprea SA de CV</li>
                                    <li>RFC: RFCA021213ASC</li>
                                    <li>Opcional 1: consenctetur adipiscing elit</li>
                                    <li>Opcional 2: Lorem ipsum dolor sit amet</li>
                                    <li>Opcional 3: consectetur adipiscing elit</li>
                                </ul>
                            </div>
                        </div>
                        <div class='tile equip'>
                            <div class='title'><p>EQUIPO</p></div>
                            <div class='content'>
                                <ul id='deposit_equip_conent'>
                                    <li>Category: Categoria categoria</li>
                                    <li>Ano: 1980</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class='info-panel deposit'>
                        <div class='title'><p>historial de depositos</p></div>
                        <div class='content'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fecha de depósito</th>                                        
                                        <th>Cantidad</th>
                                        <th>Moneda</th>
                                        <th>Tipo de cambio</th>
                                        <th>Monto convertido</th>
                                        <th class='concept'>Concepto</th>
                                    </tr>
                                </thead>
                                <tbody id='deposit_history_content'>                                                                
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class='info-panel'>
                        <div class='tile deal'>
                            <div class='title'><p>TRATO</p></div>
                            <div class='content'>
                                <ul id='deposit_deal_content'>
                                    <li>Precio: 19,500 USD</li>
                                    <li>Importacion: 4,500 USD</li>
                                    <li>Flete: 4,000 USD</li>
                                    <li>Subasta: 10,000 USD</li>
                                    <li>Comission: 2,500 USD</li>
                                    <li>Sub Total: 28,7000 USD</li>
                                    <li>Subasta: 10,000 USD</li>
                                    <li>Comission: 2,500 USD</li>
                                    <li>Sub Total: 28,7000 USD</li>
                                    <li>IVA: 0%</li>
                                    <li>IVA en Cantidad: 0 USD</li>
                                </ul>
                            </div>
                        </div>
                        <div class='tile price'>
                            <div class='content'>
                                <p><span class='name'>Total</span><span id='deposit_total-price' style='margin-left: 16px;'>35,100 USD</span></p>
                                <p><span class='name'>depósitos</span><span id='total-deposit' style='margin-left: 16px;'>15,100 USD</span></p>
                                <p><span class='name'>restante</span><span id='deposit_remaining' style='margin-left: 16px;'>20,000 USD</span></p>
                            </div>
                        </div>
                    </div>                   
                    <div class='footer'>
                        <p>COPYRIGHT © Machinery Hunters. DERECHOS RESERVADOS. MARCAS Y DISTINTIVOS PERTENECEN A SUS RESPECTIVAS MARCAS PROPIETARIAS.</p>
                        <p id='deposit_salesrep_desc'>david nombre2 apellido1 apellido2 / OFICINA: (653) 518 7333 / WHATSAPP: (653) 518 7333 / CORREO: david@maquinariajr.com.mx / UBICACION: MAPS</p>                        
                    </div>
                    <div class='line'></div>
                </div>

                <div class='row clearfix'>
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 160px;'>
                                <h6 class="mb-4"><i class="icon-basket"></i> <?php 
                                    date_default_timezone_set('America/Phoenix');
                                    $month = date('F');           
                                    if ($Lang == 'english')
                                        echo lang($month) . ' ' . lang('Sales');
                                    else if ($Lang == 'spanish')
                                        echo lang('Sales') . ' ' . lang($month);
                                ?></h6>
                                <div class="card-value text-success float-left mr-3 pr-2 border-right" id='SalesCountForMonth'>0</div>                                
                                <div class="font-12"><?php echo lang('Today');?> <span class="float-right" id='SalesCountForToday'>0</span></div>                                
                            </div>
                        </div>
                    </div>   
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 160px;'>
                                <h6 class="mb-4"><i class="icon-basket"></i> <?php echo lang('Ready Status Sales');?></h6>
                                <div class="card-value text-default float-left mr-3 pr-2 border-right" id='ReadyStatusSalesCount'>0</div>
                                <div class="font-12"><?php echo lang('Remaining');?> <span class="float-right" id='USDRemainingAmount'>0 USD</span></div>
                                <div class="font-12"><?php echo lang('Remaining');?> <span class="float-right" id='MXNRemainingAmount'>0 MXN</span></div>                                
                            </div>
                        </div>
                    </div>                         
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 160px;'>
                                <h6 class="mb-4"><i class="icon-basket"></i> <?php echo lang('Active Status Sales');?></h6>
                                <div class="card-value text-info float-left mr-3 pr-2 border-right" id='ActiveSalesCount' style='height: 80px;'>0</div>
                                <div class="font-12"><?php echo lang('Pending');?> <span class="float-right" id='PendingSalesCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Shipping');?> <span class="float-right" id='ShippingSalesCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Customs');?> <span class="float-right" id='CustomsSalesCount'>0</span></div>
                                <div class="font-12"><?php echo lang('Shop');?> <span class="float-right" id='ShopSalesCount'>0</span></div>
                            </div>
                        </div>
                    </div> 
                    <div class="col-3">
                        <div class="card">
                            <div class="body" style='height: 160px; display:flex;'>
                                <div class="d-flex align-items-center">
                                    <div class="icon-in-bg text-white rounded-circle" style='background: #dc3545;'><i
                                            class="icon-basket"></i></div>
                                    <div class="ml-4">
                                        <span><?php echo lang('No Deal Sales');?></span>
                                        <h4 class="mb-0 font-weight-medium" id='NoDealSalesCount'>0</h4>
                                    </div>
                                </div>
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
                                        <div class='filter-status' style='width : 250px'>
                                            <span><?php echo lang('Status');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputStatus' onchange="refreshDatatable();">                                                   
                                                <option value='Open'><?php echo lang('Open');?></option>
                                                <option value='Closed'><?php echo lang('Closed');?></option>                                                
                                            </select>
                                        </div>  

                                        <div class='filter-status' style='width : 290px'>
                                            <span><?php echo lang('Deal Status');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputDealStatus' onchange="refreshDatatable();">
                                                <option value='All'><?php echo lang('All');?></option>                                                
                                                <option value='Pending'><?php echo lang('Pending');?></option>
                                                <option value='Shipping'><?php echo lang('Shipping');?></option>
                                                <option value='Customs'><?php echo lang('Customs');?></option>
                                                <option value='Shop'><?php echo lang('Shop');?></option>
                                                <option value='Ready'><?php echo lang('Ready');?></option>
                                                <option value='Canceled'><?php echo lang('Canceled');?></option>
                                                <option value='Closed'><?php echo lang('Closed');?></option>
                                            </select>
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

                                        <div class="endDate-filter" style="width: 350px;">
                                            <span><?php echo lang('Start Date');?>:</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="minStartDateInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="maxStartDateInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
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
                                <div style="display: flex; justify-content: center; align-items: center; margin-top : 16px;">
                                    <div style="display: flex; flex-grow: 1;">
                                        <div class='filter-status' style='width : 280px'>
                                            <span><?php echo lang('Sales Rep');?>: </span>
                                            <select style='width: 150px;' class='custom-select' id='inputSalesRep' onchange="selectSalesRep();">
                                                <option value='All'>All</option>      
                                            </select>
                                        </div>  
                                        <div class="endDate-filter" style="width: 320px;">
                                            <span><?php echo lang('Total');?>:</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input id="minPriceInput" type='number'
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input id="maxPriceInput" type='number'
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                        </div>
                                        <div class="endDate-filter" style="width: 350px;">
                                            <span><?php echo lang('Remaining');?>:</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input id="minRemainingInput" type='number'
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
                                            </div>
                                            <span>~</span>
                                            <div class="input-group" style="width: 110px;">
                                                <input id="maxRemainingInput" type='number'
                                                    class="form-control" onkeyup="checkEnterkey(event)" value="">
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

                <div id="DealsPanel" style='display:none;'>
                    <div class='row clearfix'>
                        <button class='btn btn-primary btn-round' style='width: 120px;' id='btnBack' style='display:none;'><?php echo lang('BACK');?></button>        
                    </div>
                    <div class="row clearfix" style='margin-bottom: 1em;'>
                        <div class="col-12" style="width: 100%; text-align: center; position:relative;">
                            <ul id="progressbar">
                                <li class='active' id='stepChooseItem' style='width: 50%;'><?php echo lang('Choose Deal');?></li>
                                <li id='stepTaxInfo' style='width: 50%;'><?php echo lang('Prices');?></li>
                            </ul>
                        </div> 
                        <div class='col-lg-6' style='padding-left : 0px;'>
                            <button class='btn btn-default btn-round' style='width: 120px;' id='btnStepPrev' style='display:none;'><?php echo lang('Prev');?></button>
                        </div>   
                        <div class='col-lg-6'>
                        <button class='btn btn-default btn-round pull-right' style='width: 120px;' id='btnComplete' style='display:none;'><?php echo lang('Complete');?></button>
                        </div>                   
                    </div>

                    <div id='ItemSelectionPanel'>
                        <div class="row clearfix">                            
                            <div class="col-12" style="width: 100%;">
                                <div class="card">
                                    <div class="form-group body">
                                        <label><?php echo lang('Equipment Category');?></label>
                                        <div class="input-group mb-3" style='width: 40%;'>
                                            <select class="custom-select" id="inputEqCategory" name="EqCategory" onchange="onChangeCategory()">
                                                <option value="All Equipments"><?php echo lang('All Equipment');?></option>                                        
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row clearfix">
                            <div class="col-12" style="width: 100%;">
                                <div class="card">
                                    <div class="body">
                                        <div style="display: flex; justify-content: center; align-items: center;">                                    
                                            <div style="display: flex; flex-grow: 1;">
                                                <div class="auction-search-group" style="width: 230px;">
                                                    <span><?php echo lang('Year');?>:</span>
                                                    <div class="input-group" style="width: 80px;">
                                                        <input type="number" id="minYearInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                                    </div>
                                                    <span>~</span>
                                                    <div class="input-group" style="width: 80px;">
                                                        <input type="number" id="maxYearInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                                    </div>
                                                </div>

                                                <div class=" auction-search-group" style="width: 230px;">
                                                    <span><?php echo lang('Total');?>:</span>
                                                    <div class="input-group " style="width: 80px;">
                                                        <input type="number" id="minTotalInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                                    </div>
                                                    <span>~</span>
                                                    <div class="input-group " style="width: 80px;">
                                                        <input type="number" id="maxTotalInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="*">
                                                    </div>
                                                </div>

                                                <div class="endDate-filter" style="width: 360px;">
                                                    <span><?php echo lang('End Date');?>:</span>
                                                    <div class="input-group" style="width: 110px;">
                                                        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="minAucYearInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                                    </div>
                                                    <span>~</span>
                                                    <div class="input-group" style="width: 110px;">
                                                        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" id="maxAucYearInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                                    </div>
                                                </div>

                                                <div class="lift-capacity" style="width: 250px;">
                                                    <span><?php echo lang('Capacity');?>:</span>
                                                    <div class="input-group " style="width: 80px;">
                                                        <input type="number" id="minLiftCapacity" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="">
                                                    </div>
                                                    <span>~</span>
                                                    <div class="input-group " style="width: 80px;">
                                                        <input type="number" id="maxLiftCapacity" class="form-control" onkeyup="checkEnterkeyforDeal(event)" value="*">
                                                    </div>
                                                </div>
                                            </div>

                                            <div style="width: 285px; display:flex; justify-content:space-between; align-items: center;">
                                                <div style="width: 180px; display: inline-block; ">
                                                    <input type="text" id="searchDealInput" class="form-control" onkeyup="checkEnterkeyforDeal(event)" placeholder="<?php echo lang('Enter Search Text');?>">
                                                </div>
                                                <button class="btn btn-sm btn-primary " id="dealSearchBtn" style="width: 100px;"><?php echo lang('SearchButton');?></button>
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
                    </div>    
                    
                    <div id="AdditionalInfoPanel" style='display:none;'>

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
                                                    <td><?php echo lang('Currency');?></td>                                                    
                                                    <td>
                                                        <select class="form-control" id="SalesCurrency">                                            
                                                            <option value='USD'>USD</option>
                                                            <option value='MXN'>MXN</option>                                                            
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><?php echo lang('Sub Total');?></td>  
                                                    <td><span id='subTotal'>25,000</span> <span class="SalesCurrency"></span></td>  
                                                </tr>
                                                <tr>
                                                    <td><?php echo lang('Tax Rate');?></td>  
                                                    <td>
                                                        <select class="form-control" id="taxRate">                                            
                                                            <option value='16'>16 %</option>
                                                            <option value='8'>8 %</option>
                                                            <option value='0'>0 %</option>
                                                        </select>
                                                    </td>  
                                                </tr>
                                                <tr>
                                                    <td><?php echo lang('Tax Amount');?></td>  
                                                    <td><span id='taxAmount'>1,500</span> <span class="SalesCurrency"></span></td>                                                  
                                                </tr>
                                                <tr>
                                                    <td><?php echo lang('Total');?></td>  
                                                    <td><span id='totalAmount'>26,500</span> <span class="SalesCurrency"></span></td>  
                                                </tr>
                                            </tbody>
                                        </table>                                    
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

    <script src="<?php echo base_url('assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/toastr.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/session_timer.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/config.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/localization.js'); ?>?<?php echo time(); ?>"></script>    
    <script src="<?php echo base_url('assets/js/pages/sales/sales-management.js'); ?>?<?php echo time(); ?>"></script>

</body>

</html>