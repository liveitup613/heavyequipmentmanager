<?php
/*
@@ LEAD-MANAGEMENT.JS
@@ By Zheng
@@ 2020-02-19
*/
?>

<?php

ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

class Sales extends CI_Controller 
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

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('sales/page-main', $viewData);
    }

    public function mine() {
        $ID = $this->session->userdata('ID');

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('sales/page-mine', $viewData);
    }

    public function statistics() {
        $ID = $this->session->userdata('ID');

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('sales/page-statistics', $viewData);
    }

    public function getSalesData() {
        $this->load->model('Sales_model');

        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $searchText = $this->input->post('searchText');    
        $start = $this->input->post('start');
        $length = $this->input->post('length');
        $user = $this->input->post('user');
        $status = $this->input->post('status');
        $dealType = $this->input->post('dealType');
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $minPrice = $this->input->post('minPrice');
        $maxPrice = $this->input->post('maxPrice');
        $minRemaining = $this->input->post('minRemaining');
        $maxRemaining = $this->input->post("maxRemaining");
        $dealStatus = $this->input->post('dealStatus');

        $data = $this->Sales_model->getAllData(           
            $user,
            $searchText,            
            $status,       
            $dealStatus,     
            $dealType,
            $minStartDate,
            $maxStartDate,
            $minPrice,
            $maxPrice,
            $minRemaining,
            $maxRemaining,
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

    public function getSalesDataForExcel() {
        $this->load->model('Sales_model');
      
        $searchText = $this->input->post('searchText');            
        $user = $this->input->post('user');
        $status = $this->input->post('status');
        $dealType = $this->input->post('dealType');
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $dealStatus = $this->input->post('dealStatus');

        $data = $this->Sales_model->getAllDataForExcel(           
            $user,
            $searchText,            
            $status,       
            $dealStatus,     
            $dealType,
            $minStartDate,
            $maxStartDate
        );

        header('content-type:application/json');
        echo json_encode($data);
    }

    public function addDeal() {
        $ID = $this->input->post('ID');
        $DealID = $this->input->post('DealID');
        $data = $this->input->post();

        $this->load->model('Sales_model');
        $affected_rows = $this->Sales_model->update(array('ID' => $ID), $data);

        if ($affected_rows == null)
        {
            echo json_encode(array('success' => false, 'message'=> 'Update Sales data failed'));
            return;
        }

        $ret = $this->Sales_model->updateStatus($ID, 'In Progress');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message'=> 'Update SalesStatus Failed'));
            return;
        }

        $ret = $this->Sales_model->updateDealStatus($ID, 'Pending');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message'=> 'Update DealStatus Failed'));
            return;
        }

        $this->load->model('Deal_model');
        $ret = $this->Deal_model->update(array('ID' => $DealID), array('DealStatus' => 'PendingSale'));
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message'=> 'Update DealStatus Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function addManufacture() {
        $ID = $this->input->post('ID');
        $data = $this->input->post();
        $data['IDSale'] = $ID;

        array_splice($data, 0, 1);
        $this->load->model('Manufacturing_model');
        $ManuID = $this->Manufacturing_model->insert($data);
        if ($ManuID == null) {
            echo json_encode(array('success' => false, 'message'=> 'Add Manufacturing Failed'));
            return;
        }

        $this->load->model('Sales_model');
        $ret = $this->Sales_model->updateStatus($ID, 'In Progress');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message'=> 'Update SalesStatus Failed'));
            return;
        }

        $ret = $this->Sales_model->updateDealStatus($ID, 'Pending');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message'=> 'Update DealStatus Failed'));
            return;
        }

        $data = array(
            'DealType' => 'Manufacturing',
            'DealID' => $ManuID
        );

        $affected_rows = $this->Sales_model->update(array('ID' => $ID), $data);
        if ($affected_rows == null)
        {
            echo json_encode(array('success' => false, 'message'=> 'Update Sales data failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function addLogistics() {
        $SalesID = $this->input->post('SaleID');
        $data = $this->input->post();

        $this->load->model('Logistics_model');
        $ManuID = $this->Logistics_model->insert($data);
        if ($ManuID == null) {
            echo json_encode(array('success' => false, 'message'=> 'Add Logistics Failed'));
            return;
        }

        $this->load->model('Sales_model');
        $ret = $this->Sales_model->updateStatus($SalesID, 'In Progress');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message'=> 'Update SalesStatus Failed'));
            return;
        }

        $ret = $this->Sales_model->updateDealStatus($SalesID, 'Pending');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message'=> 'Update DealStatus Failed'));
            return;
        }

        $data = array(
            'DealType' => 'Logistics',
            'DealID' => $ManuID
        );

        $affected_rows = $this->Sales_model->update(array('ID' => $SalesID), $data);
        if ($affected_rows == null)
        {
            echo json_encode(array('success' => false, 'message'=> 'Update Sales data failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function getDealDetail() {
        $ID = $this->input->post('ID');

        $this->load->model('Sales_model');        
        $SaleData = $this->Sales_model->get(array('ID' => $ID));

        if ($SaleData == null) {
            echo json_encode(array('success' => false, 'message'=> 'Get Sales data failed'));
            return;
        }

        $DealType = $SaleData['DealType'];
        $DealID = $SaleData['DealID'];

        if ($DealType == 'Manufacturing') {
            $this->load->model('Manufacturing_model');
            $data = $this->Manufacturing_model->get(array('ID' => $DealID));
            echo json_encode(array(
                'success' => true,
                'DealType' => $DealType,
                'data' => $data
            ));
            return;
        }
        else if ($DealType == 'Logistics') {
            $this->load->model('Logistics_model');
            $data = $this->Logistics_model->get(array('ID' => $DealID));
            echo json_encode(array(
                'success' => true,
                'DealType' => $DealType,
                'data' => $data
            ));
            return;
        }
        else {
            $this->load->model('Deal_model');
            $data = $this->Deal_model->getTruck($DealID);
            echo json_encode(array(
                'success' => true,
                'DealType' => $DealType,
                'data' => $data
            ));
            return;
        }

        echo json_encode(array(
            'success' => true
        )); 
    }

    public function clearDeal() {
        $ID = $this->input->post('ID');

        $update_data = array(
            'SalesStatus' => 'New',
            'DealStatus' => '',
            'DealType' => '',
            'DealID' => 0,
            'Price' => 0,
            'BuyPremium' => 0,
            'Shipping' => 0,
            'Customs' => 0,
            'Discount' => 0,
            'TaxP' => 0,
            'TaxAmount' => 0,
            'Shop' => 0,
            'Extras' => 0,
            'Total' => 0,
            'Comm' => 0
        );       

        $this->load->model('Sales_model');

        $data = $this->Sales_model->get(array('ID' => $ID));
        if ($data == null) {
            echo json_encode(array('success' => false, 'message'=> 'Get Sales Info Failed'));
            return;
        }

        $DealID = $data['DealID'];
        $DealType = $data['DealType'];

        $affected_rows = $this->Sales_model->update(array('ID' => $ID), $update_data);
        if ($affected_rows == 0) {
            echo json_encode(array('success' => false, 'message'=> 'Update Sales Data Failed'));
            return;
        }

        if ($DealType == 'Manufacturing') {
            $this->load->model('Manufacturing_model');
            $this->Manufacturing_model->delete(array('ID' => $DealID));
        }
        else if ($DealType == 'Logistics') {
            $this->load->model('Logistics_model');
            $this->Logistics_model->delete(array("ID" => $DealID));
        }
        else {
            $this->load->model('Deal_model');
            $ret = $this->Deal_model->update(array('ID' => $DealID), array('DealStatus' => ''));
            if ($ret == null) {
                echo json_encode(array('success' => false, 'message'=> 'Update DealStatus Failed'));
                return;
            }
        }        

        echo json_encode(array('success' => true));
    }

    public function clone() {
        $ID = $this->input->post('ID');

        $this->load->model('Sales_model');
        $salesData = $this->Sales_model->get(array('ID' => $ID));

        if ($salesData == null) {
            echo json_encode(array('success' => false, 'message' => 'Invalid Sales ID'));
            return;
        }

        $inserted_id = $this->Sales_model->addNewSale($salesData['AssignmentID'], $salesData['OppID'], $salesData['SalesRep']);
        if ($inserted_id == 0) {
            echo json_encode(array('success' => false, 'message' => 'Clone Sales Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function getSaleInfo() {
        $ID = $this->input->post('ID');

        $this->load->model('Sales_model');
        $salesData = $this->Sales_model->get(array('ID' => $ID));

        if ($salesData == null) {
            echo json_encode(array('success' => false, 'message' => 'Invalid Sales ID'));
            return;
        }

        echo json_encode(array('success' => true, 'data' => $salesData));
    }

    public function updatePrice() {
        $ID = $this->input->post('ID');
        $data = $this->input->post();

        $this->load->model('Sales_model');
        $ret = $salesData = $this->Sales_model->update(array('ID' => $ID), $data);

        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update Price Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function addNote() {
        $ID = $this->input->post('ID');
        $Note = $this->input->post('Note');

        $Date = date('Y-m-d H:i:s');
        $data = array(
            'Date' => $Date,
            'DealStatus' => '',
            'ContactDate' => '',
            'Note' => $Note);
        
        $Log = json_encode($data);
        $Log = str_replace("\u", "\\\\u", $Log);      

        $this->load->model('Sales_model');
        $ret = $this->Sales_model->updateLog($ID, $Log);

        if ($ret == 0) {
            echo json_encode(array('success' => false, 'message' => 'Update Sales Log Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function changeDealStatus() {
        $ID = $this->input->post('ID');
        $DealStatus = $this->input->post('DealStatus');
        $Note = $this->input->post('Note');

        $Date = date('Y-m-d H:i:s');
        $data = array(
            'Date' => $Date,
            'DealStatus' => $DealStatus,
            'ContactDate' => '',
            'Note' => $Note);
        
        $Log = json_encode($data);
        $Log = str_replace("\u", "\\\\u", $Log);      

        $this->load->model('Sales_model');

        $ret = $this->Sales_model->updateDealStatus($ID, $DealStatus);
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update DealStatus Failed'));
            return;
        }

        $ret = $this->Sales_model->updateLog($ID, $Log);

        if ($ret == 0) {
            echo json_encode(array('success' => false, 'message' => 'Update Sales Log Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function contact() {
        $ID = $this->input->post('ID');
        $ContactDate = $this->input->post('ContactDate');
        $Note = $this->input->post('Note');

        $Date = date('Y-m-d H:i:s');
        $data = array(
            'Date' => $Date,
            'DealStatus' => '',
            'ContactDate' => $ContactDate,
            'Note' => $Note);
        
        $Log = json_encode($data);
        $Log = str_replace("\u", "\\\\u", $Log);      

        $this->load->model('Sales_model');
        $ret = $this->Sales_model->updateLog($ID, $Log);

        if ($ret == 0) {
            echo json_encode(array('success' => false, 'message' => 'Update Sales Log Failed'));
            return;
        }

        $ret = $this->Sales_model->update(array('ID' => $ID), array('ContactDate' => $ContactDate));

        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update Contact Date Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function getLog() {
        $ID = $this->input->post('ID');

        $this->load->model('Sales_model');
        $data = $this->Sales_model->get(array('ID' => $ID));

        if ($data == null) {
            echo json_encode(array('success' => false, 'message' => 'Get Logdata Failed'));
            return;
        }

        echo json_encode(array('success' => true, 'SalesLog' => $data['SalesLog']));
    }


    //// Despot  here  /////

    public function deposit() {

        $ID = $this->input->post('ID');
        $Date = $this->input->post('Date');
        $Amount = $this->input->post('Amount');
        $ExchangeRate = $this->input->post('ExchangeRate');
        $Currency = $this->input->post('Currency');
        $Type = $this->input->post('Type');
        $Concept = $this->input->post('Concept');
        $User = $this->input->post('User');
        $RealAmount = $this->input->post('RealAmount');

        if ($Date == '')
            $Date = date('Y-m-d H:i:s');

        $this->load->model('Sales_model');
        $ret = $this->Sales_model->checkDepositLimit($ID, $RealAmount);

        if ($ret == false) {
            echo json_encode(array("success" => false, 'message' => 'Limited Deposit'));
            return;
        }

        $ReceiptPhoto = '';
        if (!empty($_FILES["DepositReceiptUpload"]["name"])) {

            $date = new DateTime();
            $filename = 'recipt' . $date->getTimestamp();

            $config['upload_path'] = 'assets/images/depositRecipt/';
            $config['allowed_types'] = 'jpg|jpeg|png|gif|pdf';
            $config['overwrite'] = true;
            $config['file_name'] = $filename;

            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('DepositReceiptUpload')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('success' => false, 'message' => $error));
                return;
            }

            $d = $this->upload->data();
            $ReceiptPhoto = $d['file_name'];            
        }

    
        $this->load->model('ExchangeRate_model');
        if ($ExchangeRate != 1)
            $this->ExchangeRate_model->updateExchangeRate($User, $ExchangeRate);

        $this->load->model('Deposit_model');
        $ret = $this->Deposit_model->insert(
            array(
                'SaleID' => $ID,
                'Date' => $Date,
                'Amount' => $Amount,
                'Currency' => $Currency,
                'ExchangeRate' => $ExchangeRate,
                'RealAmount' => $RealAmount,
                'DepositType' => $Type,
                'Concept' => $Concept,
                'ReceiptPhoto' => $ReceiptPhoto,
                'DepositUser' => $User
            )
        );

        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Make Deposit Failed'));
            return;
        }

        $this->Sales_model->updateDepositCurrency($ID);

        echo json_encode(array('success' => true));
    }

    public function deleteDeposit() {
        $DepositID = $this->input->post('DepositID');
        
        $this->load->model('Deposit_model');

        $data = $this->Deposit_model->get(array('ID' => $DepositID));

        if ($data['ReceiptPhoto'] != '' && file_exists('assets/images/depositRecipt/'.$data['ReceiptPhoto']))
            unlink('assets/images/depositRecipt/'.$data['ReceiptPhoto']);

        $this->Deposit_model->delete(array('ID' => $DepositID));
    }

    public function getDepositCurrency() {
        $ID = $this->input->post('ID');

        $this->db->select('DepositCurrency');
        $this->db->where('ID', $ID);
        $this->db->from('tblSales');
        $row = $this->db->get()->row_array();

        echo json_encode($row['DepositCurrency']);
    }

    public function depositEdit() {    

        $ID = $this->input->post('ID');
        $Date = $this->input->post('Date');
        $Amount = $this->input->post('Amount');
        $ExchangeRate = $this->input->post('ExchangeRate');
        $Currency = $this->input->post('Currency');
        $Type = $this->input->post('Type');
        $Concept = $this->input->post('Concept');
        $User = $this->input->post('User');
        $RealAmount = $this->input->post('RealAmount');

        $this->load->model('Deposit_model');
        $depositData = $this->Deposit_model->get(array('ID' => $ID));

        $ExistingRealAmount = $depositData['RealAmount'];
        $SaleID = $depositData['SaleID'];

        $this->load->model('Sales_model');
        $ret = $this->Sales_model->checkDepositLimit($SaleID, $RealAmount - $ExistingRealAmount);

        if ($ret == false) {
            echo json_encode(array("success" => false, 'message' => 'Limited Deposit'));
            return;
        }

        $ReceiptPhoto = '';
        if (!empty($_FILES["DepositReceiptUpload"]["name"])) {

            $date = new DateTime();
            $filename = 'recipt' . $date->getTimestamp();

            $config['upload_path'] = 'assets/images/depositRecipt/';
            $config['allowed_types'] = 'jpg|jpeg|png|gif|pdf';
            $config['overwrite'] = true;
            $config['file_name'] = $filename;

            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('DepositReceiptUpload')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('success' => false, 'message' => $error));
                return;
            }

            $d = $this->upload->data();
            $ReceiptPhoto = $d['file_name'];            
        }

        if ($Date == '')
            $Date = date('Y-m-d H:i:s');
    
        $this->load->model('ExchangeRate_model');
        if ($ExchangeRate != 1)
            $this->ExchangeRate_model->updateExchangeRate($User, $ExchangeRate);

        
        $update_data =  array(
            'UpdateDate' => $Date,
            'Amount' => $Amount,
            'Currency' => $Currency,
            'ExchangeRate' => $ExchangeRate,
            'RealAmount' => $RealAmount,
            'DepositType' => $Type,
            'Concept' => $Concept
        );

        if ($ReceiptPhoto != '') {
            $update_data['ReceiptPhoto'] = $ReceiptPhoto;

            if ($depositData['ReceiptPhoto'] != '' && file_exists('assets/images/depositRecipt/' . $depositData['ReceiptPhoto']))
                unlink('assets/images/depositRecipt/' . $depositData['ReceiptPhoto']);
        }

        $ret = $this->Deposit_model->update(
            array('ID' => $ID),
            $update_data
        );

        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update Deposit Failed'));
            return;
        }

        echo json_encode(array('success' => true));    
    }

    public function getTotalDeposit() {
        $SalesID = $this->input->post('ID');

        $this->load->model('Deposit_model');
        $totalDeposit = $this->Deposit_model->getTotalDeposit($SalesID);

        if ($totalDeposit == null)
            echo json_encode(array('success' => false));

        echo json_encode(array('success' => true, 'TotalDeposit' => $totalDeposit));
    }

    public function getLastExchangeRate() {
        $this->load->model('ExchangeRate_model');
        $ret = $this->ExchangeRate_model->getExchangeRate();
        $ExchangeRate = 1;

        if ($ret != null) {
            $ExchangeRate = $ret;
        }

        echo json_encode(array('success' => true, 'ExchangeRate' => $ExchangeRate));
    }

    public function getDepositHistoryID() {
        $ID = $this->input->post('ID');

        $this->load->model('Deposit_model');
        $res = $this->Deposit_model->getIndexesForSale($ID);

        if ($res == null) {
            echo json_encode(array('success' => false, 'message' => 'You have no Deposits yet'));
            return;
        }

        echo json_encode(array('success' => true, 'data' => $res));
    }

    public function getDepositData() {
        $ID = $this->input->post('DepositID');

        $this->load->model('Deposit_model');
        $res = $this->Deposit_model->get(array('ID' => $ID));

        if ($res == null) {
            echo json_encode(array('success' => false, 'message' => 'Get Deposit Data failed'));
            return;
        }

        echo json_encode(array('success' => true, 'data' => $res));
    }

    public function deleteSale() {
        $ID = $this->input->post('ID');

        $this->load->model('Sales_model');
        $ret = $this->Sales_model->delete(array('ID' => $ID));

        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Delete Sale Failed'));
            return;
        }

        $this->load->model('Deposit_model');

        $this->db->select('*');
        $this->db->where('SaleID', $ID);
        $this->db->from('tbldeposits');
        $deposit_hisotry = $this->db->get()->result_array();

        foreach ($deposit_hisotry as $row) {
            if ($row['ReceiptPhoto'] != '') {
                $receiptPath = 'assets/images/depositRecipt/'.$row['ReceiptPhoto'];
                if (file_exists($receiptPath))
                    unlink($receiptPath);
            }            
        }

        $this->Deposit_model->delete(array('SaleID' => $ID));

        echo json_encode(array('success' => true));
    }

    public function close() {
        $ReceiptPhoto = '';
        if (!empty($_FILES["CloseAttach"]["name"])) {

            $date = new DateTime();
            $filename = 'recipt' . $date->getTimestamp();

            $config['upload_path'] = 'assets/images/closeSale/';
            $config['allowed_types'] = 'jpg|jpeg|png|gif';
            $config['overwrite'] = true;
            $config['file_name'] = $filename;

            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('CloseAttach')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('success' => false, 'message' => $error));
                return;
            }

            $d = $this->upload->data();
            $ReceiptPhoto = $d['file_name'];            
        }

        $ID = $this->input->post('ID');       
        $Note = $this->input->post('Note');

        $this->load->model('Sales_model');
        $this->Sales_model->updateStatus($ID, 'Closed');
        $this->Sales_model->updateDealStatus($ID, 'Closed');
        $this->Sales_model->setCloseDate($ID);

        $Date = date('Y-m-d H:i:s');
        $data = array(
            'Date' => $Date,
            'DealStatus' => 'Closed',
            'ContactDate' => $ReceiptPhoto,
            'Note' => $Note);
        
        $Log = json_encode($data);
        $Log = str_replace("\u", "\\\\u", $Log);      

        $this->load->model('Sales_model');
        $ret = $this->Sales_model->updateLog($ID, $Log);

        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Close Sale Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////STATISCS FUNCTIONS////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    public function getSalesStat() {
        $allSourceList = array();
        $interval = $this->input->post('Interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('Sales_model');
        $salesReps = $this->Sales_model->getAllSalesRep();

        if ($salesReps == null) {
            echo 'error';
        }

        foreach ($salesReps as $salesRep) {
            $result = $this->Sales_model->getStaticsData($salesRep['SalesRep'], $interval, $startDate, $endDate);

            $item = array();
            $item['name'] = $salesRep['SalesRep'];
            $item['num'] = count($result);
            $item['data'] = $result;

            array_push($allSourceList, $item);
        }

        usort($allSourceList, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($allSourceList);
    }

    public function getSalesStatByDealStatus() {
        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        
        $allSourceList = array();

        $interval = $this->input->post('Interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('Sales_model');
        
        $dealStatuses = $this->Sales_model->getAllDealStatuses();

        foreach ($dealStatuses as $dealStatus) {
            $result = $this->Sales_model->getSalesCountByDealStatus($dealStatus['DealStatus'], $interval, $startDate, $endDate);

            $item = array();
            if ($dealStatus['DealStatus'] == '')
                $item['name'] = lang('No Deal');
            else
                $item['name'] = lang($dealStatus['DealStatus']);
            $item['num'] = $result;

            array_push($allSourceList, $item);
        }

        usort($allSourceList, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($allSourceList);
    }

    public function getSalesStatByDealType() {
        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);

        $allSourceList = array();

        $interval = $this->input->post('Interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $this->load->model('Sales_model');
        
        $dealTypes = $this->Sales_model->getAllDealTypes();

        foreach ($dealTypes as $dealType) {
            if ($dealType['DealType'] == '')
                continue;

            $result = $this->Sales_model->getSalesCountByDealType($dealType['DealType'], $interval, $startDate, $endDate);

            $item = array();
            $item['name'] = lang($dealType['DealType']);
            $item['num'] = $result;

            array_push($allSourceList, $item);
        }

        usort($allSourceList, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($allSourceList);
    }

    public function getSalesStatByEqCategory() {
        $interval = $this->input->post('Interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->db->select('DealID, ID, DealType');
        if ($interval != 0) 
            $this->db->where('SalesStatus !=', 'Closed');
        if ($interval != 1)
        {
            $this->db->where('DateAdded >=', $startDate . " 00:00:00");
            $this->db->where('DateAdded <=', $endDate . " 23:59:59");
        }
        $this->db->where('SalesStatus !=', 'Canceled');
        $this->db->where('DealID !=', 0);
        $this->db->where('DealType !=', 'Logistics');
        $this->db->from('tblSales');
        $result = $this->db->get()->result_array();

        $categoryArray = array();

        foreach ($result as $row) {
            if ($row['DealType'] == 'Manufacturing') {
                $this->db->select('EquipmentCategory');
                $this->db->where('ID', $row['DealID']);
                $this->db->from('tblManufacturing');
                $this->db->limit(1);
                $deal = $this->db->get()->row_array();

                $category = 'Manufacturing '.$deal['EquipmentCategory'];

                if (array_key_exists($category, $categoryArray))
                    $categoryArray[$category]++;
                else   
                    $categoryArray[$category] = 1;
            }
            else {
                $this->db->select('EqCategory');
                $this->db->where('ID', $row['DealID']);
                $this->db->from('tblDeals');
                $this->db->limit(1);
                $deal = $this->db->get()->row_array();

                $category = $deal['EqCategory'];

                if (array_key_exists($category, $categoryArray))
                    $categoryArray[$category]++;
                else   
                    $categoryArray[$category] = 1;
            }
        }

        $returnArray = array();
        foreach ($categoryArray as $key => $value) {
            $item = array();
            $item['name'] = $key;
            $item['num'] = $value;
            array_push($returnArray, $item);
        }

        usort($returnArray, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($returnArray);
    }

    public function getNonInventoryByUploadedUser() {
        $interval = $this->input->post('Interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $DealTypeArray = array('Auction', 'For Sale', 'Consignment');

        $this->db->select('DealID, ID');
        if ($interval != 0) 
            $this->db->where('SalesStatus !=', 'Closed');
        if ($interval != 1) {
            $this->db->where('DateAdded >=', $startDate . " 00:00:00");
            $this->db->where('DateAdded <=', $endDate . " 23:59:59");
        }
        $this->db->where('SalesStatus !=', 'Canceled');
        $this->db->where_in('DealType', $DealTypeArray);
        $this->db->from('tblSales');
        $result = $this->db->get()->result_array();

        $userArray = array();

        foreach ($result as $row) {
            $this->db->select('tblDeals.ID');
            $this->db->select('tbluser.USERNAME');
            $this->db->from('tblDeals');
            $this->db->join('tbluser', 'tblDeals.UserID = tbluser.ID');
            $this->db->where('tblDeals.ID', $row['DealID']);
            $this->db->limit(1);
            $deal = $this->db->get()->row_array();

            $user = $deal['USERNAME'];

            if (array_key_exists($user, $userArray))
                $userArray[$user]++;
            else   
                $userArray[$user] = 1;
        }

        $returnArray = array();
        foreach ($userArray as $key => $value) {
            $item = array();
            $item['name'] = $key;
            $item['num'] = $value;
            array_push($returnArray, $item);
        }

        usort($returnArray, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($returnArray);
    }

    public function getSalesBySourceData() {
        $interval = $this->input->post('Interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->db->select('tblSales.OppID');
        $this->db->select('tblopportunities.Source');
        $this->db->from('tblSales');
        $this->db->join('tblopportunities', 'tblSales.OppID = tblopportunities.ID');
        if ($interval != 0) 
            $this->db->where('tblSales.SalesStatus !=', 'Closed');
        if ($interval != 1) {
            $this->db->where('tblSales.DateAdded >=', $startDate . " 00:00:00");
            $this->db->where('tblSales.DateAdded <=', $endDate . " 23:59:59");
        }
        $this->db->where('tblSales.SalesStatus !=', 'Canceled');                
        $result = $this->db->get()->result_array();

        $SourceArray = array();
        foreach ($result as $row) {
            $source = $row['Source'];
            if (array_key_exists($source, $SourceArray))
                $SourceArray[$source]++;
            else   
                $SourceArray[$source] = 1;
        }

        $returnArray = array();
        foreach ($SourceArray as $key => $value) {
            $item = array();
            $item['name'] = $key;
            $item['num'] = $value;
            array_push($returnArray, $item);
        }

        usort($returnArray, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($returnArray);
    }

    public function getDepositsDetail() {
        $interval = $this->input->post('interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->db->select('COALESCE(SUM(Amount), 0) as TotalDeposit');
        $this->db->select('Currency');
        $this->db->where('ProcurementID', 0);
        $this->db->group_by('Currency');
        $this->db->where('Date >=', $startDate . " 00:00:00");
        $this->db->where('Date <=', $endDate . " 23:59:59");
        $this->db->from('tbldeposits');
        $deposits = $this->db->get()->result_array();

        $this->db->select('ID');
        $this->db->from('tbldeposits');
        $this->db->where('Date >=', $startDate . " 00:00:00");
        $this->db->where('Date <=', $endDate . " 23:59:59");
        $this->db->where('ProcurementID', 0);
        $count = $this->db->count_all_results();


        echo json_encode(
            array(
                'count' => $count,
                'deposits' => $deposits
            )
            );
    }

    public function getMonthlySalesStatus() {
        $salesRep = $this->input->post('SalesRep');
        
        $this->load->model('Sales_model');

        $today = date('Y-m-d');
        $today_cnt = $this->Sales_model->getSalesCountByDate($salesRep, $today.' 00:00:00', $today.' 23:59:59');

        $start_month = date('Y-m-01');
        $end_month = date('Y-m-t');

        $month_cnt = $this->Sales_model->getSalesCountByDate($salesRep, $start_month.' 00:00:00', $end_month.' 23:59:59');

        echo json_encode(array(
            'today' => $today_cnt,
            'month' => $month_cnt
        ));
    }

    public function getMonthlySalesByUserStatus() {
        $start_month = date('Y-m-01');
        $end_month = date('Y-m-t');

        $this->load->model('Sales_model');
        $month_cnt = $this->Sales_model->getSalesCountByDate('All', $start_month.' 00:00:00', $end_month.' 23:59:59');

        $this->load->model('User_model');
        $allUsers = $this->User_model->getAllUser();

        $returnArray = array();

        foreach ($allUsers as $user) {
            $item = array();

            $item['name'] = $user['USERNAME'];
            $item['num'] = $this->Sales_model->getSalesCountByDate($user['USERNAME'], $start_month.' 00:00:00', $end_month.' 23:59:59');
            array_push($returnArray, $item);
        }

        usort($returnArray, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode(array(
            'users' => $returnArray,
            'month' => $month_cnt
        ));
    }

    public function getActiveSalesStatus() {
        $salesRep = $this->input->post('SalesRep');

        $this->load->model('Sales_model');

        $pending = $this->Sales_model->getSalesCountByStatus($salesRep, 'Pending');
        $shipping = $this->Sales_model->getSalesCountByStatus($salesRep, 'Shipping');
        $customs = $this->Sales_model->getSalesCountByStatus($salesRep, 'Customs');
        $shop = $this->Sales_model->getSalesCountByStatus($salesRep, 'Shop');

        echo json_encode(array(
            'pending' => $pending,
            'shipping' => $shipping,
            'customs' => $customs,
            'shop' => $shop
        ));
    }

    public function getReadySalesStatus() {
        $salesRep = $this->input->post('SalesRep');

        $this->load->model('Sales_model');

        $ready = $this->Sales_model->getSalesCountByStatus($salesRep, 'Ready');
        $usd_remain = $this->Sales_model->getRemainAmountByReadySale($salesRep, 'USD');
        $mxn_remain = $this->Sales_model->getRemainAmountByReadySale($salesRep, 'MXN');

        echo json_encode(array(
            'ready' => $ready,
            'usd' => $usd_remain,
            'mxn' => $mxn_remain
        ));
    }

    public function getNoDealSalesStatus() {
        $salesRep = $this->input->post('SalesRep');

        $this->load->model('Sales_model');

        $count = $this->Sales_model->getNoDealCount($salesRep);

        echo json_encode(array(
            'count' => $count
        ));
    }

    public function setBuyingUser() {
        $data = $this->input->post();
        $ID = $data['ID'];

        $this->load->model('Sales_model');
        $this->Sales_model->update(array('ID' => $ID), $data);

        echo json_encode(array(
            'success' => true            
        ));
    }

    public function getBuyingInfo() {
        $ID = $this->input->post('ID');

        $this->db->select('BuyingAmount, BuyingUser');
        $this->db->where('ID', $ID);
        $this->db->from('tblSales');
        $row = $this->db->get()->row_array();

        if ($row == null){
            echo json_encode(array(
                'success' => false,
                'message' => 'Invalid Sales ID'
            ));
            return;
        }

        echo json_encode(array(
            'success' => true,
            'BuyingAmount' => $row['BuyingAmount'],
            'BuyingUser' => $row['BuyingUser']
        ));
    }

    public function getIncentiveData() {
        $ID = $this->input->post('ID');

        $this->db->select('Price, Discount, Total, BuyingAmount, BuyingUser, SalesCurrency, DealID');
        $this->db->where('ID', $ID);
        $this->db->from('tblSales');
        $row = $this->db->get()->row_array();

        if ($row ==  null) {
            echo json_encode(array(
                'succes' => false,
                'message' => 'Invalid Sale ID'
            ));

            return;
        }

        $this->db->select('Margin');
        $this->db->where('ID', $row['DealID']);
        $this->db->from('tblDeals');
        $result = $this->db->get()->row_array();

        if ($row ==  null) {
            echo json_encode(array(
                'succes' => false,
                'message' => 'Invalid Deal ID'
            ));

            return;
        }

        $row['Margin'] = $result['Margin'];

        echo json_encode(array(
            'success' => true,
            'data' => $row
        ));
    }

    public function cancelSale() {
        $ID = $this->input->post('ID');
        $ReturnAmount = $this->input->post('ReturnAmount');
        
        $this->load->model('Sales_model');
        $this->load->model('Deposit_model');
        if ($ReturnAmount < 0) {
            echo json_encode(array("success" => false, 'message' => 'Negative Value'));
            return;
        }
        
        if ($ReturnAmount != 0)
        {            
            $ret = $this->Sales_model->checkDepositLimit($ID, -$ReturnAmount);

            if ($ret == false) {
                echo json_encode(array("success" => false, 'message' => 'Limited Deposit'));
                return;
            }
            
            $DepositID = $this->Deposit_model->insert(array(
                'SaleID' => $ID,
                'Date' => date('Y-m-d H:i:s'),
                'Amount' => -$ReturnAmount,
                'Currency' => 'USD',
                'ExchangeRate' => '1',
                'RealAmount' => -$ReturnAmount,
                'DepositType' => 'Electronic',
                'Concept' => 'Refund',
                'ReceiptPhoto' => ''
            ));
    
            if ($DepositID == 0) {
                echo json_encode(array(
                    'success' => false,
                    'Refund Failed'
                ));
                return;
            }
        }        

        $this->load->model('Sales_model');
        $this->Sales_model->cancelSale($ID);

        echo json_encode(array(
            'success' => true
        ));
    }

    public function getDocuments() {
        $ID = $this->input->post('ID');

        $this->db->select('*');
        $this->db->where('SalesID', $ID);
        $this->db->from('tbldocuments');
        $result = $this->db->get()->result_array();

        echo json_encode(
            array(
                'success' => true,
                'documents' => $result
            )
            );
    }

    public function uploadDocument() {
        $ID = $this->input->post('SalesID');
        $Title = $this->input->post('DocumentTitle');
        $ReceiptPhoto = '';

        if (!empty($_FILES["DocumentAttach"]["name"])) {

            $date = new DateTime();
            $filename = 'MHV'. sprintf('%06d', $ID) . '_' . $Title;

            $config['upload_path'] = 'assets/doc/';
            $config['allowed_types'] = '*';
            $config['overwrite'] = true;
            $config['file_name'] = $filename;

            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('DocumentAttach')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('success' => false, 'message' => $error));
                return;
            }

            $d = $this->upload->data();
            $ReceiptPhoto = $d['file_name'];            
        }

        $data = array(
            'SalesID' => $ID,
            'Title' => $Title,
            'Attach' => $ReceiptPhoto
        );

        $this->db->insert('tbldocuments', $data);

        echo json_encode(
            array(
                'success' => true
            )
            );
    }

    
    public function getSaleDetail() {
        $ID = $this->input->post('ID');

        $this->db->select('tblSales.*');
        $this->db->select(' tblopportunities.LeadType,
                            tblopportunities.CustomerID,
                            tblopportunities.Source                    
                            ');
        $this->db->select(' tblCustomer.Name,                            
                            tblCustomer.LastName, 
                            tblCustomer.Phone,       
                            tblCustomer.Email,
                            tblCustomer.CompanyName,
                            tblCustomer.RFC,
                            tblCustomer.Country,
                            tblCustomer.State,
                            tblCustomer.City
                            ');
        $this->db->select(' tblDeals.EqCategory,
                            tblDeals.PrimaryImage,
                            tblDeals.EqYear,
                            tblDeals.EqMake,
                            tblDeals.EqModel,
                            tblDeals.TruckYear,
                            tblDeals.TruckMake,
                            tblDeals.Length,
                            tblDeals.Type,
                            tblDeals.Capacity,
                            tblDeals.TruckModel,
                            tblDeals.EqSN,
                            tblDeals.Suspension,
                            tblDeals.HorsePower,
                            tblDeals.Hours,
                            tblDeals.Cab,
                            tblDeals.4WD,
                            tblDeals.EXt,
                            tblDeals.AuxHyd,
                            tblDeals.Ripper,
                            tblDeals.DealStatus as TruckStatus,
                            tblDeals.EndDate,
                            tblDeals.DealID as DealCode');        
        $this->db->select(' tblManufacturing.Capacity as ManuCapacity,
                            tblManufacturing.EquipmentCategory,
                            tblManufacturing.TruckMake as ManuTruckMake,
                            tblManufacturing.TruckYear as ManuTruckYear');
        $this->db->select(' tblLogistics.EqCategory as LogiEqCategory,
                            tblLogistics.PickUpCountry,
                            tblLogistics.PickUpState,
                            tblLogistics.PickUpCity,
                            tblLogistics.FinalCountry,
                            tblLogistics.FinalState,
                            tblLogistics.FinalCity                            
                        ');
        $this->db->select(' tblprocurement.BuyingPrice,
                            tblprocurement.Buyer,
                            tblprocurement.Status as ProcurementStatus
                        ');
        $this->db->select(' tbluser.USERNAME');
        $this->db->from('tblSales'); 
        $this->db->join('tblopportunities', 'tblSales.OppID = tblopportunities.ID',  'left');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');
        $this->db->join('tblManufacturing', 'tblSales.ID = tblManufacturing.IDSale and tblSales.DealID = tblManufacturing.ID', 'left');
        $this->db->join('tblLogistics', 'tblSales.ID = tblLogistics.SaleID and tblSales.DealID = tblLogistics.ID', 'left');
        $this->db->join('tbluser', 'tbluser.ID = tblDeals.UserID', 'left');
        $this->db->join('tblprocurement', 'tblSales.DealID = tblprocurement.DealID', 'left');
        $this->db->group_by('tblSales.ID');
        $this->db->where('tblSales.ID', $ID);
    
        $data = $this->db->get()->row_array();

        if ($data == null){
            echo json_encode(
                array(
                    'success' => false
                )
                );
            return;
        }

        $this->db->select('*');
        $this->db->where('SaleID', $ID);
        $this->db->from('tbldeposits');
        $depsoit_data = $this->db->get()->result_array();

        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');
        $this->db->from('tbldeposits');
        $this->db->where('SaleID', $ID);
        $totalDeposit = $this->db->get()->row_array();

        $UserID = $this->session->userdata('ID');
        $this->db->select('*');
        $this->db->from('tbluser');
        $this->db->where('ID', $UserID);
        $userData = $this->db->get()->row_array();

        echo json_encode(
            array(
                'success' => true,
                'sale' => $data,
                'deposits' => $depsoit_data,
                'TotalDeposit' => $totalDeposit['TotalDeposit'],
                'user' => $userData
            )
            );
    }

    public function changeSalesRep() {
        $ID = $this->input->post('ID');
        $SalesRep = $this->input->post('SalesRep');

        $this->load->model('Sales_model');
        $cnt = $this->Sales_model->update(
            array('ID' => $ID),
            array('SalesRep' => $SalesRep)
        );

        if ($cnt == 0) {
            echo json_encode(
                array(
                    'success' => false
                )
                );
            return;
        }

        echo json_encode(
            array(
                'success' => true
            )
            );
    }
}