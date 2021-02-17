<?php
/*
@@ Deposit Model
@@ By Zheng
@@ 2020-04-09
*/
?>

<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Deposit_model extends CI_Model
{
    private $tblname = 'tbldeposits';
    private $statuses = array('', 'New', 'In Progress');
    private $dealStatuses = array('', 'Pending', 'Shipping', 'Customs', 'Shop', 'Ready');

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

    public function getIndexesForSale($SaleID) {
        $this->db->select('ID');
        $this->db->where('SaleID', $SaleID);
        $this->db->order_by('ID', 'desc');
        $this->db->from($this->tblname);        
        $result = $this->db->get()->result_array();

        return $result;
    }

    public function getTotalDeposit($SaleID)  {
        $this->db->select('COALESCE(SUM(RealAmount), 0) as TotalDeposit');
        $this->db->where('SaleID', $SaleID);
        $this->db->from($this->tblname);
        $res = $this->db->get()->row_array();

        if ($res == null)   
            return null;
        
        return $res['TotalDeposit'];
    }
}