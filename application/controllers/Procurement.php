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

class Procurement extends CI_Controller 
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

        $this->load->view('procurement/index', $viewData);
    }

    public function add() {
        $DealID = $this->input->post('DealID');
        $AddedFrom = $this->input->post('AddedFrom');
        $DateAdded = date('Y-m-d H:i:s');

        $this->load->model('Deal_model');
        $deal = $this->Deal_model->getRow(
            array(
                'ID' => $DealID
            ));

        if ($deal == null) {
            echo json_encode(
                array(
                    'success' => false,
                    'message' => 'Unkonw Deal ID'
                )
                );
            return;
        }
        
        $this->Deal_model->update(
            array(
                'ID' => $DealID
            ), 
            array(
                'DealStatus' => 'PendingProcurement'
            ));

        $this->load->model('Procurement_model');
        $ID = $this->Procurement_model->insert(array(
            'DealID' => $DealID,
            'OriginalPrice' => $deal['Price'],
            'AddedFrom' => $AddedFrom,
            'AddedBy' => $this->session->userdata('ID'),
            'DateAdded' => $DateAdded            
        ));

        if ($ID = 0) {
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

    public function undo() {
        $ID = $this->input->post('ID');

        $this->load->model('Procurement_model');        
        $Procurement = $this->Procurement_model->getRow(array(
            'ID' => $ID
        ));

        if ($Procurement == null) {
            echo json_encode(array(
                'success' => false
            ));
            return;
        }

        $DealID = $Procurement['DealID'];
        $AddedFrom = $Procurement['AddedFrom'];

        $this->load->model('Deal_model');
        $this->Deal_model->update(
            array(
                'ID' => $DealID
            ),
            array(
                'DealStatus' => ($AddedFrom == 'Sale' ? 'PendingSale' : '')
            )
            );
        
        $this->Procurement_model->delete(
            array(
                'ID' => $ID
            )
            );
            
        echo json_encode(array(
            'success' => true
        ));
    }

    public function cancel() {
        $ID = $this->input->post('ID');
        $ReturnAmount = $this->input->post('ReturnAmount');
        
        $this->load->model('Procurement_model');
        $this->load->model('Deposit_model');
        if ($ReturnAmount < 0) {
            echo json_encode(array("success" => false, 'message' => 'Negative Value'));
            return;
        }
        
        if ($ReturnAmount != 0)
        {            
            $ret = $this->Procurement_model->checkDepositLimit($ID, -$ReturnAmount);

            if ($ret == false) {
                echo json_encode(array("success" => false, 'message' => 'Limited Deposit'));
                return;
            }
            
            $DepositID = $this->Deposit_model->insert(array(
                'ProcurementID' => $ID,
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

        $this->db->where('ID', $ID);
        $this->db->update('tblprocurement', array(
            'Status' => 'Canceled',
            'EndDate' => date("Y-m-d H:i:s")
        ));

        echo json_encode(array(
            'success' => true
        ));
    }

    public function get() {
        $data = $this->input->post();

        $this->load->model('Procurement_model');
        $res = $this->Procurement_model->getRow($data);

        if ($res ==  null) {
            echo json_encode(
                array(
                    'success' => false
                )
                );
            return;
        }

        echo json_encode(
            array(
                'success' => false,
                'procurement' => $res
            )
            );
    }

    public function update() {
        $ID = $this->input->post('ID');
        $data = $this->input->post();

        $this->load->model('Procurement_model');
        $this->Procurement_model->update(
            array(
                'ID' => $ID
            ),
            $data
        );

        echo json_encode(
            array(
                'success' => true
            )
            );
    }

    public function udpateStatusByDeposit($ID) {        

        $this->load->model('Procurement_model');
        $totalDeposit = $this->Procurement_model->getTotalDeposit($ID);
        $Procurement = $this->Procurement_model->getRow(
            array(
                'ID' => $ID
            )
        );

        $Status = 'New';

        if ($totalDeposit > 0) {
            if (floatval($totalDeposit) >= floatval($Procurement['BuyingPrice']))
                $Status = 'Paid';
            else   
                $Status = 'In Progress';
        }
        
        $this->Procurement_model->update(
            array(
                'ID' => $ID
            ),
            array(
                'Status' => $Status
            )
            );
    }

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

        $this->load->model('Procurement_model');
        $ret = $this->Procurement_model->checkDepositLimit($ID, $RealAmount);

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
                'ProcurementID' => $ID,
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

        $this->udpateStatusByDeposit($ID);
        // $this->Sales_model->updateDepositCurrency($ID);

        echo json_encode(array('success' => true));
    }

    public function getDepositHistoryID() {
        $ID = $this->input->post('ID');

        $this->db->select('ID');
        $this->db->where('ProcurementID', $ID);
        $this->db->order_by('ID', 'desc');
        $this->db->from('tbldeposits');        
        $res = $this->db->get()->result_array();

        if ($res == null) {
            echo json_encode(array('success' => false, 'message' => 'You have no Deposits yet'));
            return;
        }

        echo json_encode(array('success' => true, 'data' => $res));
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
        $SaleID = $depositData['ProcurementID'];

        $this->load->model('Procurement_model');
        $ret = $this->Procurement_model->checkDepositLimit($SaleID, $RealAmount - $ExistingRealAmount);

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

        $this->udpateStatusByDeposit($SaleID);

        echo json_encode(array('success' => true));    
    }

    public function getTotalDeposit() {
        $SalesID = $this->input->post('ID');

        $this->db->select('COALESCE(SUM(RealAmount), 0) as TotalDeposit');
        $this->db->where('ProcurementID', $SalesID);
        $this->db->from('tbldeposits');
        $res = $this->db->get()->row_array();

        if ($res == null)   
        {
            echo json_encode(array('success' => false));
            return;
        }
        
        $totalDeposit =  $res['TotalDeposit'];

        if ($totalDeposit == null) {            
            echo json_encode(array('success' => false));
            return;
        }

        echo json_encode(array('success' => true, 'TotalDeposit' => $totalDeposit));
    }

    public function getDocuments() {
        $ID = $this->input->post('ID');

        $this->db->select('*');
        $this->db->where('ProcurementID', $ID);
        $this->db->from('tbldocuments');
        $result = $this->db->get()->result_array();

        echo json_encode(
            array(
                'success' => true,
                'documents' => $result
            )
            );
    }

    public function deleteDocument() {
        $ID = $this->input->post('ID');

        $this->db->select('*');
        $this->db->where('ID', $ID);
        $this->db->from('tbldocuments');
        $result = $this->db->get()->row_array();

        if ($result == null) {
            echo json_encode(
                array(
                    'success' => false
                )
                );
            return;
        }

        if (!file_exists('assets/doc/'.$result['Attach']))
         {
            echo json_encode(
                array(
                    'success' => false
                )
                );
            return;
         }        
        
        unlink('assets/doc/'.$result['Attach']);
        
        $this->db->where('ID', $ID);
        $this->db->delete('tbldocuments');

        echo json_encode(
            array(
                'success' => true
            )
            );
    }

    public function uploadDocument() {
        $ID = $this->input->post('ProcurementID');
        $Title = $this->input->post('DocumentTitle');
        $ReceiptPhoto = '';

        $this->load->model('Procurement_model');
        $procurement = $this->Procurement_model->getRow(
            array("ID" => $ID)
        );

        if (!empty($_FILES["DocumentAttach"]["name"])) {

            $date = new DateTime();
            $filename = 'MH'. sprintf('%06d', $procurement['DealID']) . '_' . $Title;

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
            'ProcurementID' => $ID,
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

    public function convertToInventory() {
        $DealID = $this->input->post('DealID');

        $this->db->where('ID', $DealID);
        $data = array(
            'DealType' => 'Inventory',
            'Price' => 0,
            'StartDate' => '',
            'EndDate' => '',
            'FinalPrice' => 0,
            'Total' => 0,
            'Margin' => 0,
            'Shipping' => 0,
            'Customs' => 0,
            'Commission' => 0,
            'BuyPremium' => 0
        );

        $this->db->update('tblDeals', $data);

        echo json_encode(array(
            'success' => true
        ));
    }

    public function getActiveBuyStatus() {
        $this->load->model('Procurement_model');

        $today = date('Y-m-d');
        $seven = date('Y-m-d', time() - 7 * 24 * 3600);
        $thirty = date('Y-m-d', time() - 30 * 24 * 3600);

        $today_count = $this->Procurement_model->getActiveBuyInPeriod($today, $today);
        $seven_count = $this->Procurement_model->getActiveBuyInPeriod($seven, $today);
        $thirty_count = $this->Procurement_model->getActiveBuyInPeriod($thirty, $today);
        $total = $this->Procurement_model->getActiveBuyInPeriod('2020-01-01', $today);

        echo json_encode(array(
            'Today' => $today_count,
            'Seven' => $seven_count - $today_count,
            'Thirty' => $thirty_count - $seven_count,
            'Total' => $total
        ));
    }

    public function getRemainingDepositStatus() {
        $this->load->model('Procurement_model');

        $usd = $this->Procurement_model->getRemainingAmount('USD');
        $mxn = $this->Procurement_model->getRemainingAmount('MXN');
        
        $this->db->select('ID');
        $this->db->where_in('Status', array('New', 'In Progress'));
        $this->db->where('BuyingPrice >', 0);
        $this->db->from('tblprocurement');
        $count = $this->db->count_all_results();

        echo json_encode(
            array(
                'Count' => $count,
                'USD' => $usd,
                'MXN' => $mxn
            )
            );
    }

    public function getData() {
        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');        
        $searchText = $this->input->post('searchText');    
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $minPrice = $this->input->post('minPrice');
        $maxPrice = $this->input->post('maxPrice');
        $minRemaining = $this->input->post('minRemaining');
        $maxRemaining = $this->input->post("maxRemaining");
        $status = $this->input->post('status');
        $start = $this->input->post('start');
        $length = $this->input->post('length');   
        
        $this->load->model('Procurement_model');

        $data = $this->Procurement_model->getAllData(          
            $searchText,
            $minStartDate,
            $maxStartDate,
            $minPrice,
            $maxPrice,
            $minRemaining,
            $maxRemaining,
            $status,
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

    public function getDataForExcel() {
        $searchText = $this->input->post('searchText');    
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $minPrice = $this->input->post('minPrice');
        $maxPrice = $this->input->post('maxPrice');
        $minRemaining = $this->input->post('minRemaining');
        $maxRemaining = $this->input->post("maxRemaining");
        $status = $this->input->post('status');

        $this->load->model('Procurement_model');

        $data = $this->Procurement_model->getAllDataForExcel(
            $minStartDate,
            $maxStartDate,
            $minPrice,
            $maxPrice,
            $minRemaining,
            $maxRemaining,
            $status,
            $searchText
        );

        header('content-type:application/json');
        echo  json_encode($data) ;
    }
}