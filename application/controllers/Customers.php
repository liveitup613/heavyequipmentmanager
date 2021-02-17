<?php
/*
@@ Customers Class
@@ By Zheng
@@ 2020-07-26
*/
?>

<?php

ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

class Customers extends CI_Controller 
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

        $this->load->view('page-customers', $viewData);
    }

    public function getCustomerData() {

        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');        
        $searchText = $this->input->post('searchText');    
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $minLastOppDate = $this->input->post('minLastOppDate');
        $maxLastOppDate = $this->input->post('maxLastOppDate');
        $start = $this->input->post('start');
        $length = $this->input->post('length');   
        
        $this->load->model('Customer_model');

        $data = $this->Customer_model->getAllData(          
            $searchText,
            $minStartDate,
            $maxStartDate,
            $minLastOppDate,
            $maxLastOppDate,
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

    public function getCustomerDataForExcel() {
        $searchText = $this->input->post('searchText');    
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $minLastOppDate = $this->input->post('minLastOppDate');
        $maxLastOppDate = $this->input->post('maxLastOppDate');
        
        $this->load->model('Customer_model');

        $data = $this->Customer_model->getAllDataForExcel(
            $searchText,
            $minStartDate,
            $maxStartDate,
            $minLastOppDate,
            $maxLastOppDate
        );

        header('content-type:application/json');
        echo  json_encode($data) ;
    }

    public function AddNewCustomer() {
        $data = $this->input->post();
        $data['DateAdded'] = date('Y-m-d H:i:s');

        $this->load->model('Customer_model');
        $id = $this->Customer_model->insert($data);

        if ($id == 0)
        {
            echo json_encode(array(
                'success' => false,
                'message' => 'Already'
            ));
            return;
        }

        echo json_encode(array(
            'success' => true            
        ));
    }

    public function UpdateCustomer() {
        $ID = $this->input->post('ID');
        $Phone = $this->input->post('Phone');
        $data = $this->input->post();

        $this->db->select('ID');
        $this->db->where('ID !=', $ID);
        $this->db->where('Phone', $Phone);
        $this->db->from('tblCustomer');
        $result = $this->db->get()->result_array();

        if ($result != null) {
            echo json_encode(array(
                'success' => false,
                'message' => 'already'
            ));
            return;
        }

        $this->load->model('Customer_model');

        $this->Customer_model->update(array('ID' => $ID), $data);
        
        echo json_encode(array(
            'success' => true
        ));
    }

    public function getCustomerByID() {
        $ID = $this->input->post('ID');

        $this->db->select('*');
        $this->db->where('ID', $ID);
        $this->db->from('tblCustomer');
        $data = $this->db->get()->row_array();

        echo json_encode($data);
    }

    public function deleteCustomer() {
        $ID = $this->input->post('ID');
        
        $this->load->model('Customer_model');
        $this->Customer_model->delete(array('ID' => $ID));

        echo json_encode(array(
            'success' => true
        ));
    }

    public function getCustomer() {
        $Phone = $this->input->post('Phone');

        $this->db->select('*');
        $this->db->where('Phone', $Phone);
        $this->db->from('tblCustomer');
        $row = $this->db->get()->row_array();

        if ($row == null) {
            echo json_encode(array(
                'success' => false
            ));
            return;
        }

        echo json_encode(array(
            'sucess' => true,
            'customer' => $row
        ));
    }

    public function getInvoiceData() {
        $ID = $this->input->post('ID');

        $this->db->select('*');
        $this->db->where('ID', $ID);
        $this->db->from('tblCustomer');
        $row = $this->db->get()->row_array();

        if ($row == null) {
            echo json_encode(array(
                'success' => false
            ));
            return;
        }

        echo json_encode(array(
            'sucess' => true,
            'invoice' => $row
        ));
    }

    public function updateInvoiceData() {
        $data = $this->input->post();
        $ID = $this->input->post('ID');

        $this->db->set($data);
        $this->db->where('ID', $ID);
        $this->db->update('tblCustomer');

        echo json_encode(array(
            'success' => true
        ));
    }

    public function getActivity() {
        $ID = $this->input->post('ID');

        $this->db->select('Name, LastName, Phone');
        $this->db->where('ID', $ID);
        $this->db->from('tblCustomer');
        $customerInfo = $this->db->get()->row_array();

        $returnArray = array();

        $Leads = $this->getLeadsActivity($ID);

        foreach ($Leads as $lead) {
            $newItem = array();
            $newItem['date'] = $lead['DateAdded'];
            $newItem['username'] = $lead['USERNAME'];
            $newItem['avatar'] = $lead['PROFILEPICTURE'];
            $newItem['stage'] = 'Lead';
            $newItem['source'] = $lead['Source'];

            array_push($returnArray, $newItem);
        }

        $Opps = $this->getOppActivity($ID);

        foreach ($Opps as $opp) {
            $newItem = array();

            $newItem['date'] = $opp['DateAdded'];
            $newItem['stage'] = 'Opportunity';
            $newItem['username'] = $opp['USERNAME'];
            $newItem['avatar'] = $opp['PROFILEPICTURE'];
            $newItem['endDate'] = $opp['ClosingDate'];
            $newItem['source'] = $opp['Source'];
            $source = $opp['Source'];
            if (strpos($source, 'MyOpp') !== false || strpos($source, 'CFU') !== false) {
                $newItem['stage'] = 'My Opportunity';
            }
            array_push($returnArray, $newItem);

            $OppID = $opp['ID'];

            $Assigns = $this->getAssignmentActivity($OppID);
            foreach ($Assigns as $assign) {
                $newItem = array();
                $newItem['date'] = $assign['AssignDate'];
                $newItem['stage'] = 'Assignment';
                $newItem['username'] = $assign['USERNAME'];
                $newItem['avatar'] = $assign['PROFILEPICTURE'];
                $newItem['endDate'] = $assign['ClosingDate'];
                $newItem['salesRep'] = $assign['SalesRep'];
                $newItem['assginStage'] = $assign['Stage'];
                array_push($returnArray, $newItem);
            }

            $CFU = $this->getCFUActivity($OppID);
            foreach ($CFU as $cfu) {
                $newItem = array();
                if ($cfu['DateAdded'] == '0000-00-00 00:00:00')
                    $newItem['date'] = $cfu['ClosingDate'];
                else    
                    $newItem['date'] = $cfu['DateAdded'];
                $newItem['stage'] = 'CFU';
                $newItem['surveyUser'] = $cfu['SurveySup'];                
                $newItem['surveyDate'] = $cfu['SurveyDate'];
                $newItem['closedUser'] = $cfu['ClosedBy'];
                $newItem['closedDate'] = $cfu['CFUClosedDate'];
                array_push($returnArray, $newItem);
            }

            $Sales = $this->getSalesActivity($OppID);
            foreach ($Sales as $sale) {
                $newItem = array();
                $newItem['date'] = $sale['DateAdded'];
                $newItem['stage'] = 'Sales';
                $newItem['username'] = $sale['SalesRep'];                
                array_push($returnArray, $newItem);
            }
        }

        usort($returnArray, function($a, $b) {
            return $a['date'] > $b['date'];
        });

        echo json_encode(array(
            'success' => true,
            'data' => $returnArray,
            'name' => $customerInfo['Name'].' ' .$customerInfo['LastName'],
            'phone' => $customerInfo['Phone']
        ));
    }

    private function getLeadsActivity($CustomerID) {
        $this->db->select('tblLeads.DateAdded, tblLeads.Source');
        $this->db->select('tbluser.USERNAME, tbluser.PROFILEPICTURE');
        $this->db->from('tblLeads');
        $this->db->join('tbluser', 'tblLeads.ClosedBy = tbluser.USERNAME', 'left');
        $this->db->where('tblLeads.CustomerID', $CustomerID);

        $result = $this->db->get()->result_array();

        return $result;
    }

    private function getOppActivity($CustomerID) {
        $this->db->select('tblopportunities.ID, tblopportunities.DateAdded, tblopportunities.ClosingDate, tblopportunities.Source');
        $this->db->select('tbluser.USERNAME, tbluser.PROFILEPICTURE');
        $this->db->from('tblopportunities');
        $this->db->join('tbluser', 'tblopportunities.AddedBy = tbluser.USERNAME', 'left');
        $this->db->where('tblopportunities.CustomerID', $CustomerID);

        $result = $this->db->get()->result_array();

        return $result;
    }

    private function getAssignmentActivity($OppID) {
        $this->db->select('tblassignments.AssignDate, tblassignments.SalesRep, tblassignments.Stage,, tblassignments.ClosingDate');
        $this->db->select('tbluser.USERNAME, tbluser.PROFILEPICTURE');
        $this->db->from('tblassignments');
        $this->db->join('tbluser', 'tbluser.USERNAME = tblassignments.AssignedBy', 'left');
        $this->db->where('tblassignments.OpportunityID', $OppID);

        $result = $this->db->get()->result_array();

        return $result;
    }

    private function getCFUActivity($OppID) {
        $this->db->select('tblcfu.ID, tblcfu.DateAdded, tblcfu.SurveyDate, tblcfu.SurveySup, tblcfu.ClosingDate as CFUClosedDate, tblcfu.ClosedBy');
        $this->db->select('tblopportunities.ClosingDate');        
        $this->db->from('tblcfu');
        $this->db->join('tblopportunities', 'tblopportunities.ID = tblcfu.OpportunityID');        
        $this->db->where('tblcfu.OpportunityID', $OppID);
        $this->db->group_by('tblcfu.ID');

        return $this->db->get()->result_array();
    }

    private function getSalesActivity($OppID) {
        $this->db->select('tblSales.ID, tblSales.DateAdded, tblSales.SalesRep');
        $this->db->from('tblSales');        
        $this->db->where('tblSales.OppID', $OppID);        

        return $this->db->get()->result_array();
    }

    public function createContactBody() {
        $ID = $this->input->post('ID');

        $this->load->model('Customer_model');
        $customer = $this->Customer_model->getByID($ID);

        $doc = new \DOMDocument();
        $doc->formatOutput = true;
        $entry = $doc->createElement('atom:entry');
        $entry->setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:atom', 'http://www.w3.org/2005/Atom');
        $entry->setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:gd', 'http://schemas.google.com/g/2005');
        $entry->setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:gd', 'http://schemas.google.com/g/2005');
        $doc->appendChild($entry);

        $name = $doc->createElement('gd:name');
        $entry->appendChild($name);
        
        $givenName = $doc->createElement('gd:givenName', $customer['Name']);
        $name->appendChild($givenName);

        $familyName = $doc->createElement('gd:familyName', $customer['LastName']);
        $name->appendChild($familyName);

        $email = $doc->createElement('gd:email');
        $email->setAttribute('rel', 'http://schemas.google.com/g/2005#work');
        $email->setAttribute('address', $customer['Email']);
        $entry->appendChild($email);

        $contact = $doc->createElement('gd:phoneNumber', $customer['Phone']);
        $contact->setAttribute('rel', 'http://schemas.google.com/g/2005#work');
        $entry->appendChild($contact);

        $postAddress = $doc->createElement('gd:structuredPostalAddress');
        $postAddress->setAttribute('rel', 'http://schemas.google.com/g/2005/#work');
        $postAddress->setAttribute('primary', 'true');
        $entry->appendChild($postAddress);

        $city = $doc->createElement('gd:city', $customer['City']);
        $postAddress->appendChild($city);

        $state = $doc->createElement('gd:region', $customer['State']);
        $postAddress->appendChild($state);

        $country = $doc->createElement('gd:country', $customer['Country']);
        $postAddress->appendChild($country);        

        $xmlToSend = $doc->saveXML();

        echo $xmlToSend;
    }

    // public function updateDateAdded() {

    //     $this->db->select('*');
    //     $this->db->from('tblCustomer');
    //     $result = $this->db->get()->result_array();

    //     foreach ($result as $row) {
    //         $CustomerDate = '0000-00-00 00:00:00';
    //         $LastOpp = '0000-00-00 00:00:00';
    //         $CustomerID = $row['ID'];

    //         $this->db->select('DateAdded');
    //         $this->db->where('CustomerID', $CustomerID);
    //         $this->db->limit(1);
    //         $this->db->order_by('DateAdded', 'asc');
    //         $this->db->from('tblLeads');
    //         $leadData = $this->db->get()->row_array();

    //         $this->db->select('DateAdded');
    //         $this->db->where('CustomerID', $CustomerID);
    //         $this->db->limit(1);
    //         $this->db->order_by('DateAdded', 'asc');
    //         $this->db->from('tblopportunities');
    //         $oppData = $this->db->get()->row_array();

    //         if ($leadData != null && $oppData != null) {
    //             $CustomerDate = ($leadData['DateAdded'] < $oppData['DateAdded'] ? $leadData['DateAdded'] : $oppData['DateAdded']);                
    //         } 
    //         else if ($leadData != null)
    //             $CustomerDate = $leadData['DateAdded'];
    //         else if ($oppData != null)
    //             $CustomerDate = $oppData['DateAdded'];

    //         $this->db->select('DateAdded');
    //         $this->db->where('CustomerID', $CustomerID);
    //         $this->db->limit(1);
    //         $this->db->order_by('DateAdded', 'desc');
    //         $this->db->from('tblopportunities');
    //         $oppData = $this->db->get()->row_array();
            
    //         if ($oppData != null) {
    //             $LastOpp = $oppData['DateAdded'];
    //         }
    
    //         $this->db->set('DateAdded', $CustomerDate);
    //         $this->db->set('LastOpportunity', $LastOpp);
    //         $this->db->where('ID', $CustomerID);
    //         $this->db->update('tblCustomer');
    
    //         echo $CustomerID . ' ';
    //     }
        
    // }
}