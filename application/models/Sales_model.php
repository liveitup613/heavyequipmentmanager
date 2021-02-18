<?php
/*
@@ Opportunity Model
@@ By Zheng
@@ 2020-04-03
*/
?>

<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Sales_model extends CI_Model
{
    private $tblname = 'tblSales';
    private $statuses = array('', 'New', 'In Progress', 'Closed');
    private $dealStatuses = array('', 'Pending', 'Shipping', 'Customs', 'Shop', 'Ready', 'Closed');

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

    public function addNewSale($AssignId, $OppID, $user) {
        $data = array(
            'OppID' => $OppID,
            'AssignmentID' => $AssignId,
            'SalesRep' => $user,
            'DateAdded' => date('Y-m-d H:i:s'),
            'SalesStatus' => 'New'
        );

        $ID = $this->insert($data);        

        $this->db->set('SalesCode', 'concat("MHV", LPAD(ID, 6, "0"))', false);
        $this->db->where('ID', $ID);
        $this->db->update($this->tblname);

        return $ID;
    }

    public function updateStatus($ID, $Status) {
        $this->db->select('SalesStatus');
        $this->db->where('ID', $ID);
        $this->db->from($this->tblname);
        $result = $this->db->get()->row_array();

        if ($result == null)
            return null;

        $currentStatus = $result['SalesStatus'];

        $currentIndex = array_search($currentStatus, $this->statuses);
        $newIndex = array_search($Status, $this->statuses);

        if ($currentIndex < $newIndex) {
            $this->db->where('ID', $ID);
            $this->db->set('SalesStatus', $Status);
            $this->db->update($this->tblname);
        }

        return $ID;
    }

    public function updateDealStatus($ID, $Status) {
        // $this->db->select('DealStatus');
        // $this->db->where('ID', $ID);
        // $this->db->from($this->tblname);
        // $result = $this->db->get()->row_array();

        // if ($result == null)
        //     return null;

        // $currentStatus = $result['DealStatus'];

        // $currentIndex = array_search($currentStatus, $this->dealStatuses);
        // $newIndex = array_search($Status, $this->dealStatuses);

        // if ($currentIndex < $newIndex) {
        $this->db->where('ID', $ID);
        $this->db->set('DealStatus', $Status);
        $this->db->update($this->tblname);
        $this->setLastUpdateDate($ID);
        // }

        return $ID;
    }

    public function updateLog($ID, $Log) {
        $this->db->where('ID', $ID);
        $this->db->set('SalesLog', 'concat(SalesLog,  \''.$Log.'&&&\')', false);
        $this->db->update($this->tblname);

        return $this->db->affected_rows();
    }

    public function checkDepositLimit($ID, $RealAmount) {
        $this->db->select('tblSales.Total');
        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');
        $this->db->from($this->tblname);
        $this->db->join('tbldeposits', 'tblSales.ID = tbldeposits.SaleID', 'left');
        $this->db->where('tblSales.ID', $ID);        
        $this->db->group_by('tblSales.ID');
        $this->db->order_by("tblSales.DateAdded", 'asc');        

        $result = $this->db->get()->row_array();

        if ($result == null)   
            return false;
        
        $Total = $result['Total'];
        $TotalDeposit = $result['TotalDeposit'];

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

    public function setLastUpdateDate($ID) {
        $this->db->set('LastUpdateDate', date('Y-m-d H:i:s'));
        $this->db->where('ID', $ID);
        $this->db->update($this->tblname);

        return $this->db->affected_rows();
    }

    public function setCloseDate($ID) {
        $this->db->set('CloseDate', date('Y-m-d H:i:s'));
        $this->db->where('ID', $ID);
        $this->db->update($this->tblname);

        return $this->db->affected_rows();
    }

    public function getAllSalesRep() {
        $this->db->select('SalesRep');
        $this->db->from($this->tblname);
        $this->db->group_by('SalesRep');
        $result = $this->db->get()->result_array();

        return $result;
    }

    public function getAllDealStatuses() {
        $this->db->select('DealStatus');
        $this->db->from($this->tblname);
        $this->db->group_by('DealStatus');
        $result = $this->db->get()->result_array();

        return $result;
    }

    public function getSalesCountByDealStatus($dealStatus, $interval, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->from($this->tblname);
        $this->db->where('DealStatus', $dealStatus);
        if ($interval != 0) 
            $this->db->where('SalesStatus !=', 'Closed');
        if ($interval != 1) {
            $this->db->where('DateAdded >=', $startDate . " 00:00:00");
            $this->db->where('DateAdded <=', $endDate . " 23:59:59");
        }
        $this->db->where('SalesStatus !=', 'Canceled');
        return $this->db->count_all_results();
    }

    public function getAllDealTypes() {
        $this->db->select('DealType');
        $this->db->from($this->tblname);
        $this->db->group_by('DealType');
        $result = $this->db->get()->result_array();

        return $result;
    }

    public function getSalesCountByDealType($dealType, $interval, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->from($this->tblname);
        $this->db->where('DealType', $dealType);
        if ($interval != 0) 
            $this->db->where('SalesStatus !=', 'Closed');
        if ($interval != 1) {
            $this->db->where('DateAdded >=', $startDate . " 00:00:00");
            $this->db->where('DateAdded <=', $endDate . " 23:59:59");
        }
        $this->db->where('SalesStatus !=', 'Canceled');
        return $this->db->count_all_results();
    }

    public function getStaticsData($salesRep, $interval, $startDate, $endDate) {
        $this->db->select('tblSales.Total, tblSales.SalesCurrency');
        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');
        $this->db->from($this->tblname);
        $this->db->join('tbldeposits', 'tblSales.ID = tbldeposits.SaleID', 'left');
        $this->db->where('tblSales.SalesRep', $salesRep);
        if ($interval != 0) 
            $this->db->where('tblSales.SalesStatus !=', 'Closed');
        if ($interval != 1) {            
            $this->db->where('DateAdded >=', $startDate . " 00:00:00");
            $this->db->where('DateAdded <=', $endDate . " 23:59:59");
        }
        $this->db->where('tblSales.SalesStatus !=', 'Canceled');
        $this->db->group_by('tblSales.ID');
        $this->db->order_by("tblSales.DateAdded", 'asc');        

        $result = $this->db->get()->result_array();

        return $result;
    }

    public function getAllData(
        $user,
        $searchText,            
        $status,       
        $dealStatus,        
        $dealType,
        $minStartDate,
        $maxStartDate,   
        $minPrice,
        $maxPrice,
        $minRemaining,
        $maxRemaining,  
        $orderIndex,
        $sort,
        $start,
        $length
    ) {
        $field = "";   

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();
        $statuses = array('New', 'In Progress');

        $this->db->select('tblSales.*');
        $this->db->select(' tblopportunities.LeadType,
                            tblopportunities.CustomerID,
                            tblopportunities.Source                    
                            ');
        $this->db->select(' tblCustomer.Name,                            
                            tblCustomer.LastName, 
                            tblCustomer.Phone,       
                            tblCustomer.Email,
                            tblCustomer.CompanyName,
                            tblCustomer.RFC
                            ');
        $this->db->select(' tblDeals.EqCategory,
                            tblDeals.PrimaryImage,
                            tblDeals.EqYear,
                            tblDeals.EqMake,
                            tblDeals.EqModel,
                            tblDeals.TruckYear,
                            tblDeals.TruckMake,
                            tblDeals.Length,
                            tblDeals.Type,
                            tblDeals.Capacity,
                            tblDeals.TruckModel,
                            tblDeals.EqSN,
                            tblDeals.DealStatus as TruckStatus,
                            tblDeals.EndDate,
                            tblDeals.DealID as DealCode');        
        $this->db->select(' tblManufacturing.Capacity as ManuCapacity,
                            tblManufacturing.EquipmentCategory,
                            tblManufacturing.TruckMake as ManuTruckMake,
                            tblManufacturing.TruckYear as ManuTruckYear');
        $this->db->select(' tblLogistics.EqCategory as LogiEqCategory,
                            tblLogistics.PickUpCountry,
                            tblLogistics.PickUpState,
                            tblLogistics.PickUpCity,
                            tblLogistics.FinalCountry,
                            tblLogistics.FinalState,
                            tblLogistics.FinalCity                            
                        ');
        $this->db->select(' tblprocurement.BuyingPrice,
                            tblprocurement.Buyer,
                            tblprocurement.Status as ProcurementStatus
                        ');
        $this->db->select(' tbluser.USERNAME');
        $this->db->from($this->tblname); 
        $this->db->join('tblopportunities', 'tblSales.OppID = tblopportunities.ID',  'left');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');
        $this->db->join('tblManufacturing', 'tblSales.ID = tblManufacturing.IDSale and tblSales.DealID = tblManufacturing.ID', 'left');
        $this->db->join('tblLogistics', 'tblSales.ID = tblLogistics.SaleID and tblSales.DealID = tblLogistics.ID', 'left');
        $this->db->join('tbluser', 'tbluser.ID = tblDeals.UserID', 'left');
        $this->db->join('tblprocurement', 'tblSales.DealID = tblprocurement.DealID', 'left');
        if ($searchText != '')   {
            $words = explode('+', $searchText);
            foreach ($words as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);            
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word); 
                $this->db->or_like('tblCustomer.CompanyName', $word); 
                $this->db->or_like('tblCustomer.RFC', $word); 
                $this->db->or_like('tblDeals.EqYear', $word);            
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
                $this->db->or_like('tblDeals.DealID', $word);  
                $this->db->or_like('tblManufacturing.Capacity', $word);
                $this->db->or_like('tblManufacturing.EquipmentCategory', $word);
                $this->db->or_like('tblManufacturing.TruckMake', $word);
                $this->db->or_like('tblManufacturing.TruckYear', $word);
                $this->db->or_like('tblSales.DealType', $word);
                $this->db->or_like('tblSales.DealStatus', $word);
                $this->db->or_like('tblSales.SalesStatus', $word);
                $this->db->or_like('tblSales.SalesRep', $word);
                $this->db->or_like('tblSales.SalesCode', $word);
                $this->db->or_like('tblLogistics.EqCategory', $word);
                $this->db->or_like('tblLogistics.PickUpCountry', $word);
                $this->db->or_like('tblLogistics.PickUpState', $word);
                $this->db->or_like('tblLogistics.PickUpCity', $word);
                $this->db->or_like('tblLogistics.FinalCountry', $word);
                $this->db->or_like('tblLogistics.FinalState', $word);
                $this->db->or_like('tblLogistics.FinalCity', $word);
                $this->db->or_like('tbluser.USERNAME', $word);
                $this->db->group_end();
            }            
        }        
        if ($status != 'Open')
            $statuses = array('Closed', 'Canceled');

        $this->db->where_in('tblSales.SalesStatus', $statuses);
        if ($dealStatus != 'All')
            $this->db->where('tblSales.DealStatus', $dealStatus);
        if ($user != 'All')
            $this->db->where('tblSales.SalesRep', $user);
        if ($dealType != 'All' && $dealType != 'No Deal')
            $this->db->where('tblSales.DealType',  $dealType);
        else if($dealType == 'No Deal')
            $this->db->where('tblSales.DealType', '');
        
        if (!empty($minStartDate))
            $this->db->where('tblSales.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblSales.DateAdded <=', $maxStartDate.' 23:59:59');
        if (is_numeric($minPrice))
            $this->db->where("tblSales.Total >=", $minPrice);
        if (is_numeric($maxPrice))
            $this->db->where('tblSales.Total <=', $maxPrice);
                    
        //$this->db->order_by($field, $sort);
        $this->db->group_by('tblSales.ID');
        $this->db->order_by("tblSales.DateAdded", 'asc');        
        $result_array = $this->db->get()->result_array();

        $result = array();
        foreach ($result_array as $row) {
            if (is_numeric($minRemaining) && (($row['Total'] - $row['TotalDeposit']) < $minRemaining))
                continue;
            if (is_numeric($maxRemaining) && (($row['Total'] - $row['TotalDeposit']) > $maxRemaining))
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

        $response3 = array();

        foreach ($response2 as $sale) {
            $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');
            $this->db->from('tbldeposits');
            $this->db->where('SaleID', $sale['ID']);
            $totalDeposit = $this->db->get()->row_array();

            $sale['TotalDeposit'] = $totalDeposit['TotalDeposit'];
            array_push($response3, $sale);
        }

        return array('recordsTotal' => $totalCount, 'recordsFiltered' => $filteredCount, 'data' => $response3);
    }

    public function getAllDataForExcel(
        $user,
        $searchText,            
        $status,       
        $dealStatus,        
        $dealType,
        $minStartDate,
        $maxStartDate
    ) {
        $field = "";   

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();
        $statuses = array('New', 'In Progress');

        $this->db->select('tblSales.*');
        $this->db->select(' tblopportunities.LeadType,
                            tblopportunities.CustomerID,
                            tblopportunities.Source                    
                            ');
        $this->db->select(' tblCustomer.Name,                            
                            tblCustomer.LastName, 
                            tblCustomer.Phone,       
                            tblCustomer.Email,
                            tblCustomer.CompanyName,
                            tblCustomer.RFC
                            ');
        $this->db->select(' tblDeals.EqCategory,
                            tblDeals.PrimaryImage,
                            tblDeals.EqYear,
                            tblDeals.EqMake,
                            tblDeals.EqModel,
                            tblDeals.TruckYear,
                            tblDeals.TruckMake,
                            tblDeals.Length,
                            tblDeals.Type,
                            tblDeals.Capacity,
                            tblDeals.TruckModel,
                            tblDeals.EqSN,
                            tblDeals.EndDate');        
        $this->db->select(' tblManufacturing.Capacity as ManuCapacity,
                            tblManufacturing.EquipmentCategory,
                            tblManufacturing.TruckMake as ManuTruckMake,
                            tblManufacturing.TruckYear as ManuTruckYear');
        $this->db->select(' tblLogistics.EqCategory as LogiEqCategory,
                            tblLogistics.PickUpCountry,
                            tblLogistics.PickUpState,
                            tblLogistics.PickUpCity,
                            tblLogistics.FinalCountry,
                            tblLogistics.FinalState,
                            tblLogistics.FinalCity                            
                        ');
        $this->db->select(' tbluser.USERNAME');
        $this->db->from($this->tblname); 
        $this->db->join('tblopportunities', 'tblSales.OppID = tblopportunities.ID',  'left');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');        
        $this->db->join('tblManufacturing', 'tblSales.ID = tblManufacturing.IDSale and tblSales.DealID = tblManufacturing.ID', 'left');
        $this->db->join('tblLogistics', 'tblSales.ID = tblLogistics.SaleID and tblSales.DealID = tblLogistics.ID', 'left');
        $this->db->join('tbluser', 'tbluser.ID = tblDeals.UserID', 'left');
        if ($searchText != '')   {
            $words = explode('+', $searchText);
            foreach ($words as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);            
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word); 
                $this->db->or_like('tblCustomer.CompanyName', $word); 
                $this->db->or_like('tblCustomer.RFC', $word); 
                $this->db->or_like('tblDeals.EqYear', $word);            
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
                $this->db->or_like('tblManufacturing.Capacity', $word);
                $this->db->or_like('tblManufacturing.EquipmentCategory', $word);
                $this->db->or_like('tblManufacturing.TruckMake', $word);
                $this->db->or_like('tblManufacturing.TruckYear', $word);
                $this->db->or_like('tblSales.DealType', $word);
                $this->db->or_like('tblSales.DealStatus', $word);
                $this->db->or_like('tblSales.SalesStatus', $word);
                $this->db->or_like('tblSales.SalesRep', $word);
                $this->db->or_like('tblSales.SalesCode', $word);
                $this->db->or_like('tblLogistics.EqCategory', $word);
                $this->db->or_like('tblLogistics.PickUpCountry', $word);
                $this->db->or_like('tblLogistics.PickUpState', $word);
                $this->db->or_like('tblLogistics.PickUpCity', $word);
                $this->db->or_like('tblLogistics.FinalCountry', $word);
                $this->db->or_like('tblLogistics.FinalState', $word);
                $this->db->or_like('tblLogistics.FinalCity', $word);
                $this->db->or_like('tbluser.USERNAME', $word);
                $this->db->group_end();
            }            
        }        
        if ($status != 'Open')
            $statuses = array('Closed', 'Canceled');

        $this->db->where_in('tblSales.SalesStatus', $statuses);
        if ($dealStatus != 'All')
            $this->db->where('tblSales.DealStatus', $dealStatus);
        if ($user != 'All')
            $this->db->where('tblSales.SalesRep', $user);
        if ($dealType != 'All' && $dealType != 'No Deal')
            $this->db->where('tblSales.DealType',  $dealType);
        else if($dealType == 'No Deal')
            $this->db->where('tblSales.DealType', '');
        
        if (!empty($minStartDate))
            $this->db->where('tblSales.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblSales.DateAdded <=', $maxStartDate.' 23:59:59');
                    
        //$this->db->order_by($field, $sort);
        $this->db->group_by('tblSales.ID');
        $this->db->order_by("tblSales.DateAdded", 'asc');        
        $result = $this->db->get()->result_array();

        $result_array = array();

        foreach ($result as $sale) {
            $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');
            $this->db->from('tbldeposits');
            $this->db->where('SaleID', $sale['ID']);
            $totalDeposit = $this->db->get()->row_array();
            $sale['TotalDeposit'] = $totalDeposit['TotalDeposit'];

            array_push($result_array, $sale);
        }

        $headerArray = array(
            'DealType', 'DateAdded', 'ClosedDate', 'SalesRep', 'Status', 'DealStatus',
            'Customer Name', 'Customer LastName', 'Customer Phone', 'Customer Email', 'Customer Company',
            'Customer RFC', 'Customer Source', 'EqFinder', 'Price',
            'Shipping', 'Customs', 'Comm', 'Discount', 'AdditionalCharge', 'TaxAmount', 'Shop',
            'Extras', 'mxShipping', 'Buyer', 'BuyingAmount', 'Deposits', 'RemainingDeposits'
        ); 
        
        $indexArray = array(
            'DealType', 'DateAdded', 'CloseDate', 'SalesRep', 'SalesStatus', 'DealStatus',
            'Name', 'LastName', 'Phone', 'Email', 'CompanyName',
            'RFC', 'Source', 'USERNAME', 'Price',
            'Shipping', 'Customs', 'Comm', 'Discount', 'Additional', 'TaxAmount', 'Shop',
            'Extras', 'mxShipping', 'BuyingUser', 'BuyingAmount', 'TotalDeposit', 'Total'
        ); 

        $returnArray = array();
        array_push($returnArray, $headerArray);

        foreach ($result_array as $row) {
            $record = array();

            foreach ($indexArray as $index) {
                array_push($record, $row[$index]);
            }

            array_push($returnArray, $record);
        }
        
        return $returnArray;
    }

    public function getIncentiveData(       
        $searchText,            
        $status,      
        $salesRep,
        $dealType,
        $minStartDate,
        $maxStartDate,
        $user,
        $role,
        $orderIndex,
        $sort,
        $start,
        $length
    ) {
        $field = "";   

        $this->db->from($this->tblname);
        $totalCount = $this->db->count_all_results();        
        $dealStatus = array('Ready', 'Shop', 'Customs', 'Shipping');

        $this->db->select('tblSales.*');
        $this->db->select('tblopportunities.LeadType, 
                           tblopportunities.CustomerID,
                           tblopportunities.Source                    
                            ');
        $this->db->select(' tblCustomer.Name,                            
                            tblCustomer.LastName, 
                            tblCustomer.Phone,       
                            tblCustomer.Email,
                            tblCustomer.CompanyName,
                            tblCustomer.RFC
                            ');
        $this->db->select(' tblDeals.EqCategory,
                            tblDeals.PrimaryImage,
                            tblDeals.EqYear,
                            tblDeals.EqMake,
                            tblDeals.EqModel,
                            tblDeals.TruckYear,
                            tblDeals.TruckMake,
                            tblDeals.Length,
                            tblDeals.Type,
                            tblDeals.Capacity,
                            tblDeals.TruckModel,
                            tblDeals.EqSN,
                            tblDeals.EndDate');        
        $this->db->select(' tblManufacturing.Capacity as ManuCapacity,
                            tblManufacturing.EquipmentCategory,
                            tblManufacturing.TruckMake as ManuTruckMake,
                            tblManufacturing.TruckYear as ManuTruckYear');
        $this->db->select(' tblLogistics.EqCategory as LogiEqCategory,
                            tblLogistics.PickUpCountry,
                            tblLogistics.PickUpState,
                            tblLogistics.PickUpCity,
                            tblLogistics.FinalCountry,
                            tblLogistics.FinalState,
                            tblLogistics.FinalCity                            
                        ');
        $this->db->select(' tblIncentiveComm.SellerIncentive,
                            tblIncentiveComm.FinderIncentive,
                            tblIncentiveComm.BuyerIncentive,
                            tblIncentiveComm.SellerCurrency,
                            tblIncentiveComm.FinderCurrency,
                            tblIncentiveComm.BuyerCurrency
        ');
        $this->db->select(' tbluser.USERNAME');
        $this->db->from($this->tblname); 
        $this->db->join('tblopportunities', 'tblSales.OppID = tblopportunities.ID',  'left');
        $this->db->join('tblCustomer', 'tblopportunities.CustomerID = tblCustomer.ID', 'left');
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');        
        $this->db->join('tblManufacturing', 'tblSales.ID = tblManufacturing.IDSale and tblSales.DealID = tblManufacturing.ID', 'left');
        $this->db->join('tblLogistics', 'tblSales.ID = tblLogistics.SaleID and tblSales.DealID = tblLogistics.ID', 'left');
        $this->db->join('tblIncentiveComm', 'tblSales.ID = tblIncentiveComm.SaleID', 'left');
        $this->db->join('tbluser', 'tbluser.ID = tblDeals.UserID', 'left');
        if ($searchText != '')   {
            $words = explode('+', $searchText);
            foreach ($words as $word) {
                $this->db->group_start();
                $this->db->like('concat(trim(tblCustomer.Name), " ", trim(tblCustomer.LastName))', $word);            
                $this->db->or_like('tblCustomer.Phone', $word);
                $this->db->or_like('tblCustomer.Email', $word); 
                $this->db->or_like('tblCustomer.CompanyName', $word); 
                $this->db->or_like('tblCustomer.RFC', $word); 
                $this->db->or_like('tblDeals.EqYear', $word);            
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
                $this->db->or_like('tblManufacturing.Capacity', $word);
                $this->db->or_like('tblManufacturing.EquipmentCategory', $word);
                $this->db->or_like('tblManufacturing.TruckMake', $word);
                $this->db->or_like('tblManufacturing.TruckYear', $word);
                $this->db->or_like('tblSales.DealType', $word);
                $this->db->or_like('tblSales.DealStatus', $word);
                $this->db->or_like('tblSales.SalesStatus', $word);
                $this->db->or_like('tblSales.SalesRep', $word);
                $this->db->or_like('tblLogistics.EqCategory', $word);
                $this->db->or_like('tblLogistics.PickUpCountry', $word);
                $this->db->or_like('tblLogistics.PickUpState', $word);
                $this->db->or_like('tblLogistics.PickUpCity', $word);
                $this->db->or_like('tblLogistics.FinalCountry', $word);
                $this->db->or_like('tblLogistics.FinalState', $word);
                $this->db->or_like('tblLogistics.FinalCity', $word);
                $this->db->or_like('tbluser.USERNAME', $word);
                $this->db->group_end();
            }            
        }        
        
        $this->db->where_in('tblSales.IncentiveStatus', $status);        
        $this->db->where_in('tblSales.DealStatus', $dealStatus);        

        if ($salesRep != 'All')
            $this->db->where('tblSales.SalesRep', $salesRep);
        if ($dealType != 'All' && $dealType != 'No Deal')
            $this->db->where('tblSales.DealType',  $dealType);
        else if($dealType == 'No Deal')
            $this->db->where('tblSales.DealType', '');

        if ($user != 'All') {
            if ($role == 'All') {
                $this->db->group_start();
                $this->db->where('tblSales.SalesRep', $user);
                $this->db->or_where('tblSales.BuyingUser', $user);
                $this->db->or_where('tbluser.USERNAME', $user);
                $this->db->group_end();
            }
            else if ($role == 'Finder') {
                $this->db->where('tbluser.USERNAME', $user);
                if ($dealType == 'All') {
                    $this->db->where_in('tblSales.DealType', array('Auction', 'For Sale', 'Consignment'));
                }
            }
            else if ($role == 'Seller') {
                $this->db->where('tblSales.SalesRep', $user);
            }
            else if ($role == 'Buyer') {
                $this->db->where('tblSales.BuyingUser', $user);                
            }
        }
        
        if (!empty($minStartDate))
            $this->db->where('tblSales.DateAdded >=', $minStartDate);
        if (!empty($maxStartDate))
            $this->db->where('tblSales.DateAdded <=', $maxStartDate.' 23:59:59');
                    
        //$this->db->order_by($field, $sort);
        $this->db->group_by('tblSales.ID');
        $this->db->order_by("tblSales.DateAdded", 'asc');        
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


        $returnArray = array();

        $this->load->model('Incentive_model');

        foreach ($response2 as $record) {

            $record['SellerDepositUSD'] = $this->Incentive_model->getTotalDepositByUserAndCurrency('Seller', $record['ID'], 'USD');
            $record['SellerDepositMXN'] = $this->Incentive_model->getTotalDepositByUserAndCurrency('Seller', $record['ID'], 'MXN');            
            $record['BuyerDepositUSD'] = $this->Incentive_model->getTotalDepositByUserAndCurrency('Buyer', $record['ID'], 'USD');
            $record['BuyerDepositMXN'] = $this->Incentive_model->getTotalDepositByUserAndCurrency('Buyer', $record['ID'], 'MXN');            
            $record['FinderDepositUSD'] = $this->Incentive_model->getTotalDepositByUserAndCurrency('Finder', $record['ID'], 'USD');
            $record['FinderDepositMXN'] = $this->Incentive_model->getTotalDepositByUserAndCurrency('Finder', $record['ID'], 'MXN');            
            
            array_push($returnArray, $record);
        }

        return array('recordsTotal' => $totalCount, 'recordsFiltered' => $filteredCount, 'data' => $returnArray);
    }
    
    public function getSalesCount($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('SalesRep', $user);
        $this->db->where('SalesStatus !=', 'Canceled');
        $this->db->where('DateAdded >', $startDate. ' 00:00:00');
        $this->db->where('DateAdded <=', $endDate.' 23:59:59');
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getSoldReplacementsCount($user, $startDate, $endDate) {
        $this->db->select('tblSales.ID');
        $this->db->select('tblDeals.EqCategory');
        $this->db->from($this->tblname);
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');
        $this->db->where('tblSales.SalesRep', $user);        
        $this->db->where('tblSales.SalesStatus !=', 'Canceled');
        $this->db->where('tblSales.DateAdded >', $startDate. ' 00:00:00');
        $this->db->where('tblSales.DateAdded <=', $endDate.' 23:59:59');
        $this->db->where('tblSales.DealID !=', 0);
        //  add condition for replacements //
        $this->db->where('tblDeals.EqCategory =', 'Replacements');
        $this->db->group_by('tblSales.ID');        

        return $this->db->count_all_results();
    }

    public function getDepositNoDealCount() {
        $this->db->select('tblSales.*');
        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');        
        $this->db->from($this->tblname);     
        $this->db->join('tbldeposits', 'tblSales.ID = tbldeposits.SaleID', 'left');
        $this->db->where('tblSales.SalesStatus', 'New');
        $this->db->where('tblSales.DealStatus', '');
        $this->db->where('tblSales.DealID', 0);        
        $this->db->group_by('tblSales.ID');

        $result =  $this->db->get()->result_array();

        $cnt = 0;
        foreach ($result as $row) {
            if ($row['TotalDeposit'] > 0)
                $cnt++;
        }

        return $cnt;
    }

    public function getDepositPendingDealCount() {
        $this->db->select('tblSales.*');
        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');  
        $this->db->select(' tblDeals.EndDate ');        
        $this->db->from($this->tblname);         
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');
        $this->db->join('tbldeposits', 'tblSales.ID = tbldeposits.SaleID', 'left');
        $this->db->where('tblSales.SalesStatus', 'In Progress');
        $this->db->where('tblSales.DealID !=', 0);
        $this->db->where('tblDeals.EndDate >=', date('Y-m-d'));
        $this->db->group_by('tblSales.ID');

        $result =  $this->db->get()->result_array();

        $cnt = 0;
        foreach ($result as $row) {
            if ($row['TotalDeposit'] > 0)
                $cnt++;
        }

        return $cnt;
    }

    public function getSalesCountByDate($user, $startDate, $endDate) {
        $this->db->select('ID');
        if ($user != 'All') 
            $this->db->where('SalesRep', $user);        
        $this->db->where('SalesStatus !=', 'Canceled');
        $this->db->where('DateAdded >=', $startDate);
        $this->db->where('DateAdded <=', $endDate);
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getSalesCountByStatus($user, $status) {
        $this->db->select('ID');
        if ($user != 'All')
            $this->db->where('SalesRep', $user);
        $this->db->where('SalesStatus !=', 'Canceled');
        $this->db->where('DealStatus', $status);
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function getRemainAmountByReadySale($salesRep, $currency) {
        $this->db->select('tblSales.*');
        $this->db->select('COALESCE(SUM(tbldeposits.RealAmount), 0) as TotalDeposit');
        $this->db->from($this->tblname);
        $this->db->join('tbldeposits', 'tblSales.ID = tbldeposits.SaleID', 'left');
        if ($salesRep != 'All')
            $this->db->where('tblSales.SalesRep', $salesRep);
        $this->db->where('tblSales.DealStatus', 'Ready');
        $this->db->where('tblSales.SalesCurrency', $currency);
        $this->db->where('SalesStatus !=', 'Canceled');
        $this->db->group_by('tblSales.ID');

        $result = $this->db->get()->result_array();

        $remaining = 0;
        foreach ($result as $row) {
            $remaining += ($row['Total'] - $row['TotalDeposit']);
        }

        return $remaining;
    }

    public function getNoDealCount($user) {
        $this->db->select('ID');
        $this->db->where('SalesStatus', 'New');
        $this->db->where('DealStatus', '');
        $this->db->where('DealID', 0);        
        if ($user != 'All') 
            $this->db->where('SalesRep', $user);
        $this->db->from($this->tblname);

        return $this->db->count_all_results();
    }

    public function cancelSale($ID) {
        $data = array(
            'SalesStatus' => 'Canceled',
            'DealStatus' => 'Canceled',
            'CloseDate' => date('Y-m-d H:i:s'),
            'LastUpdateDate' => date('Y-m-d H:i:s'),
            'DealID' => 0,
            'DealType' => ''
        );

        $this->update(array('ID' => $ID), $data);
    }

    public function updateDepositCurrency($SalesID) {
        $this->db->set('DepositCurrency', 'SalesCurrency', false);
        $this->db->where('ID', $SalesID);
        $this->db->update($this->tblname);
    }
}