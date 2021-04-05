<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");

class Deal_model extends CI_Model
{
    public $categoryName = array(
        'Boom Truck' => array(1, 43),
        'Bucket Truck' => array(1, 42),
        'Concrete Pump Truck' => array(5, 62),
        'Crane' => array(1, 44),
        'Dozer' => array(2, 61),
        'Excavator' => array(2, 57),
        'Forklift' => array(6, 68),
        'Generator' => array(9, 74),
        'Knuckle Boom Truck' => array(1, 39),
        'Lift' => array(6, 65, 66, 67),
        'Loader Backhoe' => array(2, 60),
        'Motor Grader' => array(2, 59),
        'Skid Steer' => array(2, 50), 
        'Tow Truck' => array(1, 38),
        'Truck' => array(21, 53),
        'Wheel Loader' => array(2, 55),
        'Water Truck' => array(21, 50),
        'Dump Truck' => array(21, 54),
        'Chasis Truck' => array(21, 46),
        'Garbage Truck' => array(21, 86), 
        'Vacuum Truck' => array(21, 88),
        'Digger Derrick Truck' => array(1, 41),
        'Roll Off Truck' => array(21, 87),
        'Mixer Truck' => array(5, 64), 
        'Motor Grader' => array(2, 59),
        'Bus' => array(21, 45), 
        'Trailer' => array(8, 71), 
        'Agriculture' => array(7, 81, 84, 69, 89), 
        'Unmounted Boom' => array(4, 90), 
        'Stationary Concrete Pump' => array(5, 92),
        'Parts' => array(22, 93), 
        'Accessory' => array(4, 91), 
        'Mini Excavator' => array(2, 94),
        'Platform Truck' => array(21, 95),
        'Service Truck' => array(21, 96),
        'Reefer Truck' => array(21, 52),
        'Box Truck' => array(21, 97),
        'Drum Roller' => array(2, 56),
    );    

    public function __construct()
    {
        parent::__construct();

        // set pacific time zone
        date_default_timezone_set('America/Phoenix');
    }

    public function insert($data)
    {
        $this->db->insert('tblDeals', $data);
        return $this->db->insert_id();
    }

    public function update($criteria, $data)
    {
        $this->db->where($criteria);
        return $this->db->update('tblDeals', $data);
    }

    public function getRow($criteria) {
        $this->db->select('*');
        $this->db->where($criteria);
        $this->db->from('tblDeals');
        $this->db->limit(1);
        return $this->db->get()->row_array();
    }

    public function updateTruckResource($criteria, $data)
    {
        $this->db->where($criteria);
        return $this->db->update('tblresource', $data);
    }

    public function getAllData(
        $minYear,
        $maxYear,
        $minAucDate,
        $maxAucDate,
        $minTotal,
        $maxTotal,
        $minLiftCapacity,
        $maxLiftCapacity,
        $searchText,
        $start,
        $length,
        $published,
        $marked,
        $category,
        $dealType,
        $orderIndex,
        $sort
    ) {

        $this->db->from('viewActiveDeals');
        $totalCount = $this->db->count_all_results();


        $field = '';
        if ($orderIndex == 7) {
            $field = 'viewActiveDeals.DateAdded';
        } else if ($orderIndex == 6) {
            $field = 'viewActiveDeals.Total';
        } else if ($orderIndex == 9) {
            $field = 'viewActiveDeals.Capacity';
        } else if ($orderIndex == 5) {
            $field = 'viewActiveDeals.EndDate';
        } else if ($orderIndex == 3) {
            $field = 'viewActiveDeals.EqModel';
        }

        $this->db->select('viewActiveDeals.*');        
        $this->db->from('viewActiveDeals');        

        if ($category != 'All Equipments')
            $this->db->where('viewActiveDeals.EqCategory', $category);
        if ($dealType != 'All Deals')
            $this->db->where('viewActiveDeals.DealType', $dealType);
        if ($published == 'yes') 
            $this->db->where('viewActiveDeals.MaquinariaJRLink !=', '');        
        else if ($published == 'no') 
            $this->db->where('viewActiveDeals.MaquinariaJRLink', '');
        if ($marked == 'yes') 
            $this->db->where('viewActiveDeals.MarkForExit', 'YES');

        if ($searchText != '')   {
            $words = explode('+', $searchText);
            foreach ($words as $word) {
                $this->db->group_start();
                $this->db->like('viewActiveDeals.EqMake', $word);            
                $this->db->or_like('viewActiveDeals.EqModel', $word);
                $this->db->or_like('viewActiveDeals.Country', $word); 
                $this->db->or_like('viewActiveDeals.State', $word);            
                $this->db->or_like('viewActiveDeals.City', $word); 
                $this->db->or_like('viewActiveDeals.Auctioneer', $word);  
                $this->db->or_like('viewActiveDeals.USERNAME', $word);  
                $this->db->or_like('viewActiveDeals.DealType', $word);     
                $this->db->or_like('viewActiveDeals.EqCategory', $word);     
                $this->db->or_like('viewActiveDeals.EqYear', $word);     
                $this->db->or_like('viewActiveDeals.EqSN', $word);     
                $this->db->or_like('viewActiveDeals.TruckYear', $word);     
                $this->db->or_like('viewActiveDeals.TruckMake', $word);    
                $this->db->or_like('viewActiveDeals.TruckModel', $word);
                $this->db->or_like('viewActiveDeals.Engine', $word);
                $this->db->or_like('viewActiveDeals.TruckTrans', $word);
                $this->db->or_like('viewActiveDeals.TruckCondition', $word);
                $this->db->or_like('viewActiveDeals.Capacity', $word);
                $this->db->or_like('viewActiveDeals.Length', $word);
                $this->db->or_like('viewActiveDeals.Suspension', $word);
                $this->db->or_like('viewActiveDeals.HorsePower', $word);
                $this->db->or_like('viewActiveDeals.SourcingAppID', $word);
                $this->db->or_like('viewActiveDeals.DealID', $word);
                $this->db->or_like('viewActiveDeals.Type', $word);
                $this->db->or_like('viewActiveDeals.Hours', $word);
                $this->db->or_like('viewActiveDeals.mkTitle', $word);
                $this->db->or_like('viewActiveDeals.mkDescription', $word);
                if (strripos('Cabin', $word) !== false)
                    $this->db->or_like('viewActiveDeals.Cab', 2);
                if (strripos('4WD', $word) !== false)
                    $this->db->or_like('viewActiveDeals.4WD', 2);
                if (strripos('Ext', $word) !== false)
                    $this->db->or_like('viewActiveDeals.Ext', 2);
                if (strripos('AuxHyd', $word) !== false)
                    $this->db->or_like('viewActiveDeals.AuxHyd', 2);
                if (strripos('Ripper', $word) !== false)
                    $this->db->or_like('viewActiveDeals.Ripper', 2);                    
                $this->db->group_end();
            }            
        }     

        if (!empty($minYear))
            $this->db->where('viewActiveDeals.EqYear >=', $minYear);
        if (!empty($maxYear))
            $this->db->where('viewActiveDeals.EqYear <=', $maxYear);
        if (!empty($minAucDate)) {
            $this->db->where('DealType', 'Auction');
            $this->db->where('EndDate >=', $minAucDate);
        }
        if (!empty($maxAucDate)) {
            $this->db->where('DealType', 'Auction');
            $this->db->where('EndDate <=', $maxAucDate);
        }
        if (!empty($minTotal))
            $this->db->where('Total >=', $minTotal);
        if (!empty($maxTotal))
            $this->db->where('Total <=', $maxTotal);
        if (!empty($minLiftCapacity))  
            $this->db->where('Capacity >=', $minLiftCapacity);
        if (!empty($maxLiftCapacity))
            $this->db->where('Capacity <=', $maxLiftCapacity);

        $this->db->order_by($field, $sort);
        $this->db->group_by('viewActiveDeals.ID');
        $response1 = $this->db->get()->result_array();
        
        $realDataCount = count($response1);

        $response2 = array();
        $lastIndex = 0;

        if ($length == -1) {
            $response2 = $response1;
        } else {
            $lastIndex = $realDataCount > ($start + $length)  ? ($start + $length) : $realDataCount;
            for ($i = $start; $i < $lastIndex; $i++) {
                array_push($response2, $response1[$i]);
            }
        }


        // check with watchlist

        $userID =  $this->session->userdata('ID');
        $this->db->select('*');
        $this->db->where('UserID', $userID);
        $this->db->from('tblWatchList');

        $watchlist = $this->db->get()->result_array();

        $response3 = array();

        foreach ($response2 as $item) {
            $watchCheck = 0;
            foreach ($watchlist as $watch) {
                if ($watch['TruckID'] == $item['ID']) {
                    $watchCheck = 1;
                    break;
                }
            }            
            $item['watch'] = $watchCheck;

            $this->db->select('ID');
            $this->db->where('TruckID', $item['ID']);
            $this->db->from('tblresource');
            $item['PictureCount'] = $this->db->count_all_results();

            array_push($response3, $item);
        }

        return array('recordsTotal' => $totalCount, 'recordsFiltered' => $realDataCount, 'data' => $response3);
    }

