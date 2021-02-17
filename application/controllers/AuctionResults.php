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

class AuctionResults extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        
        //MY_Output's disable_cache() method
        $this->output->disable_cache();

        if (!$this->session->has_userdata('ID') || $this->session->userdata('ID') == "")
            redirect('Login');

        $this->load->library('Simple_html_dom');
        $this->load->model('Log_model');
    }


    public function index()
    {
        $this->load->model('User_model');

        $ID = $this->session->userdata('ID');

        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('past-result', $viewData);
    }


  

    public function getPastAuctionData()
    {
        $this->load->model('Deal_model');
        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $minYear = $this->input->post('minYear');
        $maxYear = $this->input->post('maxYear');
        $minAucYear = $this->input->post('minAucYear');
        $maxAucYear = $this->input->post('maxAucYear');
        $minTotal = $this->input->post('minTotal');
        $maxTotal = $this->input->post('maxTotal');
        $minFinal = $this->input->post('minFinal');
        $maxFinal = $this->input->post('maxFinal');
        $minLiftCapacity = $this->input->post('minLiftCapacity');
        $maxLiftCapacity = $this->input->post('maxLiftCapacity');


        $searchText = trim($this->input->post('searchText'));
        $categoryName = $this->input->post('categoryName');
        $start = $this->input->post('start');
        $length = $this->input->post('length');

        $data = $this->Deal_model->getAllPastData(
            $minYear,
            $maxYear,
            $minAucYear,
            $maxAucYear,
            $minTotal,
            $maxTotal,
            $minFinal,
            $maxFinal,
            $minLiftCapacity,
            $maxLiftCapacity,
            $searchText,
            $start,
            $length,
            $categoryName,
            $orderIndex,
            $sort
        );

        foreach ($data['data'] as $deal) {
            $thumbUrl = 'assets/images/thumbImages/'.$deal['PrimaryImage'];
            $PrimaryImage = 'assets/images/primaryImages/'.$deal['PrimaryImage'];

            if (!file_exists($thumbUrl) && file_exists($PrimaryImage)) {
                $imageData = file_get_contents($PrimaryImage);
                file_put_contents($thumbUrl, $imageData);
                $this->resizeImage($thumbUrl, 0, 150, true);
            }
        }

        header('content-type:application/json');
        echo '{           
            "recordsTotal": ' . $data["recordsTotal"] . ',
            "recordsFiltered" : ' . $data["recordsFiltered"] . ',
            "data" : ' . json_encode($data["data"]) . ',
            "average" : "' . $data['average'] . '",
            "median" : "' . $data['median'] . '"
        }';
    }


    public function getAuctionResultDataForExcel()
    {
        $this->load->model('Deal_model');     
        $minYear = $this->input->post('minYear');
        $maxYear = $this->input->post('maxYear');
        $minAucYear = $this->input->post('minAucYear');
        $maxAucYear = $this->input->post('maxAucYear');
        $minTotal = $this->input->post('minTotal');
        $maxTotal = $this->input->post('maxTotal');
        $minFinal = $this->input->post('minFinal');
        $maxFinal = $this->input->post('maxFinal');
        $minLiftCapacity = $this->input->post('minLiftCapacity');
        $maxLiftCapacity = $this->input->post('maxLiftCapacity');

        $searchText = trim($this->input->post('searchText'));
        $categoryName = $this->input->post('categoryName');
        $dealType = $this->input->post('dealType');
      

        $data = $this->Deal_model->getAuctionResultDataForExcel(
            $minYear,
            $maxYear,
            $minAucYear,
            $maxAucYear,
            $minTotal,
            $maxTotal,
            $minFinal,
            $maxFinal,
            $minLiftCapacity,
            $maxLiftCapacity,
            $searchText,        
            $categoryName     
        );

        header('content-type:application/json');
        echo  json_encode($data) ;
    }

    public function resizeImage($source, $width, $height, $maintain_ratio = FALSE) {
        $this->load->library('image_lib');
        $config['image_library'] = 'gd2';
        $config['source_image'] = $source;
        $config['create_thumb'] = FALSE;
        $config['maintain_ratio'] = $maintain_ratio;
        $config['width'] = $width;
        $config['height'] = $height;
        $config['quality'] = '100%';

        $this->image_lib->clear();
        $this->image_lib->initialize($config);
        $this->image_lib->resize();
    }

 
    public function getTruckById()
    {
      
        $id = $this->input->post('id');

        $this->db->select('*');
        $this->db->where('ID', $id);
        $this->db->from('viewAuctionResults');

        $result = $this->db->get()->row_array();
        echo json_encode($result);
    }

    public function updateFianlPrice()
    {

        $this->load->model('Deal_model');

        $ID = $this->input->post('ID');
        $FinalPrice = $this->input->post('FinalPrice');  

        $result =  $this->Deal_model->update(array('ID' => $ID), array('FinalPrice'=>$FinalPrice));

        $logData = array(
            'UserID' => $this->session->userdata('ID'),
            'Action' => 'Edit Past Result',
            'Objective' => $ID,
            'Result' => 'Success'
        );
        $this->Log_model->addLog($logData);

        echo json_encode(array('success'=> true));    
    }

    public function getEquipmentCategory() {
        $this->db->select('EqCategory');        
        $this->db->from('viewAuctionResults');
        $this->db->group_by('EqCategory');
        $result = $this->db->get()->result_array();

        echo json_encode($result);
    }
 
}
