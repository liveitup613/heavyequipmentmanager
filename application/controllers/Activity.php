<?php
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");


class Activity extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        //MY_Output's disable_cache() method
        $this->output->disable_cache();

        if (!$this->session->has_userdata('ID') || $this->session->userdata('ID') == "")
            redirect('Login');

        $this->load->model('Log_model');
        date_default_timezone_set('America/Phoenix');

        $ID = $this->session->userdata('ID');
        $this->load->model('User_model');
        $userData = $this->User_model->getUserInfo($ID);
        if ($userData['PERMISSION'] == 'uploader')
            redirect('Deals');
    }

    public function index() {
        $UserID = $this->session->userdata('ID');

        $this->load->model('User_model');
        $viewData = $this->User_model->getUserInfo($UserID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        if ($viewData['PERMISSION'] != 'admin') 
            redirect("Deals");

        $this->load->view('user/page-activity', $viewData);
    }

    public function getAllActivities() {
        $this->db->select('Activity');
        $this->db->from('tblActivities');
        $this->db->group_by('Activity');

        $result = $this->db->get()->result_array();

        echo json_encode($result);
    }

    public function getAllUserName() {
        $this->db->select('Username');
        $this->db->from('tblActivities');
        $this->db->group_by('Username');

        $result = $this->db->get()->result_array();

        echo json_encode($result);
    }

    public function getActivityData() {
        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $user = $this->input->post('user');
        $minDate = $this->input->post('minDate');
        $maxDate = $this->input->post('maxDate');
        $activity = $this->input->post('activity');
        $searchText = $this->input->post('searchText');    
        $start = $this->input->post('start');
        $length = $this->input->post('length');    

        $this->load->model('Activity_model');
        $data = $this->Activity_model->getData(
            $user,
            $minDate,
            $maxDate,
            $activity,
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

    public function addActivity() {
        $this->load->model("User_model");
        $ID = $this->session->userdata('ID');
        $userData = $this->User_model->getUserInfo($ID);
        $IP = $this->input->ip_address();

        $Activity = $this->input->post('Activity');
        $ObjectiveTable = $this->input->post('ObjectiveTable');
        $ObjectiveID = $this->input->post('ObjectiveID');
        $Webpage = $this->input->post('Webpage');
        $Status = $this->input->post('Status');
        $Error = $this->input->post('Error');

        $this->load->model('Activity_model');
        $this->Activity_model->add(
            $userData['USERNAME'], 
            $Activity, 
            $ObjectiveTable, 
            $ObjectiveID, 
            $Webpage, 
            $Status, 
            $Error,
            $IP
        );
        echo 'success';
    }

    public function getGraphData() {

        $user = $this->input->post('user');
        $minDate = $this->input->post('minDate');
        $maxDate = $this->input->post('maxDate');
        $activity = $this->input->post('activity');

        $data = array();
        $trick = array();
        $max_cnt = 0;

        $startDateTime = new DateTime($minDate.' 00:00:00');                
        $endDateTime = new DateTime(date('Y-m-d H:i:s'));
        if ($maxDate != '')
            $endDateTime = new DateTime($maxDate.' 00:00:00');

        $this->load->model('Activity_model');

        $period = new DatePeriod(
            $startDateTime,
            new DateInterval('PT1H'),
            $endDateTime
        );

        $dates = array();
        $index = 0;

        $totalCnt = iterator_count($period);
        
        foreach($period as $key => $val)
        {
            $startDate = $val->format('Y-m-d H');
            $val->add(new DateInterval("PT1H"));
            $endDate = $val->format('Y-m-d H');

            $cnt = $this->Activity_model->getActivityCount($user, $activity, $startDate, $endDate);
            $max_cnt = $max_cnt > $cnt ? $max_cnt : $cnt;

            array_push($data, array($index, $cnt));

            if (substr($startDate, 11, 2) == '00'){
                array_push($trick, array($index, substr($startDate, 5, 5)));
            }
            else if ((substr($startDate, 11, 2) == '06' || substr($startDate, 11, 2) == '18') && $totalCnt < 168) {
                array_push($trick, array($index, '6'));
            }
            else if (substr($startDate, 11, 2) == '12' && $totalCnt < 336)
                array_push($trick, array($index, '12'));

            $index++;
        }
        
        echo json_encode(array(
            'data' => $data,             
            'trick' => $trick,
            'max_cnt' => $max_cnt
        ));
    }

    public function getGraphDataForToday() {
        $startDateTime = new DateTime(date('Y-m-d 00:00:00'));
        $endDateTime = new DateTime(date('Y-m-d H:i:s'));

        $data = array();
        $trick = array();
        $max_cnt = 0;

        $this->load->model('Activity_model');

        $period = new DatePeriod(
            $startDateTime,
            new DateInterval('PT10M'),
            $endDateTime
        );

        $dates = array();
        $index = 0;

        $totalCnt = iterator_count($period);
        
        foreach($period as $key => $val)
        {
            $startDate = $val->format('Y-m-d H:i:s');
            $val->add(new DateInterval("PT10M"));
            $endDate = $val->format('Y-m-d H:i:s');

            $cnt = $this->Activity_model->getActivityCount('all', 'all', $startDate, $endDate);
            $max_cnt = $max_cnt > $cnt ? $max_cnt : $cnt;

            array_push($data, array($index, $cnt));
            if (substr($startDate, 14, 2) == '00')
                array_push($trick, array($index, substr($startDate, 11, 5)));

            $index++;
        }
        
        echo json_encode(array(
            'data' => $data,             
            'trick' => $trick,
            'max_cnt' => $max_cnt
        ));
    }
}