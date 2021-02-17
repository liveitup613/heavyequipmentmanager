<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Lead_model extends CI_Model
{
    private $tblname = 'tblLeads';
    public function __construct() {
        parent::__construct();

        date_default_timezone_set('America/Phoenix');
    }

    public function update($criteria, $data)
    {
        $this->db->where($criteria);
        $this->db->update('tblLeads', $data);

        return $this->db->affected_rows();
    }

    public function delete($criteria)
    {
        $this->db->where($criteria);
        $this->db->delete('tblLeads');

        return $this->db->affected_rows();
    }

    public function getAllData(
        $status,
        $minStartDate,
        $maxStartDate,
        $rate,
        $searchText,
        $orderIndex,
        $sort,
        $start,
        $length
    ) {
        $field = "";

        if ($orderIndex == 0) {
            $field = 'ID';
        } else if ($orderIndex == 2) {
            $field = 'Status';
        } else if ($orderIndex == 7) {
            $field = 'AttContact';
        } else if ($orderIndex == 5) {
            $field = 'DateAdded';
        } else if ($orderIndex == 8) {
            $field = 'Source';
        }

        $statusArray = array('New', 'Pending');

        if ($status == 'Closed')
            $statusArray = array('No Contact', 'Info', 'No Lead', 'Opportunity', 'Closed');

        $this->db->from('tblLeads');
        $totalCount = $this->db->count_all_results();

        $this->db->select('tblLeads.*');             
        $this->db->select('tblCustomer.Name,
                           tblCustomer.LastName,
                           tblCustomer.Phone,
                           tblCustomer.Email,
                           tblCustomer.CompanyName,
                           tblCustomer.Country,
                           tblCustomer.State,
                           tblCustomer.City,
                           tblCustomer.RFC
                        ');
        $this->db->join('tblCustomer', 'tblLeads.CustomerID = tblCustomer.ID', 'left');
        if ($searchText != '')   {
            $searchWords = explode("+", $searchText);
            foreach ($searchWords as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word);                 
                $this->db->or_like('tblCustomer.Country', $word); 
                $this->db->or_like('tblCustomer.State', $word); 
                $this->db->or_like('tblCustomer.City', $word); 
                $this->db->or_like('tblLeads.Source', $word);  
                $this->db->or_like('tblLeads.EqCategory', $word);
                $this->db->or_like('tblLeads.EqMake', $word);
                $this->db->or_like('tblLeads.EqModelCap', $word);
                $this->db->or_like('tblLeads.LeadType', $word);
                $this->db->or_like('tblLeads.Status', $word);
                $this->db->or_like('tblLeads.Source', $word);
                $this->db->or_like('tblLeads.Timeframe', $word);
                $this->db->or_like('tblLeads.ClosedBy', $word);
                $this->db->group_end();
            }
            
        }        
        $this->db->where_in('tblLeads.Status', $statusArray);        
        if (!empty($minStartDate))
            $this->db->where('tblLeads.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblLeads.DateAdded <=', $maxStartDate.' 23:59:59');     
        if ($rate != 'All')
            $this->db->where('tblLeads.Rate', $rate);

        $order_status = sprintf("FIELD(Status, 'New', 'Pending', 'Opportunity', 'Info', 'No Lead', 'No Contact', 'Closed')");
        $this->db->order_by($order_status); 
        $this->db->order_by($field, $sort);

        $this->db->from('tblLeads');        

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
        $status,
        $minStart,
        $maxStart,
        $rate,
        $searchText
    ) {
        $statusArray = array('New', 'Pending');

        if ($status == 'Closed')
            $statusArray = array('No Contact', 'Info', 'No Lead', 'Opportunity', 'Closed');

        $this->db->from('tblLeads');
        $totalCount = $this->db->count_all_results();

        $this->db->select('tblLeads.*');       
        $this->db->select('tblCustomer.Name,
                           tblCustomer.LastName,
                           tblCustomer.Phone,
                           tblCustomer.Email,
                           tblCustomer.CompanyName,
                           tblCustomer.Country,
                           tblCustomer.State,
                           tblCustomer.City,
                           tblCustomer.RFC
                        ');
        $this->db->join('tblCustomer', 'tblLeads.CustomerID = tblCustomer.ID', 'left');      
        if ($searchText != '')   {
            $searchWords = explode("+", $searchText);
            foreach ($searchWords as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word); 
                $this->db->or_like('tblCustomer.Country', $word); 
                $this->db->or_like('tblCustomer.State', $word); 
                $this->db->or_like('tblCustomer.City', $word); 
                $this->db->or_like('tblLeads.Source', $word);  
                $this->db->or_like('tblLeads.EqCategory', $word);
                $this->db->or_like('tblLeads.EqMake', $word);
                $this->db->or_like('tblLeads.EqModelCap', $word);
                $this->db->or_like('tblLeads.LeadType', $word);
                $this->db->or_like('tblLeads.Status', $word);
                $this->db->or_like('tblLeads.Source', $word);
                $this->db->or_like('tblLeads.Timeframe', $word);
                $this->db->or_like('tblLeads.ClosedBy', $word);
                $this->db->group_end();
            }
            
        }        
        $this->db->where_in('tblLeads.Status', $statusArray);        
        if (!empty($minStart))
            $this->db->where('tblLeads.DateAdded >=', $minStart);
        if (!empty($maxStart))
            $this->db->where('tblLeads.DateAdded <=', $maxStart.' 23:59:59');   
        if ($rate != 'All')
            $this->db->where('tblLeads.Rate', $rate);  

        $order_status = sprintf("FIELD(Status, 'New', 'Pending', 'Opportunity', 'Info', 'No Lead', 'No Contact', 'Closed')");
        $this->db->order_by($order_status); 
        $this->db->order_by('tblLeads.ID');

        $this->db->from('tblLeads');        

        $result = $this->db->get()->result_array();

        $filteredCount = count($result);

        $headerArray = array(
            'LeadType', 'Name', 'LastName', 'Phone', 'Email', 'CompanyName',
            'Country', 'State', 'City', 'EqCategory', 'EqMake',
            'EqModelCap', 'MinYear', 'MaxPrice', 'Unit', 'TimeFrame',
            'AdditionalInfo', 'DateAdded', 'Source', 'AttContact', 'AttContactDates', 'LastAttContact', 'ClosingDate',
            'ClosedBy', 'Status'
        );

        $returnArray = array();
        array_push($returnArray, $headerArray);

        foreach ($result as $row) {
            $record = array();

            foreach ($headerArray as $header) {
                array_push($record, $row[$header]);
            }

            array_push($returnArray, $record);
        }
        
        return $returnArray;
    }

    public function addNewLead($data) {
        $this->db->select('LeadTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $result = $this->db->get()->row_array();

        if ($result == null)
            return 0;

        $leadTime = $result['LeadTime'];

        $today = time();
        $expiration = $today + $leadTime * 60 * 60;
        $wday = date('w', $today);

        $sundayStart = $today - ($wday - 0) * 86400 - ($today % 86400) + 7 * 60 * 60; // Sunday 00.00.00
        $mondayStart = $sundayStart + 24 * 60 * 60 + 8 * 60 * 60; // Monday 07.59.59
        $saturdayStart = $sundayStart + 6 * 24 * 60 * 60 + 15 * 60 * 60; // Saturday 15.00.00


        if ($today >= $sundayStart && $today < $mondayStart){
            $expiration = $mondayStart + $leadTime * 60 * 60;
        }

        if ($today >= $mondayStart && $today < $saturdayStart && $expiration >= $saturdayStart) {
            $expiration += 41 * 60 * 60;
        }

        if ($today >= $saturdayStart) {
            $expiration += (41 * 60 * 60 - ($today - $saturdayStart));
        }      
        
        $now = date('Y-m-d H:i:s', $today);
        $expirationDate = date('Y-m-d H:i:s', $expiration);

        $data['AddedBy'] = $this->session->userdata('ID');        
        $data['Status'] = 'New';
        $data['DateAdded'] = $now;
        $data['ExpirationDate'] = $expirationDate;        

        $this->db->insert('tblLeads', $data);
        return $this->db->insert_id();
    }

    public function attemptContact($id, $username) {

        $now = date('Y-m-d H:i:s');

        $this->db->where('ID', $id);
        $this->db->set('AttContact', '(AttContact + 1)', false);
        $this->db->set('LastAttContact', $now);
        $this->db->set('Status', 'Pending');
        $this->db->set('AttContactDates', 'concat(AttContactDates,  "'.$now.'&'.$username.';")', false);
        $this->db->update('tblLeads');

        return $this->db->affected_rows();
    }

    public function updateStatus() {
        $now = date('Y-m-d H:i:s');
        
        $status = array("New", "Pending");
        $this->db->where('ExpirationDate <', $now);
        $this->db->where_in('Status', $status);
        $this->db->set('Status', 'No Contact');
        $this->db->set('ClosingDate', $now);
        $this->db->set('ClosedBy', 'System');
        $this->db->update('tblLeads');
    }

    public function getAllSources() {
        $query =  $this->db->query('SELECT DISTINCT Source  FROM tblLeads');
        $result = $query->result_array();
        return  $result;
    }

    public function getLeadsCountBySource($source, $startDate, $endDate) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblLeads WHERE Source="' . $source . '" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '"');        
        $row = $query->row();
        return  $row->num;
    }

    public function getLeadsToOppCountBySource($source, $startDate, $endDate) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblLeads WHERE Source="' . $source . '" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '" AND Status = "Opportunity"');        
        $row = $query->row();
        return  $row->num;
    }

    public function getLeadCountByStatus($status) {
        $this->db->select('ID');
        $this->db->where('Status', $status);
        $this->db->from('tblLeads');
        return $this->db->count_all_results();
    }

    public function getNoLeadCountToday() {
        $today = date('Y-m-d');

        $this->db->select('ID');
        $this->db->where_in('Status', array('No Lead'));
        $this->db->where('ClosingDate >=', $today . ' 00:00:00');
        $this->db->where('ClosingDate <=', $today . ' 23:59:59');
        $this->db->from($this->tblname);
        
        return $this->db->count_all_results();
    }

    public function getInfoCountToday() {
        $today = date('Y-m-d');

        $this->db->select('ID');
        $this->db->where_in('Status', array('Info'));
        $this->db->where('ClosingDate >=', $today . ' 00:00:00');
        $this->db->where('ClosingDate <=', $today . ' 23:59:59');
        $this->db->from($this->tblname);
        
        return $this->db->count_all_results();
    }

    public function getTodayAddedCount() {
        $today = date('Y-m-d');

        $this->db->select('ID');
        $this->db->where('DateAdded >=', $today . ' 00:00:00');
        $this->db->where('DateAdded <=', $today . ' 23:59:59');
        $this->db->from($this->tblname);
        
        return $this->db->count_all_results();
    }
}
