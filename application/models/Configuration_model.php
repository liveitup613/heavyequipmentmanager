<?php
/*
@@ Opportunity Model
@@ By Zheng
@@ 2020-03-15
*/
?>

<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Configuration_model extends CI_Model
{
    private $tblname = 'tblconfig';

    public function __construct() {
        parent::__construct();

        date_default_timezone_set('America/Phoenix');
    }

    public function update($data)
    {
        $this->db->where('ID', 1);        
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

    public function getExpirationData() {
        $this->db->select('LeadTime, AssignmentTime, ContactTime, OppTime, ActiveDealTime, UnpublishAuction');
        $this->db->from($this->tblname);
        $result =  $this->db->get()->row_array();

        return $result;
    }

    public function getExpirationStatus() {
        $this->db->select('ActiveExpiration');
        $this->db->where('ID', 1);
        $this->db->limit(1);
        $this->db->from($this->tblname);
        $row = $this->db->get()->row_array();

        return $row['ActiveExpiration'];
    }

    public function getNoAutoAssignmentStatus() {
        $this->db->select('NoAutoAssignment');
        $this->db->where('ID', 1);
        $this->db->limit(1);
        $this->db->from($this->tblname);
        $row = $this->db->get()->row_array();

        return $row['NoAutoAssignment'];
    }
}