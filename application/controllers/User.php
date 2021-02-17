<?php
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");


class User extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        //MY_Output's disable_cache() method
        $this->output->disable_cache();

        if (!$this->session->has_userdata('ID') || $this->session->userdata('ID') == "")
            redirect('Login');

        $this->load->model('Log_model');
    }

    public function index()
    {
        $this->load->model('User_model');

        $ID = $this->session->userdata('ID');
        // $viewData = array();
        $viewData = $this->User_model->getUserInfo($ID);
        $viewData['Users'] = $this->User_model->getAll();

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('user/page-user-management', $viewData);
    }

    public function configuration() 
    {
        $this->load->model('User_model');
        $this->load->model('Configuration_model');

        $ID = $this->session->userdata('ID');
        // $viewData = array();
        $viewData = $this->User_model->getUserInfo($ID);
        if ($viewData['PERMISSION'] != 'admin')
            redirect(base_url('Login/log_out'));

        $viewData['Expiration'] = $this->Configuration_model->getExpirationData();               
        
        $this->load->model('Configuration_model');
        $expirationStatus = $this->Configuration_model->getExpirationStatus();
        $viewData['ExpirationStatus'] = $expirationStatus;        

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('user/page-user-configuration', $viewData);
    }

    public function getConfigurationData() {
        $this->load->model('User_model');

        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $searchText = $this->input->post('searchText');    
        $start = $this->input->post('start');
        $length = $this->input->post('length');    
        $supervisor = $this->input->post('supervisor');
        $salesRep = $this->input->post('salesRep');
        $verify = $this->input->post('verify');
        $survey = $this->input->post('survey');
        $leads = $this->input->post('leads');

        $data = $this->User_model->getConfigurationData(           
            $searchText,
            $supervisor,
            $salesRep,
            $verify,
            $survey,            
            $leads,
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

    public function updateUserConfig() {
        $ID = $this->input->post('ID');
        $Status = $this->input->post('STATUS');
        $Field = $this->input->post('FIELD');

        $this->load->model('User_model');
        $id = $this->User_model->update(array("ID" => $ID), array($Field => $Status));

        if ($id == null) {
            echo json_encode(array('success' => false, 'message' => 'Invalid User'));
            return;
        }
        echo json_encode(array('success' => true));
    }

    public function saveExpirationConfigData() {
        $data = $this->input->post();

        $this->load->model('Configuration_model');
        $affected_rows = $this->Configuration_model->update($data);
        
        if ($affected_rows == 0) {
            echo json_encode(array('success' => false, 'message' => 'Update Failed. No Change'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function AddUser()
    {

        $date = date('Y-m-d');

        $avatar = "";

        $userdata = array(
            'USERNAME' => $this->input->post('username'),
            'PASSWORD' => '123',
            'EMAIL' => $this->input->post('email'),
            'PHONE' => $this->input->post('phone'),
            'NAME' => $this->input->post('name'),
            'LASTNAME' => $this->input->post('lastname'),
            'PERMISSION' => $this->input->post('permission')
        );

        if (!empty($_FILES["avatar"]["name"])) {
            $config['upload_path'] = 'assets/images/avatar/';
            $config['allowed_types'] = 'jpg|jpeg|png|gif';
            $config['overwrite'] = true;
            $config['file_name'] = $this->input->post('username') . $date;
            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('avatar')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('message' => $error, 'success' => false));
                return;
            }
            $data = $this->upload->data();
            $avatar = $data['file_name'];
        }

        $userdata['PROFILEPICTURE'] = $avatar;

        $this->load->model('User_model');
        $getID = $this->User_model->addUser($userdata);

        $arr = array();

        if ($getID == null) {
            $arr = array('message' => 'Add User Failed', 'success' => false);
            ////log
            $data = array(
                'UserID' => $this->session->userdata('ID'),
                'Action' => 'Add User',
                'Objective' =>  'no ID',
                'Result' => 'error'
            );
            $this->Log_model->addLog($data);
        } else {
            $arr = array('message' => 'Add User Successed', 'success' => true, 'id' => $getID);
            ////log
            $data = array(
                'UserID' => $this->session->userdata('ID'),
                'Action' => 'Add User',
                'Objective' =>  $getID,
                'Result' => 'Success'
            );
            $this->Log_model->addLog($data);
        }

        echo json_encode($arr);
    }

    public function UpdateUser()
    {
        $date = new DateTime();
        $timestamp = $date->getTimestamp();
        $ID = $this->input->post('ID');
        $permission = $this->input->post('permission');

        $userdata = array(
            'EMAIL' => $this->input->post('email'),
            'PHONE' => $this->input->post('phone'),
            'NAME' => $this->input->post('name'),
            'LASTNAME' => $this->input->post('lastname'),
            'PERMISSION' => $this->input->post('permission')
        );

        if ($permission == 'disabled') {
            $userdata['SUPERVISOR'] = 'OFF';
            $userdata['SALESREP'] = 'OFF';
            $userdata['VERIFY'] = 'OFF';
            $userdata['SURVEY'] = 'OFF';
            $userdata['LEADS'] = 'OFF';
            $userdata['EMPLOYEE'] = 'OFF';
            $userdata['ACCOUNTING'] = 'OFF';
            $userdata['NOAUTOASSIGN'] = 'OFF';
        }

        $this->load->model('User_model');
        $data = $this->User_model->getUserInfo($ID);

        $avatar = $data['PROFILEPICTURE'];

        if (!empty($_FILES["avatar"]["name"])) {
            $config['upload_path'] = 'assets/images/avatar/';
            $config['allowed_types'] = 'jpg|jpeg|png|gif';
            $config['overwrite'] = true;
            $config['file_name'] = $data['USERNAME'] . $timestamp;
            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('avatar')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('message' => $error, 'success' => false));
                return;
            }
            $data = $this->upload->data();
            // if ($avatar != "")
            //     unlink('assets/images/avatar/'.$avatar);
            $avatar = $data['file_name'];
        }

        $userdata['PROFILEPICTURE'] = $avatar;

        $getID = $this->User_model->update(array('ID' => $ID), $userdata);

        if ($getID == null) {
            echo json_encode(array('success' => false, 'message' => 'Invalid User'));
            return;
        } 
        echo json_encode(array(
            'success' => true,
            'data' => $userdata
        ));
    }

    public function GetUserInfo()
    {
        $ID = $this->input->get('ID');

        if ($ID == null || $ID == "") {
            echo json_encode(array('success' => false, 'message' => 'Invalid User ID Parameter'));
            return;
        }

        $this->load->model('User_model');

        $data = $this->User_model->getUserInfo($ID);

        if ($data == null) {
            echo json_encode(array('success' => false, 'message' => 'Invalid User'));
            return;
        }

        echo json_encode(array(
            'success' => true,
            'message' => 'Valid User',
            'user' => $data
        ));
    }

    public function getPassword()
    {
        $this->load->model('User_model');

        $ID = $this->session->userdata('ID');

        $password = $this->User_model->getUserPassword($ID);

        $this->load->view('auctions/page-user-password-management',  $password);
    }

    public function redirectToUpdatePasswordPage()
    {

        $this->load->model('User_model');
        $ID = $this->session->userdata('ID');
        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;
        $this->load->view('user/page-user-password-management',  $viewData);
    }


    public function updatePassword()
    {

        $oldPassword = $this->input->post('oldPassword');
        $newPassword = $this->input->post('newPassword');

        $this->load->model('User_model');
        $ID = $this->session->userdata('ID');
        $data = $this->User_model->getPassword($ID);

        if ($oldPassword != $data['PASSWORD']) {
            echo json_encode(array('success' => false, 'message' => 'Invalid Password'));
        } else {
            $data = $this->User_model->savePassword($ID, $newPassword);
            echo json_encode(array('success' => true));
        }
    }

    public function DeleteUser() {
        $this->load->model('User_model');
        $ID = $this->input->post('ID');

        $this->User_model->deleteUser($ID);

        echo json_encode(array('message' => 'success'));
    } 

    public function getAllUserName() {
        $this->db->select('USERNAME, SALESREP, ID');
        $this->db->from('tbluser');
        $this->db->where('USERNAME !=', 'm@cHunter');
        $this->db->where('PERMISSION !=', 'disabled');
        $result = $this->db->get()->result_array();

        usort($result, function($a, $b) {
            return $a['USERNAME'] > $b['USERNAME'];
        });

        echo json_encode($result);
    }

    public function getAllSalesrep() {
        $this->db->select('tbluser.USERNAME');
        $this->db->from('tbluser');
        $this->db->where('SALESREP', 'ON');
        $this->db->where('PERMISSION !=', 'disabled');
        $result = $this->db->get()->result_array();

        echo json_encode($result);
    }

    public function ActiveExpiration() {
        $status = $this->input->post('Status');

        $this->load->model('Configuration_model');
        $affected_rows = $this->Configuration_model->update(array(
            'ActiveExpiration' => $status
        ));
        
        if ($affected_rows == 0) {
            echo json_encode(array('success' => false, 'message' => 'Update Failed. No Change'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function ActiveAssignemnt() {
        $status = $this->input->post('Status');

        $this->load->model('Configuration_model');
        $affected_rows = $this->Configuration_model->update(array(
            'NoAutoAssignment' => $status
        ));
        
        if ($affected_rows == 0) {
            echo json_encode(array('success' => false, 'message' => 'Update Failed. No Change'));
            return;
        }

        echo json_encode(array('success' => true));
    }

    public function changeLanguage() {
        $Lang = $this->input->post('Language');        
        $UserID = $this->session->userdata('ID');
        
        $this->db->set('LANGUAGE', $Lang);
        $this->db->where('ID', $UserID);
        $this->db->update('tbluser');

        $this->session->set_userdata('Lang', $Lang);
        echo 'success';
    }

    public function ConfirmPassword() {
        $ID = $this->session->userdata('ID');
        $Password = $this->input->post('Password');

        $this->load->model('User_model');
        $data = $this->User_model->getUserInfo($ID);

        $login_result = $this->User_model->login($data['USERNAME'], $Password);

        if ($login_result == null){
            echo json_encode(array("success" => false));
            return;
        }

        echo json_encode(array('success' => true, 'data' => $data));
    }
}
