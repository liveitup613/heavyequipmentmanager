
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
    <!-- VENDOR CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/bootstrap/css/bootstrap.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/font-awesome/css/font-awesome.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/animate-css/vivify.min.css'); ?>?<?php echo time(); ?>">


    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/dataTables.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedcolumns.bootstrap4.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/jquery-datatable/fixedeader/dataTables.fixedheader.bootstrap4.min.css'); ?>?<?php echo time(); ?>">

    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/c3/c3.min.css'); ?>?<?php echo time(); ?>" />
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/morrisjs/morris.css'); ?>?<?php echo time(); ?>" />

    <!-- MAIN CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/site.min.css'); ?>?<?php echo time(); ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/vendor/toastr.min.css'); ?>?<?php echo time(); ?>">
    <!-- CUSTOM CSS -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/user/management.css'); ?>?<?php echo time(); ?>">
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
                <a href=""><img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="Oculux Logo" class="img-fluid logo"><span class="sidebar-logo-title">Machinery Hunters Platform</span></a>
                <button type="button" class="btn-toggle-offcanvas btn btn-sm float-right"><i class="lnr lnr-menu icon-close"></i></button>
            </div>
            <div class="sidebar-scroll">
                <div class="user-account">
                    <div class="user_div">
                        <img src="<?php echo base_url('assets/images/avatar/' . ($PROFILEPICTURE == "" ? "default.png" : $PROFILEPICTURE)); ?>" class="user-photo" alt="User Profile Picture">
                    </div>
                    <div class="dropdown">
                        <a href="javascript:void(0);" class="user-name" data-toggle="dropdown"  style="margin-top: 10px;"><strong><?php echo $FULLNAME; ?></strong></a>
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
                       
                        <li class="active open">
                            <a href="#myPage" class="has-arrow"><i class="icon-user"></i><span><?php echo lang('Users');?></span></a>
                            <ul>
                                <li class="active"><a href="<?php echo base_url('User'); ?>"><?php echo lang('Management');?></a></li>
                                <li><a href="<?php echo base_url('User/redirectToUpdatePasswordPage'); ?>"><?php echo lang('Update Profile');?></a></li>
                                <li><a href="<?php echo base_url('Worksheet');?>"><?php echo lang('Worksheet');?></a></li>

                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div id="main-content">
            <div class="container-fluid">
                <div class="block-header">
                    <div class="row clearfix">
                        <div class="col-md-6 col-sm-12">
                            <h1>User Management</h1>
                        </div>
                    </div>
                </div>
                <?php if ($PERMISSION == "admin") { ?>
                    <div class="row clearfix">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="body text-right">

                                    <button type="button" class="btn btn-primary btn-round mb-2" style="width : 160px;" data-toggle="modal" data-target="#AddNewUser"><i class="fa fa-plus"></i> <span>Add User</span></button>&nbsp;

                                    <!-- Vertically centered -->
                                </div>
                            </div>
                        </div>
                    </div>
                <?php } ?>

                <div class="modal fade" id="AddNewUser" tabindex="-1" role="dialog" aria-labelledby="AddNewUserTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="AddNewUserTitle">Add User</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id="upload-form" enctype="multipart/form-data">
                                    <div class="form-group">
                                        <div class="user-profile-img">
                                            <img src="<?php echo base_url('assets/images/avatar/default.png'); ?>" class="img-thumbnail rounded-circle" id="imgProfile">
                                            <input type="file" style="display:none" id="inputImgProfile" name="avatar">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>USERNAME</label>
                                        <input type="text" class="form-control" id="username" name="username" required>
                                    </div>
                                    <div class="form-group">
                                        <label>EMAIL</label>
                                        <input type="text" class="form-control" id="email" name="email" required>
                                    </div>
                                    <div class="form-group">
                                        <label>PHONE</label>
                                        <input type="text" class="form-control" id="phone" name="phone" required>
                                    </div>
                                    <div class="form-group">
                                        <label>NAME</label>
                                        <input type="text" class="form-control" id="name" name="name" required>
                                    </div>
                                    <div class="form-group">
                                        <label>LASTNAME</label>
                                        <input type="text" class="form-control" id="lastname" name="lastname" required>
                                    </div>
                                    <div class="form-group">
                                        <label>PERMISSION</label>
                                        <select class="form-control" id="permission" name="permission">
                                            <option value="editable">Edit Permission</option>
                                            <option value="general">General Permission</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-round btn-primary" data-dismiss="modal" id="btnAddUser">Add User</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="EditUser" tabindex="-1" role="dialog" aria-labelledby="EditUserTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="EditUserTitle">Edit User</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <form id="upload-edit-form" enctype="multipart/form-data">
                                    <div class="form-group">
                                        <div class="user-profile-img">
                                            <img src="<?php echo base_url('assets/images/avatar/default.png'); ?>" class="img-thumbnail rounded-circle" id="editImgProfile">
                                            <input type="file" style="display:none" id="inputEditImgProfile" name="avatar">
                                            <input type="text" style="display:none" id="inputEditID" name="ID">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label>EMAIL</label>
                                        <input type="text" class="form-control" id="inputEmail" name="email" required>
                                    </div>
                                    <div class="form-group">
                                        <label>PHONE</label>
                                        <input type="text" class="form-control" id="inputPhone" name="phone" required>
                                    </div>
                                    <div class="form-group">
                                        <label>NAME</label>
                                        <input type="text" class="form-control" id="inputName" name="name" required>
                                    </div>
                                    <div class="form-group">
                                        <label>LASTNAME</label>
                                        <input type="text" class="form-control" id="inputLastname" name="lastname" required>
                                    </div>
                                    <div class="form-group">
                                        <label>PERMISSION</label>
                                        <select class="form-control" id="inputPermission" name="permission" <?php if ($PERMISSION != 'admin') {
                                                                                                                echo 'disabled';
                                                                                                            } ?>>
                                            <option value="editable">Edit Permission</option>
                                            <option value="general">General Permission</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-round btn-primary" data-dismiss="modal" id="btnUpdateUser">Update</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade " id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
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
                                    Are you really going to delete this User?
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-round btn-default" data-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-round btn-primary" onclick="deleteUser()">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row clearfix">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="body">
                                <div class="table-responsive">
                                    <table class="table table-hover js-basic-example dataTable table-custom spacing5" style="width: 100%;">
                                        <thead>
                                            <tr>
                                                <th style="width: 20px;">#</th>
                                                <th style="display:none;">ID</th>
                                                <th>USER</th>
                                                <th>PHONE</th>
                                                <th>NAME</th>
                                                <th>LASTNAME</th>
                                                <th style="width: 80px;">ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $cnt = 1;
                                            foreach ($Users as $user) {
                                                ?>
                                                <tr>
                                                    <td><?php echo $cnt++; ?></td>
                                                    <td style="display: none;" class='user-id'><?php echo $user['ID']; ?></td>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <img src="<?php echo base_url('assets/images/avatar/' . ($user['PROFILEPICTURE'] == "" ? 'default.png' : $user['PROFILEPICTURE'])); ?>" data-toggle="tooltip" data-placement="top" title="" alt="Avatar" class="w35 h35 rounded" data-original-title="Avatar Name">
                                                            <div class="ml-3">
                                                                <a href="javascript:void(0);" title=""><?php echo $user['USERNAME']; ?></a>
                                                                <p class="mb-0"><?php echo $user['EMAIL']; ?></p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><?php echo $user['PHONE']; ?></td>
                                                    <td><?php echo $user['NAME']; ?></td>
                                                    <td><?php echo $user['LASTNAME']; ?></td>
                                                    <td>
                                                        <?php
                                                            if ($user['ID'] == $ID) {
                                                                echo '<button type="button" class="btn btn-sm btn-default" title="" data-toggle="tooltip" data-placement="top" data-original-title="Edit" onclick="editClicked(this)"><i class="icon-note"></i></button>
                                                                <button type="button" class="btn btn-sm btn-default" title="" data-toggle="tooltip" data-placement="top" data-original-title="Delete" onclick="deleteClicked(this)" disabled><i class="icon-trash"></i></button>';
                                                            } else {
                                                                $action = 'disabled';
                                                                if ($PERMISSION == 'admin') {
                                                                    $action = '';
                                                                }
                                                                echo '<button type="button" class="btn btn-sm btn-default" title="" data-toggle="tooltip" data-placement="top" data-original-title="Edit" onclick="editClicked(this)" ' . $action . '><i class="icon-note"></i></button>
                                                                <button type="button" class="btn btn-sm btn-default" title="" data-toggle="tooltip" data-placement="top" data-original-title="Delete" onclick="deleteClicked(this)" ' . $action . '><i class="icon-trash"></i></button>';
                                                            } ?>
                                                    </td>
                                                </tr>
                                            <?php
                                            }
                                            ?>
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

    <!-- JQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js?<?php echo time(); ?>"></script>

    <!-- Javascript -->
    <script src="<?php echo base_url('assets/bundles/libscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/vendorscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>

    <script src="<?php echo base_url('assets/bundles/datatablescripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/dataTables.buttons.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.bootstrap4.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.colVis.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.html5.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/vendor/jquery-datatable/buttons/buttons.print.min.js'); ?>?<?php echo time(); ?>"></script>



    <script src="<?php echo base_url('assets/bundles/c3.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/bundles/knob.bundle.js'); ?>?<?php echo time(); ?>"></script><!-- Jquery Knob-->
    <script src="<?php echo base_url('assets/bundles/mainscripts.bundle.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/index6.js'); ?>?<?php echo time(); ?>"></script>

    <!-- Custom Javascript -->
    <script type="text/javascript">
        var base_url = "<?php echo base_url(); ?>";
        var currentView = 0;
        /* 
         * 0 : Total Bins
         * 1 : Available Bins
         * 2 : Dispatched Bins
         * 3 : Overdue Bins
         * 4 : History
         */
    </script>
    <script src="<?php echo base_url('assets/vendor/toastr.min.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/user/management.js'); ?>?<?php echo time(); ?>"></script>
    <script src="<?php echo base_url('assets/js/pages/session_timer.js'); ?>?<?php echo time(); ?>"></script>

</body>

</html>