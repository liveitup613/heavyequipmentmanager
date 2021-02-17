<?php
/*
@@ Incentive Model
@@ By Zheng
@@ 2020-06-24
*/
?>

<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Incentive_model extends CI_Model
{
    private $tblname = 'tblIncentives';
    
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

    public function getTotalDepositByUserAndCurrency($User, $SalesID, $Currency) {
        $this->db->select('COALESCE(SUM(Amount), 0) as TotalDeposit');
        $this->db->where('User', $User);
        $this->db->where('SalesID', $SalesID);
        $this->db->where('Currency', $Currency);
        $this->db->from($this->tblname);
        $result = $this->db->get()->row_array();

        return $result['TotalDeposit'];
    }

    public function getTotalDepositByCurrency($SalesID, $Currency) {
        $this->db->select('COALESCE(SUM(Amount), 0) as TotalDeposit');
        $this->db->where('SalesID', $SalesID);
        $this->db->where('Currency', $Currency);
        $this->db->from($this->tblname);
        $result = $this->db->get()->row_array();

        return $result['TotalDeposit'];
    }

    public function getIncentiveComm($User, $SaleID) {
        $this->db->select('*');
        $this->db->where('SaleID', $SaleID);
        $this->db->limit(1);
        $this->db->from('tblIncentiveComm');
        $result = $this->db->get()->row_array();

        if ($result == null) 
            return null;
        
        $returnArray = array(
            'IncentiveAmount' => $result[$User.'Incentive'],
            'Currency' => $result[$User.'Currency']
        );

        return $returnArray;
    }
}