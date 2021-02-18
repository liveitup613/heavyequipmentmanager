<?php
/*
@@ Incentive Class
@@ By Zheng
@@ 2020-06-18
*/
?>

<?php

ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

class Incentive extends CI_Controller 
{
    public function __construct() {
        parent::__construct();

        $this->output->disable_cache();
        date_default_timezone_set('America/Phoenix');

        if (!$this->session->has_userdata('ID') || $this->session->userdata('ID') == "")
            redirect('Login');   

        $ID = $this->session->userdata('ID');
        $this->load->model('User_model');
        $userData = $this->User_model->getUserInfo($ID);
        if ($userData['PERMISSION'] == 'uploader')
            redirect('Deals');

    }

    ///////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// SHOW VIEW ////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    public function index() {
        $ID = $this->session->userdata('ID');

        $this->db->select('ACCOUNTING, PERMISSION');
        $this->db->where('ID', $ID);
        $this->db->from('tbluser');
        $result = $this->db->get()->row_array();
        if ($result == null || ($result['ACCOUNTING'] == 'OFF' && $result['PERMISSION'] != 'admin'))
            redirect('Sales');

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('sales/page-incentive', $viewData);
    }

    public function mine() {
        $ID = $this->session->userdata('ID');

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('sales/page-my-incentive', $viewData);
    }

    public function getData() {        
        $this->load->model('Sales_model');
        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $searchText = $this->input->post('searchText');    
        $start = $this->input->post('start');
        $length = $this->input->post('length');
        $status = $this->input->post('status');
        $salesRep = $this->input->post('salesRep');
        $dealType = $this->input->post('dealType');
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');

        $data = $this->Sales_model->getIncentiveData(
            $searchText,            
            $status,
            $salesRep,
            $dealType,
            $minStartDate,
            $maxStartDate,
            'All',
            'All',
            $orderIndex,
            $sort,
            $start,
            $length
        );

        header('content-type:application/json');
        echo '{           
            "recordsTotal": ' . $data["recordsTotal"] . ',
            "recordsFiltered" : ' . $data["recordsFiltered"] . ',
            "data" : ' . json_encode($data["data"]) . '
        }';
    }

    public function getDataForMe() {
        $userID = $this->session->userdata('ID');
        $this->load->model('User_model');
        $userData = $this->User_model->getUserInfo($userID);

        $this->load->model('Sales_model');
        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $searchText = $this->input->post('searchText');    
        $start = $this->input->post('start');
        $length = $this->input->post('length');
        $status = $this->input->post('status');
        $role = $this->input->post('role');
        $dealType = $this->input->post('dealType');
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');

        $data = $this->Sales_model->getIncentiveData(
            $searchText,            
            $status,
            'All',
            $dealType,
            $minStartDate,
            $maxStartDate,
            $userData['USERNAME'],
            $role,
            $orderIndex,
            $sort,
            $start,
            $length
        );

        header('content-type:application/json');
        echo '{           
            "recordsTotal": ' . $data["recordsTotal"] . ',
            "recordsFiltered" : ' . $data["recordsFiltered"] . ',
            "data" : ' . json_encode($data["data"]) . '
        }';
    }

    public function getDataByID() {
        $ID = $this->input->post('ID');

        $this->load->model('Sales_model');
        $this->load->model('Deal_model');

        $sales_data = $this->Sales_model->get(array('ID' => $ID));
        if ($sales_data == null) {
            echo json_encode(array(
                'success' => false,
                'message' => 'Unkown Sales ID'
            ));
            return;
        }

        $DealID = $sales_data['DealID'];
        $deal_data = array();        
        if ($sales_data['DealType'] != 'Manufacturing' && $sales_data['DealType'] != 'Logistics') {
            $deal_data = $this->Deal_model->getTruck($DealID);
            if ($deal_data == null) {
                echo json_encode(array(
                    'success' => false,
                    'message' => 'Unkown Deal ID'
                ));
                return;
            }

            $Link = $deal_data['Link'];
            $DealType = $deal_data['DealType'];
            $BuyingSource = '';

            if ($DealType == 'Auction' || $DealType == 'For Sale' || $DealType == 'Consignment') {
                if ($Link != '') {
                    //echo $Link;
                    if (strpos($Link, 'https') === false) {
                        $deal_data['BuyingSource'] = 'None';
                    }
                    else {
                        
                        $BuyingSource = substr($Link, 8);
                        if (strpos($BuyingSource, 'www') !== false) {
                            $BuyingSource = substr($BuyingSource, 4);
                        }

                        $endPos = strpos($BuyingSource, '.');
                        $BuyingSource = substr($BuyingSource, 0, $endPos);
                        $deal_data['BuyingSource'] = $BuyingSource;
                    }
                }
                else {
                    $deal_data['BuyingSource'] = 'None';
                }

                $DealType = substr($DealType, 0, 1);

                $this->db->select('Grade, Pay');
                $this->db->where('AuctioneerSupp', $BuyingSource);
                $this->db->where('Type', $DealType);
                $this->db->from('tblAuctioneersSupp');
                $result = $this->db->get()->row_array();

                if ($result == null) {
                    $this->db->select('Grade, Pay');
                    $this->db->where('AuctioneerSupp', 'Other');
                    $this->db->where('Type', $DealType);
                    $this->db->from('tblAuctioneersSupp');
                    $result = $this->db->get()->row_array();

                    $deal_data['SourceGrade'] = $result['Grade'];
                    $deal_data['SourcePaygrade'] = $result['Pay'];    
                }  
                else {
                    $deal_data['SourceGrade'] = $result['Grade'];
                    $deal_data['SourcePaygrade'] = $result['Pay'];
                }
            }
            else {
                $deal_data['SourceGrade'] = '';
                $deal_data['SourcePaygrade'] = 0;
            }
            
            $EqCategory = $deal_data['EqCategory'];
            $this->db->select('Grade, Pay');
            $this->db->where('EqCategory', $EqCategory);
            $this->db->from('tblEqCategories');
            $result = $this->db->get()->row_array();
            $deal_data['EquipmentCategoryGrade'] = $result['Grade'];
            $deal_data['EquipmentCategoryPaygrade'] = $result['Pay'];
        }

        $this->db->select('*');
        $this->db->from('tblIncentiveSettings');
        $row = $this->db->get()->row_array();

        echo json_encode(array(
            'success' => true,
            'deal' => $deal_data,
            'sale' => $sales_data,
            'setting' => $row
        ));
    }

    public function getDepositUsers() {
        $ID = $this->input->post('ID');

        $this->db->select('SalesRep, BuyingUser, DealID');
        $this->db->where('ID', $ID);
        $this->db->from('tblSales');
        $this->db->limit(1);
        $result = $this->db->get()->row_array();

        if ($result == null )
        {
            echo json_encode(array(
                'success' => false,
                'message' => 'Unknown Sales ID'
            ));
            return;
        }

        $Seller = $result['SalesRep'];
        $Buyer = $result['BuyingUser'];
        $DealID = $result['DealID'];

        $this->db->select('tblDeals.UserID');
        $this->db->select('tbluser.USERNAME');
        $this->db->join('tbluser', 'tbluser.ID = tblDeals.UserID');
        $this->db->from('tblDeals');
        $this->db->where('tblDeals.ID', $DealID);
        $this->db->limit(1);
        $result = $this->db->get()->row_array();

        if ($result == null) {
            echo json_encode(array(
                'success' => false,
                'message' => 'Unknown Deal ID'
            ));
            return;
        }

        $Finder = $result['USERNAME'];

        echo json_encode(array(
            'success' => true,
            'Seller' => $Seller,
            'Buyer' => $Buyer,
            'Finder' => $Finder,
            'SellerEmployee' => $this->isUserEmployee($Seller),
            'BuyerEmployee' => $this->isUserEmployee($Buyer),
            'FinderEmployee' => $this->isUserEmployee($Finder)
        ));
    }

    public function isUserEmployee($User) {
        if ($User == '')
            return 'OFF';
        $this->db->select('EMPLOYEE');
        $this->db->where('USERNAME', $User);
        $this->db->from('tbluser');
        $row = $this->db->get()->row_array();

        if ($row == null)
            return 'OFF';
        
        return $row['EMPLOYEE'];
    }

    public function getIncentiveDetail() {
        $User = $this->input->post('User');
        $SalesID = $this->input->post('SalesID');
        
        $this->load->model('Incentive_model');

        $Incentive = $this->Incentive_model->getIncentiveComm($User, $SalesID);
        $IncentiveAmount = '';
        $IncentiveCurrency = '';

        if ($Incentive != null) {
            $IncentiveAmount = $Incentive['IncentiveAmount'];
            $IncentiveCurrency = $Incentive['Currency'];
        }

        $MXNDeposit = $this->Incentive_model->getTotalDepositByUserAndCurrency($User, $SalesID, 'MXN');
        $USDDeposit = $this->Incentive_model->getTotalDepositByUserAndCurrency($User, $SalesID, 'USD');
        
        echo json_encode(array(
            'success' => true,
            'IncentiveAmount' => $IncentiveAmount,
            'IncentiveCurrency' => $IncentiveCurrency,
            'MXNDeposit' => $MXNDeposit,
            'USDDeposit' => $USDDeposit
        ));
    }

    public function addIncentive() {
        $data = $this->input->post();

        $this->load->model('Incentive_model');
        $this->Incentive_model->insert($data);

        echo json_encode(array(
            'success' => true
        ));
    }

    public function getSettings() {

        $this->db->select('*');
        $this->db->from('tblIncentiveSettings');
        $row = $this->db->get()->row_array();

        echo json_encode($row);
    }

    public function updateSettings() {
        $data = $this->input->post();

        $this->db->set($data);
        $this->db->where('ID', 1);
        $this->db->update('tblIncentiveSettings');
    }

    public function setIncentiveValue() {
        $SaleID = $this->input->post('SaleID');
        $data = $this->input->post();

        $this->db->select('*');
        $this->db->from('tblIncentiveComm');
        $this->db->where('SaleID', $SaleID);
        $result = $this->db->get()->result_array();

        if ($result == null) {
            $this->db->insert('tblIncentiveComm', $data);
        }
        else {
            $this->db->where('SaleID', $SaleID);
            $this->db->update('tblIncentiveComm', $data);
        }
    }

    public function discardIncentive() {
        $ID = $this->input->post('ID');

        $this->db->set('IncentiveStatus', 'Discarded');
        $this->db->where('ID', $ID);
        $this->db->update('tblSales');

        echo 'success';
    }

    public function setPaidIncentive() {
        $ID = $this->input->post('ID');

        $this->db->set('IncentiveStatus', 'Paid');
        $this->db->where('ID', $ID);
        $this->db->update('tblSales');

        echo 'success';
    }

    public function returnToOpen() {
        $ID = $this->input->post('ID');

        $this->db->set('IncentiveStatus', 'Open');
        $this->db->where('ID', $ID);
        $this->db->update('tblSales');

        echo 'success';
    }

    public function getProjectedIncentiveStatus() {
        $user = $this->input->post('user');
        $dealType = $this->input->post('dealType');
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $salesRep = $this->input->post('salesRep');
        $role = $this->input->post('role');

        $this->db->select('tblSales.*');        
        $this->db->select('tbluser.USERNAME');
        $this->db->select(' tblIncentiveComm.SellerIncentive,
                            tblIncentiveComm.FinderIncentive,
                            tblIncentiveComm.BuyerIncentive,
                            tblIncentiveComm.SellerCurrency,
                            tblIncentiveComm.FinderCurrency,
                            tblIncentiveComm.BuyerCurrency
                        ');
        $this->db->from('tblSales');
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');  
        $this->db->join('tbluser', 'tbluser.ID = tblDeals.UserID', 'left');
        $this->db->join('tblIncentiveComm', 'tblSales.ID = tblIncentiveComm.SaleID', 'left');
        $this->db->group_by('tblSales.ID');
        
        $dealStatus = array('Ready', 'Shop', 'Customs', 'Shipping');
        $this->db->where_in('tblSales.DealStatus', $dealStatus);

        $this->db->where('tblSales.IncentiveStatus', 'Open');
        if ($user != 'All') {
            if ($role == 'All') {
                $this->db->group_start();
                $this->db->where('tblSales.SalesRep', $user);
                $this->db->or_where('tblSales.BuyingUser', $user);
                $this->db->or_where('tbluser.USERNAME', $user);
                $this->db->group_end();
            }
            else if ($role == 'Finder') {
                $this->db->where('tbluser.USERNAME', $user);
                if ($dealType == 'All') {
                    $this->db->where_in('tblSales.DealType', array('Auction', 'For Sale', 'Consignment'));
                }
            }
            else if ($role == 'Seller') {
                $this->db->where('tblSales.SalesRep', $user);
            }
            else if ($role == 'Buyer') {
                $this->db->where('tblSales.BuyingUser', $user);                
            }
        }

        $this->db->group_start();
        $this->db->where('tblIncentiveComm.SellerIncentive > ', 0);
        $this->db->or_where('tblIncentiveComm.FinderIncentive >', 0);
        $this->db->or_where('tblIncentiveComm.BuyerIncentive >', 0);
        $this->db->group_end();

        if ($salesRep != 'All')
            $this->db->where('tblSales.SalesRep', $salesRep);

        if ($dealType != 'All' && $dealType != 'No Deal')
            $this->db->where('tblSales.DealType',  $dealType);
        else if($dealType == 'No Deal')
            $this->db->where('tblSales.DealType', '');
        
        if (!empty($minStartDate))
            $this->db->where('tblSales.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblSales.DateAdded <=', $maxStartDate.' 23:59:59');

        $result = $this->db->get()->result_array();
        $totalCount = count($result);

        $USD = 0;
        $MXN = 0;

        foreach ($result as $row) {
            if ($user == 'All')  {
                if ($row['SellerCurrency'] == 'USD')
                    $USD += $row['SellerIncentive'];
                else 
                    $MXN += $row['SellerIncentive'];

                if ($row['BuyerCurrency'] == 'USD')
                    $USD += $row['BuyerIncentive'];
                else 
                    $MXN += $row['BuyerIncentive'];

                if ($row['FinderCurrency'] == 'USD')
                    $USD += $row['FinderIncentive'];
                else 
                    $MXN += $row['FinderIncentive'];
            }
            else {
                if ($row['SalesRep'] == $user) {
                    if ($row['SellerCurrency'] == 'USD')
                        $USD += $row['SellerIncentive'];
                    else 
                        $MXN += $row['SellerIncentive'];
                }

                if ($row['BuyingUser'] == $user) {
                    if ($row['BuyerCurrency'] == 'USD')
                        $USD += $row['BuyerIncentive'];
                    else 
                        $MXN += $row['BuyerIncentive'];
                }

                if ($row['USERNAME'] == $user) {
                    if ($row['FinderCurrency'] == 'USD')
                        $USD += $row['FinderIncentive'];
                    else 
                        $MXN += $row['FinderIncentive'];
                }
            }
            
        }

        echo json_encode(array(
            'TotalCnt' => $totalCount,
            'USD' => $USD,
            'MXN' => $MXN
        ));
    }

    public function getPaidIncentiveStatus() {
        $user = $this->input->post('user');        
        $dealType = $this->input->post('dealType');
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $salesRep = $this->input->post('salesRep');
        $role = $this->input->post('role');

        $this->db->select('tblSales.*');        
        $this->db->select('tbluser.USERNAME');
        $this->db->from('tblSales');
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');  
        $this->db->join('tbluser', 'tbluser.ID = tblDeals.UserID', 'left');        
        $this->db->group_by('tblSales.ID');
        
        $dealStatus = array('Ready', 'Shop', 'Customs', 'Shipping');
        $this->db->where_in('tblSales.DealStatus', $dealStatus);

        $this->db->where_in('tblSales.IncentiveStatus', array('Open', 'Paid'));
        
        if ($user != 'All') {
            if ($role == 'All') {
                $this->db->group_start();
                $this->db->where('tblSales.SalesRep', $user);
                $this->db->or_where('tblSales.BuyingUser', $user);
                $this->db->or_where('tbluser.USERNAME', $user);
                $this->db->group_end();
            }
            else if ($role == 'Finder') {
                $this->db->where('tbluser.USERNAME', $user);
                if ($dealType == 'All') {
                    $this->db->where_in('tblSales.DealType', array('Auction', 'For Sale', 'Consignment'));
                }
            }
            else if ($role == 'Seller') {
                $this->db->where('tblSales.SalesRep', $user);
            }
            else if ($role == 'Buyer') {
                $this->db->where('tblSales.BuyingUser', $user);                
            }
        }

        if ($salesRep != 'All')
            $this->db->where('tblSales.SalesRep', $salesRep);

        if ($dealType != 'All' && $dealType != 'No Deal')
            $this->db->where('tblSales.DealType',  $dealType);
        else if($dealType == 'No Deal')
            $this->db->where('tblSales.DealType', '');
        
        if (!empty($minStartDate))
            $this->db->where('tblSales.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblSales.DateAdded <=', $maxStartDate.' 23:59:59');

        $result = $this->db->get()->result_array();

        $totalCount = 0;
        $USD = 0;
        $MXN = 0;

        $this->load->model('Incentive_model');

        foreach ($result as $row) {
            
            $USD_for_Sale = $this->Incentive_model->getTotalDepositByCurrency($row['ID'], 'USD');
            $MXN_for_Sale = $this->Incentive_model->getTotalDepositByCurrency($row['ID'], 'MXN');

            if ($USD_for_Sale != 0 || $MXN_for_Sale != 0){
                $totalCount++;
            }

            if ($user == 'All') {
                $MXN += $MXN_for_Sale;
                $USD += $USD_for_Sale;
            }
            else {
                if ($row['SalesRep'] == $user) {
                    $MXN += $this->Incentive_model->getTotalDepositByUserAndCurrency('Seller', $row['ID'], 'MXN');
                    $USD += $this->Incentive_model->getTotalDepositByUserAndCurrency('Seller', $row['ID'], 'USD');
                }

                if ($row['BuyingUser'] == $user) {
                    $MXN += $this->Incentive_model->getTotalDepositByUserAndCurrency('Buyer', $row['ID'], 'MXN');
                    $USD += $this->Incentive_model->getTotalDepositByUserAndCurrency('Buyer', $row['ID'], 'USD');
                }

                if ($row['USERNAME'] == $user) {
                    $MXN += $this->Incentive_model->getTotalDepositByUserAndCurrency('Finder', $row['ID'], 'MXN');
                    $USD += $this->Incentive_model->getTotalDepositByUserAndCurrency('Finder', $row['ID'], 'USD');
                }
            }
        }

        echo json_encode(array(
            'TotalCnt' => $totalCount,
            'USD' => $USD,
            'MXN' => $MXN
        ));
    }

    public function getIncentiveRoleStatus() {
        $user = $this->input->post('user');
        $status = $this->input->post('status');
        $dealType = $this->input->post('dealType');
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');        
        $role = $this->input->post('role');

        $this->db->select('tblSales.*');        
        $this->db->select('tbluser.USERNAME');
        $this->db->from('tblSales');
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');  
        $this->db->join('tbluser', 'tbluser.ID = tblDeals.UserID', 'left');        
        $this->db->group_by('tblSales.ID');
        
        $dealStatus = array('Ready', 'Shop', 'Customs', 'Shipping');
        $this->db->where_in('tblSales.DealStatus', $dealStatus);
        
        if ($user != 'All') {
            if ($role == 'All') {
                $this->db->group_start();
                $this->db->where('tblSales.SalesRep', $user);
                $this->db->or_where('tblSales.BuyingUser', $user);
                $this->db->or_where('tbluser.USERNAME', $user);
                $this->db->group_end();
            }
            else if ($role == 'Finder') {
                $this->db->where('tbluser.USERNAME', $user);
                if ($dealType == 'All') {
                    $this->db->where_in('tblSales.DealType', array('Auction', 'For Sale', 'Consignment'));
                }
            }
            else if ($role == 'Seller') {
                $this->db->where('tblSales.SalesRep', $user);
            }
            else if ($role == 'Buyer') {
                $this->db->where('tblSales.BuyingUser', $user);                
            }
        }

        $this->db->where('tblSales.IncentiveStatus', $status);     

        if ($dealType != 'All' && $dealType != 'No Deal')
            $this->db->where('tblSales.DealType',  $dealType);
        else if($dealType == 'No Deal')
            $this->db->where('tblSales.DealType', '');
        
        if (!empty($minStartDate))
            $this->db->where('tblSales.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblSales.DateAdded <=', $maxStartDate.' 23:59:59');

        $result = $this->db->get()->result_array();
        $totalCount = count($result);

        $Finder = 0;
        $Seller = 0;
        $Buyer = 0;

        $SellerArray = array('Inventory', 'Auction', 'For Sale', 'Consignment', 'Manufacturing', 'Logistics');
        $FinderArray = array('Auction', 'For Sale', 'Consignment');
        $BuyerArray = array('Auction', 'For Sale');

        foreach ($result as $row) {
            if ($row['SalesRep'] == $user && in_array($row['DealType'], $SellerArray)) {
                $Seller += 1;
            }

            if ($row['BuyingUser'] == $user && in_array($row['DealType'], $BuyerArray)) {
                $Buyer += 1;
            }

            if ($row['USERNAME'] == $user && in_array($row['DealType'], $FinderArray)) {
                $Finder += 1;
            }
        }

        echo json_encode(array(
            'TotalCnt' => $totalCount,
            'Seller' => $Seller,
            'Finder' => $Finder,
            'Buyer' => $Buyer
        ));
    }
}