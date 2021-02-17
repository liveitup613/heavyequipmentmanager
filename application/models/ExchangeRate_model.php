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

class ExchangeRate_model extends CI_Model
{
    private $tblname = 'tblexchangerate';    

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

    public function getExchangeRate() {
        $this->db->select('ExchangeRate');
        $this->db->order_by('Date', 'desc');
        $this->db->limit(1);
        $this->db->from($this->tblname);
        $result = $this->db->get()->row_array();
        
        if ($result == null)
            return null;
        
        return $result['ExchangeRate'];
    }

    public function updateExchangeRate($User, $ExchangeRate) {
        $ExistingExchangeRate = $this->getExchangeRate();

        if ($ExistingExchangeRate == null || ($ExistingExchangeRate != null && $ExchangeRate != $ExistingExchangeRate)) {
            $this->insert(
                array(
                    'Date' => date('Y-m-d H:i:s'),
                    'ExchangeRate' => $ExchangeRate,
                    'User' => $User
                )
            );            
        }

        return true;
    }
}