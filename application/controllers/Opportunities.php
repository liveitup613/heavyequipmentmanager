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

class Opportunities extends CI_Controller 
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

        $this->db->select('SALESREP, SUPERVISOR');
        $this->db->where('ID', $ID);
        $this->db->from('tbluser');
        $result = $this->db->get()->row_array();
        if ($result == null || ($result['SALESREP'] == 'OFF' && $result['SUPERVISOR'] == 'OFF'))
            redirect('Deals');

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $this->load->model('Assignment_model');
        $viewData['SearchHelpCount'] = $this->Assignment_model->getSearchHelpCount();

        $this->load->model('Configuration_model');
        $expirationStatus = $this->Configuration_model->getExpirationStatus();
        $viewData['ExpirationStatus'] = $expirationStatus;        

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;


        $this->load->view('page-opportunity', $viewData);
    }

    public function mine() {
        $ID = $this->session->userdata('ID');

        $this->db->select('SALESREP, SUPERVISOR');
        $this->db->where('ID', $ID);
        $this->db->from('tbluser');
        $result = $this->db->get()->row_array();
        if ($result == null || ($result['SALESREP'] == 'OFF' && $result['SUPERVISOR'] == 'OFF'))
            redirect('Deals');

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);

        $this->db->where('LastSalesRep', $viewData['USERNAME']);
        $this->db->where('Status', 'Pending');
        $this->db->from('tblopportunities');
        $viewData['PendingOpps'] = $this->db->count_all_results();        

        $this->load->model('Assignment_model');
        $viewData['SearchHelpCount'] = $this->Assignment_model->getSearchHelpCount();

        $this->load->model('Configuration_model');
        $expirationStatus = $this->Configuration_model->getExpirationStatus();
        $viewData['ExpirationStatus'] = $expirationStatus;

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('page-my-opportunity', $viewData);
    }

    public function proposal($AssignID = 0, $Type = 'Equipment') {
        $ID = $this->session->userdata('ID');

        $this->db->select('SALESREP, SUPERVISOR');
        $this->db->where('ID', $ID);
        $this->db->from('tbluser');
        $result = $this->db->get()->row_array();
        if ($result == null || ($result['SALESREP'] == 'OFF' && $result['SUPERVISOR'] == 'OFF'))
            redirect('Deals');

        if ($AssignID == 0) 
            redirect(base_url('Opportunities/mine'));

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($ID);       
        $viewData['AssignmentID'] = $AssignID;
        $viewData['Type'] = $Type;

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;
        
        $this->load->view('page-proposal', $viewData);
    }

    public function getProposalDocumentData() {
        $DealID = $this->input->post('ID');
        $AssignID = $this->input->post('AssignmentID');

        $this->db->select('*');
        $this->db->where('ID', $DealID);
        $this->db->from('viewActiveDeals');
        $result =  $this->db->get()->row_array();
        
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
        $this->db->from('tblassignments');
        $this->db->join('tblopportunities', 'tblassignments.OpportunityID = tblopportunities.ID', 'left');
        $this->db->join('tblCustomer', 'tblCustomer.ID = tblopportunities.CustomerID', 'left');
        $this->db->group_by('tblassignments.ID');
        $this->db->where('tblassignments.ID', $AssignID);
        $Customer = $this->db->get()->row_array();

        $UserID = $this->session->userdata('ID');
        $this->db->select('*');
        $this->db->from('tbluser');
        $this->db->where('ID', $UserID);
        $userData = $this->db->get()->row_array();

        echo json_encode(
            array(
                'deal' => $result,
                'customer' => $Customer,
                'user' => $userData
            )
            );
    }

    ///////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////   AJAX FUNCTIONS  ///////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////


    public function getProposals() {
        $AssignID = $this->input->post('ID');

        $this->db->where('AssignmentID', $AssignID);
        $this->db->from('tblproposals');
        $result = $this->db->get()->result_array();

        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'Get Proposals Failed'));
            return;
        }
        
        echo json_encode(array('success' => true, 'proposals' => $result));
    }

    public function getProposalByID() {
        $proposalID = $this->input->post('ID');

        $this->db->where('ID', $proposalID);
        $this->db->from('tblproposals');
        $result = $this->db->get()->row_array();

        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'Get Proposals Failed'));
            return;
        }
        
        echo json_encode(array('success' => true, 'proposal' => $result));
    }

    public function saveProposal() {
        $ID = $this->input->post('ID');        

        $this->load->model('Assignment_model');

        $ret = $this->Assignment_model->updateStage($ID, 'Proposal');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update Stage Failed'));
            return;
        }        

        $this->db->select('OpportunityID, SalesRep');
        $this->db->where('ID', $ID);
        $this->db->from('tblassignments');
        $result = $this->db->get()->row_array();

        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'Save Proposal Failed (1)'));
            return;
        }

        $OppID = $result['OpportunityID'];
        $SalesRep = $result['SalesRep'];

        $this->load->model('Opportunity_model');
        $ret = $this->Opportunity_model->updateStage($OppID, 'Proposal');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update Stage Failed'));
            return;
        }     

        $data = array(
            'OpportunityID' => $OppID,
            'AssignmentID' => $ID,
            'SalesRep' => $SalesRep,
            'Date' => date('Y-m-d H:i:s'),
            'Image' => ''
        );

        $this->db->insert('tblproposals', $data);
        $inserted_ID = $this->db->insert_id();

        if ($inserted_ID == 0) {
            echo json_encode(array('success' => false, 'message' => 'Save Proposal Failed'));
            return;
        }

        echo json_encode(array('success' => true, 'ID' => $inserted_ID));
    }

    public function deleteProposals() {
        $IDs = $this->input->post('IDs');
        $AssignmentID = $this->input->post('AssignmentID');

        $this->db->select('*');
        $this->db->where('AssignmentID', $AssignmentID);
        $this->db->from('tblproposals');
        $count = $this->db->count_all_results();

        if ($count <= 1) {
            echo json_encode(array('success' => false, 'message' => 'Can not delete the last proposals'));
            return;
        }

        if ($count == count($IDs)) {
            array_pop($IDs);
        }

        //delete file
        $this->db->select('*');
        $this->db->where_in('ID', $IDs);
        $this->db->from('tblproposals');
        $rows = $this->db->get()->result_array();
        foreach ($rows as $row) {
            $image = $row['Image'];
            $images = explode(";", $image);

            foreach($images as $page) {
                if ($page == '')
                    break;
                if (file_exists('assets/images/proposals/' . $page)) {
                    unlink('assets/images/proposals/' . $page);
                }
            }
            
        }

        $this->db->where_in('ID', $IDs);
        $this->db->delete('tblproposals');

        echo json_encode(array('success' => true));
    }

    public function MasterDelete(){
        $ID = $this->input->post('ID');

        // Delete Opportunity
        $this->load->model('Opportunity_model');
        $ret = $this->Opportunity_model->delete(array('ID' => $ID));

        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Delete Opportunity Failed'));
            return;
        }

        // Delete Assignments
        $this->load->model('Assignment_model');
        $ret = $this->Assignment_model->delete(array('OpportunityID' => $ID));
        
        // Delete CFU
        $this->load->model('CFU_model');
        $ret = $this->CFU_model->delete(array('OpportunityID' => $ID));
        
        // Delete Proposals
        $this->db->select('Image');
        $this->db->where('OpportunityID', $ID);
        $this->db->from('tblproposals');
        $result = $this->db->get()->result_array();

        foreach ($result as $proposal) {
            if ($proposal['Image'] != '') {
                $image = $proposal['Image'];
                $images = explode(';', $image);

                for ($i = 0; $i < count($images) - 1; $i++){
                    if (file_exists('assets/images/proposals/'.$images[$i]))
                        unlink('assets/images/proposals/'.$images[$i]);
                }
            }
        }

        $this->db->where('OpportunityID', $ID);
        $this->db->delete('tblproposals');

        echo json_encode(array('success' => true));
    }

    public function savePdfImages() {
        $imageData = $this->input->post('imageData');
        $ID = $this->input->post('ID');

        $image_parts = explode(";base64,", $imageData);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_type = $image_type_aux[1];
        $image_base64 = base64_decode($image_parts[1]);

        $date = new DateTime();
        $filename = $date->getTimestamp() . '.' . $image_type;

        $file = 'assets/images/proposals/' . $filename;

        $result = file_put_contents($file, $image_base64);
        if ($result == false) {
            echo json_encode(array('success' => false, 'message' => 'file stream error'));
            return;
        }        
        
        $this->db->where('ID', $ID);
        $this->db->set('Image', 'concat(Image,  \''.$filename.';\')', false);
        $this->db->update('tblproposals');
        
        echo json_encode(array('success' => true));
    }

    public function getOpportunityData() {
        $this->load->model('Opportunity_model');

        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $searchText = $this->input->post('searchText');    
        $start = $this->input->post('start');
        $length = $this->input->post('length');    
        $contactDate = $this->input->post('contactDate');
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $searchHelp = $this->input->post('searchHelp');
        $status = $this->input->post('status');
        $stage = $this->input->post('stage');
        $leadType = $this->input->post('leadType');
        $salesRep = $this->input->post('salesRep');
        $rate = $this->input->post('rate');

        $data = $this->Opportunity_model->getAllData(            
            $searchText,
            $status,
            $stage,
            $leadType,
            $salesRep,    
            $rate,        
            $contactDate,
            $minStartDate,
            $maxStartDate,
            $searchHelp,
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

    public function getOpportunityDataForExcel() {
        $this->load->model('Opportunity_model');
      
        $searchText = $this->input->post('searchText');            
        $contactDate = $this->input->post('contactDate');
        $minStartDate = $this->input->post('minStartDate');
        $maxStartDate = $this->input->post('maxStartDate');
        $searchHelp = $this->input->post('searchHelp');
        $status = $this->input->post('status');
        $stage = $this->input->post('stage');
        $leadType = $this->input->post('leadType');
        $salesRep = $this->input->post('salesRep');

        $data = $this->Opportunity_model->getAllDataForExcel(            
            $searchText,
            $status,
            $stage,
            $leadType,
            $salesRep,            
            $contactDate,
            $minStartDate,
            $maxStartDate,
            $searchHelp
        );

        header('content-type:application/json');
        echo  json_encode($data) ;
    }

    public function getOpportunityByID() {
        $OppID = $this->input->post('ID');       

        $this->db->select('tblopportunities.*');
        $this->db->select('tblCustomer.Name,
                        tblCustomer.LastName,
                        tblCustomer.Phone,
                        tblCustomer.Email,
                        tblCustomer.CompanyName,
                        tblCustomer.Country,
                        tblCustomer.State,
                        tblCustomer.City
                    ');
        $this->db->from('tblopportunities');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');
        $this->db->where('tblopportunities.ID', $OppID);
        $result = $this->db->get()->row_array();
        
        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'Get Opportunity Failed'));
            return;
        }
        
        echo json_encode(array('success' => true, 'data' => $result));
    } 

    public function editOpportunity() {
        $data = $this->input->post();
        $ID = $data['ID'];

        $this->load->model('Customer_model');
        $customer_ID = $this->Customer_model->updateCustomer($data);

        $this->load->model('Opportunity_model');
        $affected_row = $this->Opportunity_model->update(array("ID" => $ID), array(            
            'EqCategory' => $data['EqCategory'],
            'EqMake' => $data['EqMake'],
            'EqModelCap' => $data['EqModelCap'],
            'MinYear' => $data['MinYear'],
            'MaxPrice' => $data['MaxPrice'],
            'Unit' => $data['Unit'],
            'TimeFrame' => $data['TimeFrame'],
            'Rate' => $data['Rate'],
            'AdditionalInfo' => $data['AdditionalInfo'],
            'CustomerID' => $customer_ID
        ));
        
        echo json_encode(array('success' => true));
    }

    public function getMyOpportunityData() {
        $this->load->model('Assignment_model');

        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $searchText = $this->input->post('searchText');    
        $start = $this->input->post('start');
        $length = $this->input->post('length');    
        $status = $this->input->post('status');
        $stage = $this->input->post('stage');
        $leadType = $this->input->post('leadType');
        $salesRep = $this->input->post('salesRep');
        $rate = $this->input->post('rate');
        $minContactDate = $this->input->post('minContactDate');
        $maxContactDate = $this->input->post('maxContactDate');

        $data = $this->Assignment_model->getAllData(           
            $searchText,
            $status,
            $stage,
            $leadType,
            $salesRep,
            $rate,
            $minContactDate,
            $maxContactDate,
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

    public function getMyOpportunityDataForExcel() {
        $this->load->model('Assignment_model');

        $searchText = $this->input->post('searchText');            
        $status = $this->input->post('status');
        $stage = $this->input->post('stage');
        $leadType = $this->input->post('leadType');
        $salesRep = $this->input->post('salesRep');
        $minContactDate = $this->input->post('minContactDate');
        $maxContactDate = $this->input->post('maxContactDate');

        $data = $this->Assignment_model->getAllDataForExcel(           
            $searchText,
            $status,
            $stage,
            $leadType,
            $salesRep,
            $minContactDate,
            $maxContactDate
        );

        header('content-type:application/json');
        echo  json_encode($data) ;

    }


    public function addNewOpportunity() {
        $data = $this->input->post();        
        $Phone = $this->input->post('Phone');

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

        $ID = $this->session->userdata('ID');

        $this->load->model('User_model');
        $user = $this->User_model->getUserInfo($ID);

        $this->load->model('Opportunity_model');

        $data['AdditionalInfo'] = $data['AdditionalInfo'];
        $data['AddedBy'] = $user['USERNAME'];        
        $data['Stage'] = 'No Contact';
        $data['Status'] = 'New';                

        $today = time();        
        $data['DateAdded'] = date('Y-m-d H:i:s', $today);       
        $data['AddedBy'] = $user['USERNAME'];

        /* remove data for customer from this array */
        unset($data['Name']);
        unset($data['LastName']);
        unset($data['Phone']);
        unset($data['Email']);
        unset($data['CompanyName']);
        unset($data['Country']);
        unset($data['State']);
        unset($data['City']);        

        $data['CustomerID'] = $customer_ID;
        $id = $this->Opportunity_model->insert($data);   

        if ($id == null) {
            echo json_encode(array('success' => false, 'message' => 'Add New Opportunity Failed'));
            return;
        }

        $customerData = array();
        $customerData['LastOpportunity'] = date('Y-m-d H:i:s', $today);
        $this->Customer_model->update(array('ID' => $customer_ID), $customerData);

        if ($data['LastSalesRep'] != '') {
            $ret = $this->AssignOpportunity($id, $user['USERNAME'], $data['LastSalesRep'], $data['AdditionalInfo']);

            if ($ret == 0) {
                echo json_encode(array('success' => false, 'message' => 'Assgin User Failed'));
                return;
            }
        }
        
        echo json_encode(array('success' => true, 'OppID' => $id));
    }

    public function AssignUserToOpportunity() {
        $user = $this->input->post('user');
        $salesRep = $this->input->post('salesRep');
        $AdditionalInfo = nl2br($this->input->post('AdditionalInfo'));
        $ID = $this->input->post('ID');

        $ret = $this->AssignOpportunity($ID, $user, $salesRep, $AdditionalInfo);
        
        if ($ret == 0) {
            echo json_encode(array('success' => false, 'message' => 'Assgin User Failed'));
            return;
        }

        echo json_encode(array('success' => true, 'ID' => $ret));
    }

    public function AutoCancelAssignments() {
        $today = date('Y-m-d H:i:s');

        $this->db->select('ID');
        $this->db->where('ExpirationDate <=', $today);
        $this->db->where('Status', 'Assigned'); 
        $this->db->from('tblopportunities');
        $result = $this->db->get()->result_array();

        foreach ($result as $row) {            
            $ret = $this->Cancel($row['ID'], 'System');
            if ($ret == 0) {
                echo json_encode(array('success' => false, 'message' => 'Auto Cancel Assignment Failed' . $row['ID']));
                return;
            }
        }

        echo json_encode(array('success' => true));
    }

    public function CancelAssignment() {
        $ID = $this->input->post('ID');
        $user = $this->input->post('user');  
        
        $ret = $this->Cancel($ID, $user);

        if ($ret == 0) {            
            echo json_encode(array('success' => false, 'message' => 'Cancel Assignment Failed'));
            return;
        }

        echo json_encode(array('success' => true, 'ID' => $ret));
    }

    public function GetLeadAdditionalInfo() {
        $ID = $this->input->post('ID');

        $this->db->select('AdditionalInfo');
        $this->db->where('ID', $ID);
        $this->db->from('tblopportunities');
        $result = $this->db->get()->row_array();

        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'Get Additional Info Failed'));
            return;
        }

        echo json_encode(array('success' => true, 'AdditionalInfo' => $result['AdditionalInfo']));
    }

    public function contactOpp() {

        $this->db->select('ContactTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $result = $this->db->get()->row_array();
        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'Contact on Assignment Failed'));
            return;
        }
        $ToContactActiveDay = $result['ContactTime'];

        $this->load->model('Assignment_model');

        $ID = $this->input->post('ID');
        $NoContact = $this->input->post("NoContact");
        $Note = $this->input->post('Note');
        $ToContactDate = $this->input->post('ToContactDate');
        $ToContactDate .= ' 00:00:00';
        $StillIntersted = $this->input->post('StillInterested');
        $ExpirationDate = $this->getExpirationDate($ToContactDate, $ToContactActiveDay * 24);
        $Date = date('Y-m-d H:i:s');

        $ContactChannel = array();

        $ContactCnt = $this->Assignment_model->getContactChannelCount($ID);
        // if ($ContactCnt == null) {
        //     echo json_encode(array('success' => false, 'message' => 'Contact Channel Count Get Failed'));
        //     return;
        // }
        
        $ContactCntArray = array();
        if ($ContactCnt != '')
            $ContactCntArray = json_decode($ContactCnt, true);

        if ($this->input->post('PhoneCall') == 'true')
            array_push($ContactChannel, 'PhoneCall');        
        if ($this->input->post('Whatsapp') == 'true')
            array_push($ContactChannel, 'Whatsapp');
        if ($this->input->post('VideoCall') == 'true')
            array_push($ContactChannel, 'VideoCall');
        if ($this->input->post('Email') == 'true')
            array_push($ContactChannel, 'Email');
        if ($this->input->post('Other') == 'true')
            array_push($ContactChannel, 'Other');
        if ($NoContact == 'true')
            array_push($ContactChannel, 'NoContact');

        $SendItems = array();

        if ($this->input->post('Catalog') == 'true')
            array_push($SendItems, 'Catalog');
        if ($this->input->post('AuctionResults') == 'true')
            array_push($SendItems, 'AuctionResults');
        if ($this->input->post('Multimedia') == 'true')
            array_push($SendItems, 'Multimedia');
        if ($this->input->post('CompanyInfo') == 'true')
            array_push($SendItems, 'CompanyInfo');
        
        foreach ($ContactChannel as $Channel) {
            if (array_key_exists($Channel, $ContactCntArray))
                $ContactCntArray[$Channel] = $ContactCntArray[$Channel] + 1;
            else
                $ContactCntArray[$Channel] = 1;
        }

         foreach ($SendItems as $SendItem) {
            if (array_key_exists($SendItem, $ContactCntArray))
                $ContactCntArray[$SendItem] = $ContactCntArray[$SendItem] + 1;
            else
                $ContactCntArray[$SendItem] = 1;
         }   

        $this->Assignment_model->setContactChannelCount($ID, json_encode($ContactCntArray));

        $data = array(
            'NoContact' => $NoContact,
            'Date' => $Date,
            'StillIntersted' => $StillIntersted,
            'ToContactDate' => $ToContactDate,
            'Note' => $Note,
            'ContactChannel' => $ContactChannel,
            'SendItems' => $SendItems
        );
        
        $contactLog = json_encode($data);

        $contactLog = str_replace("\u", "\\\\u", $contactLog);  

        if ($NoContact != 'true') {
            $ret = $this->Assignment_model->updateStage($ID, 'Contact');
            if ($ret == null) {
                echo json_encode(array('success' => false, 'message' => 'Update Stage Failed'));
                return;
            }
        }

        $OppID = $this->Assignment_model->contact($ID, $contactLog, $ToContactDate, $ExpirationDate);
        if ($OppID == null) {
            echo json_encode(array('success' => false, 'message' => 'Contact on Assignment Failed'));
            return;
        }

        $this->load->model('Opportunity_model');

        if ($NoContact != 'true') {
            $ret = $this->Opportunity_model->updateStage($OppID, 'Contact');
            if ($ret == null) {
                echo json_encode(array('success' => false, 'message' => 'Update Stage Failed'));
                return;
            }
        }
        
        $data = array(
            'ExpirationDate' => $ExpirationDate   
        );
        $affected_rows = $this->Opportunity_model->update(array('ID' => $OppID), $data);

        echo json_encode(array('success' => true));
    }

    public function saveAssignNote() {
        $ID = $this->input->post('ID');
        $AssignmentLog = $this->input->post('AssignmentLog');
        $Date = date('Y-m-d H:i:s');
        $data = array(
            'Date' => $Date,
            'StillIntersted' => "",
            'ToContactDate' => "",
            'Note' => $AssignmentLog);

        $contactLog = json_encode($data);

        $contactLog = str_replace("\u", "\\\\u", $contactLog);    

        $this->db->where('ID', $ID);
        $this->db->set('ContactsLog', 'concat(ContactsLog,  \''.$contactLog.'&&&\')', false);
        $this->db->update('tblassignments');

        $affect_rows = $this->db->affected_rows();

        if ($affect_rows == 0) {
            echo json_encode(array('success' => false, 'message' => 'Add Assignment Log Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function CloseAssignment() {
        $UserID = $this->session->userdata('ID');
        
        $this->load->model('User_model');
        $UserData = $this->User_model->getUserInfo($UserID);
        $UserName = $UserData['USERNAME'];

        $ID = $this->input->post('ID');
        $Note = $this->input->post('Note');
        $ToContactDate = $this->input->post('ToContactDate');
        $ToContactDate .= ' 00:00:00';
        $StillIntersted = $this->input->post('StillInterested');        

        $Date = date('Y-m-d H:i:s');

        $data = array(
            'Date' => $Date,
            'StillIntersted' => $StillIntersted,
            'ToContactDate' => $ToContactDate,
            'Note' => $Note);
        $contactLog = json_encode($data);
        $contactLog = str_replace("\u", "\\\\u", $contactLog);       

        $this->load->model('Assignment_model');
        $ret = $this->Assignment_model->updateStage($ID, 'Contact');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update Stage Failed'));
            return;
        }

        $this->Assignment_model->updateContactLog($ID, $contactLog);
        $OppID = $this->Assignment_model->close($ID);
        if ($OppID == null) {
            echo json_encode(array('success' => false, 'message' => 'Close Assignment Failed'));
            return;
        }

        $this->load->model('Opportunity_model');
        $ret = $this->Opportunity_model->updateStage($OppID, 'Contact');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update Stage Failed'));
            return;
        }

        $data = array(
            'Status' => 'Closed',
            'ClosedBy' => $UserName,
            'ExpirationDate' => "",
            'ClosingDate' => date('Y-m-d H:i:s'),
            'NegativeInterestLevel' => $StillIntersted
        );
        $affected_rows = $this->Opportunity_model->update(array('ID' => $OppID), $data);

        if ($affected_rows == 0) {
            echo json_encode(array('success' => false, 'message' => 'Close Opportunity Failed'));
            return;
        }

        // Add to Customer Follow Up
        $data = array(
            'OpportunityID' => $OppID,
            'Status' => 'New',
            'DateAdded' => date('Y-m-d H:i:s')
        );

        $this->load->model('CFU_model');
        $inserted_ID = $this->CFU_model->insert($data);

        if ($inserted_ID == 0) {
            echo json_encode(array('success' => false, 'message' => 'Add to CFU failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function gotoSalesCycle() {
        $ID = $this->input->post('ID');

        $this->load->model('User_model');        
        $userID = $this->session->userdata('ID');
        $userInfo = $this->User_model->getUserInfo($userID);

        $this->load->model('Assignment_model');
        $ret = $this->Assignment_model->updateStage($ID, 'Sale');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update Stage Failed'));
            return;
        }
        $OppID = $this->Assignment_model->close($ID);
        if ($OppID == null) {
            echo json_encode(array('success' => false, 'message' => 'Close Assignment Failed'));
            return;
        }

        $this->load->model('Opportunity_model');
        $ret = $this->Opportunity_model->updateStage($OppID, 'Sale');
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Update Stage Failed'));
            return;
        }

        $data = array(
            'Status' => 'Closed',
            'ClosedBy' => $userInfo['USERNAME'],
            'ExpirationDate' => "",
            'ClosingDate' => date('Y-m-d H:i:s')
        );
        $affected_rows = $this->Opportunity_model->update(array('ID' => $OppID), $data);

        if ($affected_rows == 0) {
            echo json_encode(array('success' => false, 'message' => 'Close Opportunity Failed'));
            return;
        }

        $this->load->model('Sales_model');       

        $ret = $this->Sales_model->addNewSale($ID, $OppID, $userInfo['USERNAME']);
        if ($ret == null) {
            echo json_encode(array('success' => false, 'message' => 'Add New Sale Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function CloseOpp() {
        $ID = $this->input->post('ID');

        $this->load->model('User_model');        
        $userID = $this->session->userdata('ID');
        $userInfo = $this->User_model->getUserInfo($userID);

        $data = array(
            'Status' => 'Canceled',
            'ClosedBy' => $userInfo['USERNAME'],
            'ClosingDate' => date('Y-m-d H:i:s')
        );

        $this->load->model('Opportunity_model');
        $affected_rows = $this->Opportunity_model->update(array('ID' => $ID), $data);

        if ($affected_rows == 0) {
            echo json_encode(array('success' => false, 'message' => 'Close Opportunity Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function GoBackOpp() {
        $ID = $this->input->post('ID');

        $data = array(
            'Status' => 'Pending',
            'ClosingDate' => ''
        );

        $this->load->model('Opportunity_model');
        $affected_rows = $this->Opportunity_model->update(array('ID' => $ID), $data);

        if ($affected_rows == 0) {
            echo json_encode(array('success' => false, 'message' => 'Go Opportunity Back Failed'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function getAssignmentContactInfo(){
        $ID = $this->input->post('ID');

        $this->load->model('Assignment_model');
        $result = $this->Assignment_model->getContactLog($ID);

        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'No Contact Logs yet'));
            return;
        }

        echo json_encode(array('success' => true, 'ContactLog' => $result));
    }

    public function getAssignmentChannelCount() {
        $ID = $this->input->post('ID');

        $this->load->model('Assignment_model');
        $result =  $this->Assignment_model->getContactChannelCount($ID);

        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'No Assignment Stats'));
            return;
        }

        echo json_encode(array('success' => true, 'ContactLog' => $result));
    }

    public function getOpportunityHistory() {
        $ID = $this->input->post('ID');

        $this->load->model('Assignment_model');
        $result = $this->Assignment_model->getHistory($ID);

        echo json_encode($result);
    }

    public function CheckUserIfLimited(){

        $this->db->select('OppTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $result = $this->db->get()->row_array();
        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'Contact on Assignment Failed'));
            return;
        }
        $AssignToMeLimit = $result['OppTime'];

        
        $User = $this->input->post('User');

        $this->db->select('AssignDate');
        $this->db->from('tblassignments');
        $this->db->where('SalesRep', $User);
        $this->db->limit(1);
        $this->db->order_by('AssignDate', 'desc');
        $result = $this->db->get()->row_array();

        if ($result == null) {
            echo json_encode(array('success' => true));
            return;
        }

        $LastAssignDate = $result['AssignDate'];

        $now = strtotime(date('Y-m-d H:i:s'));
        $lastAssignDate = strtotime($LastAssignDate);
        $spent = $now - $lastAssignDate;

        if ($spent < $AssignToMeLimit * 60) {
            echo json_encode(array('success' => false, 'message' => 'You are now limited.<br>Please wait '. date('i:s', $AssignToMeLimit * 60 - $spent)));
            return;
        }

        echo json_encode(array('success' => true));
    }


    public function setSearchHelp() {
        $AssignID = $this->input->post('ID');
        $SearchHelp = $this->input->post('SearchHelp');

        $this->load->model('Assignment_model');
        $affected_rows = $this->Assignment_model->update(
            array('ID' => $AssignID), 
            array('SearchHelp' => $SearchHelp)
        );

        if ($affected_rows == 0) {
            echo json_encode(array('success' => false, 'message' => 'Search Help Error'));
            return; 
        }
        echo json_encode(array('success' => true));
    }

    public function getTag() {
        $AssignID =$this->input->post('AssignID');
        $this->load->model('Assignment_model');
        $result = $this->Assignment_model->getTag($AssignID);

        echo json_encode(array('tag' => $result));
    }

    public function addTag() {
        $AssignID = $this->input->post('AssignID');
        $TagText = $this->input->post('TagText');
        $TagColor = $this->input->post('TagColor');

        $this->load->model('Assignment_model');
        $this->Assignment_model->addTag($AssignID, $TagText, $TagColor);
        $result = $this->Assignment_model->getTag($AssignID);

        echo json_encode(array('success' => true, 'tag' => $result));
    }

    public function removeTag() {
        $AssignID = $this->input->post('AssignID');
        $TagNum = $this->input->post('TagNum');

        $this->load->model('Assignment_model');
        $result = $this->Assignment_model->removeTag($AssignID, $TagNum);

        echo json_encode(array('success' => true, 'tag' => $result));
    }

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////  PRIVATE FUNCTIONS  ///////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    private function getExpirationDate($date, $hour) {
        $today = strtotime($date);
        $expiration = $today + $hour * 60 * 60;
        $wday = date('w', $today);

        $sundayStart = $today - ($wday - 0) * 86400 - ($today % 86400) + 7 * 60 * 60; // Sunday 00.00.00
        $mondayStart = $sundayStart + 24 * 60 * 60 + 8 * 60 * 60; // Monday 07.59.59
        $saturdayStart = $sundayStart + 6 * 24 * 60 * 60 + 15 * 60 * 60; // Saturday 15.00.00


        if ($today >= $sundayStart && $today < $mondayStart){
            $expiration = $mondayStart + $hour * 60 * 60;
        }

        if ($today >= $mondayStart && $today < $saturdayStart && $expiration >= $saturdayStart) {
            $expiration += 41 * 60 * 60;
        }

        if ($today >= $saturdayStart) {
            $expiration += (41 * 60 * 60 - ($today - $saturdayStart));
        } 

        return date('Y-m-d H:i:s', $expiration);
    }

    private function Cancel($ID, $user) {
        $this->load->model('Opportunity_model');

        $affect_rows = $this->Opportunity_model->CancelAssignment($ID, $user);        
        if ($affect_rows == 0) {    
            return 0;           
        }

        $this->load->model('Assignment_model');
        $AssignID = $this->Assignment_model->getAssignmentID($ID);
        if ($AssignID == null)
            return 0;
        $affect_rows = $this->Assignment_model->cancelAssignment($ID, $user);    
        if ($affect_rows == 0) {    
            return 0;           
        }     

        return $AssignID;
    }


    private function AssignOpportunity($ID, $user, $salesRep, $AdditionalInfo) {

        $this->db->select('ID');
        $this->db->where('ID', $ID);
        $this->db->where('Status', 'Assigned');
        $this->db->from('tblopportunities');
        $cnt = $this->db->count_all_results();

        if ($cnt != 0)
            return 0;

        $this->db->select('AssignmentTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $result = $this->db->get()->row_array();
        if ($result == null) {
            echo json_encode(array('success' => false, 'message' => 'Contact on Assignment Failed'));
            return;
        }
        $AssignmentActiveTime = $result['AssignmentTime'];        

        $today = date('Y-m-d H:i:s');
        $expiration = $this->getExpirationDate($today, $AssignmentActiveTime);

        $data['Status'] = 'Assigned';
        $data['Stage'] = 'No Contact';
        $data['AssignDate'] = $today;
        $data['ExpirationDate'] = $expiration;
        $data['LastSalesRep'] = $salesRep;
        

        // Update Opportuntiy Table
        $this->load->model('Opportunity_model');
        $affected_row = $this->Opportunity_model->update(array('ID'=> $ID), $data);

        if ($affected_row == 0) {            
            return 0;
        }

        // Insert into Assignment Table
        $this->load->model('Assignment_model');
        $data = array();
        $data['OpportunityID'] = $ID;
        $data['Status'] = 'Open';
        $data['AssignDate'] = $today;
        $data['ExpirationDate'] = $expiration;
        $data['Stage'] = 'No Contact';
        $data['AssignedBy'] = $user;
        $data['SalesRep'] = $salesRep;
        $data['AdditionalInfo'] = $AdditionalInfo;

        $id = $this->Assignment_model->insert($data);
        
        if ($id == null) {            
            return 0;
        }

        return $id;
    }

    public function addBannedUser() {
        $OppID = $this->input->post('OppID');
        $SalesRep = $this->input->post('SalesRep');

        $this->db->where('ID', $OppID);
        $this->db->set('BannedSalesRep', 'concat(BannedSalesRep,  "' . $SalesRep . '" , \''.'$$$\')', false);
        $this->db->update('tblopportunities');

        if ($this->db->affected_rows() == 0) {
            echo json_encode(array('success' => false, 'message' => 'Failed to Add Banned User'));
            return;
        }

        echo json_encode(array('success' => true));
    }    

    public function getOppsPerStatus(){
        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);

        $allSourceList = array();

        $interval = $this->input->post("interval");
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');                

        $this->load->model('Opportunity_model');        
        if ($interval == '-3')
        {
            $sourecList = array(
                array('Status' => 'New'),
                array('Status' => 'Pending'),
                array('Status' => 'Assigned')
            );
        }
        else         
            $sourecList = $this->Opportunity_model->getAllStatus();

        foreach ($sourecList as $source) {
            $item = array();
            $item['name'] = lang($source['Status']);
            if ($interval == -3)
                $item['num'] = $this->Opportunity_model->getOppsByStatus($source['Status']);    
            else
                $item['num'] = $this->Opportunity_model->getOppsByStatusRange($source['Status'], $startDate, $endDate);
            array_push($allSourceList, $item);
        }     

        usort($allSourceList, function ($a, $b) {
            $statusOrder = array(
                lang("New") => 0,
                lang("Pending") => 1,
                lang("Assigned") => 2,
                lang("Closed") => 3,
                lang("Canceled") => 4
            );
            return $statusOrder[$a['name']] - $statusOrder[$b['name']];
        });

        echo json_encode($allSourceList);
    }

    public function getDirectOppPerUser() {
        $allSourceList = array();

        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');        

        $this->load->model('Opportunity_model');        
        $sourecList = $this->Opportunity_model->getAllDirectUsers();

        foreach ($sourecList as $source) {
            $item = array();
            $item['name'] = $source['Source'];
            $item['num'] = $this->Opportunity_model->getDirectOppsByUsers($source['Source'], $startDate, $endDate);
            array_push($allSourceList, $item);
        }     

        usort($allSourceList, function ($a, $b) {
            $rest = explode(" ", $a["name"]);           
            if (count($rest) > 1)  {
                $searchText = $rest[1];
                if ($searchText == '')
                    $searchText = $rest[2];
                if (strpos($b['name'], $searchText) !== false)
                    return ($b['num'] - $a['num']);            
            }            
            return ($a['name'] > $b['name']);
        });

        echo json_encode($allSourceList);
    }

    public function getAssignedOppPerUser() {
        $allSourceList = array();

        $inteval = $this->input->post('interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');      

        if ($inteval == -3) {
            $this->load->model('Opportunity_model');        
            $sourecList = $this->Opportunity_model->getAllSalesRep();

            foreach ($sourecList as $source) {
                $item = array();
                $item['name'] = $source['LastSalesRep'];
                $item['num'] = $this->Opportunity_model->getAssignedOppByUser($source['LastSalesRep']);
                array_push($allSourceList, $item);
            }     

            usort($allSourceList, function ($a, $b) {
                return $b['num'] - $a['num'];
            });

            echo json_encode($allSourceList);
        }
        else {
            $this->load->model('Assignment_model');      
            $sourecList = $this->Assignment_model->getAllSalesRep();

            foreach ($sourecList as $source) {
                $item = array();
                $item['name'] = $source['SalesRep'];
                $item['num'] = $this->Assignment_model->getAssignedOppByUser($source['SalesRep'], $startDate, $endDate);
                array_push($allSourceList, $item);
            }     

            usort($allSourceList, function ($a, $b) {
                return $b['num'] - $a['num'];
            });

            echo json_encode($allSourceList);
        }
        
    }

    public function getBuyingOppsPerCategory() {

        $allSourceList = array();

        $interval = $this->input->post("interval");
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('Opportunity_model');        
        $sourecList = $this->Opportunity_model->getAllCategory();

        foreach ($sourecList as $source) {
            $item = array();
            $item['name'] = $source['EqCategory'];
            if ($interval == '-3')
                $item['num'] = $this->Opportunity_model->getActiveBuyingOppsByCategory($source['EqCategory']);
            else
                $item['num'] = $this->Opportunity_model->getBuyingOppsByCategory($source['EqCategory'], $startDate, $endDate);
            array_push($allSourceList, $item);
        }     

        usort($allSourceList, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($allSourceList);
    }

    public function getAssignedOppsWaitingContact() {
        $salesRep = $this->input->post('SalesRep');

        $this->load->model('Opportunity_model');
        $noContactCount = $this->Opportunity_model->getNoContactAssignments($salesRep);
        $expiredCount = $this->Opportunity_model->getWatingContactAssignments($salesRep, date('Y-m-d H:i:s', time() -  60 * 60 * 24));
        $todayCount = $this->Opportunity_model->getWatingContactAssignments($salesRep, date('Y-m-d H:i:s'));

        echo json_encode(array('noContact' => $noContactCount, 'today' => $todayCount - $expiredCount, 'expired' => $expiredCount));
    }

    public function getOpenOpps() {
        $salesRep = $this->input->post('SalesRep');
        $this->load->model('Opportunity_model');
        $New_count = $this->Opportunity_model->getNewOppCount();
        $Pending_count = $this->Opportunity_model->getPendingOppCount();
        $Assigned_count = $this->Opportunity_model->getAssignedCount($salesRep);

        echo json_encode(array('new' => $New_count, 'assigned' => $Assigned_count, 'pending' => $Pending_count));
    }

    public function getOpenAssignments() {
        $salesRep = $this->input->post('SalesRep');
        $this->load->model('Assignment_model');
        $noContact_count = $this->Assignment_model->getNoContactOppCount($salesRep);
        $contact_count = $this->Assignment_model->getContactOppCount($salesRep);
        $proposal_count = $this->Assignment_model->getProposalOppCount($salesRep);

        echo json_encode(array('noContact' => $noContact_count, 'contact' => $contact_count, 'proposal' => $proposal_count));
    }

    public function getClosedOpps() {
        $salesRep = $this->input->post('SalesRep');
        $this->load->model('Opportunity_model');
        $count = $this->Opportunity_model->getClosedOppsToday($salesRep);

        echo json_encode(array('count' => $count));
    }

    public function getUpdatedOpps() {
        $salesRep = $this->input->post('SalesRep');
        $this->load->model('Assignment_model');
        $count = $this->Assignment_model->getUpdateOpssCountToday($salesRep);
        $this->load->model('Opportunity_model');
        $closed = $this->Opportunity_model->getClosedOppsToday($salesRep);        

        echo json_encode(array('count' => $count, 'closed' => $closed));
    }
}
