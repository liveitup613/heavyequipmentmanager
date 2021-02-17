<?php
/*
@@ Activity Model
@@ By Zheng
@@ 2020-04-23
*/

class Activity_model extends CI_Model {

    private $tblname = 'tblActivities';
    public function __construct() {
        parent::__construct();

        date_default_timezone_set('America/Phoenix');
    }
    
    public function add($username, $activity, $objectiveTable, $objectiveID, $webpage, $status, $error, $IP) {   
        $this->db->select('USERNAME');
        $this->db->where('USERNAME', $username);
        $this->db->from('tbluser');
        $row = $this->db->get()->row_array();

        if ($row != null)
            $username = $row['USERNAME'];

        $data = array(
            'Username' => $username,
            'Date' => date('Y-m-d H:i:s'),
            'Activity' => $activity,
            'ObjectiveTable' => $objectiveTable,
            'ObjectiveID' => $objectiveID,
            'Webpage' => $webpage,
            'Status' => $status,
            'IP' => $IP,
            'Error' => $error
        );     
        $this->db->insert($this->tblname, $data);       
    }

    public function getCatalogDownloadedCount($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('Username', $user);
        $this->db->group_start();
        $this->db->where('Activity', 'Download Image Catalog');
        $this->db->or_where('Activity', 'Download PDF Catalog');
        $this->db->group_end();
        $this->db->where('Date >', $startDate.' 00:00:00');
        $this->db->where('Date <=', $endDate.' 23:59:59');
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getData(
        $user,
        $minDate,
        $maxDate,
        $activity,
        $searchText,
        $orderIndex,
        $sort,
        $start,
        $length
    ) {
        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();

        $this->db->select('*');
        $this->db->from($this->tblname);
        if ($user != 'all')
            $this->db->where('Username', $user);
        if ($activity != 'all')
            $this->db->where('Activity', $activity);
        if (!empty($minDate))
            $this->db->where('Date >=', $minDate);
        if (!empty($maxDate))
            $this->db->where('Date <=', $maxDate.' 23:59:59');   
        if ($searchText != '')   {
            $this->db->group_start();
            $this->db->like('Username', $searchText);            
            $this->db->or_like('Activity', $searchText);
            $this->db->or_like('Webpage', $searchText); 
            $this->db->or_like('IP', $searchText);  
            $this->db->or_like('ObjectiveTable', $searchText);              
            $this->db->group_end();
        }   

        $this->db->order_by('Date', 'desc');
        $result = $this->db->get()->result_array();

        $filteredCount = count($result);

        $realDataCount = $filteredCount;
        $response2 = array();
        $lastIndex = 0;

        if ($length == -1) {
            $response2 = $result;
        } else {
            $lastIndex = $realDataCount > ($start + $length)  ? ($start + $length) : $realDataCount;
            for ($i = $start; $i < $lastIndex; $i++) {
                array_push($response2, $result[$i]);
            }
        }

        return array('recordsTotal' => $totalCount, 'recordsFiltered' => $filteredCount, 'data' => $response2);
    }

    public function getActivityCount($username, $action, $startDate, $endDate) {
        $this->db->select('ID');
        if ($action != 'all')
            $this->db->where('Activity', $action);
        if ($username != 'all')
            $this->db->where('username', $username);
        $this->db->where('Date >=', $startDate . ':00:00');
        $this->db->where('Date <', $endDate . ':00:00');
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getActivityCountByAction($userName, $Action, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('Activity', $Action);
        if ($userName != 'all')
            $this->db->where('username', $userName);
        $this->db->where('Status', 'Success');
        $this->db->where('Date >=', $startDate . ' 00:00:00');
        $this->db->where('Date <=', $endDate . ' 23:59:59');
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getNewOppByCFU($date) {
        $this->db->select('ID');
        $this->db->where('Activity', 'Add New Opportunity');
        $this->db->where('Status', 'Success');
        $this->db->where('objectiveTable', 'tblCfu');
        $this->db->where('Date >=', $date . ' 00:00:00');
        $this->db->where('Date <=', $date . ' 23:59:59');
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }
}