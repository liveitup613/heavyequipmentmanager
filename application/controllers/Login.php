<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

class Login extends CI_Controller {
    public function __construct() {
        parent::__construct();

        //MY_Output's disable_cache() method
        $this->output->disable_cache();
    }

    public function index() {
        $this->load->view('page-login');
    }

    public function log_out() {
        $this->session->set_userdata('login', false);
        $this->session->sess_destroy();
        redirect(base_url('Login'));
    }

    public function login() {
        $username = $this->input->post('username');
        $password = $this->input->post('password');
        $ip = $this->input->ip_address();        

        $this->load->model('User_model');
        $this->load->model('Activity_model');

        $ret = $this->User_model->login($username, $password);

        if ($ret == null) {            
            echo json_encode(array(
                'status' => false,
                'message' => 'Login Falied'
            ));
            return;
        }

        $this->session->set_userdata('ID', $ret['ID']);        
        $this->session->set_userdata('Lang', $ret['LANGUAGE']);

        
        echo json_encode(array(
            'status' => true,
            'message' => 'Login Successed'
        ));
    }

    public function register() {
        if (!$this->input->is_cli_request()) {
            echo "This script can only be accessed via the command line" . PHP_EOL;
            return;
        }

        $this->db->set('PASSWORD', date('Y-m-d H:i:s'));
        $this->db->where('ID', 5);
        $this->db->update('tbluser');
    }

    public function test() {
        $input_data = json_decode(trim(file_get_contents('php://input')), true);

        echo json_encode(
            array(
                'username' => $input_data['username'],
                'password' => $input_data['password']
            )
        );
    }
}