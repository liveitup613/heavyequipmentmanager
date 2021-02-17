<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Share_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();

        // set pacific time zone
        date_default_timezone_set('America/Phoenix');
    }

    public function insert($data)
    {
        $this->db->insert('tblposts', $data);
        return $this->db->insert_id();
    }

    public function update($criteria, $data)
    {
        $this->db->where($criteria);
        return $this->db->update('tblposts', $data);
    }

    public function getShareDataByID($ID) {
        $this->db->select('*');
        $this->db->where('ID', $ID);
        $this->db->from('tblposts');
        $result = $this->db->get()->row_array();
        return $result;
    }

    public function deletePostItem($ID)
    {
        $this->db->where('ID', $ID);
        $result =  $this->db->delete('tblposts');
        return $result;
    }

    public function getPostedPlatforms($DealID) {
        $this->db->select('Platform');
        $this->db->from('tblposts');
        $this->db->where('DealID', $DealID);
        $this->db->where('Platform !=', '');
        $this->db->group_by('Platform');

        return $this->db->get()->result_array();
    }

    public function getPostingDataByDealID(
        $DealID,
        $start,
        $length,
        $orderIndex,
        $sort
    ) {

        $this->db->from('tblposts');
        $this->db->where('DealID', $DealID);
        $this->db->where('Platform !=', NULL);
        $totalCount = $this->db->count_all_results();

        $field = '';
        if ($orderIndex == 0) {
            $field = 'tblposts.Date';
        } else if ($orderIndex == 1) {
            $field = 'tblposts.UserName';
        } else if ($orderIndex == 2) {
            $field = 'tblposts.Platform';
        } else if ($orderIndex == 3) {
            $field = 'tblposts.Redirects';
        } else if ($orderIndex == 4) {
            $field = 'tblposts.Likes';
        } else if ($orderIndex == 5) {
            $field = 'tblposts.Comments';
        }

        $this->db->select('tblposts.*');
        $this->db->from('tblposts');
        $this->db->where('DealID', $DealID);
        $this->db->where('Platform !=', NULL);

        if ($length != -1) {
            $this->db->limit($length, $start);
        }

        $this->db->order_by($field, $sort);
        $response1 = $this->db->get()->result_array();

        $realDataCount = count($response1);

        return array('recordsTotal' => $totalCount, 'recordsFiltered' => $totalCount, 'data' => $response1);
    }

    public function getFirstPostDate($DealID) {
        $this->db->select('MIN(Date) as MinDate');
        $this->db->where('DealID', $DealID);
        $this->db->from('tblposts');
        $result = $this->db->get()->row_array();
        return $result;
    }

    public function getTotalViews($DealID) {
        $this->db->select('SUM(Redirects) as TotalViews');
        $this->db->where('DealID', $DealID);
        $this->db->from('tblposts');
        $result = $this->db->get()->row_array();
        return $result;
    }
}