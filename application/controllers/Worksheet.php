<?php
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");


class Worksheet extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        //MY_Output's disable_cache() method
        $this->output->disable_cache();

        if (!$this->session->has_userdata('ID') || $this->session->userdata('ID') == "")
            redirect('Login');

        $this->load->model('Log_model');

        $ID = $this->session->userdata('ID');
        $this->load->model('User_model');
        $userData = $this->User_model->getUserInfo($ID);
        if ($userData['PERMISSION'] == 'uploader')
            redirect('Deals');
    }

    public function index()
    {
        $this->load->model('User_model');

        $ID = $this->session->userdata('ID');
        // $viewData = array();
        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('user/page-worksheet', $viewData);
    }

    public  function getUploadedDealsByUser_Date()
    {
        $user = $this->input->post('user');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $date = new DateTime($startDate);

        $period = new DatePeriod(
            new DateTime($startDate),
            new DateInterval('P1D'),
            new DateTime($endDate)
       );

       $dealsCountArray = array(0);
       $dateArray = array("");       

       $this->load->model('Deal_model');

       $graphStart = 0;

       foreach ($period as $key => $val) {
           $dateVal = $val->format('Y-m-d');           
           $deal_count = $this->Deal_model->getTruckCountByDateAdded_User($dateVal, $user);

           if ($deal_count != 0)
                $graphStart = 1;

           if ($graphStart == 1) 
           {
                array_push($dateArray, $val->format('d'));
                array_push($dealsCountArray, $deal_count);           
           }
           
       }

       $total_count = $this->Deal_model->getTruckCountByUserID($user, $startDate, $endDate, 0);

       echo json_encode(array('date' => $dateArray, 'counts' => $dealsCountArray, 'total_count' => $total_count));
    }

    public  function getAssignedOppByUser_Date()
    {
        $user = $this->input->post('user');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('User_model');
        $userInfo = $this->User_model->getUserInfo($user);        

        $date = new DateTime($startDate);

        $period = new DatePeriod(
            new DateTime($startDate),
            new DateInterval('P1D'),
            new DateTime($endDate)
       );

       $dealsCountArray = array(0);
       $dateArray = array("");       

       $this->load->model('Assignment_model');

       $graphStart = 0;

       foreach ($period as $key => $val) {
           $dateVal = $val->format('Y-m-d');           
           $deal_count = $this->Assignment_model->getAssignedOppByDateAdded_User($dateVal, $userInfo["USERNAME"]);
           if ($deal_count != 0)
                $graphStart = 1;
            
            if ($graphStart == 1) 
            {
                array_push($dateArray, $val->format('d'));
                array_push($dealsCountArray, $deal_count);
            }
           
       }

       $total_count = $this->Assignment_model->getAssignedOpp($userInfo['USERNAME'], $startDate, $endDate);

       echo json_encode(array('date' => $dateArray, 'counts' => $dealsCountArray, 'total_counts' => $total_count));
    }

    public function getStatusByDealType() {
        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);

        $user = $this->input->post('user');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('Deal_model');
        $data = array();

        $item = array();
        $item['name'] = lang('Sold Deals');
        $item['num'] = $this->Deal_model->getSoldUploadedDealsCount($user, $startDate, $endDate);
        array_push($data, $item);

        $dealTypeList = $this->Deal_model->getAllDealType();

        foreach ($dealTypeList as $dealType) {
            $item = array();
            $item['name'] = $dealType['DealType'];
            $item['num'] = $this->Deal_model->getTruckCountByDealType_user_date($dealType['DealType'], $user, $startDate, $endDate);
            array_push($data, $item);

            if ($dealType['DealType'] == 'Auction' && $item['num'] > 0) {
                $item['name'] = 'Expired';
                $item['num'] = $this->Deal_model->getExpiredAuctionCountByUserDate($user, $startDate, $endDate);
                array_push($data, $item);

                $item = array();
                $item['name'] = 'Expiring within a week';
                $item['num'] = $this->Deal_model->getExpriedAuctionCountInWeekByUserDate($user, $startDate, $endDate);
                array_push($data, $item);
            }            
        }

        // usort($data, function ($a, $b) {
        //     return $b['num'] - $a['num'];
        // });

        // Get Published Deals
        $item = array();
        $item['name'] = lang('Active Published Deals');
        $item['num'] = $this->Deal_model->getActivePublishedDealsCountByUserDate($user, $startDate, $endDate);
        array_push($data, $item);

        $item = array();
        $item['name'] = lang('Deals with 3 pictures or less');
        $item['num'] = $this->Deal_model->getLeadsHaveLessThan4Pictures($user, $startDate, $endDate);
        array_push($data, $item);

        // Get old Non Auction Deals
        $this->db->select('ActiveDealTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $this->db->limit(1);
        $row = $this->db->get()->row_array();

        $activeDealTime = $row['ActiveDealTime'];

        if ($activeDealTime < 2)
            $activeDealTime = 2;

        $item = array();
        if ($language == 'english')
            $item['name'] = ($activeDealTime - 2) . '+ days Non Auction Deals';
        else if ($language == 'spanish') 
            $item['name'] = 'Tratos agregados hace ' . ($activeDealTime - 2) . '+ días (no subastas)';

        $item['num'] = $this->Deal_model->getOutdatedDealsCountByUser($user);
        array_push($data, $item);

        // Get No Final Price Deals

        $item = array();
        $item['name'] = lang('Auctions without Final Price');
        $item['num'] = $this->Deal_model->getNoFianlPriceDealsCountByUser($user);
        array_push($data, $item);

        $item = array();
        $item['name'] = 'Total Num';
        $item['num'] = $this->Deal_model->getAllAuctionResultsCountByUser($user);
        array_push($data, $item);

        $item = array();
        $item['name'] = lang('Sold Deals');
        $item['num'] = $this->Deal_model->getSoldUploadedDealsCount($user, $startDate, $endDate);

        
        echo json_encode($data);
    }

    public function getStatusByEqCategory() {
        $user = $this->input->post('user');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('Deal_model');
        $data = array();

        $dealTypeList = $this->Deal_model->getAllCategory();

        foreach ($dealTypeList as $dealType) {
            $item = array();
            $item['name'] = $dealType['EqCategory'];
            $item['num'] = $this->Deal_model->getTruckCountByCategoryName_user_date($dealType['EqCategory'], $user, $startDate, $endDate);

            array_push($data, $item);
        }

        usort($data, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($data);
    }

    public function getAssignedOppsByEqCategory() {
        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);

        $user = $this->input->post('user');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('User_model');
        $userInfo = $this->User_model->getUserInfo($user);  

        $this->load->model('Opportunity_model');
        $this->load->model('Assignment_model');
        $data = array();

        $dealTypeList = $this->Opportunity_model->getAllCategory();

        foreach ($dealTypeList as $dealType) {
            $item = array();
            $item['name'] = $dealType['EqCategory'];
            $item['num'] = $this->Assignment_model->getAssignmentByEqCategoryNameUserDate($dealType['EqCategory'], $userInfo['USERNAME'], $startDate, $endDate);

            array_push($data, $item);
        }

        usort($data, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($data);
    }

    public function getSurveyResult() {
        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);

        $user = $this->input->post('user');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('User_model');
        $userInfo = $this->User_model->getUserInfo($user);  

        $this->load->model('CFU_model');        
        $data = array();

        $item['name'] = lang('Total');
        $item['num'] = $this->CFU_model->getAllSurveyCountByUser($userInfo['USERNAME'], $startDate, $endDate);

        array_push($data, $item);

        $SurveySalesRep = array('No Contact' => 'No Contact', 'Bad' => 'Bad Contact', 'OK' => 'OK Contact', 'Great' => 'Great Contact');        
        $SurveyOffer = array('No Offer' => 'No Offer', 'Bad' => 'Bad Offer', 'OK' => 'OK Offer', 'Great' => 'Great Offer');

        foreach ($SurveySalesRep as $key => $Survey) {            
            $item['name'] = lang($Survey);
            $item['num'] = $this->CFU_model->getSurveySalesRepCountByUser($key, $userInfo['USERNAME'], $startDate, $endDate);

            array_push($data, $item);
        }

        foreach ($SurveyOffer as $key => $Survey) {            
            $item['name'] = lang($Survey);
            $item['num'] = $this->CFU_model->getSurveyOfferCountByUser($key, $userInfo['USERNAME'], $startDate, $endDate);

            array_push($data, $item);
        }        

        $CFUBecameOpp = $this->CFU_model->getCFUBecameOppByUser($userInfo['USERNAME'], $startDate, $endDate);        

        echo json_encode(array(
            'data' =>$data,
            'Opp' => $CFUBecameOpp)
        );
    }

    public function getAssignmentDetails() {
        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);

        $user = $this->input->post('user');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $interval = $this->input->post('interval');

        $this->load->model('User_model');
        $userInfo = $this->User_model->getUserInfo($user);  

        $this->load->model('Opportunity_model');
        $this->load->model('Assignment_model');
        $data = array();

        $stageList = $this->Assignment_model->getAllStages();

        foreach ($stageList as $stage) {
            $item = array();
            $item['name'] = lang($stage['Stage']);
            $item['num'] = $this->Assignment_model->getAssignmentByStageNameUserDate($stage['Stage'], $userInfo['USERNAME'], $startDate, $endDate);

            array_push($data, $item);
        }

        //Get System Canceled Assignemts        

        usort($data, function ($a, $b) {
            return $b['num'] - $a['num'];
        });        

        $systemCanceled = array();
        $systemCanceled['name'] = lang('System Canceled');
        $systemCanceled['num'] = $this->Assignment_model->getSystemCanceledAssignments($userInfo['USERNAME'], $startDate, $endDate);   
        
        $opened = array();
        $opened['name'] = lang('Open');
        $opened['num'] = $this->Assignment_model->getAssignmentByStatusUserDate('Open', $userInfo['USERNAME'], $startDate, $endDate);

        $closed = array();
        $closed['name'] = lang('Closed');
        $closed['num'] = $this->Assignment_model->getAssignmentByStatusUserDate('Closed', $userInfo['USERNAME'], $startDate, $endDate);

        $contactsCount = array();        
        $contactsCount['name'] = lang('Assignment Notes');

        $endDateTime = new DateTime($endDate);
        $endDateTime->add(new DateInterval('P1D'));

        $period = new DatePeriod(
            new DateTime($startDate),
            new DateInterval('P1D'),
            $endDateTime
        );

        $totalCount = -1;

        if (iterator_count($period) <= 32) {
            $totalCount = 0; 
            foreach ($period as $key => $val) {
                $dateVal = $val->format('Y-m-d');           
                $assignCount = $this->Assignment_model->getContacedAssignByDate($dateVal, $userInfo["USERNAME"]);
                $totalCount += $assignCount;
            }
        }
        
        $contactsCount['num'] = $totalCount;

        echo json_encode(array('stage' =>$data, 'systemCanceled' => $systemCanceled, 'open' => $opened, 'closed' => $closed, 'contacted' => $contactsCount));
    }

    public function getPointsByUser() {
        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);

        $user = $this->input->post('user');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $this->load->model('User_model');
        $userInfo = $this->User_model->getUserInfo($user);  

        $this->db->select('*');
        $this->db->from('tblPointsByCase');
        $point = $this->db->get()->row_array();

        $result = array();

        $this->load->model('Deal_model');

        $rbAuctionCount = $this->Deal_model->getRbauctionsByUser($user, $startDate, $endDate);        
        array_push($result, array(
            'name' => lang('Ritchie Bros Auctions'),
            'point' => $point['rbauction'],
            'num' => $rbAuctionCount
        ));

        $ironplanetCount = $this->Deal_model->getIronplanetByUser($user, $startDate, $endDate);
        array_push($result, array(
            'name' => lang('Proxibid/Ironplanet Auctions'),
            'point' => $point['ironplanetProxibid'],
            'num' => $ironplanetCount
        ));

        $allAuction = $this->Deal_model->getAllAuctionsByUser($user, $startDate, $endDate);
        array_push($result, array(
            'name' => lang('Other Auctions'),
            'point' => $point['auction'],
            'num' => ($allAuction - $rbAuctionCount - $ironplanetCount)
        ));

        $ForSaleTraderCount = $this->Deal_model->getForSaleTraderByUser($user, $startDate, $endDate);
        array_push($result, array(
            'name' => lang('Machinery/Crane Trader For Sales'),
            'point' => $point['For SaleTrader'],
            'num' => $ForSaleTraderCount
        ));

        $allForSaleCount = $this->Deal_model->getAllForSaleByUser($user, $startDate, $endDate);
        array_push($result, array(
            'name' => lang('Other For Sales'),
            'point' => $point['For Sale'],
            'num' => ($allForSaleCount - $ForSaleTraderCount)
        ));

        $allConsignmentCount = $this->Deal_model->getAllConsignmentByUser($user, $startDate, $endDate);
        array_push($result, array(
            'name' => lang('Consignments'),
            'point' => $point['consignment'],
            'num' => $allConsignmentCount
        ));

        $this->load->model('Assignment_model');
        $allAssignments = $this->Assignment_model->getAssignedOpp($userInfo['USERNAME'], $startDate, $endDate);
        array_push($result, array(
            'name' => lang('Auto Assignments'),
            'point' => $point['assignment'],
            'num' => $allAssignments
        ));

        $this->load->model('Opportunity_model');
        $allMyOpp = $this->Opportunity_model->getDirectOppsByUsersLike('MyOpp '.$userInfo['USERNAME'], $startDate, $endDate);
        array_push($result, array(
            'name' => lang('MyOpp') . ' '.$userInfo['USERNAME'],
            'point' => $point['myopp'],
            'num' => $allMyOpp
        ));

        $this->load->model('Activity_model');
        $catalogDonwloaded = $this->Activity_model->getCatalogDownloadedCount($userInfo['USERNAME'], $startDate, $endDate);
        array_push($result, array(
            'name' => lang('Catalog Downloads'),
            'point' => $point['catalogDownloads'],
            'num' => $catalogDonwloaded
        ));

        if ($endDate != 'NaN-NaN-NaN')
        {
            $endDateTime = new DateTime($endDate);
            $endDateTime->add(new DateInterval('P1D'));
    
            $period = new DatePeriod(
                new DateTime($startDate),
                new DateInterval('P1D'),
                $endDateTime
            );
    
            $dates = array();
    
            foreach($period as $key => $val)
            {
                $dates[] = $val->format('Y-m-d');
            }
    
            $dates = array_reverse($dates);
            $totalCount = 0;
            $count = 0;
    
            foreach ($dates as $dateVal) {
                $count++;
                if ($count ==  30)
                    break;
                $assignCount = $this->Assignment_model->getContacedAssignByDate($dateVal, $userInfo["USERNAME"]);
                $totalCount += $assignCount;
            }
    
            array_push($result, array(
                'name' => lang('Notes'),
                'point' => $point['notes'],
                'num' => $totalCount
            ));
        }
        

        $this->load->model('Sales_model');
        $salesCount = $this->Sales_model->getSalesCount($userInfo['USERNAME'], $startDate, $endDate);
        $replacementsCount = $this->Sales_model->getSoldReplacementsCount($userInfo['USERNAME'], $startDate, $endDate);

        $SalesPoint = ($point['sale'] * ($salesCount - $replacementsCount)) + ($point['SoldReplacements'] * $replacementsCount);
        array_push($result, array(
            'name' => lang('Sale'),
            'point' => $SalesPoint,
            'num' => $salesCount
        ));

        $this->load->model('Activity_model');
        $editPriceCount = $this->Activity_model->getActivityCountByAction($userInfo['USERNAME'], "Edit Final Price", $startDate, $endDate);
        $closeAuctionCount = $this->Activity_model->getActivityCountByAction($userInfo['USERNAME'], "Close Auction", $startDate, $endDate);

        array_push($result, array(
            'name' => lang('Edit Final Results'),
            'point' => $point['auctionfinalprice'],
            'num' => $editPriceCount + $closeAuctionCount
        ));

        $proposalCount = $this->Activity_model->getActivityCountByAction($userInfo['USERNAME'], "Make a Proposal", $startDate, $endDate);

        array_push($result, array(
            'name' => lang('Proposals Made'),
            'point' => $point['proposal'],
            'num' => $proposalCount
        ));

        $lessLeadsCount = $this->Deal_model->getLeadsHaveLessThan4Pictures($user, $startDate, $endDate);

        array_push($result, array(
            'name' => lang('Deals with 3 pictures or less'),
            'point' => $point['dealsLessXpics'],
            'num' => $lessLeadsCount
        ));
        echo json_encode($result);
    }
}