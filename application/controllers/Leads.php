<?php

ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

class Leads extends CI_Controller 
{
    public function __construct() {
        parent::__construct();

        date_default_timezone_set('America/Phoenix');        
        $this->output->disable_cache();

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

        $this->db->select('LEADS');
        $this->db->where('ID', $ID);
        $this->db->from('tbluser');
        $result = $this->db->get()->row_array();
        if ($result == null || $result['LEADS'] == 'OFF')
            redirect('Deals');

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('page-lead', $viewData);
    }

    public function statistic() {
        $ID = $this->session->userdata('ID');
        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;


        $this->load->view('page-state-demand', $viewData);
    }

    public function updateStatus() {
        $this->load->model('Lead_model');

        $this->Lead_model->updateStatus();

        echo 'success';
    }

    public function getLeadData() {
        $this->load->model('Lead_model');

        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $status = $this->input->post('status');
        $minStart = $this->input->post('minStart');
        $maxStart = $this->input->post('maxStart');
        $rate = $this->input->post('rate');
        $searchText = $this->input->post('searchText');    
        $start = $this->input->post('start');
        $length = $this->input->post('length');    

        $data = $this->Lead_model->getAllData(
            $status,
            $minStart,
            $maxStart,
            $rate,
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

    public function getLeadDataForExcel() {
        $status = $this->input->post('status');
        $minStart = $this->input->post('minStart');
        $maxStart = $this->input->post('maxStart');
        $rate = $this->input->post('rate');
        $searchText = $this->input->post('searchText');    

        $this->load->model('Lead_model');
        
        $data = $this->Lead_model->getAllDataForExcel(
            $status,
            $minStart,
            $maxStart,
            $rate,
            $searchText
        );

        header('content-type:application/json');
        echo  json_encode($data) ;
    }

    public function AddNewLead() {
        $data = $this->input->post();

        $this->load->model('Lead_model');

        $this->load->model('Customer_model');
        $customer_ID = $this->Customer_model->updateCustomer($data);

        $this->db->select('ID');
        $statuses = array("New", "Pending", "Assigned");
        $this->db->where_in('Status', $statuses);
        $this->db->where('CustomerID', $customer_ID);
        $this->db->from('tblopportunities');
        $result = $this->db->get()->result_array();

        if ($result != null) {
            echo json_encode(array('success' => false, 'message' => 'Phone number is an Active Opportunity ERROR'));
            return;
        }

        $id = $this->Lead_model->addNewLead(array(
            'LeadType' => $data['LeadType'],
            'EqCategory' => $data['EqCategory'],
            'EqMake' => $data['EqMake'],
            'EqModelCap' => $data['EqModelCap'],
            'MinYear' => $data['MinYear'],
            'MaxPrice' => $data['MaxPrice'],
            'Unit' => $data['Unit'],
            'TimeFrame' => $data['TimeFrame'],
            'AdditionalInfo' => $data['AdditionalInfo'],
            'Source' => $data['Source'],
            'CustomerID' => $customer_ID
        ));

        if ($id == null) {
            echo json_encode(array('success' => false, 'message' => 'Add New Lead Failed'));
        }
        
        echo json_encode(array('success' => true, 'ID' => $id));
    }

    public function attemptContact() {
        $id = $this->input->post('ID');

        $this->load->model('Lead_model');        
        $this->load->model('User_model');        
        $user_id = $this->session->userdata('ID');        
        $viewData = $this->User_model->getUserInfo($user_id);

        $result = $this->Lead_model->attemptContact($id, $viewData['USERNAME']);

        if ($result == 0) {
            echo json_encode(array("success" => false, 'message' => 'Attempt Contact Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function getLeadById() {
        $id = $this->input->post('ID');

        $this->db->select('tblLeads.*');
        $this->db->select('tblCustomer.Name,
                            tblCustomer.LastName,
                            tblCustomer.Phone,
                            tblCustomer.Email,
                            tblCustomer.CompanyName,
                            tblCustomer.Country,
                            tblCustomer.State,
                            tblCustomer.City,
                            tblCustomer.RFC
                        ');
        $this->db->join('tblCustomer', 'tblLeads.CustomerID = tblCustomer.ID', 'left');
        $this->db->where('tblLeads.ID', $id);
        $this->db->from('tblLeads');
        $result = $this->db->get()->row_array();

        echo json_encode($result);
    }

    public function UpdateLead() {
        $id = $this->input->post('ID');
        $data = $this->input->post();

        $this->load->model('Customer_model');
        $customer_ID = $this->Customer_model->updateCustomer($data);

        $this->load->model('Lead_model');
        $result = $this->Lead_model->update(array("ID" => $id), array(
            'LeadType' => $data['LeadType'],
            'EqCategory' => $data['EqCategory'],
            'EqMake' => $data['EqMake'],
            'EqModelCap' => $data['EqModelCap'],
            'MinYear' => $data['MinYear'],
            'MaxPrice' => $data['MaxPrice'],
            'Unit' => $data['Unit'],
            'TimeFrame' => $data['TimeFrame'],
            'Rate' => $data['Rate'],
            'AdditionalInfo' => $data['AdditionalInfo'],
            'Source' => $data['Source'],
            'CustomerID' => $customer_ID
        ));

        echo json_encode(array('success' => true));
    }

    public function deleteLead() {
        $id = $this->input->post('ID');

        $this->load->model('Lead_model');
        $result = $this->Lead_model->delete(array("ID" => $id));

        if ($result == 0) {
            echo json_encode(array("success" => false, 'message' => 'Delete Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function updateStatusByID() {
        $id = $this->input->post('ID');
        $status = $this->input->post('Status');
        $date = date('Y-m-d H:i:s');

        $this->load->model('Lead_model');

        $result = $this->Lead_model->update(array('ID' => $id), array('Status' => $status, 'ClosingDate' => $date));

        if ($result == 0) {
            echo json_encode(array("success" => false, 'message' => 'Update Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function setClosedUser() {
        $ID = $this->input->post("ID");
        $User = $this->input->post("User");

        $this->db->set('ClosedBy', $User);
        $this->db->where('ID', $ID);
        $this->db->update('tblLeads');

        echo 'success';
    }

    public function getLeadsPerSource() {
        $allSourceList = array();

        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('Lead_model');        
        $sourecList = $this->Lead_model->getAllSources();

        foreach ($sourecList as $source) {
            $item = array();
            $item['name'] = $source['Source'];
            $item['num'] = $this->Lead_model->getLeadsCountBySource($source['Source'], $startDate, $endDate);
            $item['oppNum'] = $this->Lead_model->getLeadsToOppCountBySource($source['Source'], $startDate, $endDate);
            array_push($allSourceList, $item);
        }     

        usort($allSourceList, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($allSourceList);
    }

    public function getActiveLeadStatus() {
        $this->load->model('Lead_model');

        $new = $this->Lead_model->getLeadCountByStatus('New');
        $pending = $this->Lead_model->getLeadCountByStatus('Pending');

        echo json_encode(array('new' => $new, 'pending' => $pending));
    }

    public function getUpdatedLeadStatus() {
        $this->load->model('Activity_model');
        $this->load->model('Lead_model');

        $today = date('Y-m-d');
        $opportunity = $this->Activity_model->getActivityCountByAction('all', 'Lead Contact', $today, $today);
        $info = $this->Lead_model->getInfoCountToday();
        $noLead = $this->Lead_model->getNoLeadCountToday();

        echo json_encode(array('opportunity' => $opportunity - $noLead - $info, 'noLead' => $info + $noLead, 'info' => $info));
    }

    public function getTodayAddedLeadStatus() {
        $this->load->model('Lead_model');

        $count = $this->Lead_model->getTodayAddedCount();

        echo json_encode(array('count' => $count));
    }
}