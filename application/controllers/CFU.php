<?php
/*
@@ LEAD-MANAGEMENT.JS
@@ By Zheng
@@ 2020-03-09
*/
?>


<?php

ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

class CFU extends CI_Controller 
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

    public function index() {
        $ID = $this->session->userdata('ID');
        $language = $this->session->userdata('Lang');

        $this->db->select('SURVEY, VERIFY');
        $this->db->where('ID', $ID);
        $this->db->from('tbluser');
        $result = $this->db->get()->row_array();
        if ($result == null || ($result['SURVEY'] == 'OFF' && $result['VERIFY'] == 'OFF'))
            redirect('Deals');

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $this->load->model('CFU_model');
        $viewData['ScheduledCount'] = $this->CFU_model->getScheduledBeforeTodayCount();
            
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('page-cfu', $viewData);
    }

    public function getCFUData() {
        $this->load->model('CFU_model');

        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $status = $this->input->post('status');
        $shouldVerify = $this->input->post('shouldVerify');
        $verified = $this->input->post('verified');
        $searchText = $this->input->post('searchText');    
        $start = $this->input->post('start');
        $length = $this->input->post('length');    
        $minAucYear = $this->input->post('minAucYear');
        $maxAucYear = $this->input->post('maxAucYear');

        $data = $this->CFU_model->getAllData(
            $minAucYear,
            $maxAucYear,
            $status,
            $shouldVerify,
            $verified,
            $searchText,
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

    public function getCFUDataForExcel(){
        $this->load->model('CFU_model');

       
        $status = $this->input->post('status');
        $shouldVerify = $this->input->post('shouldVerify');
        $verified = $this->input->post('verified');
        $searchText = $this->input->post('searchText');         
        $minAucYear = $this->input->post('minAucYear');
        $maxAucYear = $this->input->post('maxAucYear');

        $data = $this->CFU_model->getAllDataForExcel(
            $minAucYear,
            $maxAucYear,
            $status,
            $shouldVerify,
            $verified,
            $searchText
        );

        header('content-type:application/json');
        echo json_encode($data);
    }

    public function attemptContact() {
        $id = $this->input->post('ID');
        $Status = $this->input->post('Status');

        $this->load->model('CFU_model');        
        $this->load->model('User_model');        
        $user_id = $this->session->userdata('ID');        
        $viewData = $this->User_model->getUserInfo($user_id);

        $result = $this->CFU_model->attemptContact($id, $viewData['USERNAME'], $Status);

        if ($result == 0) {
            echo json_encode(array("success" => false, 'message' => 'Attempt Contact Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function getCFUById() {
        $id = $this->input->post('ID');
        $this->db->select('*');
        $this->db->where('ID', $id);
        $this->db->from('tblcfu');
        $result = $this->db->get()->row_array();

        echo json_encode($result);
    }

    public function getOppIDByCFU() {
        $ID = $this->input->post('ID');

        $this->db->select('OpportunityID');
        $this->db->where('ID', $ID);    
        $result = $this->db->get('tblcfu')->row_array();

        if ($result == null) {
            echo json_encode(array("success" => false, 'message' => 'Survey Failed'));
            return;
        }

        $OppID = $result['OpportunityID'];       

        echo json_encode(array('success' => true, 'OppID' => $OppID));
    }

    public function saveSurvey() {
        $ID = $this->input->post('ID');
        $data = $this->input->post();
        $data['SurveyDate'] = date('Y-m-d H:i:s');

        if ($data['SurveySalesRep'] == 'No Contact' || $data['SurveySalesRep'] == 'Bad')
            $data['ShouldVerify'] = 'true';
        if ($data['SurveyOffer'] == 'No Offer' || $data['SurveyOffer'] == 'Bad')
            $data['ShouldVerify'] = 'true';

        $this->load->model('CFU_model');
        $affected_rows = $this->CFU_model->update(array('ID'=> $ID), $data);

        if ($affected_rows == 0) {
            echo json_encode(array("success" => false, 'message' => 'Survey Failed'));
            return;
        }

        $this->db->select('OpportunityID');
        $this->db->where('ID', $ID);    
        $result = $this->db->get('tblcfu')->row_array();

        if ($result == null) {
            echo json_encode(array("success" => false, 'message' => 'Survey Failed'));
            return;
        }

        $OppID = $result['OpportunityID'];       

        echo json_encode(array('success' => true, 'OppID' => $OppID));
    }

    public function updateStatusByID() {
        $ID = $this->input->post('ID');
        $Status = $this->input->post('Status');
        $User = $this->input->post('User');

        $this->load->model('CFU_model');

        $data = array(
            'Status' => $Status
        );

        if ($Status == 'Opportunity') {            
            $data['ToContactDate'] = '';
            $log = array(
                'Status' => 'Opportunity',
                'Date' => date('Y-m-d H:i:s'),
            );
            $this->CFU_model->updateContactLog($ID, json_encode($log));
        }
        else if ($Status == 'Scheduled') {
            $data['ToContactDate'] = $this->input->post('ToContactDate');                        
            $log = array(
                'Status' => 'Scheduled',
                'Note' => $this->input->post('Note'),
                'Date' => date('Y-m-d H:i:s'),
                'ToContactDate' => $this->input->post('ToContactDate')
            );

            $log = json_encode($log);
            $log = str_replace('\u', '\\\\u', $log);
            $this->CFU_model->updateContactLog($ID, $log);            
        }
        else if ($Status == 'Closed') {
            $data['ClosingDate'] = date('Y-m-d H:i:s');   
            $data['ClosedBy'] = $User;
            $data['ToContactDate'] = '';
            $log = array(
                'Status' => 'Closed',
                'Date' => date('Y-m-d H:i:s')
            );            
            $this->CFU_model->updateContactLog($ID, json_encode($log));
        }
        
        $affected_rows = $this->CFU_model->update(array('ID'=> $ID), $data);

        if ($affected_rows == 0) {
            echo json_encode(array("success" => false, 'message' => 'Update Status Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }    

    public function verify() {
        $ID = $this->input->post('ID');
        $data = $this->input->post();

        $data['VerifyDate'] = date('Y-m-d H:i:s');
        $data['ShouldVerify'] = '';

        switch ($data['VerifySales']) {
            case 'No Contact':
                $data['VerifyResult'] = '-2';
            break;
            case 'Bad':
                $data['VerifyResult'] = '-1';
            break;
            case 'OK':
                $data['VerifyResult'] = '0';
            break;
            case 'Great':
                $data['VerifyResult'] = '1';
            break;

        }

        $this->load->model('CFU_model');
        $affected_rows = $this->CFU_model->update(array('ID'=> $ID), $data);

        if ($affected_rows == 0) {
            echo json_encode(array("success" => false, 'message' => 'Verify Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function GetSurveyVerifyComment() {
        $ID = $this->input->post('ID');

        $this->db->select('SurveyComm, VerifyComm');
        $this->db->where('ID', $ID);
        $this->db->from('tblcfu');
        $result = $this->db->get()->row_array();

        echo json_encode($result);
    }

    public function getSurveyResult() {
        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);

        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('CFU_model');        
        $data = array();

        $item['name'] = 'Total';
        $item['num'] = $this->CFU_model->getAllSurveyCount($startDate, $endDate);

        array_push($data, $item);

        $SurveySalesRep = array('No Contact' => 'No Contact', 'Bad' => 'Bad Contact', 'OK' => 'OK Contact', 'Great' => 'Great Contact');        
        $SurveyOffer = array('No Offer' => 'No Offer', 'Bad' => 'Bad Offer', 'OK' => 'OK Offer', 'Great' => 'Great Offer');

        foreach ($SurveySalesRep as $key => $Survey) {            
            $item['name'] = lang($Survey);
            $item['num'] = $this->CFU_model->getAllSurveySalesRepCount($key, $startDate, $endDate);

            array_push($data, $item);
        }

        foreach ($SurveyOffer as $key => $Survey) {            
            $item['name'] = lang($Survey);
            $item['num'] = $this->CFU_model->getAllSurveyOfferCount($key, $startDate, $endDate);

            array_push($data, $item);
        }        

        $CFUBecameOpp = $this->CFU_model->getAllCFUBecameOpp($startDate, $endDate);        

        echo json_encode(array(
            'data' =>$data,
            'Opp' => $CFUBecameOpp)
        );
    }

    public function getActiveCFUStatus() {
        $this->load->model('CFU_model');

        $new = $this->CFU_model->getCFUCountByStatus('New');
        $pending = $this->CFU_model->getCFUCountByStatus('Pending');
        $scheduled = $this->CFU_model->getCFUCountByStatus('Scheduled');

        echo json_encode(array('new' => $new, 'pending' => $pending, 'scheduled' => $scheduled));
    }

    public function getScheduledCFUStatus() {
        $this->load->model('CFU_model');

        $today = $this->CFU_model->getScheduledBeforeTodayCount();
        $expired = $this->CFU_model->getScheduledBeforeYesterdayCount();        

        echo json_encode(array('today' => $today - $expired, 'expired' => $expired));
    }    

    public function getUpdatedCFUStatus() {
        $this->load->model('Activity_model');

        $today = date('Y-m-d');
        $scheduled = $this->Activity_model->getActivityCountByAction('all', 'Schedule CFU', $today, $today);
        $opportunity = $this->Activity_model->getNewOppByCFU($today);
        $closed = $this->Activity_model->getActivityCountByAction('all', 'Close CFU', $today, $today);

        echo json_encode(array('scheduled' => $scheduled, 'opportunity' => $opportunity, 'closed' => $closed));
    }
}