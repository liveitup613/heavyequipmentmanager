<?php
/*
@@ Opportunity Model
@@ By Zheng
@@ 2020-02-19
*/
?>

<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Opportunity_model extends CI_Model
{
    private $tblname = 'tblopportunities';
    private $stages = array('No Contact', 'Contact', 'Proposal', 'Sale');

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

    public function updateStage($ID, $Stage) {
        $this->db->select('Stage');
        $this->db->where('ID', $ID);
        $this->db->from($this->tblname);
        $result = $this->db->get()->row_array();

        if ($result == null)
            return null;

        $currentStage = $result['Stage'];

        $currentIndex = array_search($currentStage, $this->stages);
        $newIndex = array_search($Stage, $this->stages);

        if ($currentIndex < $newIndex) {
            $this->db->where('ID', $ID);
            $this->db->set('Stage', $Stage);
            $this->db->update($this->tblname);
        }

        return $ID;
    }

    public function getAllData(        
        $searchText,
        $status,
        $stage,
        $leadType,
        $salesRep,
        $rate,         
        $contactDate,
        $minStartDate,
        $maxStartDate,
        $searchHelp,
        $orderIndex,
        $sort,
        $start,
        $length
    ) { 
        $statusRange = array('New', 'Pending', 'Assigned');
        if ($status == 'Closed')
            $statusRange = array('Closed', 'Canceled');        

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();

        $this->db->select('tblopportunities.*');     
        $this->db->select(' tblassignments.ToContactDate as ContactDate,
                            tblassignments.SearchHelp,
                            tblassignments.Tag,
                            tblassignments.Status as AssignStatus,
                            tblassignments.Stage as AssignStage
        ');
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
        $this->db->from($this->tblname);        
        $this->db->join('tblassignments', 
                        'tblassignments.OpportunityID = tblopportunities.ID and tblassignments.Status = "Open"', 'left');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');

        if ($searchText != '')   {
            $words = explode("+", $searchText);
            foreach ($words as $word) {                
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word);                 
                $this->db->or_like('tblCustomer.State', $word);  
                $this->db->or_like('tblCustomer.Country', $word);  
                $this->db->or_like('tblCustomer.City', $word);  
                $this->db->or_like('tblopportunities.Source', $word);  
                $this->db->or_like('tblopportunities.EqCategory', $word);  
                $this->db->or_like('tblopportunities.EqMake', $word);  
                $this->db->or_like('tblopportunities.EqModelCap', $word);  
                $this->db->or_like('tblopportunities.LastSalesRep', $word);  
                $this->db->or_like('tblopportunities.LeadType', $word);  
                $this->db->or_like('tblopportunities.Timeframe', $word);  
                $this->db->or_like('tblopportunities.ClosedBy', $word);
                $this->db->or_like('tblopportunities.Status', $word);
                $this->db->or_like('tblassignments.Tag', $word);
                $this->db->group_end();
            }            
        }        
        $this->db->where_in('tblopportunities.Status', $statusRange);
        if ($stage != 'All')
            $this->db->where('tblopportunities.Stage', $stage);
        if ($leadType != 'All')
            $this->db->where('tblopportunities.LeadType', $leadType);
        if ($salesRep != 'All')
            $this->db->where('tblopportunities.LastSalesRep', $salesRep);          
        if ($rate != 'All')
            $this->db->where('tblopportunities.Rate', $rate);
        if (!empty($minStartDate))
            $this->db->where('tblopportunities.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblopportunities.DateAdded <=', $maxStartDate.' 23:59:59');     
        if (!empty($contactDate)){
            if ($stage == 'All')
                $this->db->where('tblassignments.Stage !=', 'No Contact');
            $this->db->where('tblassignments.ToContactDate >=', $contactDate.' 00:00:00');
            $this->db->where('tblassignments.ToContactDate <=', $contactDate.' 23:59:59');
        }
        if ($searchHelp == 'YES')
            $this->db->where('tblassignments.SearchHelp', 'YES');

        $order_status = sprintf("FIELD(tblopportunities.Status, 'New', 'Pending', 'Assigned', 'Canceled', 'Closed')");
        $this->db->order_by($order_status); 
        $this->db->order_by('tblopportunities.DateAdded');        

        $filteredArray = $this->db->get()->result_array();

        $filteredCount = count($filteredArray);

        $realDataCount = $filteredCount;
        $response2 = array();
        $lastIndex = 0;

        if ($length == -1) {
            $response2 = $filteredArray;
        } else {
            $lastIndex = $realDataCount > ($start + $length)  ? ($start + $length) : $realDataCount;
            for ($i = $start; $i < $lastIndex; $i++) {                
                array_push($response2, $filteredArray[$i]);
            }
        }

        return array('recordsTotal' => $totalCount, 'recordsFiltered' => $filteredCount, 'data' => $response2);
    }

    public function getAllDataForExcel(
        $searchText,
        $status,
        $stage,
        $leadType,
        $salesRep,            
        $contactDate,
        $minStartDate,
        $maxStartDate,
        $searchHelp
    ) {
        $statusRange = array('New', 'Pending', 'Assigned');
        if ($status == 'Closed')
            $statusRange = array('Closed', 'Canceled');        

        $this->db->select('tblopportunities.*');     
        $this->db->select(' tblassignments.ToContactDate as ContactDate,
                            tblassignments.SearchHelp,
                            tblassignments.Tag,
                            tblassignments.Status as AssignStatus,
                            tblassignments.Stage as AssignStage
                        ');
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
        $this->db->from($this->tblname);        
        $this->db->join('tblassignments', 
                        'tblassignments.OpportunityID = tblopportunities.ID and tblassignments.Status = "Open"', 'left');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');

        if ($searchText != '')   {
            $words = explode("+", $searchText);
            foreach ($words as $word) {                
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word); 
                $this->db->or_like('tblCustomer.State', $word);  
                $this->db->or_like('tblCustomer.Country', $word);  
                $this->db->or_like('tblCustomer.City', $word);  
                $this->db->or_like('tblopportunities.Source', $word);  
                $this->db->or_like('tblopportunities.EqCategory', $word);  
                $this->db->or_like('tblopportunities.EqMake', $word);  
                $this->db->or_like('tblopportunities.EqModelCap', $word);  
                $this->db->or_like('tblopportunities.LastSalesRep', $word);  
                $this->db->or_like('tblopportunities.LeadType', $word);  
                $this->db->or_like('tblopportunities.Timeframe', $word);  
                $this->db->or_like('tblopportunities.ClosedBy', $word);
                $this->db->or_like('tblopportunities.Status', $word);
                $this->db->or_like('tblassignments.Tag', $word);
                $this->db->group_end();
            }            
        }        
        $this->db->where_in('tblopportunities.Status', $statusRange);
        if ($stage != 'All')
            $this->db->where('tblopportunities.Stage', $stage);
        if ($leadType != 'All')
            $this->db->where('tblopportunities.LeadType', $leadType);
        if ($salesRep != 'All')
            $this->db->where('tblopportunities.LastSalesRep', $salesRep);          
        if (!empty($minStartDate))
            $this->db->where('tblopportunities.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblopportunities.DateAdded <=', $maxStartDate.' 23:59:59');     
        if (!empty($contactDate)){
            if ($stage == 'All')
                $this->db->where('tblassignments.Stage !=', 'No Contact');
            $this->db->where('tblassignments.ToContactDate >=', $contactDate.' 00:00:00');
            $this->db->where('tblassignments.ToContactDate <=', $contactDate.' 23:59:59');
        }
        if ($searchHelp == 'YES')
            $this->db->where('tblassignments.SearchHelp', 'YES');

        $order_status = sprintf("FIELD(tblopportunities.Status, 'New', 'Pending', 'Assigned', 'Canceled', 'Closed')");
        $this->db->order_by($order_status); 
        $this->db->order_by('tblopportunities.DateAdded');        

        $result = $this->db->get()->result_array();

        $headerArray = array(
            'Status', 'Stage', 'StartDate', 'SalesRep', 'AssignDate', 'AddedBy',
            'CustomerName', 'LastName', 'CustomerPhone', 'CustomerEmail', 'CustomerSource',
            'CustomerCity', 'CustomerState', 'CustomerCountry', 'EqCategory', 'EqMake',
            'EqModelCap', 'EqMinYear', 'EqMaxPrice', 'Unit', 'TimeFrame', 'ClosingDate', 'ClosedBy',
            'LastSalesRep'
        ); 
        
        $indexArray = array(
            'Status', 'Stage', 'DateAdded', 'LastSalesRep', 'AssignDate', 'AddedBy',
            'Name', 'LastName', 'Phone', 'Email', 'Source',
            'City', 'State', 'Country', 'EqCategory', 'EqMake',
            'EqModelCap', 'MinYear', 'MaxPrice', 'Unit', 'TimeFrame', 'ClosingDate', 'ClosedBy',
            'LastSalesRep'
        ); 

        $returnArray = array();
        array_push($returnArray, $headerArray);

        foreach ($result as $row) {
            $record = array();

            foreach ($indexArray as $index) {
                array_push($record, $row[$index]);
            }

            array_push($returnArray, $record);
        }
        
        return $returnArray;

    }

    public function CancelAssignment($ID, $CanceledBy) {
        $this->db->where('ID', $ID);
        $this->db->set('Status', 'Pending');
        $this->db->set('ExpirationDate', '');
        $this->db->set('AssignDate', '');
        if ($CanceledBy == 'System')
            $this->db->set('BannedSalesRep', 'concat(BannedSalesRep,  LastSalesRep , \''.'$$$\')', false);
        $this->db->update($this->tblname);      
        
        return $this->db->affected_rows();
    }

    public function getAllCategory()
    {
        $query =  $this->db->query('SELECT DISTINCT EqCategory  FROM tblopportunities where EqCategory != ""');
        $result = $query->result_array();
        return  $result;
    }

    public function getBuyingOppsByCategory($category, $startDate, $endDate) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblopportunities WHERE EqCategory="' . $category . '" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '" AND LeadType = "Buying"');        
        $row = $query->row();
        return  $row->num;
    }

    public function getActiveBuyingOppsByCategory($category) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblopportunities WHERE EqCategory="' . $category . '" AND LeadType = "Buying" AND (Status="Assigned" or Status="New" or Status="Pending")');        
        $row = $query->row();
        return  $row->num;
    }

    public function getAllStatus() {
        $query =  $this->db->query('SELECT DISTINCT Status  FROM tblopportunities ');
        $result = $query->result_array();
        return  $result;
    }

    public function getOppsByStatusRange($status, $startDate, $endDate) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblopportunities WHERE Status="' . $status . '" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '"');        
        $row = $query->row();
        return  $row->num;
    }

    public function getOppsByStatus($status) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblopportunities WHERE Status="' . $status .'"');        
        $row = $query->row();
        return  $row->num;
    }

    public function getAllSalesRep() {
        $query =  $this->db->query('SELECT DISTINCT LastSalesRep FROM tblopportunities where LastSalesRep != ""');
        $result = $query->result_array();
        return  $result;
    }

    public function getAssignedOppByUser($user) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblopportunities WHERE LastSalesRep="' . $user . '" AND  Status="Assigned"');        
        $row = $query->row();
        return  $row->num;
    }

    public function getAllDirectUsers() {
        $query =  $this->db->query('SELECT DISTINCT Source FROM tblopportunities where Source like "MyOpp%" or Source like "CFU%"');
        $result = $query->result_array();
        return  $result;
    }

    public function getDirectOppsByUsers($source, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->from('tblopportunities');
        $this->db->where('Source', $source);
        $this->db->where('DateAdded >', $startDate . " 00:00:00");
        $this->db->where('DateAdded <', $endDate . " 23:59:59");
        return  $this->db->count_all_results();
    }

    public function getDirectOppsByUsersLike($source, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->from('tblopportunities');
        $this->db->like('Source', $source);
        $this->db->where('DateAdded >', $startDate . " 00:00:00");
        $this->db->where('DateAdded <', $endDate . " 23:59:59");
        return  $this->db->count_all_results();
    }

    public function getNoContactAssignments($salesRep) {
        $this->db->select('ID');
        $this->db->where('Status', 'Assigned');
        $this->db->where('Stage', 'No Contact');
        if ($salesRep != 'All')
            $this->db->where('LastSalesRep', $salesRep);
        $this->db->from($this->tblname);
        return $this->db->count_all_results();
    }

    public function getWatingContactAssignments($salesRep, $date) {
        // $this->db->select('ID');
        // $this->db->where('Status', 'Assigned');
        // $this->db->where_in('Stage', array('Contact', 'Proposal'));
        // if ($salesRep != 'All')
        //     $this->db->where('LastSalesRep', $salesRep);
        // $this->db->from($this->tblname);

        // $result = $this->db->get()->result_array();

        // $cnt = 0;
        // for ($i = 0; $i < count($result); $i++) {
        //     $this->db->select('ToContactDate');
        //     $this->db->where('OpportunityID', $result[$i]['ID']);
        //     $this->db->where('Status', 'Open');
        //     $this->db->from('tblassignments');
        //     $this->db->limit(1);
        //     $row = $this->db->get()->row_array();

        //     $ContactDate = $row['ToContactDate'];
        //     if ($ContactDate < $date)
        //         $cnt++;
        // }

        // return $cnt;
        $this->db->select('ID');
        $this->db->where('Status', 'Open');
        $this->db->where_in('Stage', array('Contact', 'Proposal'));
        if ($salesRep != 'All')
            $this->db->where('SalesRep', $salesRep);
        $this->db->where('ToContactDate <', $date);
        $this->db->where('ToContactDate !=', '0000-00-00 00:00:00');
        $this->db->from('tblassignments');
        return $this->db->count_all_results();
    }

    public function getNewOppCount() {
        $this->db->select('ID');        
        $this->db->where('Status', 'New');
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getPendingOppCount() {
        $this->db->select('ID');        
        $this->db->where('Status', 'Pending');
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getAssignedCount($salesRep) {
        $this->db->select('ID');        
        $this->db->where('Status', 'Assigned');
        if ($salesRep != 'All')
            $this->db->where('LastSalesRep', $salesRep);
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getClosedOppsToday($salesRep) {
        $today = date('Y-m-d');
        $this->db->select('ID');
        $this->db->where('Status', 'Closed');        
        $this->db->where('ClosingDate >=', $today.' 00:00:00');
        $this->db->where('ClosingDate <=', $today.' 23:59:59');
        if ($salesRep != 'All')
            $this->db->where('LastSalesRep', $salesRep);
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }
}