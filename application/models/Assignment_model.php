<?php
/*
@@ Assignment Model
@@ By Zheng
@@ 2020-02-26
*/
?>

<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Assignment_model extends CI_Model
{
    private $tblname = 'tblassignments';
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

    public function getAssignmentID($OppID) {
        $this->db->select('ID');
        $this->db->where('OpportunityID', $OppID);
        $this->db->limit(1);
        $this->db->order_by('AssignDate', 'desc');
        $this->db->from($this->tblname);
        $result = $this->db->get()->row_array();

        if ($result == null)
            return null;

        return $result['ID'];
    }

    public function cancelAssignment($OppID, $user) {
        
        $this->db->where('OpportunityID', $OppID);
        $this->db->where('Status', 'Open');

        $this->db->set('Status', 'Closed');
        $this->db->set('ExpirationDate', '');
        $this->db->set('CancelBy', $user);
        $this->db->set('ClosingDate', date('Y-m-d H:i:s'));
        $this->db->set('ToContactDate', '');
        $this->db->update($this->tblname);

        return $this->db->affected_rows();
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
        $mine,       
        $rate, 
        $minContactDate,
        $maxContactDate,
        $orderIndex,
        $sort,
        $start,
        $length
    ) {

        $field = "";   

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();

        $this->db->select('tblassignments.*');        
        $this->db->select(' tblopportunities.LeadType, 
                            tblopportunities.CustomerID,                                 
                            tblopportunities.EqCategory, 
                            tblopportunities.EqMake, 
                            tblopportunities.EqModelCap, 
                            tblopportunities.Source,
                            tblopportunities.MinYear, 
                            tblopportunities.MaxPrice,
                            tblopportunities.Unit,
                            tblopportunities.TimeFrame,
                            tblopportunities.Rate,
                            tblopportunities.AdditionalInfo as LeadAdditionalInfo
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
        $this->db->join('tblopportunities', 'tblassignments.OpportunityID = tblopportunities.ID');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');
        if ($searchText != '')   {
            $words = explode('+', $searchText);

            foreach ($words as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word); 
                $this->db->or_like('tblCustomer.CompanyName', $word);  
                $this->db->or_like('tblopportunities.EqCategory', $word);  
                $this->db->or_like('tblopportunities.EqMake', $word);  
                $this->db->or_like('tblopportunities.EqModelCap', $word);  
                $this->db->or_like('tblopportunities.Source', $word);  
                $this->db->or_like('tblopportunities.LeadType', $word);
                $this->db->or_like('tblassignments.SalesRep', $word);            
                $this->db->or_like('tblassignments.Tag', $word);
                $this->db->or_like('tblassignments.Stage', $word);
                $this->db->or_like('tblassignments.AssignedBy', $word);
                $this->db->group_end();    
            }            
        }        
        $this->db->where('tblassignments.Status', $status);
        if ($stage != 'All')
            $this->db->where('tblassignments.Stage', $stage);
        if ($leadType != 'All')
            $this->db->where('tblopportunities.LeadType', $leadType);
        if ($mine != 'All')
            $this->db->where('tblassignments.SalesRep', $mine);
        if ($rate != 'All')
            $this->db->where('tblopportunities.Rate', $rate);
        if (!empty($minContactDate)){
            if ($stage == 'All')
                $this->db->where('tblassignments.Stage !=', 'No Contact');
            $this->db->where('tblassignments.ToContactDate >=', $minContactDate);
        }
            
        if (!empty($maxContactDate)){
            if ($stage == 'All')
                $this->db->where('tblassignments.Stage !=', 'No Contact');
            $this->db->where('tblassignments.ToContactDate <=', $maxContactDate.' 23:59:59'); 
        }
            
                    
        //$this->db->order_by($field, $sort);
        if ($orderIndex == 2)
        {            
            $this->db->order_by('FIELD (tblassignments.Status, "Open", "Closed")');        
            $this->db->order_by("FIELD (tblassignments.Stage, 'No Contact', 'Contact', 'Proposal', 'Sold')");
            $this->db->order_by("tblassignments.AssignDate", $sort);
        }
        else
        {
            $this->db->order_by("FIELD (tblassignments.Stage, 'No Contact')");
            $this->db->order_by('tblassignments.ToContactDate', $sort);
        }
        
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
        $status,
        $stage,
        $leadType,
        $mine,
        $minContactDate,
        $maxContactDate
    ) {        

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();

        $this->db->select('tblassignments.*');
        $this->db->select(' tblopportunities.LeadType, 
                            tblopportunities.CustomerID,                            
                            tblopportunities.EqCategory, 
                            tblopportunities.EqMake, 
                            tblopportunities.EqModelCap, 
                            tblopportunities.Source,
                            tblopportunities.MinYear, 
                            tblopportunities.MaxPrice,
                            tblopportunities.Unit,
                            tblopportunities.TimeFrame,
                            tblopportunities.AdditionalInfo as LeadAdditionalInfo
                            ');
        $this->db->select(' tblCustomer.Name,
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
        $this->db->join('tblopportunities', 'tblassignments.OpportunityID = tblopportunities.ID');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');
        if ($searchText != '')   {
            $words = explode('+', $searchText);

            foreach ($words as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word); 
                $this->db->or_like('tblCustomer.CompanyName', $word);  
                $this->db->or_like('tblopportunities.EqCategory', $word);  
                $this->db->or_like('tblopportunities.EqMake', $word);  
                $this->db->or_like('tblopportunities.EqModelCap', $word);  
                $this->db->or_like('tblopportunities.Source', $word);  
                $this->db->or_like('tblopportunities.LeadType', $word);
                $this->db->or_like('tblassignments.SalesRep', $word);            
                $this->db->or_like('tblassignments.Tag', $word);
                $this->db->or_like('tblassignments.Stage', $word);
                $this->db->or_like('tblassignments.AssignedBy', $word);
                $this->db->group_end();    
            }            
        }        
        $this->db->where('tblassignments.Status', $status);
        if ($stage != 'All')
            $this->db->where('tblassignments.Stage', $stage);
        if ($leadType != 'All')
            $this->db->where('tblopportunities.LeadType', $leadType);
        if ($mine != 'All')
            $this->db->where('tblassignments.SalesRep', $mine);
        if (!empty($minContactDate)){
            if ($stage == 'All')
                $this->db->where('tblassignments.Stage !=', 'No Contact');
            $this->db->where('tblassignments.ToContactDate >=', $minContactDate);
        }
            
        if (!empty($maxContactDate)){
            if ($stage == 'All')
                $this->db->where('tblassignments.Stage !=', 'No Contact');
            $this->db->where('tblassignments.ToContactDate <=', $maxContactDate.' 23:59:59'); 
        }
            
                    
        //$this->db->order_by($field, $sort);       
        
        $result = $this->db->get()->result_array();
        
        $headerArray = array(
            'Status', 'Stage', 'AssignDate', 'Source', 'SalesRep', 'AssignedBy',
            'LeadType', 'Name', 'LastName', 'Phone', 'Email',
            'Company', 'EqCat', 'EqMake', 'EqModel', 'EqMinYear',
            'EqMaxPrice', 'Unit', 'TimeFrame'
        ); 
        
        $indexArray = array(
            'Status', 'Stage', 'AssignDate', 'Source', 'SalesRep', 'AssignedBy',
            'LeadType', 'Name', 'LastName', 'Phone', 'Email',
            'CompanyName', 'EqCategory', 'EqMake', 'EqModelCap', 'MinYear',
            'MaxPrice', 'Unit', 'TimeFrame'
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

    public function contact($ID, $ContactsLog, $ToContactDate, $ExpirationDate) {
        
        $this->db->where('ID', $ID);
        $this->db->set('Contacts', '(Contacts + 1)', false);
        $this->db->set('ToContactDate', $ToContactDate);
        $this->db->set('ContactsLog', 'concat(ContactsLog,  \''.$ContactsLog.'&&&\')', false);
        $this->db->set('ExpirationDate', $ExpirationDate);
        $this->db->update($this->tblname);

        $affected_rows =  $this->db->affected_rows();

        if ($affected_rows == 0)
            return null;

        $this->db->select('OpportunityID');
        $this->db->where('ID', $ID);
        $this->db->from($this->tblname);
        $row = $this->db->get()->row_array();

        if ($row == null)
            return null;
        return $row['OpportunityID'];
    }

    public function close($ID) {
        $this->db->where('ID', $ID);
        $this->db->set('ClosingDate', date('Y-m-d H:i:s'));        
        $this->db->set('Status', 'Closed');
        $this->db->set('ExpirationDate', "");
        $this->db->update($this->tblname);

        $affected_rows =  $this->db->affected_rows();

        if ($affected_rows == 0)
            return null;

        $this->db->select('OpportunityID');
        $this->db->where('ID', $ID);
        $this->db->from($this->tblname);
        $row = $this->db->get()->row_array();

        if ($row == null)
            return null;
        return $row['OpportunityID'];
    }

    public function updateContactLog($ID, $ContactsLog) {
        $this->db->where('ID', $ID);
        $this->db->set('Contacts', '(Contacts + 1)', false);
        $this->db->set('ContactsLog', 'concat(ContactsLog,  \''.$ContactsLog.'&&&\')', false);
        $this->db->update($this->tblname);

        return $this->db->affected_rows();
    }

    public function getContactLog($ID) {
        $this->db->select('ContactsLog');
        $this->db->where('ID', $ID);
        $this->db->from($this->tblname);
        $result = $this->db->get()->row_array();

        if ($result == null)
            return null;

        return $result['ContactsLog'];
    }

    public function getHistory($OppID) {
        $this->db->select('*');
        $this->db->where('OpportunityID', $OppID);
        $this->db->order_by('ID', 'desc');
        $this->db->from($this->tblname);
        return $this->db->get()->result_array();
    }

    public function getAllSalesRep() {
        $query =  $this->db->query('SELECT DISTINCT SalesRep FROM tblassignments');
        $result = $query->result_array();
        return  $result;
    }

    public function getAllStages() {
        $query =  $this->db->query('SELECT DISTINCT Stage FROM tblassignments');
        $result = $query->result_array();
        return  $result;
    }


    public function getAssignedOppByUser($salesRep, $startDate, $endDate) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblassignments WHERE SalesRep="' . $salesRep . '" AND  AssignDate >= "' . $startDate . " 00:00:00" . '" AND  AssignDate <= "' . $endDate . " 23:59:59" . '"');        
        $row = $query->row();
        return  $row->num;
    }

    public function getAssignedOpp($salesRep, $startDate, $endDate) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblassignments WHERE AssignedBy="' . $salesRep . '" AND SalesRep="' . $salesRep . '" AND AssignDate >= "' . $startDate . " 00:00:00" . '" AND  AssignDate <= "' . $endDate . " 23:59:59" . '"');        
        $row = $query->row();
        return  $row->num;
    }

    public function getAssignedOppByDateAdded_User($date, $user) {
        $query =  $this->db->query('SELECT COUNT(ID) as num FROM tblassignments WHERE AssignedBy="' . $user . '" AND SalesRep="' . $user . '" AND AssignDate like "'.$date.'%"');        
        $row = $query->row();
        return  $row->num;
    }

    public function getAssignmentByEqCategoryNameUserDate($EqCategory, $user, $startDate, $endDate){
        $this->db->select('A.ID');
        $this->db->from('tblassignments as A');
        $this->db->join('tblopportunities as O', 'A.OpportunityID = O.ID');
        $this->db->where('A.AssignDate >= ', $startDate . " 00:00:00");
        $this->db->where('A.AssignDate <= ', $endDate . " 23:59:59");
        $this->db->where('A.SalesRep', $user);
        $this->db->where('O.EqCategory', $EqCategory);
        $this->db->group_by('A.ID');

        return $this->db->count_all_results();
    }

    public function getAssignmentByStageNameUserDate($Stage, $user, $startDate, $endDate) {
        $this->db->select('A.ID');
        $this->db->from('tblassignments as A');
        $this->db->where('A.AssignDate >= ', $startDate . " 00:00:00");
        $this->db->where('A.AssignDate <= ', $endDate . " 23:59:59");
        $this->db->where('A.SalesRep', $user);
        $this->db->where('A.Stage', $Stage);
        $this->db->group_by('A.ID');

        return $this->db->count_all_results();
    }

    public function getSystemCanceledAssignments($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->from($this->tblname);
        $this->db->where('AssignDate >= ', $startDate . " 00:00:00");
        $this->db->where('AssignDate <= ', $endDate . " 23:59:59");
        $this->db->where('SalesRep', $user);
        $this->db->where('CancelBy', 'System');
        return $this->db->count_all_results();
    }

    public function getAssignmentByStatusUserDate($status, $user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->from($this->tblname);
        $this->db->where('AssignDate >= ', $startDate . " 00:00:00");
        $this->db->where('AssignDate <= ', $endDate . " 23:59:59");
        $this->db->where('SalesRep', $user);
        $this->db->where('Status', $status);
        return $this->db->count_all_results();
    }

    public function getContacedAssignByDate($dateVal, $user) {
        $this->db->select('ID');
        $this->db->from($this->tblname);
        $this->db->where('SalesRep', $user);
        $this->db->like('ContactsLog', '"Date":"'.$dateVal);
        return $this->db->count_all_results();
    }

    public function getSearchHelpCount() {
        $this->db->select('ID');
        $this->db->where('Status', 'Open');
        $this->db->where('SearchHelp', 'YES');
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getContactChannelCount($ID) {
        $this->db->select('ContactChannelCount');
        $this->db->where('ID', $ID);
        $this->db->from($this->tblname);
        $result = $this->db->get()->row_array();

        // if ($result == null)
        //     return null;

        return $result['ContactChannelCount'];
    }

    public function setContactChannelCount($ID, $ContactChannelCount) {
        $this->db->set('ContactChannelCount', $ContactChannelCount);
        $this->db->where('ID', $ID);
        $this->db->update($this->tblname);
    }

    public function getTag($ID) {
        $this->db->select('Tag');
        $this->db->where('ID', $ID);
        $this->db->from($this->tblname);
        $result = $this->db->get()->row_array();

        if ($result == null)
            return '';

        return $result['Tag'];
    }

    public function addTag($ID, $Text, $Color) {
        $this->db->set('Tag', 'concat(Tag,  \'&'.$Text.';'.$Color.'\')', false);
        $this->db->where('ID', $ID);
        $this->db->update($this->tblname);
    }

    public function removeTag($ID, $Num) {
        $tagText = $this->getTag($ID);
        $newTagText = '';

        $tags = explode('&', $tagText);
        $index = 0;

        foreach($tags as $tag) {
            if ($index == 0 || $index == $Num) {
                $index++;
                continue;
            }

            $index++;
            $newTagText = $newTagText . '&' . $tag;
        }

        $this->db->set('Tag', $newTagText);
        $this->db->where('ID', $ID);
        $this->db->update($this->tblname);

        return $newTagText;
    }

    public function getUpdateOpssCountToday($salesRep) {
        $dateVal = date('Y-m-d');   
        $this->db->select('ID');
        if ($salesRep != 'All')
            $this->db->where('SalesRep', $salesRep);
        $this->db->from($this->tblname);        
        $this->db->like('ContactsLog', '"Date":"'.$dateVal);
        return $this->db->count_all_results();
    }

    public function getNoContactOppCount($salesRep) {
        $this->db->select('ID');
        $this->db->where('Status', 'Open');
        $this->db->where('Stage', 'No Contact');
        $this->db->where('SalesRep', $salesRep);
        $this->db->from($this->tblname);
        return $this->db->count_all_results();
    }

    public function getContactOppCount($salesRep) {
        $this->db->select('ID');
        $this->db->where('Status', 'Open');
        $this->db->where('Stage', 'Contact');   
        $this->db->where('SalesRep', $salesRep);
        $this->db->from($this->tblname);
        return $this->db->count_all_results();
    }

    public function getProposalOppCount($salesRep) {
        $this->db->select('ID');
        $this->db->where('Status', 'Open');
        $this->db->where('Stage', 'Proposal');
        $this->db->where('SalesRep', $salesRep);
        $this->db->from($this->tblname);
        return $this->db->count_all_results();
    }    
}