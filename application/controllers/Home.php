<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Facebook\Facebook;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;

class Home extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        //MY_Output's disable_cache() method
        date_default_timezone_set('America/Phoenix');
        $this->output->disable_cache();

        if (!$this->session->has_userdata('ID') || $this->session->userdata('ID') == "")
            redirect('Login');
    }


    public function index()
    {        

        $this->load->model('User_model');

        $ID = $this->session->userdata('ID');
        $viewData = $this->User_model->getUserInfo($ID);

        if ($viewData['PERMISSION'] != 'admin')
            redirect('Deals');

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('page-home', $viewData);
    }
}