    public function getAllDataForExcel(
        $minYear,
        $maxYear,
        $minAucDate,
        $maxAucDate,
        $minTotal,
        $maxTotal,
        $minLiftCapacity,
        $maxLiftCapacity,
        $searchText,
        $category,
        $dealType

    ) {


        if ($category == "All Equipments") {

            $this->db->select('*');
            if ($dealType == 'All Deals') { } else {
                $this->db->where('DealType', $dealType);
            }
            $this->db->from('viewActiveDeals');
        } else {
            $this->db->select('*');
            $this->db->where('EqCategory', $category);
            if ($dealType == 'All Deals') { } else {
                $this->db->where('DealType', $dealType);
            }
            $this->db->from('viewActiveDeals');
        }

        $result = $this->db->get()->result_array();

        $totalCount = count($result);

        $response1 = array();

        foreach ($result as $val) {
            $include = true;

            if (!empty($searchText)) {

                $include = false;

                if (strripos($val['EqMake'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['EqModel'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Country'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['State'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['City'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Auctioneer'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['USERNAME'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['DealType'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['EqCategory'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['DealID'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['EqSN'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['TruckMake'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['TruckModel'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Engine'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['TruckTrans'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['TruckCondition'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Length'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Type'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Suspension'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['HorsePower'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Hours'], $searchText) !== false) {
                    $include = true;
                } else if ($val['Cab'] == 1 && strripos('cabin', $searchText) !== false) {
                    $include = true;
                } else if ($val['4WD'] == 1 && strripos('4WD', $searchText) !== false) {
                    $include = true;
                } else if ($val['Ext'] == 1 && strripos('Ext', $searchText) !== false) {
                    $include = true;
                } else if ($val['AuxHyd'] == 1 && strripos('Aux Hyd', $searchText) !== false) {
                    $include = true;
                } else if ($val['Ripper'] == 1 && strripos('Ripper', $searchText) !== false) {
                    $include = true;
                } 
            }

            if ($include == true) {

                $rangeYear = false;


                if (empty($minYear) && empty($maxYear)) {

                    $rangeYear = true;
                } else if (empty($minYear) && !empty($maxYear)) {

                    if ($val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                } else if (!empty($minYear) && empty($maxYear)) {

                    if ($val['EqYear'] >= $minYear) {

                        $rangeYear = true;
                    }
                } else {

                    if ($val['EqYear'] >= $minYear && $val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                }


                if ($rangeYear == true) {

                    $rangeAuctionDate = false;

                    if (empty($minAucDate) && empty($maxAucDate)) {

                        $rangeAuctionDate = true;
                    } else if (empty($minAucDate) && !empty($maxAucDate)) {

                        if ($val['DealType'] == 'Auction') {
                            if ($val['EndDate'] <= $maxAucDate) {
                                $rangeAuctionDate = true;
                            }
                        }
                    } else if (!empty($minAucDate) && empty($maxAucDate)) {

                        if ($val['DealType'] == 'Auction') {
                            if ($val['EndDate'] >= $minAucDate) {
                                $rangeAuctionDate = true;
                            }
                        }
                    } else {

                        if ($val['DealType'] == 'Auction') {
                            if ($val['EndDate'] >= $minAucDate && $val['EndDate'] <= $maxAucDate) {
                                $rangeAuctionDate = true;
                            }
                        }
                    }

                    if ($rangeAuctionDate == true) {

                        $rangeTotal = false;

                        if (empty($maxTotal) && empty($minTotal)) {
                            $rangeTotal = true;
                        } else if (empty($minTotal) && !empty($maxTotal)) {
                            if ($val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        } else if (!empty($minTotal) && empty($maxTotal)) {
                            if ($val['Total'] >= $minTotal) {
                                $rangeTotal = true;
                            }
                        } else {
                            if ($val['Total'] >= $minTotal && $val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        }

                        if ($rangeTotal == true) {

                            $rangeLiftCapacity = false;


                            if (empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                $rangeLiftCapacity = true;
                            } else if (empty($minLiftCapacity) && !empty($maxLiftCapacity)) {

                                if ($val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else if (!empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                if ($val['Capacity'] >= $minLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else {

                                if ($val['Capacity'] >= $minLiftCapacity && $val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            }

                            if ($rangeLiftCapacity == true) {
                                /////////////// push ////////////////
                                array_push($response1, $val);
                            }
                        }
                    }
                }
            }
        }



        $realDataCount = count($response1);

        $headerArray = array(
            'DealType', 'EqCategory', 'EqYear', 'EqMake', 'EqModel', 'Capacity',
            'Country', 'State', 'City', 'WareHouse', 'EndDate',
            'Auctioneer', 'BuyPremium', 'Price', 'Shipping', 'Customs',
            'Commission', 'Margin', 'Total', 'UserName', 'DateAdded', 'Link'
        );

        $result = array();
        array_push($result, $headerArray);

        foreach ($response1 as $res) {

            $record = array();
            array_push($record, $res['DealType']);
            array_push($record, $res['EqCategory']);
            array_push($record, $res['EqYear']);
            array_push($record, $res['EqMake']);
            array_push($record, $res['EqModel']);
            array_push($record, $res['Capacity']);
            array_push($record, $res['Country']);
            array_push($record, $res['State']);
            array_push($record, $res['City']);
            array_push($record, $res['WareHouse']);
            array_push($record, $res['EndDate']);
            array_push($record, $res['Auctioneer']);
            array_push($record, $res['BuyPremium']);
            array_push($record, $res['Price']);
            array_push($record, $res['Shipping']);
            array_push($record, $res['Customs']);
            array_push($record, $res['Commission']);
            array_push($record, $res['Margin']);
            array_push($record, $res['Total']);
            array_push($record, $res['USERNAME']);
            array_push($record, $res['DateAdded']);
            array_push($record, $res['Link']);

            array_push($result, $record);
        }
        return $result;
    }



    public function getAllDataForWatchList(
        $minYear,
        $maxYear,
        $minAucDate,
        $maxAucDate,
        $minTotal,
        $maxTotal,
        $minLiftCapacity,
        $maxLiftCapacity,
        $search,
        $start,
        $length,
        $category,
        $dealType,
        $orderIndex,
        $sort
    ) {

        //get all watch list by userID

        $watchIDList = array();

        $userID =  $this->session->userdata('ID');
        $this->db->select('*');
        $this->db->where('UserID', $userID);
        $this->db->from('tblWatchList'); 
        $watchlist = $this->db->get()->result_array();

        foreach ($watchlist as $watch) {
            array_push($watchIDList, $watch['TruckID']);
        }



        ///////
        $field = '';
        if ($orderIndex == 7) {
            $field = 'DateAdded';
        } else if ($orderIndex == 6) {
            $field = 'Total';
        } else if ($orderIndex == 9) {
            $field = 'Capacity';
        } else if ($orderIndex == 5) {
            $field = 'EndDate';
        } else if ($orderIndex == 3) {
            $field = 'EqModel';
        }

        if ($category == "All Equipments") {

            $this->db->select('*');
            if (count($watchIDList) > 0) {
                $this->db->where_in('ID', $watchIDList);
            } else {
                $this->db->where('ID', 0);
            }

            if ($dealType == 'All Deals') { } else {
                $this->db->where('DealType', $dealType);
            }
            $this->db->order_by($field, $sort);
            $this->db->from('viewActiveDeals');
        } else {
            $this->db->select('*');
            if (count($watchIDList) > 0) {
                $this->db->where_in('ID', $watchIDList);
            } else {
                $this->db->where('ID', 0);
            }
            $this->db->where('EqCategory', $category);
            if ($dealType == 'All Deals') { } else {
                $this->db->where('DealType', $dealType);
            }
            $this->db->order_by($field, $sort);
            $this->db->from('viewActiveDeals');
        }

        $result = $this->db->get()->result_array();

        $totalCount = count($result);

        $response1 = array();

        foreach ($result as $val) {
            $include = true;

            if (!empty($search)) {
                $words = explode("+", $search);

                foreach ($words as $searchText) {
                    $searchText = trim($searchText);
                    //echo $searchText;

                    if ($include == true) {

                        $include = false;

                        if (strripos($val['EqMake'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['EqModel'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Country'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['State'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['City'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Auctioneer'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['USERNAME'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['DealType'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['EqCategory'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['EqYear'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['EqSN'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckYear'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckMake'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckModel'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Engine'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckTrans'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckCondition'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Capacity'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Length'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Suspension'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['HorsePower'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['DealID'], $searchText) !== false) {
                            $include = true;
                        }  else if (strripos($val['Type'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Hours'], $searchText) !== false) {
                            $include = true;
                        } else if ($val['Cab'] == '2' && strripos('Cabin', $searchText) !== false) {                    
                            $include = true;
                        } else if ($val['4WD'] == '2' && strripos('4WD', $searchText) !== false) {
                            $include = true;
                        } else if ($val['Ext'] == '2' && strripos('Ext', $searchText) !== false) {
                            $include = true;
                        } else if ($val['AuxHyd'] == '2' && strripos('AuxHyd', $searchText) !== false) {
                            $include = true;
                        } else if ($val['Ripper'] == '2' && strripos('Ripper', $searchText) !== false) {
                            $include = true;
                        } 
                    }
                }
            }



            if ($include == true) {

                $rangeYear = false;


                if (empty($minYear) && empty($maxYear)) {

                    $rangeYear = true;
                } else if (empty($minYear) && !empty($maxYear)) {

                    if ($val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                } else if (!empty($minYear) && empty($maxYear)) {

                    if ($val['EqYear'] >= $minYear) {

                        $rangeYear = true;
                    }
                } else {

                    if ($val['EqYear'] >= $minYear && $val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                }


                if ($rangeYear == true) {

                    $rangeAuctionDate = false;

                    if (empty($minAucDate) && empty($maxAucDate)) {

                        $rangeAuctionDate = true;

                        // if ($val['DealType'] == 'Auction') {
                        //     if ($val['EndDate'] >= date('Y-m-d')) {
                        //         $rangeAuctionDate = true;
                        //     }
                        // } else {
                        //     $rangeAuctionDate = true;
                        // }
                    } else if (empty($minAucDate) && !empty($maxAucDate)) {

                        if ($val['DealType'] == 'Auction') {
                            if ($val['EndDate'] <= $maxAucDate) {
                                $rangeAuctionDate = true;
                            }
                        }
                    } else if (!empty($minAucDate) && empty($maxAucDate)) {

                        if ($val['DealType'] == 'Auction') {
                            if ($val['EndDate'] >= $minAucDate) {
                                $rangeAuctionDate = true;
                            }
                        }
                    } else {

                        if ($val['DealType'] == 'Auction') {
                            if ($val['EndDate'] >= $minAucDate && $val['EndDate'] <= $maxAucDate) {
                                $rangeAuctionDate = true;
                            }
                        }
                    }

                    if ($rangeAuctionDate == true) {

                        $rangeTotal = false;

                        if (empty($maxTotal) && empty($minTotal)) {
                            $rangeTotal = true;
                        } else if (empty($minTotal) && !empty($maxTotal)) {
                            if ($val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        } else if (!empty($minTotal) && empty($maxTotal)) {
                            if ($val['Total'] >= $minTotal) {
                                $rangeTotal = true;
                            }
                        } else {
                            if ($val['Total'] >= $minTotal && $val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        }

                        if ($rangeTotal == true) {

                            $rangeLiftCapacity = false;


                            if (empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                $rangeLiftCapacity = true;
                            } else if (empty($minLiftCapacity) && !empty($maxLiftCapacity)) {

                                if ($val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else if (!empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                if ($val['Capacity'] >= $minLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else {

                                if ($val['Capacity'] >= $minLiftCapacity && $val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            }

                            if ($rangeLiftCapacity == true) {
                                /////////////// push ////////////////
                                array_push($response1, $val);
                            }
                        }
                    }
                }
            }
        }



        $realDataCount = count($response1);

        $response2 = array();
        $lastIndex = 0;

        if ($length == -1) {
            $response2 = $response1;
        } else {
            $lastIndex = $realDataCount > ($start + $length)  ? ($start + $length) : $realDataCount;
            for ($i = $start; $i < $lastIndex; $i++) {
                array_push($response2, $response1[$i]);
            }
        }

        $response3 = array();

        foreach ($response2 as $item) {

            $this->db->select('ID');
            $this->db->where('TruckID', $item['ID']);
            $this->db->from('tblresource');
            $item['PictureCount'] = $this->db->count_all_results();

            array_push($response3, $item);
        }

        return array('recordsTotal' => $totalCount, 'recordsFiltered' => $realDataCount, 'data' => $response3);
    }

    public function getWatchListDataForExcel(
        $minYear,
        $maxYear,
        $minAucDate,
        $maxAucDate,
        $minTotal,
        $maxTotal,
        $minLiftCapacity,
        $maxLiftCapacity,
        $searchText,
        $category,
        $dealType

    ) {


        //get all watch list by userID

        $watchIDList = array();

        $userID =  $this->session->userdata('ID');
        $this->db->select('*');
        $this->db->where('UserID', $userID);
        $this->db->from('tblWatchList');
        $watchlist = $this->db->get()->result_array();

        foreach ($watchlist as $watch) {
            array_push($watchIDList, $watch['TruckID']);
        }


        if ($category == "All Equipments") {

            $this->db->select('*');
            if (count($watchIDList) > 0) {
                $this->db->where_in('ID', $watchIDList);
            } else {
                $this->db->where('ID', 0);
            }

            if ($dealType == 'All Deals') { } else {
                $this->db->where('DealType', $dealType);
            }
          
            $this->db->from('viewActiveDeals');
        } else {
            $this->db->select('*');
            if (count($watchIDList) > 0) {
                $this->db->where_in('ID', $watchIDList);
            } else {
                $this->db->where('ID', 0);
            }
            $this->db->where('EqCategory', $category);
            if ($dealType == 'All Deals') { } else {
                $this->db->where('DealType', $dealType);
            }
           
            $this->db->from('viewActiveDeals');
        }

        $result = $this->db->get()->result_array();

        $totalCount = count($result);

        $response1 = array();

        foreach ($result as $val) {
            $include = true;

            if (!empty($searchText)) {

                $include = false;

                if (strripos($val['EqMake'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['EqModel'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Country'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['State'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['City'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Auctioneer'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['USERNAME'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['DealType'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['EqCategory'], $searchText) !== false) {
                    $include = true;
                }
            }



            if ($include == true) {

                $rangeYear = false;


                if (empty($minYear) && empty($maxYear)) {

                    $rangeYear = true;
                } else if (empty($minYear) && !empty($maxYear)) {

                    if ($val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                } else if (!empty($minYear) && empty($maxYear)) {

                    if ($val['EqYear'] >= $minYear) {

                        $rangeYear = true;
                    }
                } else {

                    if ($val['EqYear'] >= $minYear && $val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                }


                if ($rangeYear == true) {

                    $rangeAuctionDate = false;

                    if (empty($minAucDate) && empty($maxAucDate)) {

                        $rangeAuctionDate = true;
                   
                    } else if (empty($minAucDate) && !empty($maxAucDate)) {

                        if ($val['DealType'] == 'Auction') {
                            if ($val['EndDate'] <= $maxAucDate) {
                                $rangeAuctionDate = true;
                            }
                        }
                    } else if (!empty($minAucDate) && empty($maxAucDate)) {

                        if ($val['DealType'] == 'Auction') {
                            if ($val['EndDate'] >= $minAucDate) {
                                $rangeAuctionDate = true;
                            }
                        }
                    } else {

                        if ($val['DealType'] == 'Auction') {
                            if ($val['EndDate'] >= $minAucDate && $val['EndDate'] <= $maxAucDate) {
                                $rangeAuctionDate = true;
                            }
                        }
                    }

                    if ($rangeAuctionDate == true) {

                        $rangeTotal = false;

                        if (empty($maxTotal) && empty($minTotal)) {
                            $rangeTotal = true;
                        } else if (empty($minTotal) && !empty($maxTotal)) {
                            if ($val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        } else if (!empty($minTotal) && empty($maxTotal)) {
                            if ($val['Total'] >= $minTotal) {
                                $rangeTotal = true;
                            }
                        } else {
                            if ($val['Total'] >= $minTotal && $val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        }

                        if ($rangeTotal == true) {

                            $rangeLiftCapacity = false;


                            if (empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                $rangeLiftCapacity = true;
                            } else if (empty($minLiftCapacity) && !empty($maxLiftCapacity)) {

                                if ($val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else if (!empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                if ($val['Capacity'] >= $minLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else {

                                if ($val['Capacity'] >= $minLiftCapacity && $val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            }

                            if ($rangeLiftCapacity == true) {
                                /////////////// push ////////////////
                                array_push($response1, $val);
                            }
                        }
                    }
                }
            }
        }

        $realDataCount = count($response1);

        $headerArray = array(
            'DealType', 'EqCategory', 'EqYear', 'EqMake', 'EqModel', 'Capacity',
            'Country', 'State', 'City', 'WareHouse', 'EndDate',
            'Auctioneer', 'BuyPremium', 'Price', 'Shipping', 'Customs',
            'Commission', 'Margin', 'Total', 'UserName', 'DateAdded', 'Link'
        );

        $result = array();
        array_push($result, $headerArray);

        foreach ($response1 as $res) {

            $record = array();
            array_push($record, $res['DealType']);
            array_push($record, $res['EqCategory']);
            array_push($record, $res['EqYear']);
            array_push($record, $res['EqMake']);
            array_push($record, $res['EqModel']);
            array_push($record, $res['Capacity']);
            array_push($record, $res['Country']);
            array_push($record, $res['State']);
            array_push($record, $res['City']);
            array_push($record, $res['WareHouse']);
            array_push($record, $res['EndDate']);
            array_push($record, $res['Auctioneer']);
            array_push($record, $res['BuyPremium']);
            array_push($record, $res['Price']);
            array_push($record, $res['Shipping']);
            array_push($record, $res['Customs']);
            array_push($record, $res['Commission']);
            array_push($record, $res['Margin']);
            array_push($record, $res['Total']);
            array_push($record, $res['USERNAME']);
            array_push($record, $res['DateAdded']);
            array_push($record, $res['Link']);

            array_push($result, $record);
        }
        return $result;

      
    }

    public function getWatchListDataForTVmode() {


        //get all watch list by userID

        $watchIDList = array();

        $userID =  $this->session->userdata('ID');
        $this->db->select('*');
        $this->db->where('UserID', $userID);
        $this->db->from('tblWatchList');
        $watchlist = $this->db->get()->result_array();

        foreach ($watchlist as $watch) {
            array_push($watchIDList, $watch['TruckID']);
        }

        $this->db->select('*');
        if (count($watchIDList) > 0) {
            $this->db->where_in('ID', $watchIDList);
        } else {
            $this->db->where('ID', 0);
        }          
      
        $this->db->from('viewActiveDeals');  

        $result = $this->db->get()->result_array();  

        return $result;
      
    }

    public function getTvModeData($id, $direction){
        $this->db->select('*');
        $this->db->where('TvMode', 'yes');
        $this->db->order_by('ID', 'asc');    
        $this->db->from('viewActiveDeals');
        $records = $this->db->get()->result_array(); 
        if(empty($records)){
            return false;
        }else{
            if($id == 0){
                return $records[0];
            }
            else {
                $currentDataNumber = 0;
                $count = count($records);
                for($i = 0; $i< $count; $i++){
                    if($records[$i]['ID'] == $id){
                        $currentDataNumber = $i;
                    }
                }

                if($direction == 0){   // next
                    if($currentDataNumber + 1 == $count){
                        return $records[0];
                    }
                    else {
                        return $records[$currentDataNumber+1];
                    }                    
                 }
                 else {           // prev
                    if($currentDataNumber == 0){
                        return $records[$count-1];
                    } 
                    else {
                        return $records[$currentDataNumber-1];
                    }  
                }
            }
        }
    }



    public function getAllDataForPdf($recordSelectedList)
    {

        $result = array();

        $this->db->select('*');
        $this->db->where_in('ID', $recordSelectedList);
        $this->db->from('tblDeals');
        $this->db->order_by('EqCategory');
        $this->db->order_by('EndDate');
        $result = $this->db->get()->result_array();
        return $result;
    }

    public function getAllDataForFbPublish($recordID)
    {
        $this->db->select('*');
        $this->db->where('ID', $recordID);
        $this->db->from('tblDeals');
        $result =  $this->db->get()->row_array();
        return $result;
    }

    public function getTruck($id)
    {

        $this->db->select('*');
        $this->db->where('ID', $id);
        $this->db->from('tblDeals');

        return $this->db->get()->row_array();
    }



    public function deleteTruck($ID)
    {

        $this->db->where('ID', $ID);
        $result =  $this->db->delete('tblDeals');

        return $result;
    }

    public function getTruckById($id) {
        $this->db->select('*');
        $this->db->where('ID', $id);
        $this->db->from('viewActiveDeals');
        $result =  $this->db->get()->row_array();
        return $result;
    }

    public function getTruckCountByDateAdded($date) {
        $query = $this->db->query('SELECT COUNT(UserID) as num from tblDeals WHERE DateAdded like "'.$date.'%"');
        $row  = $query->row();
        return $row->num;
    }

    public function getTruckCountByDateAdded_User($date, $user) {
        $query = $this->db->query('SELECT COUNT(UserID) as num from tblDeals WHERE DateAdded like "'.$date.'%" and UserID = '.$user);
        $row  = $query->row();
        return $row->num;
    }
    
    public function getTotalTruckCountByDateAdded($date) {
        $query = $this->db->query('SELECT COUNT(UserID) as num from tblDeals WHERE DateAdded <= "'.$date.' 23:59:59"');
        $row = $query->row();
        return $row->num;
    }


    public function getTruckCountByUserID($UserID, $startDate, $endDate, $interval)
    {
        $query = '';
        if ($interval == 2)
            $query =  $this->db->query('SELECT COUNT(UserID) as num FROM viewActiveDeals WHERE UserID=' . $UserID);                    
        else 
            $query =  $this->db->query('SELECT COUNT(UserID) as num FROM tblDeals WHERE UserID=' . $UserID . ' AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '"');        

        $row = $query->row();
        return  $row->num;
    }

    public function getAllCategory()
    {
        $query =  $this->db->query('SELECT DISTINCT EqCategory  FROM tblDeals ');
        $result = $query->result_array();

        return  $result;
    }

    public function getTruckCountByCategoryName($categoryName, $interval, $startDate, $endDate)
    {
        if ($interval == 2) {
            $this->db->select('ID');
            $this->db->from('viewActiveDeals');
            $this->db->where('EqCategory', $categoryName);            
        }
        else {
            $this->db->select('ID');
            $this->db->from('tblDeals');
            $this->db->where('EqCategory', $categoryName);
            $this->db->where('DateAdded >', $startDate . " 00:00:00");
            $this->db->where('DateAdded <', $endDate . " 23:59:59");            
        }
        return  $this->db->count_all_results();        
    }

    public function getTruckCountByCategoryName_user_date($categoryName, $user, $startDate, $endDate) {
        $query =  $this->db->query('SELECT COUNT(DealType) as num FROM tblDeals WHERE EqCategory="' . $categoryName . '" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '" and UserID = '.$user);
        $row = $query->row();
        return $row->num;
    }

    public function getAllDealType() {
        $query =  $this->db->query('SELECT DISTINCT DealType  FROM tblDeals ');
        $result = $query->result_array();

        return  $result;
    }

    public function getTruckCountByDealType($dealType, $interval, $startDate, $endDate) {
        if ($interval == 2) {
            $this->db->select('ID');
            $this->db->from('viewActiveDeals');
            $this->db->where('DealType', $dealType);            
        }
        else {
            $this->db->select('ID');
            $this->db->from('tblDeals');
            $this->db->where('DealType', $dealType);
            $this->db->where('DateAdded >', $startDate . " 00:00:00");
            $this->db->where('DateAdded <', $endDate . " 23:59:59");            
        }
        return  $this->db->count_all_results();        
    }

    public function getExpiredTruckCount($startDate, $endDate) {
        $now = date('Y-m-d');        

        $query =  $this->db->query('SELECT COUNT(DealType) as num FROM tblDeals WHERE DealType="Auction" AND EndDate < "'.$now.'" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '"');
        $row = $query->row();
        return $row->num;
    }

    public function getExpiringInWeekTruckCount($interval, $startDate, $endDate) {
        $now = date('Y-m-d');
        $week = date('Y-m-d', strtotime("+1 week"));
        $query = '';

        if ($interval == 2) {
            $query =  $this->db->query('SELECT COUNT(DealType) as num FROM viewActiveDeals WHERE DealType="Auction" AND EndDate >= "'.$now.'" AND EndDate <= "'. $week .'"');
        }
        else {
            $query =  $this->db->query('SELECT COUNT(DealType) as num FROM tblDeals WHERE DealType="Auction" AND EndDate >= "'.$now.'" AND EndDate <= "'. $week .'" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '"');
        }

        $row = $query->row();
        return $row->num;
    }

    public function getTruckCountByDealType_user_date($dealType, $user, $startDate, $endDate) {
        $query =  $this->db->query('SELECT COUNT(DealType) as num FROM tblDeals WHERE DealType="' . $dealType . '" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '" and UserID = '.$user);
        $row = $query->row();
        return $row->num;
    }

    public function getExpiredAuctionCountByUserDate($user, $startDate, $endDate) {
        $now = date('Y-m-d');

        $query =  $this->db->query('SELECT COUNT(DealType) as num FROM tblDeals WHERE DealType="Auction" AND EndDate < "'.$now.'" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '" and UserID = '.$user);
        $row = $query->row();
        return $row->num;
    }

    public function getExpriedAuctionCountInWeekByUserDate($user, $startDate, $endDate) {
        $now = date('Y-m-d');
        $week = date('Y-m-d', strtotime("+1 week"));

        $query =  $this->db->query('SELECT COUNT(DealType) as num FROM tblDeals WHERE DealType="Auction" AND EndDate >= "'.$now.'" AND EndDate < "'. $week .'" AND  DateAdded >= "' . $startDate . " 00:00:00" . '" AND  DateAdded <= "' . $endDate . " 23:59:59" . '" and UserID = '.$user);
        $row = $query->row();
        return $row->num;
    }


    public function getAllPastData(
        $minYear,
        $maxYear,
        $minAucDate,
        $maxAucDate,
        $minTotal,
        $maxTotal,        
        $minFinal,
        $maxFinal,
        $minLiftCapacity,
        $maxLiftCapacity,
        $search,
        $start,
        $length,
        $category,
        $orderIndex,
        $sort
    ) {
        $field = '';
        if ($orderIndex == 7) {
            $field = 'DateAdded';
        } else if ($orderIndex == 6) {
            $field = 'Total';
        } else if ($orderIndex == 9) {
            $field = 'Capacity';
        } else if ($orderIndex == 5) {
            $field = 'EndDate';
        } else if ($orderIndex == 3) {
            $field = 'EqModel';
        }

        if ($category == "All Equipments") {
            $this->db->select('*');
            $this->db->order_by($field, $sort);
            $this->db->from('viewAuctionResults');
        } else {
            $this->db->select('*');
            $this->db->where('EqCategory', $category);
            $this->db->order_by($field, $sort);
            $this->db->from('viewAuctionResults');
        }

        if (!empty($minFinal))
            $this->db->where('FinalPrice >= ', $minFinal);
        if (!empty($maxFinal) || $maxFinal == '0')
            $this->db->where('FinalPrice <= ', $maxFinal);

        $result = $this->db->get()->result_array();

        $totalCount = count($result);

        $response1 = array();

        foreach ($result as $val) {
            $include = true;

            if (!empty($search)) {
                $words = explode("+", $search);

                foreach ($words as $searchText) {
                    $searchText = trim($searchText);
                    //echo $searchText;

                    if ($include == true) {

                        $include = false;

                        if (strripos($val['EqMake'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['EqModel'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Country'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['State'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['City'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Auctioneer'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['USERNAME'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['DealType'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['EqCategory'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['EqYear'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['EqSN'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckYear'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckMake'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckModel'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Engine'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckTrans'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['TruckCondition'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Capacity'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Length'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Suspension'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['HorsePower'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['ID'], $searchText) !== false) {
                            $include = true;
                        }  else if (strripos($val['Type'], $searchText) !== false) {
                            $include = true;
                        } else if (strripos($val['Hours'], $searchText) !== false) {
                            $include = true;
                        } else if ($val['Cab'] == '2' && strripos('Cabin', $searchText) !== false) {                    
                            $include = true;
                        } else if ($val['4WD'] == '2' && strripos('4WD', $searchText) !== false) {
                            $include = true;
                        } else if ($val['Ext'] == '2' && strripos('Ext', $searchText) !== false) {
                            $include = true;
                        } else if ($val['AuxHyd'] == '2' && strripos('AuxHyd', $searchText) !== false) {
                            $include = true;
                        } else if ($val['Ripper'] == '2' && strripos('Ripper', $searchText) !== false) {
                            $include = true;
                        } 
                    }
                }
            }

            if ($include == true) {

                $rangeYear = false;

                if (empty($minYear) && empty($maxYear)) {

                    $rangeYear = true;
                } else if (empty($minYear) && !empty($maxYear)) {

                    if ($val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                } else if (!empty($minYear) && empty($maxYear)) {

                    if ($val['EqYear'] >= $minYear) {

                        $rangeYear = true;
                    }
                } else {

                    if ($val['EqYear'] >= $minYear && $val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                }


                if ($rangeYear == true) {

                    $rangeAuctionDate = false;

                    if (empty($minAucDate) && empty($maxAucDate)) {

                        $rangeAuctionDate = true;
                    } else if (empty($minAucDate) && !empty($maxAucDate)) {

                        if ($val['EndDate'] <= $maxAucDate) {
                            $rangeAuctionDate = true;
                        }
                    } else if (!empty($minAucDate) && empty($maxAucDate)) {


                        if ($val['EndDate'] >= $minAucDate) {
                            $rangeAuctionDate = true;
                        }
                    } else {

                        if ($val['EndDate'] >= $minAucDate && $val['EndDate'] <= $maxAucDate) {
                            $rangeAuctionDate = true;
                        }
                    }

                    if ($rangeAuctionDate == true) {

                        $rangeTotal = false;

                        if (empty($maxTotal) && empty($minTotal)) {
                            $rangeTotal = true;
                        } else if (empty($minTotal) && !empty($maxTotal)) {
                            if ($val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        } else if (!empty($minTotal) && empty($maxTotal)) {
                            if ($val['Total'] >= $minTotal) {
                                $rangeTotal = true;
                            }
                        } else {
                            if ($val['Total'] >= $minTotal && $val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        }

                        if ($rangeTotal == true) {

                            $rangeLiftCapacity = false;


                            if (empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                $rangeLiftCapacity = true;
                            } else if (empty($minLiftCapacity) && !empty($maxLiftCapacity)) {

                                if ($val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else if (!empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                if ($val['Capacity'] >= $minLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else {

                                if ($val['Capacity'] >= $minLiftCapacity && $val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            }

                            if ($rangeLiftCapacity == true) {
                                /////////////// push ////////////////
                                
                                array_push($response1, $val);
                                
                            }
                        }
                    }
                }
            }
        }

        $differences = array();

        for ($i = 0; $i < count($response1); $i++) {
            if ($response1[$i]['FinalPrice'] > 0) {
                $differences[] = ($response1[$i]['Price'] - $response1[$i]['FinalPrice']);
            }
        }

        sort($differences);

        $count = sizeof($differences);
        $average = 0;
        $median = 0;
        $index = floor($count / 2);
        if (!$count) {
            $average = "No Data";
            $median = "No Data";
        } else if ($count & 1) {
            $average = array_sum($differences) / $count;
            $median = $differences[$index];
        } else {
            $average = array_sum($differences) / $count;
            $median = ($differences[$index-1] + $differences[$index]) / 2;
        }

        $realDataCount = count($response1);

        $response2 = array();
        $lastIndex = 0;

        if ($length == -1) {
            $response2 = $response1;
        } else {
            $lastIndex = $realDataCount > ($start + $length)  ? ($start + $length) : $realDataCount;
            for ($i = $start; $i < $lastIndex; $i++) {
                array_push($response2, $response1[$i]);
            }
        }

        return array('recordsTotal' => $totalCount, 'recordsFiltered' => $realDataCount, 'data' => $response2, 'average' => $average, 'median' => $median);
    }

    public function getAuctionResultDataForExcel(
        $minYear,
        $maxYear,
        $minAucDate,
        $maxAucDate,
        $minTotal,
        $maxTotal,
        $minFinal,
        $maxFinal,
        $minLiftCapacity,
        $maxLiftCapacity,
        $searchText,     
        $category      
    ) {
       

        if ($category == "All Equipments") {
            $this->db->select('*');         
            $this->db->from('viewAuctionResults');
        } else {
            $this->db->select('*');
            $this->db->where('EqCategory', $category);        
            $this->db->from('viewAuctionResults');
        }

        $result = $this->db->get()->result_array();

        $totalCount = count($result);

        $response1 = array();

        foreach ($result as $val) {
            $include = true;

            if (!empty($searchText)) {

                $include = false;

                if (strripos($val['EqMake'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['EqModel'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Country'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['State'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['City'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['Auctioneer'], $searchText) !== false) {
                    $include = true;
                } else if (strripos($val['USERNAME'], $searchText) !== false) {
                    $include = true;
                }
            }



            if ($include == true) {

                $rangeYear = false;

                if (empty($minYear) && empty($maxYear)) {

                    $rangeYear = true;
                } else if (empty($minYear) && !empty($maxYear)) {

                    if ($val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                } else if (!empty($minYear) && empty($maxYear)) {

                    if ($val['EqYear'] >= $minYear) {

                        $rangeYear = true;
                    }
                } else {

                    if ($val['EqYear'] >= $minYear && $val['EqYear'] <= $maxYear) {

                        $rangeYear = true;
                    }
                }


                if ($rangeYear == true) {

                    $rangeAuctionDate = false;

                    if (empty($minAucDate) && empty($maxAucDate)) {

                        $rangeAuctionDate = true;
                    } else if (empty($minAucDate) && !empty($maxAucDate)) {

                        if ($val['EndDate'] <= $maxAucDate) {
                            $rangeAuctionDate = true;
                        }
                    } else if (!empty($minAucDate) && empty($maxAucDate)) {


                        if ($val['EndDate'] >= $minAucDate) {
                            $rangeAuctionDate = true;
                        }
                    } else {

                        if ($val['EndDate'] >= $minAucDate && $val['EndDate'] <= $maxAucDate) {
                            $rangeAuctionDate = true;
                        }
                    }

                    if ($rangeAuctionDate == true) {

                        $rangeTotal = false;

                        if (empty($maxTotal) && empty($minTotal)) {
                            $rangeTotal = true;
                        } else if (empty($minTotal) && !empty($maxTotal)) {
                            if ($val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        } else if (!empty($minTotal) && empty($maxTotal)) {
                            if ($val['Total'] >= $minTotal) {
                                $rangeTotal = true;
                            }
                        } else {
                            if ($val['Total'] >= $minTotal && $val['Total'] <= $maxTotal) {
                                $rangeTotal = true;
                            }
                        }

                        if ($rangeTotal == true) {

                            $rangeLiftCapacity = false;


                            if (empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                $rangeLiftCapacity = true;
                            } else if (empty($minLiftCapacity) && !empty($maxLiftCapacity)) {

                                if ($val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else if (!empty($minLiftCapacity) && empty($maxLiftCapacity)) {

                                if ($val['Capacity'] >= $minLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            } else {

                                if ($val['Capacity'] >= $minLiftCapacity && $val['Capacity'] <= $maxLiftCapacity) {

                                    $rangeLiftCapacity = true;
                                }
                            }

                            if ($rangeLiftCapacity == true) {
                                $rangeFinal = false;

                                if (empty($maxFianl) && empty($minFinal)) {
                                    $rangeFinal = true;
                                } else if (empty($minFinal) && !empty($maxFianl)) {
                                    if ($val['FinalPrice'] <= $maxFianl) {
                                        $rangeFinal = true;
                                    }
                                } else if (!empty($minFinal) && empty($maxFianl)) {
                                    if ($val['FinalPrice'] >= $minFinal) {
                                        $rangeFinal = true;
                                    }
                                } else {
                                    if ($val['FinalPrice'] >= $minFinal && $val['FinalPrice'] <= $maxFianl) {
                                        $rangeFinal = true;
                                    }
                                }

                                if ($rangeFinal == true) {
                                    array_push($response1, $val);
                                }                                
                            }
                        }
                    }
                }
            }
        }

        $realDataCount = count($response1);

        $headerArray = array(
             'EqCategory', 'EqYear', 'EqMake', 'EqModel', 'Capacity',
            'Country', 'State', 'City', 'EndDate',
            'Auctioneer', 'BuyPremium', 'Price', 'FinalPrice', 'Shipping', 'Customs',
            'Commission', 'Total', 'UserName', 'DateAdded'
        );

        $result = array();
        array_push($result, $headerArray);

        foreach ($response1 as $res) {

            $record = array();
           
            array_push($record, $res['EqCategory']);
            array_push($record, $res['EqYear']);
            array_push($record, $res['EqMake']);
            array_push($record, $res['EqModel']);
            array_push($record, $res['Capacity']);
            array_push($record, $res['Country']);
            array_push($record, $res['State']);
            array_push($record, $res['City']);           
            array_push($record, $res['EndDate']);
            array_push($record, $res['Auctioneer']);
            array_push($record, $res['BuyPremium']);
            array_push($record, $res['Price']);
            array_push($record, $res['FinalPrice']);
            array_push($record, $res['Shipping']);
            array_push($record, $res['Customs']);
            array_push($record, $res['Commission']);          
            array_push($record, $res['Total']);
            array_push($record, $res['USERNAME']);
            array_push($record, $res['DateAdded']);
          
            array_push($result, $record);
        }
        return $result;
    }

    public function findLink($link){
        if (strpos($link, 'https://www.rbauction.com/') !== false) {
            $invIdPos = strpos($link, 'invId');
            $idPos = strpos($link, '&id');
            $invId = substr($link, $invIdPos + 6, 8);

            $this->db->select('ID');
            $this->db->where('SourceID', $invId);
            $this->db->from('tblDeals');
            $result = $this->db->get()->row_array();

            if ($result != null)
                return $result['ID'];

            return null;
        }
        else {
            $this->db->select('ID');
            $this->db->where('Link', $link);
            $this->db->from('tblDeals');
            $result = $this->db->get()->row_array();
            return $result['ID'];
        }
    }

    public function getPublishIndex($title, $table) {
        $machinary_db = $this->load->database('machinary_db', true);

        // Get Brand ID
        $id = 0;
        $machinary_db->select('id');
        $machinary_db->where('title', $title);
        $machinary_db->limit(1);
        $machinary_db->from($table);
        $result = $machinary_db->get()->row_array();


        if ($result == null) {
            $machinary_db->insert($table, array('title' => $title));
            $id = $machinary_db->insert_id();
        }
        else
            $id = $result['id'];

        return $id;
    }

    public function checkPublishable($category) {
        $category_name = $this->categoryName[$category][0];
        $subcate_name = $this->categoryName[$category][1];

        if ($category_name == 1 && $subcate_name == 1)
            return false;
            
        return true;
    }

    public function publishToMachinary($title, $price, $category, $year, $brand, $model, $location, $sale_mode, $description, $image, $type) {
        $machinary_db = $this->load->database('machinary_db', true);

        // Get Brand ID, Model_ID, Location_ID, Sale_Mode_ID        

        $brand_id = $this->getPublishIndex($brand, 'maquin_brand');
        $model_id = $this->getPublishIndex($model, 'maquin_model');
        $location_id = $this->getPublishIndex($location, 'maquin_location');
        $sale_mode_id = $this->getPublishIndex($sale_mode, 'maquin_salesmode');        
        
        $category_name = $this->categoryName[$category][0];
        $subcate_name = $this->categoryName[$category][1];

        if ($category == 'Lift') {
            if ($type == 'Telescopic')
                $subcate_name = $this->categoryName[$category][2];
            else if ($type == 'Scissor')
                $subcate_name = $this->categoryName[$category][3];
        }
        else if ($category == 'Agriculture') {            
            if ($type == 'Tractor')
                $subcate_name = $this->categoryName[$category][3];
            else if ($type == 'Harvester')
                $subcate_name = $this->categoryName[$category][2];
            else if ($type == 'Other')
                $subcate_name = $this->categoryName[$category][4];
        }
        
        $machinary_db->insert('maquin_manageproduct', array(
            'productname' => $title,
            'description' => $description,
            'price' => $price,
            'categoryname' => $category_name,
            'subcategoryname' => $subcate_name,
            'model' => $model_id,
            'location' => $location_id,
            'brand' => $brand_id,
            'year' => $year,
            'salesmode' => $sale_mode_id,
            'video' => '',
            'status' => 1,
            'product_img' => $image,
            'info_text' => ''
        ));

        return $machinary_db->insert_id();        
    }

    public function add_machinary_link($deal_id, $machinary_id, $user_id) {
        $link =  'https://www.maquinariajr.com/producto.php?id='.$machinary_id;
        $this->db->where('ID', $deal_id);
        $this->db->update('tblDeals', array('MaquinariaJRLink' => $link, 'MJRPublishedBy' => $user_id));        
        return $link;
    }

    public function delete_machinary_link($deal_id) {
        $this->db->where('ID', $deal_id);
        $this->db->update('tblDeals', array('MaquinariaJRLink' => '', 'MJRPublishedBy' => ''));        
    }

    public function getMachinaryID($deal_id) {
        $this->db->select('MaquinariaJRLink');
        $this->db->where('ID', $deal_id);
        $this->db->from('tblDeals');
        $this->db->limit(1);
        $result = $this->db->get()->row_array();
        
        if ($result == null)
            return null;

        $link = $result['MaquinariaJRLink'];
        $link_parts = explode('?id=', $link);

        if (count($link_parts) < 2)
            return null;
        
        return $link_parts[1];
    }

    public function getMachinaryImage($machinaryID) {
        $machinary_db = $this->load->database('machinary_db', true);

        $machinary_db->select('product_img');
        $machinary_db->where('id', $machinaryID);
        $machinary_db->from('maquin_manageproduct');
        $machinary_db->limit(1);
        $result = $machinary_db->get()->row_array();

        if ($result == null)
            return null;
        
        return $result['product_img'];
    }

    public function delete_machinary_from_maquinaria($machinaryID) {
        $machinary_db = $this->load->database('machinary_db', true);
        
        $machinary_db->where('id', $machinaryID);
        $machinary_db->delete('maquin_manageproduct');

        return true;
    }

    public function getOutdatedDealsCountByUser($ID) {
        $this->db->select('ActiveDealTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $this->db->limit(1);
        $row = $this->db->get()->row_array();

        $activeDealTime = $row['ActiveDealTime'];

        $this->db->where('UserID', $ID);
        $date = date('Y-m-d H:i:s', strtotime('-'.($activeDealTime - 2).'days'));
        $dealTypeArray = array('Consignment', 'For Sale');
        $this->db->where_in('DealType', $dealTypeArray);
        $this->db->where('DateAdded <', $date);
        $this->db->from('viewActiveDeals');
        $count = $this->db->count_all_results();

        return $count;
    }

    public function getOutdatedDealsCount() {
        $this->db->select('ActiveDealTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $this->db->limit(1);
        $row = $this->db->get()->row_array();

        $activeDealTime = $row['ActiveDealTime'];

        $date = date('Y-m-d H:i:s', strtotime('-'.($activeDealTime - 2).'days'));
        $dealTypeArray = array('Consignment', 'For Sale');
        $this->db->where_in('DealType', $dealTypeArray);
        $this->db->where('DateAdded <', $date);
        $this->db->from('viewActiveDeals');
        $count = $this->db->count_all_results();

        return $count;
    }

    public function getPublishedDealsCountByUserDate($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('UserID', $user);
        $this->db->where('MaquinariaJRLink != ', '');
        $this->db->where('DateAdded >=', $startDate." 00:00:00");
        $this->db->where('DateAdded <=', $endDate." 23:55:55");
        $this->db->from('tblDeals');
        
        return $this->db->count_all_results();
    }

    public function getActivePublishedDealsCountByUserDate($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('UserID', $user);
        $this->db->where('MaquinariaJRLink != ', '');
        $this->db->where('DateAdded >=', $startDate." 00:00:00");
        $this->db->where('DateAdded <=', $endDate." 23:55:55");
        $this->db->from('viewActiveDeals');
        
        return $this->db->count_all_results();
    }

    public function getLeadsHaveLessThan4Pictures($user, $startDate, $endDate) {
        $this->db->select('tblDeals.ID');
        $this->db->from('tblDeals');
        $this->db->where('tblDeals.UserID', $user);        
        $this->db->where('tblDeals.DateAdded >=', $startDate." 00:00:00");
        $this->db->where('tblDeals.DateAdded <=', $endDate." 23:55:55");
        $result = $this->db->get()->result_array();

        if ($result == null)
            return 0;
        
        $count = 0;
        foreach ($result as $row) {
            $this->db->select('ID');
            $this->db->where('TruckID', $row['ID']);
            $this->db->where('Kind', 'picture');
            $this->db->from('tblresource');
            $picture_count = $this->db->count_all_results();

            if ($picture_count < 3)
                $count++;
        }

        return $count;
    }

    public function getActivePublishedDealsCount($interval, $startDate, $endDate) {
        if ($interval == 2) {
            $this->db->select('ID');
            $this->db->from('viewActiveDeals');
            $this->db->where('MaquinariaJRLink != ', '');         
        }
        else {
            $this->db->select('ID');
            $this->db->from('tblDeals');
            $this->db->where('MaquinariaJRLink != ', '');
            $this->db->where('DateAdded >', $startDate . " 00:00:00");
            $this->db->where('DateAdded <', $endDate . " 23:59:59");            
        }
        return  $this->db->count_all_results();       
    }

    public function getRbauctionsByUser($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('UserID', $user);
        $this->db->where('DealType', 'Auction');
        $this->db->like('LOWER(Link)', '//www.rbauction');
        $this->db->where('DateAdded >=', $startDate." 00:00:00");
        $this->db->where('DateAdded <=', $endDate." 23:55:55");
        $this->db->from('tblDeals');
        
        return $this->db->count_all_results();
    }

    public function getIronplanetByUser($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('UserID', $user);
        $this->db->where('DealType', 'Auction');
        $this->db->group_start();
        $this->db->like('LOWER(Link)', '//www.ironplanet');
        $this->db->or_like('LOWER(Link)', '//www.proxibid');
        $this->db->group_end();
        $this->db->where('DateAdded >=', $startDate." 00:00:00");
        $this->db->where('DateAdded <=', $endDate." 23:55:55");
        $this->db->from('tblDeals');
        
        return $this->db->count_all_results();
    }

    public function getAllAuctionsByUser($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('UserID', $user);
        $this->db->where('DealType', 'Auction');
        $this->db->where('DateAdded >=', $startDate." 00:00:00");
        $this->db->where('DateAdded <=', $endDate." 23:55:55");
        $this->db->from('tblDeals');
        
        return $this->db->count_all_results();
    }

    public function getForSaleTraderByUser($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('UserID', $user);
        $this->db->where('DealType', 'For Sale');
        $this->db->group_start();
        $this->db->like('LOWER(Link)', 'cranetrader');
        $this->db->or_like('LOWER(Link)', 'machinerytrader');
        $this->db->group_end();
        $this->db->where('DateAdded >=', $startDate." 00:00:00");
        $this->db->where('DateAdded <=', $endDate." 23:55:55");
        $this->db->from('tblDeals');

        return $this->db->count_all_results();
    }

    public function getAllForSaleByUser($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('UserID', $user);
        $this->db->where('DealType', 'For Sale');
        $this->db->where('DateAdded >=', $startDate." 00:00:00");
        $this->db->where('DateAdded <=', $endDate." 23:55:55");
        $this->db->from('tblDeals');
        
        return $this->db->count_all_results();
    }

    public function getAllConsignmentByUser($user, $startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('UserID', $user);
        $this->db->where('DealType', 'Consignment');
        $this->db->where('DateAdded >=', $startDate." 00:00:00");
        $this->db->where('DateAdded <=', $endDate." 23:55:55");
        $this->db->from('tblDeals');
        
        return $this->db->count_all_results();
    }

    public function getNoFianlPriceDealsCountByUser($user) {
        $this->db->select('ID');
        $this->db->where('FinalPrice', 0);
        $this->db->where('UserID', $user);
        $this->db->from('viewAuctionResults');
        return $this->db->count_all_results();
    }

    public function getAllAuctionResultsCountByUser($user) {
        $this->db->select('ID');
        $this->db->where('UserID', $user);
        $this->db->from('viewAuctionResults');
        return $this->db->count_all_results();
    }

    public function getActiveDealsCountByType($type) {
        $this->db->select('ID');
        $this->db->where('DealType', $type);
        $this->db->from('viewActiveDeals');
        return $this->db->count_all_results();
    }

    public function getAuctionInPeriod($startDate, $endDate) {
        $this->db->select('ID');
        $this->db->where('EndDate >=', $startDate);
        $this->db->where('EndDate <=', $endDate);
        $this->db->where('DealType', 'Auction');
        $this->db->from('viewActiveDeals');
        return $this->db->count_all_results();
    }

    public function getTodayDealsCountByType($type) {
        $today = date('Y-m-d');

        $this->db->select('ID');
        $this->db->where('DateAdded >=', $today.' 00:00:00');
        $this->db->where('DateAdded <=', $today.' 23:59:59');
        $this->db->where('DealType', $type);
        $this->db->from('tblDeals');

        return $this->db->count_all_results();
    }

    public function getLessPhotoDealsCount($UserID) {
        //$this->db->select('viewActiveDeals.ID');        
        
        $query = $this->db->query(
            "SELECT COUNT(*) as num FROM 
                ( SELECT COALESCE(count(tblresource.ID), 0) as PhotoCount 
                    FROM `viewActiveDeals` 
                        LEFT JOIN `tblresource` ON `viewActiveDeals`.`ID` = `tblresource`.`TruckID` 
                    WHERE `viewActiveDeals`.`UserID` = '" . $UserID. "' 
                    GROUP BY `viewActiveDeals`.`ID`
                ) 
                subquery 
            where PhotoCount < 3");

        $row = $query->row();
        return  $row->num;

        return $this->db->count_all_results();
    } 

    public function getDealAlertCount($UserID) {
        $this->db->select('ID');
        $this->db->where('UserID', $UserID);
        $this->db->where('MarkForExit', 'YES');
        $this->db->from('viewActiveDeals');
        return $this->db->count_all_results();
    }

    public function getSoldUploadedDealsCount($UserID, $startDate, $endDate) {
        $this->db->select('tblSales.ID, tblSales.DealID');
        $this->db->select('tblDeals.UserID');
        $this->db->join('tblDeals', 'tblSales.DealID = tblDeals.ID', 'left');
        $this->db->from('tblSales');
        $this->db->where('tblSales.DealID != 0');
        $this->db->where('tblSales.SalesStatus !=', 'Canceled');
        $this->db->where_in('tblSales.DealType', array('Auction', 'Inventory', 'For Sale', 'Consignment'));
        $this->db->where('tblDeals.DateAdded >=', $startDate.' 00:00:00');
        $this->db->where('tblDeals.DateAdded <=', $endDate.' 23:59:59');
        $this->db->where('tblDeals.UserID', $UserID);
        $this->db->group_by('tblSales.ID');
        $result = $this->db->get()->result_array();

        return count($result);
    }
}