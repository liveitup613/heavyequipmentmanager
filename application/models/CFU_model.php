<?php
/*
@@ Opportunity Model
@@ By Zheng
@@ 2020-03-10
*/
?>

<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class CFU_model extends CI_Model
{
    private $tblname = 'tblcfu';

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

    public function getAllData(
        $minAucYear,
        $maxAucYear,
        $status,
        $shouldVerify,
        $verified,
        $searchText,
        $orderIndex,
        $sort,
        $start,
        $length
    )
    {
        $statusArray = array('New', 'Pending');

        if ($status == 'Closed')
            $statusArray = array('Scheduled', 'Opportunity', 'Closed');

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();

        $this->db->select('tblcfu.*');
        $this->db->select(' tblopportunities.LeadType, 
                            tblopportunities.CustomerID,
                            tblopportunities.Stage,      
                            tblopportunities.DateAdded,      
                            tblopportunities.LastSalesRep,      
                            tblopportunities.ClosingDate as OppClosingDate,           
                            tblopportunities.Source,                    
                            tblopportunities.EqCategory, 
                            tblopportunities.EqMake, 
                            tblopportunities.EqModelCap, 
                            tblopportunities.MinYear, 
                            tblopportunities.MaxPrice,
                            tblopportunities.Unit,
                            tblopportunities.NegativeInterestLevel,
                            tblopportunities.TimeFrame, 
                            tblopportunities.Rate,
                            ');           
        $this->db->select('tblCustomer.Name,
                            tblCustomer.LastName,
                            tblCustomer.Phone,
                            tblCustomer.Email,
                            tblCustomer.CompanyName,
                            tblCustomer.Country,
                            tblCustomer.State,
                            tblCustomer.City
                        ');  
        $this->db->from($this->tblname); 
        $this->db->join('tblopportunities', 'tblcfu.OpportunityID = tblopportunities.ID');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');
        if ($searchText != '')   {
            $words = explode('+', $searchText);
            foreach ($words as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);            
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word); 
                $this->db->or_like('tblCustomer.City', $word);  
                $this->db->or_like('tblCustomer.State', $word);  
                $this->db->or_like('tblCustomer.Country', $word);  
                $this->db->or_like('tblopportunities.EqCategory', $word);  
                $this->db->or_like('tblopportunities.EqMake', $word);                  
                $this->db->or_like('tblopportunities.TimeFrame', $word);  
                $this->db->or_like('tblopportunities.LeadType', $word);  
                $this->db->group_end();
            }            
        }    

        $this->db->where_in('tblcfu.Status', $statusArray);
        if (!empty($minAucYear))
            $this->db->where('tblopportunities.ClosingDate >=', $minAucYear);
        if (!empty($maxAucYear))
            $this->db->where('tblopportunities.ClosingDate <=', $maxAucYear);
        if ($shouldVerify == 'true')
            $this->db->where('tblcfu.ShouldVerify', 'true');
        if ($verified == 'YES')
            $this->db->where('tblcfu.VerifySup !=', '');
        else if ($verified == 'NO')
            $this->db->where('tblcfu.VerifySup', '');
        //$this->db->order_by($field, $sort);        
        if ($status == 'Open') {
            $this->db->order_by('OppClosingDate', 'asc');
        }
        else {
            $this->db->order_by('FIELD (tblcfu.Status, "Scheduled", "Opportunity", "Closed")');
            $this->db->order_by('tblcfu.ToContactDate');
            $this->db->order_by('tblcfu.SurveyDate');
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
        $minAucYear,
        $maxAucYear,
        $status,
        $shouldVerify,
        $verified,
        $searchText
    )
    {
        $statusArray = array('New', 'Pending');

        if ($status == 'Closed')
            $statusArray = array('Scheduled', 'Opportunity', 'Closed');

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();

        $this->db->select('tblcfu.*');
        $this->db->select(' tblopportunities.LeadType, 
                            tblopportunities.CustomerID,
                            tblopportunities.Stage,      
                            tblopportunities.DateAdded,      
                            tblopportunities.LastSalesRep,      
                            tblopportunities.ClosingDate as OppClosingDate,      
                            tblopportunities.Source,  
                            tblopportunities.EqCategory, 
                            tblopportunities.EqMake, 
                            tblopportunities.EqModelCap, 
                            tblopportunities.MinYear, 
                            tblopportunities.MaxPrice,
                            tblopportunities.Unit,
                            tblopportunities.NegativeInterestLevel,
                            tblopportunities.TimeFrame,
                            tblopportunities.Rate
                            ');      
        $this->db->select(' tblCustomer.Name,
                            tblCustomer.LastName,
                            tblCustomer.Phone,
                            tblCustomer.Email,
                            tblCustomer.CompanyName,
                            tblCustomer.Country,
                            tblCustomer.State,
                            tblCustomer.City
                            ');         
        $this->db->from($this->tblname); 
        $this->db->join('tblopportunities', 'tblcfu.OpportunityID = tblopportunities.ID');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');

        if ($searchText != '')   {
            $words = explode('+', $searchText);
            foreach ($words as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);            
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word);                 
                $this->db->or_like('tblCustomer.City', $word);  
                $this->db->or_like('tblCustomer.State', $word);  
                $this->db->or_like('tblCustomer.Country', $word);  
                $this->db->or_like('tblopportunities.EqCategory', $word);  
                $this->db->or_like('tblopportunities.EqMake', $word);  
                $this->db->or_like('tblopportunities.TimeFrame', $word);  
                $this->db->or_like('tblopportunities.LeadType', $word);  
                $this->db->group_end();
            }            
        }    

        $this->db->where_in('tblcfu.Status', $statusArray);
        if (!empty($minAucYear))
            $this->db->where('tblopportunities.ClosingDate >=', $minAucYear);
        if (!empty($maxAucYear))
            $this->db->where('tblopportunities.ClosingDate <=', $maxAucYear);
        if ($shouldVerify == 'true')
            $this->db->where('tblcfu.ShouldVerify', 'true');
        if ($verified == 'YES')
            $this->db->where('tblcfu.VerifySup !=', '');
        else if ($verified == 'NO')
            $this->db->where('tblcfu.VerifySup', '');
        //$this->db->order_by($field, $sort);        
        if ($status == 'Open') {
            $this->db->order_by('OppClosingDate', 'asc');
        }
        else {
            $this->db->order_by('FIELD (tblcfu.Status, "Scheduled", "Opportunity", "Closed")');
            $this->db->order_by('tblcfu.ToContactDate');
            $this->db->order_by('tblcfu.SurveyDate');
        }
        
        $result = $this->db->get()->result_array();

        $headerArray = array(
            'LeadType', 'Status', 'SalesRep', 'Name', 'LastName', 'Phone',
            'Email', 'Source', 'City', 'State', 'Country',
            'EqCat', 'EqMake', 'EqModel', 'EqMinYear', 'EqMaxPrice',
            'Stage', 'StartDate', 'EndDate', 'SurveySalesRep', 'SurveyOffer', 'SurveyDate', 'SurveySup',
            'VerifySalesRep', 'VerifyOffer', 'VerifyDate', 'VerifySup'
        ); 
        
        $indexArray = array(
            'LeadType', 'Status', 'LastSalesRep', 'Name', 'LastName', 'Phone',
            'Email', 'Source', 'City', 'State', 'Country',
            'EqCategory', 'EqMake', 'EqModelCap', 'MinYear', 'MaxPrice',
            'Stage', 'DateAdded', 'OppClosingDate', 'SurveySalesRep', 'SurveyOffer', 'SurveyDate', 'SurveySup',
            'VerifySales', 'VerifyOffers', 'VerifyDate', 'VerifySup'
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

    public function attemptContact($id, $username, $Status) {
        $now = date('Y-m-d H:i:s');

        $this->db->where('ID', $id);
        $this->db->set('AttContact', '(AttContact + 1)', false);
        $this->db->set('LastAttContact', $now);
        $this->db->set('Status', $Status);
        $this->db->set('AttContactDates', 'concat(AttContactDates,  "'.$now.'&'.$username.';")', false);
        $this->db->update($this->tblname);

        return $this->db->affected_rows();
    }

    public function updateContactLog($ID, $log) {
        $this->db->where('ID', $ID);
        $this->db->set('Contacts', 'Contacts + 1', false);
        $this->db->set('ContactsLog', 'concat(ContactsLog, \''.$log.'\', "&&&")', false);
        $this->db->update($this->tblname);

        return $this->db->affected_rows();
    }

    public function getSurveySalesRepCountByUser($SurveySalesRep, $user, $startDate, $endDate) {
        $this->db->select('C.ID');
        $this->db->from('tblcfu as C');
        $this->db->join('tblopportunities as O', 'C.OpportunityID = O.ID');
        $this->db->where('C.SurveySalesRep', $SurveySalesRep);
        $this->db->where('O.LastSalesRep', $user);
        $this->db->where('C.SurveyDate >= ', $startDate . " 00:00:00");
        $this->db->where('C.SurveyDate <= ', $endDate . " 23:59:59");        
        $this->db->group_by('C.ID');

        return $this->db->count_all_results();
    }

    public function getAllSurveySalesRepCount($SurveySalesRep, $startDate, $endDate) {
        $this->db->select('C.ID');
        $this->db->from('tblcfu as C');        
        $this->db->where('C.SurveySalesRep', $SurveySalesRep);
        $this->db->where('C.SurveyDate >= ', $startDate . " 00:00:00");
        $this->db->where('C.SurveyDate <= ', $endDate . " 23:59:59");        
        $this->db->group_by('C.ID');

        return $this->db->count_all_results();
    }

    public function getSurveyOfferCountByUser($SurveyOffer, $user, $startDate, $endDate) {
        $this->db->select('C.ID');
        $this->db->from('tblcfu as C');
        $this->db->join('tblopportunities as O', 'C.OpportunityID = O.ID');
        $this->db->where('C.SurveyOffer', $SurveyOffer);
        $this->db->where('O.LastSalesRep', $user);
        $this->db->where('C.SurveyDate >= ', $startDate . " 00:00:00");
        $this->db->where('C.SurveyDate <= ', $endDate . " 23:59:59");        
        $this->db->group_by('C.ID');

        return $this->db->count_all_results();
    }

    public function getAllSurveyOfferCount($SurveyOffer, $startDate, $endDate) {
        $this->db->select('C.ID');
        $this->db->from('tblcfu as C');
        $this->db->where('C.SurveyOffer', $SurveyOffer);
        $this->db->where('C.SurveyDate >= ', $startDate . " 00:00:00");
        $this->db->where('C.SurveyDate <= ', $endDate . " 23:59:59");        
        $this->db->group_by('C.ID');

        return $this->db->count_all_results();
    }
    
    public function getAllSurveyCountByUser($user, $startDate, $endDate) {
        $this->db->select('C.ID');
        $this->db->from('tblcfu as C');
        $this->db->join('tblopportunities as O', 'C.OpportunityID = O.ID');        
        $this->db->where('O.LastSalesRep', $user);
        $this->db->where('C.SurveyDate >= ', $startDate . " 00:00:00");
        $this->db->where('C.SurveyDate <= ', $endDate . " 23:59:59");        
        $this->db->group_by('C.ID');

        return $this->db->count_all_results();
    }

    public function getAllSurveyCount($startDate, $endDate) {
        $this->db->select('C.ID');
        $this->db->from('tblcfu as C');          
        $this->db->where('C.SurveyDate >= ', $startDate . " 00:00:00");
        $this->db->where('C.SurveyDate <= ', $endDate . " 23:59:59");        

        return $this->db->count_all_results();
    }

    public function getCFUBecameOppByUser($user, $startDate, $endDate) {
        $this->db->select('C.ID');
        $this->db->from('tblcfu as C');
        $this->db->join('tblopportunities as O', 'C.OpportunityID = O.ID');        
        $this->db->where('O.LastSalesRep', $user);
        $this->db->where('C.SurveyDate >= ', $startDate . " 00:00:00");
        $this->db->where('C.SurveyDate <= ', $endDate . " 23:59:59");  
        $this->db->like('C.Status', 'Opportunity');
        $this->db->group_by('C.ID');

        return $this->db->count_all_results();
    }

    public function getAllCFUBecameOpp($startDate, $endDate) {
        $this->db->select('C.ID');
        $this->db->from('tblcfu as C');    
        $this->db->where('C.SurveyDate >= ', $startDate . " 00:00:00");
        $this->db->where('C.SurveyDate <= ', $endDate . " 23:59:59");  
        $this->db->like('C.Status', 'Opportunity');
        $this->db->group_by('C.ID');

        return $this->db->count_all_results();
    }

    public function getScheduledBeforeTodayCount() {
        $this->db->select('ID');
        $this->db->where('ToContactDate <', date('Y-m-d H:i:s'));
        $this->db->where('Status', 'Scheduled');
        $this->db->from($this->tblname);
        return $this->db->count_all_results();
    }

    public function getCFUCountByStatus($status) {
        $this->db->select('ID');
        $this->db->where('Status', $status);
        $this->db->from($this->tblname);
        return $this->db->count_all_results();
    }

    public function getScheduledBeforeYesterdayCount() {
        $this->db->select('ID');
        $this->db->where('ToContactDate <', date('Y-m-d H:i:s', time() - 24 * 60 * 60));
        $this->db->where('Status', 'Scheduled');
        $this->db->from($this->tblname);
        return $this->db->count_all_results();
    }
}
