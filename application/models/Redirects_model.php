<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Redirects_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();

        // set pacific time zone
        date_default_timezone_set('America/Phoenix');
    }

    public function insert($data)
    {
        $this->db->insert('tblredirects', $data);
        return $this->db->insert_id();
    }

    public function update($criteria, $data)
    {
        $this->db->where($criteria);
        return $this->db->update('tblredirects', $data);
    }

    public function getRedirectDataByID($ID) {
        $this->db->select('*');
        $this->db->where('ID', $ID);
        $this->db->from('tblredirects');
        $result = $this->db->get()->row_array();
        return $result;
    }

    public function getTotalCountByShareID($ShareID) {
        $this->db->select('ID');
        $this->db->where('PostID =', $ShareID);
        $this->db->from('tblredirects');

        return $this->db->count_all_results();
    }
}