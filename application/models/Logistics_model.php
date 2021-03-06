<?php
/*
@@ Logistics Model
@@ By Zheng
@@ 2020-06-4
*/
?>

<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Logistics_model extends CI_Model
{
    private $tblname = 'tblLogistics';    

    public function __construct() {
        parent::__construct();

        date_default_timezone_set('America/Phoenix');
    }

    public function update($criteria, $data)
    {
        $this->db->where($criteria);
        $this->db->update($this->tblname, $data);

        return $this->db->affected_rows();
    }

    public function delete($criteria)
    {
        $this->db->where($criteria);
        $this->db->delete($this->tblname);

        return $this->db->affected_rows();
    }

    public function insert($data) {          

        $this->db->insert($this->tblname, $data);

        return $this->db->insert_id();
    }

    public function get($criteria) {

        $this->db->where($criteria);
        $this->db->from($this->tblname);
        $this->db->limit(1);

        return $this->db->get()->row_array();
    }
}