<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Customer_model extends CI_Model
{
    private $tblname = 'tblCustomer';
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
        $sql = $this->db->insert_string($this->tblname, $data) . ' ON DUPLICATE KEY UPDATE ID=ID';
        $this->db->query($sql);
        $id = $this->db->insert_id();
        return $id;        
    }

    public function getByID($ID) {
        $this->db->select('*');
        $this->db->where('ID', $ID);
        $this->db->from($this->tblname);
        return $this->db->get()->row_array();
    }

    public function getAllData(      
        $searchText,
        $minStartDate,
        $maxStartDate,
        $minLastOppDate,
        $maxLastOppDate,
        $orderIndex,
        $sort,  
        $start,
        $length
    ) {
        $field = "";

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();

        $this->db->select('*');             
        if ($searchText != '')   {
            $searchWords = explode("+", $searchText);
            foreach ($searchWords as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(Name), " ", trim(LastName))', $word);
                $this->db->or_like('Phone', $word);
                $this->db->or_like('Email', $word); 
                $this->db->or_like('Country', $word); 
                $this->db->or_like('CompanyName', $word);
                $this->db->or_like('State', $word); 
                $this->db->or_like('City', $word);                
                $this->db->group_end();
            }            
        }    

        if (!empty($minStartDate)){
            $this->db->where('DateAdded >=', $minStartDate);
        }

        if (!empty($maxStartDate)) {
            $this->db->where('DateAdded <=', $maxStartDate);
        }

        if (!empty($minLastOppDate)) {
            $this->db->where('LastOpportunity >=', $minLastOppDate);
        }

        if (!empty($maxLastOppDate)) {
            $this->db->where('LastOpportunity <=', $maxLastOppDate);
        }

        $this->db->from($this->tblname);        
        $this->db->order_by('DateAdded', 'desc');
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

    public function getAllDataForExcel(
        $searchText,
        $minStartDate,
        $maxStartDate,
        $minLastOppDate,
        $maxLastOppDate
    ) {
        $field = "";

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();

        $this->db->select('*');             
        if ($searchText != '')   {
            $searchWords = explode("+", $searchText);
            foreach ($searchWords as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(Name), " ", trim(LastName))', $word);
                $this->db->or_like('Phone', $word);
                $this->db->or_like('Email', $word); 
                $this->db->or_like('Country', $word); 
                $this->db->or_like('CompanyName', $word);
                $this->db->or_like('State', $word); 
                $this->db->or_like('City', $word);                
                $this->db->group_end();
            }            
        }    

        if (!empty($minStartDate)){
            $this->db->where('DateAdded >=', $minStartDate);
        }

        if (!empty($maxStartDate)) {
            $this->db->where('DateAdded <=', $maxStartDate);
        }

        if (!empty($minLastOppDate)) {
            $this->db->where('LastOpportunity >=', $minLastOppDate);
        }

        if (!empty($maxLastOppDate)) {
            $this->db->where('LastOpportunity <=', $maxLastOppDate);
        }

        $this->db->from($this->tblname);        
        $this->db->order_by('DateAdded', 'desc');
        $customer_result = $this->db->get()->result_array();

        $headerArray = array(
            'Phone', 'Name', 'Last Name', 'Email', 'Country', 'State', 'City', 'Company', 'Date Added', 'Last Opportunity'
        );

        $result = array();
        array_push($result, $headerArray);

        foreach ($customer_result as $res) {

            $record = array();
            array_push($record, $res['Phone']);
            array_push($record, $res['Name']);
            array_push($record, $res['LastName']);
            array_push($record, $res['Email']);
            array_push($record, $res['Country']);
            array_push($record, $res['State']);
            array_push($record, $res['City']);
            array_push($record, $res['CompanyName']);
            array_push($record, $res['DateAdded']);
            array_push($record, $res['LastOpportunity']);
            array_push($result, $record);
        }
        return $result;
    }

    public function updateCustomer($data) {
        $rfcAvailable = array_key_exists('RFC', $data);

        $sql = 'insert into `tblCustomer` (Phone, Name, LastName, Email, CompanyName, Country, State, DateAdded, City'. ($rfcAvailable ? ', RFC' : '') .') values( "' .
                $data['Phone'] . '", "' .
                $data['Name'] . '", "' .
                $data['LastName'] . '", "' .
                $data['Email'] . '", "' .
                $data['CompanyName'] . '", "' .
                $data['Country'] . '", "' .
                $data['State'] . '", "' .
                date('Y-m-d H:i:s') . '", "' .
                $data['City'] . 
                ($rfcAvailable ? '", "'.$data['RFC'] : '').
                '") on duplicate key update  ' .
                'Name = "'.$data['Name']. '", ' .
                'LastName = "'.$data['LastName']. '", ' .
                'Email = "'.$data['Email']. '", ' .
                'CompanyName = "'.$data['CompanyName']. '", ' .
                'Country = "'.$data['Country']. '", ' .
                'State = "'.$data['State']. '", ' .
                'City = "'.$data['City'].
                ($rfcAvailable ? '", RFC = "'.$data['RFC'] : '') .
                 '";';
        $this->db->query($sql);
        
        $this->db->select('ID');
        $this->db->from($this->tblname);
        $this->db->where('Phone', $data['Phone']);
        $row = $this->db->get()->row_array();

        return $row['ID'];
    }
}