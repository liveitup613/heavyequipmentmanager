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

class Procurement_model extends CI_Model
{
    private $tblname = 'tblprocurement';

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

    public function getRow($criteria) {
        $this->db->select('*');
        $this->db->from($this->tblname);
        $this->db->where($criteria);
        $this->db->limit(1);

        return $this->db->get()->row_array();
    }

    public function getAllData(
        $searchText,
        $minStartDate,
        $maxStartDate,
        $minPrice,
        $maxPrice,
        $minRemaining,
        $maxRemaining,
        $status,
        $orderIndex,
        $sort,
        $start,
        $length
    ) {
        $field = "";   

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();
        $statuses = array('New', 'In Progress');
        if ($status == 'Closed')
            $statuses = array('Paid', 'Canceled');

        $this->db->select('tblprocurement.*');
        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');                
        $this->db->select(' tblDeals.EqCategory,
                            tblDeals.PrimaryImage,
                            tblDeals.DealID as MHCode,
                            tblDeals.DealType,
                            tblDeals.EqYear,
                            tblDeals.EqMake,
                            tblDeals.EqModel,
                            tblDeals.TruckYear,
                            tblDeals.TruckMake,
                            tblDeals.Length,
                            tblDeals.Country,
                            tblDeals.State,
                            tblDeals.City,
                            tblDeals.Type,
                            tblDeals.Capacity,
                            tblDeals.TruckModel,
                            tblDeals.EqSN,
                            tblDeals.EndDate');                   
        $this->db->select('tbluser.USERNAME');
        $this->db->select('tblSales.SalesCode');
        $this->db->from($this->tblname);         
        $this->db->join('tblDeals', 'tblprocurement.DealID = tblDeals.ID', 'left');
        $this->db->join('tbldeposits', 'tblprocurement.ID = tbldeposits.ProcurementID', 'left');
        $this->db->join('tbluser', 'tblDeals.UserID = tbluser.ID', 'left');
        $this->db->join('tblSales', 'tblSales.DealID = tblDeals.ID', 'left');
        if ($searchText != '')   {
            $words = explode('+', $searchText);
            foreach ($words as $word) {
                $this->db->group_start();                
                $this->db->like('tblDeals.EqYear', $word);            
                $this->db->or_like('tblDeals.EqMake', $word);
                $this->db->or_like('tblDeals.DealID', $word); 
                $this->db->or_like('tblDeals.DealType', $word); 
                $this->db->or_like('tblDeals.EqCategory', $word); 
                $this->db->or_like('tblDeals.EqModel', $word);  
                $this->db->or_like('tblDeals.TruckYear', $word);  
                $this->db->or_like('tblDeals.TruckMake', $word);     
                $this->db->or_like('tblDeals.Length', $word);     
                $this->db->or_like('tblDeals.Type', $word);     
                $this->db->or_like('tblDeals.Capacity', $word);     
                $this->db->or_like('tblDeals.TruckModel', $word);     
                $this->db->or_like('tblDeals.EqSN', $word);     
                $this->db->or_like('tblDeals.EndDate', $word);     
                $this->db->or_like('tblSales.SalesCode', $word);     
                $this->db->or_like('tbluser.USERNAME', $word);
                $this->db->group_end();
            }            
        }        

        $this->db->where_in('tblprocurement.Status', $statuses);

        if (!empty($minStartDate))
            $this->db->where('tblprocurement.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblprocurement.DateAdded <=', $maxStartDate.' 23:59:59');
        if (is_numeric($minPrice))
            $this->db->where("tblprocurement.BuyingPrice >=", $minPrice);
        if (is_numeric($maxPrice))
            $this->db->where('tblprocurement.BuyingPrice <=', $maxPrice);
                    
        //$this->db->order_by($field, $sort);
        $this->db->group_by('tblprocurement.ID');
        $this->db->order_by("tblprocurement.DateAdded", 'asc');      
        $result_array = $this->db->get()->result_array();

        $result = array();
        foreach ($result_array as $row) {
            if (is_numeric($minRemaining) && (($row['BuyingPrice'] - $row['TotalDeposit']) < $minRemaining))
                continue;
            if (is_numeric($maxRemaining) && (($row['BuyingPrice'] - $row['TotalDeposit']) > $maxRemaining))
                continue;

            array_push($result, $row);
        }

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
        $minStartDate,
        $maxStartDate,
        $minPrice,
        $maxPrice,
        $minRemaining,
        $maxRemaining,
        $status,
        $searchText
    ) {
        $field = "";   

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();
        $statuses = array('New', 'In Progress');
        if ($status == 'Closed')
            $statuses = array('Paid', 'Canceled');

        $this->db->select('tblprocurement.*');
        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');                
        $this->db->select(' tblDeals.EqCategory,
                            tblDeals.PrimaryImage,
                            tblDeals.DealID as MHCode,
                            tblDeals.DealType,
                            tblDeals.EqYear,
                            tblDeals.EqMake,
                            tblDeals.EqModel,
                            tblDeals.TruckYear,
                            tblDeals.TruckMake,
                            tblDeals.Length,
                            tblDeals.Country,
                            tblDeals.State,
                            tblDeals.City,
                            tblDeals.Type,
                            tblDeals.Capacity,
                            tblDeals.TruckModel,
                            tblDeals.EqSN,
                            tblDeals.EndDate,
                            tblDeals.StartDate');       
        $this->db->select('tbluser.USERNAME');
        $this->db->select('tblSales.SalesCode');
        $this->db->from($this->tblname);         
        $this->db->join('tblDeals', 'tblprocurement.DealID = tblDeals.ID', 'left');
        $this->db->join('tbldeposits', 'tblprocurement.ID = tbldeposits.ProcurementID', 'left');
        $this->db->join('tbluser', 'tblprocurement.AddedBy = tbluser.ID', 'left');
        $this->db->join('tblSales', 'tblSales.DealID = tblDeals.ID', 'left');
        if ($searchText != '')   {
            $words = explode('+', $searchText);
            foreach ($words as $word) {
                $this->db->group_start();                
                $this->db->like('tblDeals.EqYear', $word);            
                $this->db->or_like('tblDeals.EqMake', $word); 
                $this->db->or_like('tblDeals.EqModel', $word);  
                $this->db->or_like('tblDeals.TruckYear', $word);  
                $this->db->or_like('tblDeals.TruckMake', $word);     
                $this->db->or_like('tblDeals.Length', $word);     
                $this->db->or_like('tblDeals.Type', $word);     
                $this->db->or_like('tblDeals.Capacity', $word);     
                $this->db->or_like('tblDeals.TruckModel', $word);     
                $this->db->or_like('tblDeals.EqSN', $word);     
                $this->db->or_like('tblDeals.EndDate', $word);
                $this->db->or_like('tblSales.SalesCode', $word);
                $this->db->or_like('tbluser.USERNAME', $word);
                $this->db->group_end();
            }            
        }        

        $this->db->where_in('tblprocurement.Status', $statuses);

        if (!empty($minStartDate))
            $this->db->where('tblprocurement.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblprocurement.DateAdded <=', $maxStartDate.' 23:59:59');
        if (is_numeric($minPrice))
            $this->db->where("tblprocurement.BuyingPrice >=", $minPrice);
        if (is_numeric($maxPrice))
            $this->db->where('tblprocurement.BuyingPrice <=', $maxPrice);
                    
        //$this->db->order_by($field, $sort);
        $this->db->group_by('tblprocurement.ID');
        $this->db->order_by("tblprocurement.DateAdded", 'asc');      
        $result_array = $this->db->get()->result_array();

        $result = array();
        foreach ($result_array as $row) {
            if (is_numeric($minRemaining) && (($row['BuyingPrice'] - $row['TotalDeposit']) < $minRemaining))
                continue;
            if (is_numeric($maxRemaining) && (($row['BuyingPrice'] - $row['TotalDeposit']) > $maxRemaining))
                continue;

            array_push($result, $row);
        }

        $headerArray = array(
            'Status', 'Date Added', 'Equipment Category', 'EqMake', 'EqModel', 'City',
            'State', 'Country', 'Deal Type', 'Start Date', 'End Date',
            'Serial Number', 'MH Code', 'Added User', 'Original Price',
            'Buying Price', 'Buyer', 'Total Deposit', 'Remaining Deposits'
        ); 
        
        $indexArray = array(
            'Status', 'DateAdded', 'EqCategory', 'EqMake', 'EqModel', 'City',
            'State', 'Country', 'DealType', 'StartDate', 'EndDate',
            'EqSN', 'MHCode', 'USERNAME', 'OriginalPrice',
            'BuyingPrice', 'Buyer', 'TotalDeposit', 'BuyingPrice'
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

    public function checkDepositLimit($ID, $RealAmount) {
        $this->db->select('tblprocurement.BuyingPrice');
        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');
        $this->db->from($this->tblname);
        $this->db->join('tbldeposits', 'tblprocurement.ID = tbldeposits.ProcurementID', 'left');
        $this->db->where('tblprocurement.ID', $ID);        
        $this->db->group_by('tblprocurement.ID');

        $result = $this->db->get()->row_array();

        if ($result == null)   
            return false;
        
        $Total = $result['BuyingPrice'];
        $TotalDeposit = $result['TotalDeposit'];

        if ($Total == 0)
            return false;

        if ($RealAmount < 0) {
            if ($TotalDeposit < abs($RealAmount))
                return false;
        }
        else {
            if ($Total != 0 && (($TotalDeposit + $RealAmount) > $Total))
                return false;
        }

        return true;
    }

    public function getTotalDeposit($ID) {

        $this->db->select('COALESCE(SUM(RealAmount), 0) as TotalDeposit');
        $this->db->where('ProcurementID', $ID);
        $this->db->from('tbldeposits');
        $res = $this->db->get()->row_array();

        if ($res == null)   
            return null;
        
        $totalDeposit =  $res['TotalDeposit'];
        return $totalDeposit;
    }

    public function getActiveBuyInPeriod($start, $end) {
        $this->db->select('ID');
        $this->db->where('DateAdded >=', $start.' 00:00:00');
        $this->db->where('DateAdded <=', $end.' 23:59:59');
        $this->db->where_in('Status', array('New', 'In Progress'));
        $this->db->from('tblprocurement');
        return $this->db->count_all_results();
    }

    public function getRemainingAmount($currency) {
        $this->db->select('tblprocurement.BuyingPrice');
        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');
        $this->db->from($this->tblname);
        $this->db->join('tbldeposits', 'tblprocurement.ID = tbldeposits.ProcurementID', 'left');                
        $this->db->where('tblprocurement.Currency', $currency);
        $this->db->where('tblprocurement.Status !=', 'Canceled');
        $this->db->group_by('tblprocurement.ID');

        $result = $this->db->get()->result_array();

        $remaining = 0;
        foreach ($result as $row) {
            $remaining += ($row['BuyingPrice'] - $row['TotalDeposit']);
        }

        return $remaining;
    }
}