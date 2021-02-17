<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';



class TvMode extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        //MY_Output's disable_cache() method
        $this->output->disable_cache();
    }


    public function index()
    {       
        $this->load->view('tvMode');
    }


}
