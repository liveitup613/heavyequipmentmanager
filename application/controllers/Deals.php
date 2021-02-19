<?php
ini_set("log_errors", 1);
ini_set("error_log", $_SERVER['DOCUMENT_ROOT'] . "/logs/php-error.log");
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Facebook\Facebook;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;

class Deals extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        //MY_Output's disable_cache() method
        date_default_timezone_set('America/Phoenix');
        $this->output->disable_cache();

        if (!$this->session->has_userdata('ID') || $this->session->userdata('ID') == "")
            redirect('Login');

        $this->load->library('Simple_html_dom');
        $this->load->model('Log_model');
    }


    public function index()
    {        

        $this->load->model('User_model');

        $ID = $this->session->userdata('ID');
        $viewData = $this->User_model->getUserInfo($ID);

        $this->load->model('Deal_model');
        $viewData['OutDatedCount'] = $this->Deal_model->getOutdatedDealsCountByUser($ID);

        $viewData['LessPhotoCount'] = $this->Deal_model->getLessPhotoDealsCount($ID);

        $viewData['DealAlertCount'] = $this->Deal_model->getDealAlertCount($ID);

        $this->load->model('Assignment_model');
        $viewData['SearchHelpCount'] = $this->Assignment_model->getSearchHelpCount();

        

        $this->db->select('ActiveDealTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $this->db->limit(1);
        $row = $this->db->get()->row_array();

        $viewData['ActiveDealTime'] = $row['ActiveDealTime'];

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('management', $viewData);
    }

    public function watchlist()
    {

        $this->load->model('User_model');

        $ID = $this->session->userdata('ID');

        $viewData = $this->User_model->getUserInfo($ID);

        $this->load->model('Assignment_model');
        $viewData['SearchHelpCount'] = $this->Assignment_model->getSearchHelpCount();


        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('watchlist', $viewData);
    }


    public function addNewDeal()
    {
        $this->load->model('User_model');

        $ID = $this->session->userdata('ID');

        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('add-truck', $viewData);
    }

    public function statistic()
    {
        $this->load->model('User_model');

        $ID = $this->session->userdata('ID');

        $viewData = $this->User_model->getUserInfo($ID);

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $viewData['Lang'] = $language;

        $this->load->view('page-statistic', $viewData);
    }

    private function getPropertyAttribute($html, $filter, $attribute, $cnt)
    {
        $property = $html->find($filter);
        $response = array();

        for ($i = 0; $i < $cnt; $i++) {
            if (isset($property[$i])) {
                array_push($response, $property[$i]->getAttribute($attribute));
            } else
                array_push($response, "");
        }

        return $response;
    }

    private function getPropertyText($html, $filter)
    {
        $property = $html->find($filter);

        if (isset($property[0]))
            return $property[0]->innertext();
        else
            return "";
    }

    private function getPropertyByDataKey($html, $dataKey, $index)
    {
        $parent = $html->find('div[data-key="' . $dataKey . '"]');
        if (isset($parent[$index])) {
            $value = $parent[$index]->find('.static-value');
            return $value[0]->innertext();
        } else {
            return "";
        }
    }

    public function UploadPrimaryImage()
    {
        $avatar = "";
        $date = new DateTime();
        $filename = $date->getTimestamp();

        if (isset($_FILES["userImage"]["name"])) {
            $config['upload_path'] = 'assets/images/primaryImages/temp/';
            $config['allowed_types'] = 'jpg|jpeg|png|gif';
            $config['overwrite'] = true;
            $config['file_name'] = $filename;
            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('userImage')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('message' => $error, 'success' => false));
                return;
            }
            $data = $this->upload->data();
            $avatar = $data['file_name'];
        }

        if ($avatar == "") {
            echo json_encode(array('message' => "failed", 'success' => false));
            return;
        }

        echo json_encode(array('message' => "successed", 'success' => true, 'url' => base_url('assets/images/primaryImages/temp/' . $avatar)));
    }

    public function ScrapeWebsite()
    {
        $EqCategory = $this->input->post('EqCategory');
        $EqAuctioneer = $this->input->post('EqAuctioneer');
        $DealType = $this->input->post('DealType');

        $Link = $this->input->post('Link');

        $html = false;

        //  $mainUrlList = array('rbauction.com', 'ironplanet.com');

        if ($EqAuctioneer == 'Ritchie Bros') {
            if (strpos($Link, 'rbauction.com') !== false) {
                $html = file_get_html($Link);
            }
        } else if ($EqAuctioneer == 'Ironplanet') {
            if (strpos($Link, 'ironplanet.com') !== false) {
                $html = file_get_html($Link);
            }
        } else { }


        $response = array();

        if ($html != false) {

            if ($DealType == 'Auction') {

                if ($EqAuctioneer == "Ritchie Bros") {

                    // Primary Image
                    $images = $this->getPropertyAttribute($html, "img.rba-carousel-slide-image", "data-loadsrc", 3);
                    for ($i = 0; $i < 3; $i++) {
                        $image_replace = str_replace('400x300', '1920x1440', $images[$i]);
                        $images[$i] = "https://www.rbauction.com" . $image_replace;
                    }
                    $response['PrimaryImage'] =  $images;

                    //Start Date
                    $response["StartDate"] = $this->getPropertyText($html, "time.auction-date");

                    // Location
                    $response['Location'] = $this->getPropertyText($html, "a.auction-location-link");

                    // Year
                    $response['EqYear'] = $this->getPropertyText($html, "a.year");
                    if (empty($response['EqYear'])) {
                        $response['EqYear'] = trim($this->getPropertyByDataKey($html, "AS400YearOfManufacture", 0));
                    }

                    // Make
                    $response['EqMake'] = $this->getPropertyByDataKey($html, "BoomManufacturer", 0);
                    if (empty($response['EqMake'])) {
                        $response['EqMake'] = $this->getPropertyByDataKey($html, "AS400ManufacturerName", 0);
                    }

                    // Model
                    $response['EqModel'] = $this->getPropertyByDataKey($html, "BoomModel", 0);
                    if (empty($response['EqModel'])) {
                        $response['EqModel'] = $this->getPropertyByDataKey($html, "AS400ModelName", 0);
                    }

                    // Serial Number
                    $response['EqSN'] = $this->getPropertyByDataKey($html, "AS400SerialOrVehicleIdNumber", 0);


                    ////////////////////////// special data ///////////////////////////////////////////////////////

                    // Truck Year
                    $response['TruckYear'] = $this->getPropertyByDataKey($html, "AS400YearOfManufacture", 0);

                    // Truck Make
                    $response['TruckMake'] = $this->getPropertyByDataKey($html, "AS400ManufacturerName", 0);

                    // Condition
                    $response['TruckCondition'] = $this->getPropertyByDataKey($html, "AS400Odometer", 0);

                    // Engine 
                    $response['Engine'] = $this->getPropertyByDataKey($html, "Manufacturer", 1);

                    // TruckTrans                   
                    $response['TruckTrans'] = $this->getPropertyByDataKey($html, "Manufacturer", 0);

                    //Lift Capacity
                    $response['Capacity'] = $this->getPropertyByDataKey($html, "BoomWeight", 0);

                    //Length
                    $response['Length'] = $this->getPropertyByDataKey($html, "MaxLength", 0);

                    // 4wd(null-> 4*2 )
                    $Axle = $this->getPropertyByDataKey($html, "AxleConfiguration", 0);
                    if (empty($Axle)) {
                        $response['4WD'] = 0;
                    } else {
                        $response['4WD'] = 1;
                    }

                    // ext
                    $CW = $this->getPropertyByDataKey($html, "CW", 0);
                    if (strripos($CW, "extendahoe") !== false) {
                        $response['Ext'] = 1;
                    } else {
                        $response['Ext'] = 0;
                    }

                    //canopy
                    $cab = $this->getPropertyByDataKey($html, "CabCanopy", 0);
                    if (empty($cab)){
                        $response['Cab'] = 0;
                    } else {
                        $response['Cab'] = 1;
                    }

                    //AuxHyd
                    $Rear = $this->getPropertyByDataKey($html, "RearAuxiliaryHydraulics", 0);
                    if (empty($Rear)) {
                        $response['AuxHyd'] = 0;
                    } else {
                        $response['AuxHyd'] = 1;
                    }

                    //Hours
                    $response['Hours'] = intval($this->getPropertyByDataKey($html, "AS400Odometer", 0));

                    // meters
                    $response['Meters'] = 0;

                    //ripper
                    $response['Ripper'] = 0;

                    // Boom type
                    if ($EqCategory == 'Dozer') {

                        $temp = $this->getPropertyByDataKey($html, "AS400AssetType", 0);
                        if (strripos($temp, "crawler") !== false) {
                            $response['Type'] = "Crawler";
                        } else {
                            $response['Type'] = "Wheel";
                        }
                    } else if ($EqCategory == 'Generator') {

                        $temp = $this->getPropertyByDataKey($html, "CW", 0);
                        if (strripos($temp, "Diesel") !== false) {
                            $response['Type'] = 'Diesel';
                        } else {
                            $response['Type'] = 'Gas';
                        }
                    } else if ($EqCategory == 'Lift') {

                        $response['Type'] = 'Articulated';
                    } else {
                        $response['Type'] = 'Wheel';
                    }
                }
            } else {

                // Primary Image
                $images = $this->getPropertyAttribute($html, "img.rba-carousel-slide-image", "data-loadsrc", 3);
                for ($i = 0; $i < 3; $i++) {
                    $images[$i] = "https://www.rbauction.com" . $images[$i];
                }
                $response['PrimaryImage'] =  $images;

                //Start Date
                $response["StartDate"] = $this->getPropertyText($html, "time.auction-date");

                // Location
                $response['Location'] = $this->getPropertyText($html, "a.auction-location-link");

                // Year
                $response['EqYear'] = $this->getPropertyText($html, "a.year");

                // Make
                $response['EqMake'] = $this->getPropertyByDataKey($html, "BoomManufacturer", 0);

                // Model
                $response['EqModel'] = $this->getPropertyByDataKey($html, "BoomModel", 0);

                // Serial Number
                $response['EqSN'] = $this->getPropertyByDataKey($html, "AS400SerialOrVehicleIdNumber", 0);


                ////////////////////////// special data ///////////////////////////////////////////////////////

                // Truck Year
                $response['TruckYear'] = $this->getPropertyByDataKey($html, "AS400YearOfManufacture", 0);

                // Truck Make
                $response['TruckMake'] = $this->getPropertyByDataKey($html, "AS400ManufacturerName", 0);

                // Condition
                $response['TruckCondition'] = $this->getPropertyByDataKey($html, "AS400Odometer", 0);

                // Engine 
                $response['Engine'] = $this->getPropertyByDataKey($html, "Manufacturer", 1);

                // TruckTrans                   
                $response['TruckTrans'] = $this->getPropertyByDataKey($html, "Manufacturer", 0);

                //Lift Capacity
                $response['Capacity'] = $this->getPropertyByDataKey($html, "BoomWeight", 0);

                //Length
                $response['Length'] = $this->getPropertyByDataKey($html, "MaxLength", 0);

                // 4wd(null-> 4*2 )
                $Axle = $this->getPropertyByDataKey($html, "AxleConfiguration", 0);
                if (empty($Axle)) {
                    $response['4WD'] = 0;
                } else {
                    $response['4WD'] = 1;
                }

                // ext
                $CW = $this->getPropertyByDataKey($html, "CW", 0);
                if (strripos($CW, "extendahoe") !== false) {
                    $response['Ext'] = 1;
                } else {
                    $response['Ext'] = 0;
                }

                //canopy
                $CW = $this->getPropertyByDataKey($html, "CW", 0);
                if (strripos($CW, "canopy") !== false) {
                    $response['Cab'] = 0;
                } else {
                    $response['Cab'] = 1;
                }

                //AuxHyd
                $Rear = $this->getPropertyByDataKey($html, "RearAuxiliaryHydraulics", 0);
                if (empty($Rear)) {
                    $response['AuxHyd'] = 0;
                } else {
                    $response['AuxHyd'] = 1;
                }

                //Hours
                $response['Hours'] = intval($this->getPropertyByDataKey($html, "AS400Odometer", 0));

                // meters
                $response['Meters'] = 0;

                //ripper
                $response['Ripper'] = 0;

                // Boom type
                if ($EqCategory == 'Dozer') {

                    $temp = $this->getPropertyByDataKey($html, "AS400AssetType", 0);
                    if (strripos($temp, "crawler") !== false) {
                        $response['Type'] = "Crawler";
                    } else {
                        $response['Type'] = "Wheel";
                    }
                } else if ($EqCategory == 'Generator') {

                    $temp = $this->getPropertyByDataKey($html, "CW", 0);
                    if (strripos($temp, "Diesel") !== false) {
                        $response['Type'] = 'Diesel';
                    } else {
                        $response['Type'] = 'Gas';
                    }
                } else if ($EqCategory == 'Lift') {

                    $response['Type'] = 'Articulated';
                } else {
                    $response['Type'] = 'Wheel';
                }
            }


            echo json_encode($response);
        } else {
            echo "failed";
        }
        // echo $html;
    }

    public function estimatePrice() {
        $EqCategory = $this->input->post('EqCategory');
        $DealType = $this->input->post('DealType');
        $Year = $this->input->post('Year');
        $Make = $this->input->post('Make');
        $Model = $this->input->post('Model');
        $_4WD = $this->input->post('4WD');
        $Ext = $this->input->post('Ext');
        $AuxHyd = $this->input->post('AuxHyd');
        $Cabin = $this->input->post('Cabin');
        $Country = $this->input->post('Country');
        $State = $this->input->post('State');                

        $criteria = array();
        $criteria['EqCategory'] = $EqCategory;
        if ($_4WD != '')
            $criteria['4WD'] = $_4WD;
        if ($Ext != '')
            $criteria['Ext'] = $Ext;        
        if ($AuxHyd != '')
            $criteria['AuxHyd'] = $AuxHyd;
        if ($Cabin != '')
            $criteria['Cab'] = $Cabin;
        if ($Make != '')
            $criteria['EqMake'] = $Make;    
        if ($Model != '')
            $criteria['EqModel'] = $Model;

        // Search on For Sales
        $PriceColumn = array('Price', 'Customs');
        $ReturnArray = array();

        // Calculate the PriceToBet

        if ($DealType != 'Auction') {
            $ReturnArray['Price']  = 0;
        }
        else {

            if ($EqCategory == 'Loader Backhoe')
            {
                $isPriceSet = false;
                // Search on For Sales
                //echo $Column;
                $this->db->select('Price');            
                $this->db->where($criteria);        
                $this->db->where('DealType', 'For Sale');
                $this->db->limit(2);
                $this->db->order_by('DateAdded', 'desc');
                $this->db->from('tblDeals');
                if ($Year != '')
                    $this->db->where('EqYear', $Year);            
                $result = $this->db->get()->result_array();

                //echo json_encode($result);

                $AveragePrice = $this->getAverageValue($result, 'Price');
                if ($AveragePrice != 0) {
                    $ReturnArray['Price'] = $AveragePrice * 0.85;                
                    $isPriceSet = true;
                }

                // Search on For Sale with 3 Years;
                if ($Year != '' && $isPriceSet == false){
                    $YearArray = array($Year - 1, $Year + 1);                
                    $this->db->select('Price');
                    $this->db->where($criteria);        
                    $this->db->where('DealType', 'For Sale');
                    $this->db->where_in('EqYear', $YearArray);
                    $this->db->limit(2);
                    $this->db->order_by('DateAdded', 'desc');
                    $this->db->from('tblDeals');        
                    $result = $this->db->get()->result_array();

                    //echo json_encode($result);

                    $AveragePrice = $this->getAverageValue($result, 'Price');
                    if ($AveragePrice != 0) {
                        $ReturnArray['Price'] = $AveragePrice * 0.85;
                        $isPriceSet = true;
                    }
                }

                // Search for Aution Result      
                
                if ($isPriceSet == false) {
                    $this->db->select('FinalPrice');
                    $this->db->where('FinalPrice !=', 0);            
                    $this->db->where($criteria);        
                    $this->db->limit(2);
                    $this->db->order_by('EndDate', 'desc');
                    $this->db->from('viewAuctionResults');
                    if ($Year != '')
                        $this->db->where('EqYear', $Year);
                    $result = $this->db->get()->result_array();

                    //echo json_encode($result);

                    $AveragePrice = $this->getAverageValue($result, 'FinalPrice');
                    if ($AveragePrice != 0) {
                        $ReturnArray['Price'] = $AveragePrice;
                        $isPriceSet = true;
                    }
                }
                

                // Search For Auctoion Result with 3 Years

                if ($Year != '' && $isPriceSet == false){
                    $YearArray = array($Year - 1, $Year + 1);    
                    $this->db->select('FinalPrice');
                    $this->db->where('FinalPrice !=', 0);                    
                    $this->db->where($criteria);        
                    $this->db->limit(2);
                    $this->db->order_by('EndDate', 'desc');
                    $this->db->where_in('EqYear', $YearArray);
                    $this->db->from('viewAuctionResults');                
                    $result = $this->db->get()->result_array();

                    //echo json_encode($result);

                    $AveragePrice = $this->getAverageValue($result, 'FinalPrice');
                    if ($AveragePrice != 0) {
                        $ReturnArray['Price'] = $AveragePrice;  
                        $isPriceSet = true;                  
                    }
                }

                if ($isPriceSet == false)
                    $ReturnArray['Price'] = 0;
            }
            else{
                $ReturnArray['Price'] = 0;
            }
            
        }    
        
        // Calculate the Customs

        if ($DealType == 'Auction' || $DealType == 'For Sale') {
            $this->db->select('Customs');
            $this->db->where('EqCategory', $EqCategory);
            $this->db->where_in('EqYear', array($Year - 1, $Year, $Year + 1));
            $this->db->order_by('DateAdded', 'desc');
            $this->db->limit(5);
            $this->db->from('tblDeals');
            $result = $this->db->get()->result_array();

            $ReturnArray['Customs'] = $this->getAverageValue($result, 'Customs');
        }
        else {
            $ReturnArray['Customs'] = 0;
        }

        // Calculate for Shipping
        if ($DealType == 'Auction' || $DealType == 'For Sale') {
            $this->db->select('Shipping');
            $this->db->where('EqCategory', $EqCategory);
            if ($Country != '')
                $this->db->where('Country', $Country);
            if ($State != '')  
                $this->db->where('State', $State);
            $this->db->where_in('DealType', array('Auction', 'For Sale'));
            $this->db->limit(5);
            $this->db->order_by('DateAdded', 'desc');
            $this->db->from('tblDeals');
            $result = $this->db->get()->result_array();

            //echo json_encode($result);  

            $ReturnArray['Shipping'] = $this->getAverageValue($result, 'Shipping');
        }
        else {
            $ReturnArray['Shipping'] = 0;
        }
        
        
        echo json_encode(array(
            'success' => true,
            'data' => $ReturnArray
        ));
    }

    public function getAverageValue($result, $Column) {
        if ($result != null) {
            $Total_Price = 0;
            $Average = 0;
            $Cnt = 0;

            foreach ($result as $row) {
                $Total_Price += $row[$Column];
                $Cnt++;
            }
            
            $Average = $Total_Price / $Cnt;            
            return $Average;            
        }
        return 0;
    }

    public function AddNewTruck()
    {

        $this->load->model('Deal_model');
        $eqCategory = $this->input->post("EqCategory");
        $dealType = $this->input->post('DealType');

        $mkTitle = $this->input->post('mkTitle');
        $mkDescription = $this->input->post('mkDescription');
        $EqYear = $this->input->post('EqYear');
        $EqMake = $this->input->post('EqMake');
        $EqModel = $this->input->post('EqModel');
        $EqSN = $this->input->post('EqSN');
        $Country = $this->input->post('Country');
        $State = $this->input->post('State');
        $City = $this->input->post('City');
        $StartDate = $this->input->post('StartDate');
        $EndDate = $this->input->post('EndDate');
        $Auctioneer = $this->input->post('Auctioneer');
        $Link = $this->input->post('Link');
        $BuyPremium = $this->input->post('BuyPremium');
        $Price = $this->input->post('Price');
        $Shipping = $this->input->post('Shipping');
        $Customs = $this->input->post('Customs');
        $Commission = $this->input->post('Commission');
        $PrimaryImage = "";
        $Total = $this->input->post('Total');
        $UserID = $this->input->post('userId');
        $DateAdded = date('Y-m-d H:i:s');
        $Contact = $this->input->post('Contact');
        $ContactPhone = $this->input->post('FullContactPhone');
        $CompanyName = $this->input->post('CompanyName');
        $Margin = $this->input->post('Margin');
        $Warehouse = $this->input->post('Warehouse');
        $Suspension = $this->input->post('Suspension');
        $HorsePower = $this->input->post('HorsePower');

        //// special fields///////
        $TruckYear = $this->input->post('TruckYear');
        $TruckMake = $this->input->post('TruckMake');
        $TruckModel =  $this->input->post('TruckModel');
        $Engine =  $this->input->post('Engine');
        $TruckTrans =  $this->input->post('TruckTrans');
        $TruckCondition =  $this->input->post('TruckCondition');
        $TruckConditionUnit = $this->input->post('TruckCondUnit');
        $Capacity =  $this->input->post('Capacity');
        $Meters =  $this->input->post('Meters');
        $Length =  $this->input->post('Length');
        $LengthUnit = $this->input->post('LengthUnit');
        $Type =  $this->input->post('Type');
        $Hours =  $this->input->post('Hours');
        $Cab =  $this->input->post('Cab');
        $wd =  $this->input->post('4WD');
        $Ext =  $this->input->post('Ext');
        $AuxHyd =  $this->input->post('AuxHyd');
        $Ripper = $this->input->post('Ripper');
        $Note = $this->input->post("Note");

        $truckData = array();
        $truckData['DealType'] = $dealType;
        $truckData['EqCategory'] = $eqCategory;
        $truckData['Note'] = $Note;

        if ($EqYear != NULL) {
            $truckData['EqYear'] = $EqYear;
        }
        else {
            if ($TruckYear != NULL) {
                $truckData['EqYear'] = $TruckYear;
            }
        }

        if ($EqMake != NULL) {
            $truckData['EqMake'] = $EqMake;
        }
        else {
            if ($TruckMake != NULL) {
                $truckData['EqMake'] = $TruckMake;
            }
        }

        if ($EqModel != NULL) {
            $truckData['EqModel'] = $EqModel;
        }
        else{
            if ($TruckModel != NULL) {
                $truckData['EqModel'] = $TruckModel;
            }
        }

        if ($EqSN != NULL) {
            $truckData['EqSN'] = $EqSN;
        }
        if ($Country != NULL) {
            $truckData['Country'] = $Country;
        }
        if ($State != NULL) {
            $truckData['State'] = $State;
        }
        if ($City != NULL) {
            $truckData['City'] = $City;
        }
        if ($Warehouse != NULL) {
            $truckData['Warehouse'] = $Warehouse;
        }

        if ($StartDate != NULL) {
            $truckData['StartDate'] = $StartDate;
        }
        if ($EndDate != NULL) {
            $truckData['EndDate'] = $EndDate;
        }
        if ($Auctioneer != NULL) {
            if ($dealType == 'Auction') {
                $truckData['Auctioneer'] = $Auctioneer;
            } else {
                $truckData['Auctioneer'] = '';
            }
        }
        if ($Contact != NULL) {
            $truckData['Contact'] = $Contact;
        }
        if ($ContactPhone != NULL) {
            $truckData['ContactPhone'] = $ContactPhone;
        }
        if ($CompanyName != NULL) {
            $truckData['CompanyName'] = $CompanyName;
        }
        if ($Link != NULL) {
            $truckData['Link'] = $Link;
            if (strpos($Link, 'https://www.rbauction.com/') !== false) {
                $invIdPos = strpos($Link, 'invId');
                $idPos = strpos($Link, '&id');
                $invId = substr($Link, $invIdPos + 6, 8);
                $truckData['SourceID'] = $invId;
            }
        }
        if ($BuyPremium != NULL) {
            $truckData['BuyPremium'] = $BuyPremium;
        }
        if ($Price != NULL) {
            $truckData['Price'] = $Price;
        }
        if ($Margin != NULL) {
            $truckData['Margin'] = $Margin;
        }
        if ($Shipping != NULL) {
            $truckData['Shipping'] = $Shipping;
        }
        if ($Customs != NULL) {
            $truckData['Customs'] = $Customs;
        }
        if ($Commission != NULL) {
            $truckData['Commission'] = $Commission;
        }
        if ($Total != NULL) {
            $truckData['Total'] = $Total;
        }
        if ($mkTitle != NULL) {
            $truckData['mkTitle'] = $mkTitle;
        }
        if ($mkDescription != NULL) {
            $truckData['mkDescription'] = $mkDescription;
        }
        if ($PrimaryImage != NULL) {
            $truckData['PrimaryImage'] = $PrimaryImage;
        }
        if ($UserID != NULL) {
            $truckData['UserID'] = $UserID;
        }

        if ($DateAdded != NULL) {
            $truckData['DateAdded'] = $DateAdded;
        }
        if ($TruckYear != NULL) {
            $truckData['TruckYear'] = $TruckYear;
        }
        if ($TruckMake != NULL) {
            $truckData['TruckMake'] = $TruckMake;
        }
        if ($TruckModel != NULL) {
            $truckData['TruckModel'] = $TruckModel;
        }
        if ($Engine != NULL) {
            $truckData['Engine'] = $Engine;
        }
        if ($TruckTrans != NULL) {
            $truckData['TruckTrans'] = $TruckTrans;
        }
        if ($TruckCondition != NULL) {
            $truckData['TruckCondition'] = $TruckCondition . ' ' . $TruckConditionUnit;
        }
        if ($Capacity != NULL) {
            $truckData['Capacity'] = $Capacity;
        }
        if ($Meters != NULL) {
            $truckData['Meters'] = $Meters;
        }
        if ($Length != NULL) {
            $truckData['Length'] = $Length . ' ' . $LengthUnit;
        }
        if ($Type != NULL) {
            $truckData['Type'] = $Type;
        }
        if ($Hours != NULL) {
            $truckData['Hours'] = $Hours;
        }
        if ($Cab != NULL) {
            $truckData['Cab'] = $Cab;
        }
        if ($wd != NULL) {
            $truckData['4WD'] = $wd;
        }
        if ($Ext != NULL) {
            $truckData['Ext'] = $Ext;
        }
        if ($AuxHyd != NULL) {
            $truckData['AuxHyd'] = $AuxHyd;
        }
        if ($Ripper != NULL) {
            $truckData['Ripper'] = $Ripper;
        }
        if ($Suspension != NULL) {
            $truckData['Suspension'] = $Suspension;
        }
        if ($HorsePower != NULL) {
            $truckData['Ripper'] = $HorsePower;
        }


        $this->db->insert('tblDeals', $truckData);
        $getID = $this->db->insert_id();

        if ($getID == null) {

            //log
            $data = array(
                'UserID' => $this->session->userdata('ID'),
                'Action' => 'Add Deal',
                'Objective' => 'No ID',
                'Result' => 'error'
            );
            $this->Log_model->addLog($data);

            echo json_encode(array('success' => false, 'message' => 'Add Deal Error'));
            return;
        }

        $this->db->set('DealID', 'concat("HK", LPAD(ID, 6, "0"))', false);
        $this->db->where('ID', $getID);
        $this->db->update('tblDeals');

        $PrimaryImageUrl = $this->input->post('primaryImageUrl');
        //$fileExt = substr($PrimaryImageUrl, strlen($PrimaryImageUrl) - 4);
        $fileFilter = explode('.', $PrimaryImageUrl);
        $fileExt = $fileFilter[count($fileFilter) - 1];
        
        $date = new DateTime();
        $filename = $date->getTimestamp();

        $filename = 'deals' . $filename . '.' . $fileExt;

        $destUrl = 'assets/images/primaryImages/' . $filename;
        $thumbUrl = 'assets/images/thumbImages/'.$filename;

        // File Upload

        $image_content = file_get_contents($PrimaryImageUrl);
        file_put_contents($destUrl, $image_content);
        file_put_contents($thumbUrl, $image_content);
        $this->resizeImage($thumbUrl, 0, 150, true);

        //get image size
        $image = imagecreatefromstring($image_content);
        $width = imagesx($image);
        $height = imagesy($image);

        $AuctionUpdateData = array(
            "PrimaryImage" => $filename,
            "pmW" => $width,
            "pmH" => $height
        );

        $this->db->where('ID', $getID);
        $this->db->update('tblDeals', $AuctionUpdateData);

        // Add 10 Scrapped Photos 

        $html = false;

        if ($Auctioneer == 'Ritchie Bros') {
            if (strpos($Link, 'rbauction.com') !== false) {
                $html = file_get_html($Link);
            }
        }

        if ($html != false) {
            $scraped_images = $this->getPropertyAttribute($html, "img.rba-carousel-slide-image", "data-loadsrc", 10);
            $scraped_images_count = count($scraped_images);

            for ($i = 0; $i < 10 && $i < $scraped_images_count ; $i++) {
                $image_replace = str_replace('400x300', '1920x1440', $scraped_images[$i]);
                $sliderImageUrl = "https://www.rbauction.com" . $image_replace;

                if ($image_replace == '' || $sliderImageUrl == $PrimaryImageUrl)
                    continue;

                $fileFilter = explode('.', $sliderImageUrl);
                $fileExt = $fileFilter[count($fileFilter) - 1];
        
                $date = new DateTime();
                $filename = $date->getTimestamp();
        
                $filename = 'Truck' . $getID . $i . "_" . $filename . '.' . $fileExt;
        
                $destUrl = 'assets/images/sliderImages/' . $filename;
        
                // File Upload
        
                $image_content = file_get_contents($sliderImageUrl);
                file_put_contents($destUrl, $image_content);
        
                //get image size
                $image = imagecreatefromstring($image_content);
                $width = imagesx($image);
                $height = imagesy($image);
        
                $pictureData = array(
                    'TruckID' => $getID,
                    'Filename' =>  $filename,
                    'Kind' => 'picture',
                    'Width' => $width,
                    'Height' => $height
                );
                $this->db->insert('tblresource', $pictureData);
            }            
        }
        else {
            // Upload Resource Photos
            for ($i = 1; $i <= 3; $i++) {
                $sliderImageUrl = $this->input->post('scrappedImage'.$i);
                if ($sliderImageUrl == '' || $sliderImageUrl == $PrimaryImageUrl)
                    continue;

                $fileFilter = explode('.', $sliderImageUrl);
                $fileExt = $fileFilter[count($fileFilter) - 1];
        
                $date = new DateTime();
                $filename = $date->getTimestamp();
        
                $filename = 'Truck' . $getID . $i . "_" . $filename . '.'. $fileExt;
        
                $destUrl = 'assets/images/sliderImages/' . $filename;
        
                // File Upload
        
                $image_content = file_get_contents($sliderImageUrl);
                file_put_contents($destUrl, $image_content);
        
                //get image size
                $image = imagecreatefromstring($image_content);
                $width = imagesx($image);
                $height = imagesy($image);
        
                $pictureData = array(
                    'TruckID' => $getID,
                    'Filename' =>  $filename,
                    'Kind' => 'picture',
                    'Width' => $width,
                    'Height' => $height
                );
                $this->db->insert('tblresource', $pictureData);
            }
        }

        //Log 

        $data = array(
            'UserID' => $this->session->userdata('ID'),
            'Action' => 'Add Truck',
            'Objective' => $getID,
            'Result' => 'Success'
        );
        $this->Log_model->addLog($data);

        echo json_encode(array('success' => true, 'picture' => array('ID' => $getID, 'url' => base_url($destUrl), 'pmW' => $width, 'pmH' => $height)));
    }

    public function AddBannerPrimaryImage()
    {
        $ID = $this->input->post('ID');
        $imageData = $this->input->post('imgdata');
        $this->load->model('Deal_model');

        $image_parts = explode(";base64,", $imageData);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_type = $image_type_aux[1];
        $image_base64 = base64_decode($image_parts[1]);

        $image_info = getimagesizefromstring($image_base64);
        $width = $image_info[0];
        $height = $image_info[1];

        $date = new DateTime();
        $filename = 'TruckBanner' . $date->getTimestamp() . '.' . $image_type;

        $file = 'assets/images/primaryImages/' . $filename;
        file_put_contents($file, $image_base64);
        $data = array();
        $data['BannerPrimaryImage'] = $filename;
        $data['BannerPmW'] = $width;
        $data['BannerPmH'] = $height;

        $this->Deal_model->update(array('ID' => $ID), $data);
        echo json_encode($this->getAllMediaDataByID($ID));
    }

    public function getTruckData()
    {
        $this->load->model('Deal_model');
        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $minYear = $this->input->post('minYear');
        $maxYear = $this->input->post('maxYear');
        $minAucYear = $this->input->post('minAucYear');
        $maxAucYear = $this->input->post('maxAucYear');
        $minTotal = $this->input->post('minTotal');
        $maxTotal = $this->input->post('maxTotal');
        $minLiftCapacity = $this->input->post('minLiftCapacity');
        $maxLiftCapacity = $this->input->post('maxLiftCapacity');        
        $published = $this->input->post('published');
        $marked = $this->input->post('marked');

        $searchText = trim($this->input->post('searchText'));
        $categoryName = $this->input->post('categoryName');
        $dealType = $this->input->post('dealType');
        $start = $this->input->post('start');
        $length = $this->input->post('length');

        $data = $this->Deal_model->getAllData(
            $minYear,
            $maxYear,
            $minAucYear,
            $maxAucYear,
            $minTotal,
            $maxTotal,
            $minLiftCapacity,
            $maxLiftCapacity,
            $searchText,
            $start,
            $length,
            $published,
            $marked,
            $categoryName,
            $dealType,
            $orderIndex,
            $sort
        );

        for ($i = 0; $i < count($data['data']); $i++) {
            $thumbUrl = 'assets/images/thumbImages/'.$data['data'][$i]['PrimaryImage'];
            $PrimaryImage = 'assets/images/primaryImages/'.$data['data'][$i]['PrimaryImage'];

            if (!file_exists($thumbUrl) && file_exists($PrimaryImage)) {
                $imageData = file_get_contents($PrimaryImage);
                file_put_contents($thumbUrl, $imageData);
                $this->resizeImage($thumbUrl, 0, 150, true);
            }

            $data['data'][$i]['PostedPlatforms'] = $this->getPostedPlatforms($data['data'][$i]['ID']);
        }

        header('content-type:application/json');
        echo '{           
            "recordsTotal": ' . $data["recordsTotal"] . ',
            "recordsFiltered" : ' . $data["recordsFiltered"] . ',
            "data" : ' . json_encode($data["data"]) . '
        }';
    }

    public function getPostedPlatforms($DealID) { // Get social platforms that deal was posted by DealID.
        $this->load->model('Share_model');
        $Platforms = $this->Share_model->getPostedPlatforms($DealID);
        return $Platforms;
    }

    public function getDealDataForExcel()
    {
        $this->load->model('Deal_model');     
        $minYear = $this->input->post('minYear');
        $maxYear = $this->input->post('maxYear');
        $minAucYear = $this->input->post('minAucYear');
        $maxAucYear = $this->input->post('maxAucYear');
        $minTotal = $this->input->post('minTotal');
        $maxTotal = $this->input->post('maxTotal');
        $minLiftCapacity = $this->input->post('minLiftCapacity');
        $maxLiftCapacity = $this->input->post('maxLiftCapacity');


        $searchText = trim($this->input->post('searchText'));
        $categoryName = $this->input->post('categoryName');
        $dealType = $this->input->post('dealType');
      

        $data = $this->Deal_model->getAllDataForExcel(
            $minYear,
            $maxYear,
            $minAucYear,
            $maxAucYear,
            $minTotal,
            $maxTotal,
            $minLiftCapacity,
            $maxLiftCapacity,
            $searchText,        
            $categoryName,
            $dealType           
        );

        header('content-type:application/json');
        echo  json_encode($data) ;
    }


    public function getTruckDataForWatchList()
    {
        $this->load->model('Deal_model');
        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $minYear = $this->input->post('minYear');
        $maxYear = $this->input->post('maxYear');
        $minAucYear = $this->input->post('minAucYear');
        $maxAucYear = $this->input->post('maxAucYear');
        $minTotal = $this->input->post('minTotal');
        $maxTotal = $this->input->post('maxTotal');
        $minLiftCapacity = $this->input->post('minLiftCapacity');
        $maxLiftCapacity = $this->input->post('maxLiftCapacity');


        $searchText = trim($this->input->post('searchText'));
        $categoryName = $this->input->post('categoryName');
        $dealType = $this->input->post('dealType');
        $start = $this->input->post('start');
        $length = $this->input->post('length');

        $data = $this->Deal_model->getAllDataForWatchList(
            $minYear,
            $maxYear,
            $minAucYear,
            $maxAucYear,
            $minTotal,
            $maxTotal,
            $minLiftCapacity,
            $maxLiftCapacity,
            $searchText,
            $start,
            $length,
            $categoryName,
            $dealType,
            $orderIndex,
            $sort
        );

        header('content-type:application/json');
        echo '{           
            "recordsTotal": ' . $data["recordsTotal"] . ',
            "recordsFiltered" : ' . $data["recordsFiltered"] . ',
            "data" : ' . json_encode($data["data"]) . '
        }';
    }


    public function getWatchListDataForExcel()
    {
        $this->load->model('Deal_model');     
        $minYear = $this->input->post('minYear');
        $maxYear = $this->input->post('maxYear');
        $minAucYear = $this->input->post('minAucYear');
        $maxAucYear = $this->input->post('maxAucYear');
        $minTotal = $this->input->post('minTotal');
        $maxTotal = $this->input->post('maxTotal');
        $minLiftCapacity = $this->input->post('minLiftCapacity');
        $maxLiftCapacity = $this->input->post('maxLiftCapacity');


        $searchText = trim($this->input->post('searchText'));
        $categoryName = $this->input->post('categoryName');
        $dealType = $this->input->post('dealType');
      

        $data = $this->Deal_model->getWatchListDataForExcel(
            $minYear,
            $maxYear,
            $minAucYear,
            $maxAucYear,
            $minTotal,
            $maxTotal,
            $minLiftCapacity,
            $maxLiftCapacity,
            $searchText,        
            $categoryName,
            $dealType           
        );

        header('content-type:application/json');
        echo  json_encode($data) ;
    }


    public function getWatchListDataForTVmode()
    {
        $this->load->model('Deal_model');     
       

        $data = $this->Deal_model->getWatchListDataForTVmode( );

        header('content-type:application/json');
        echo  json_encode($data) ;
    }

    public function getTruckDataForPdf()
    {
        $this->load->model('Deal_model');
        $recordSelectedList = $this->input->post('recordSelectedList');
        $data = $this->Deal_model->getAllDataForPdf($recordSelectedList);

        header('content-type:application/json');
        echo  json_encode(array('data' => $data));
    }

    public function getTruckDataForFbPublish()
    {
        $this->load->model('Deal_model');
        $recordID = $this->input->post('recordID');
        $data = $this->Deal_model->getAllDataForFbPublish($recordID);

        echo json_encode($data);
    }

    public function AddTruckToWatchlist()
    {
        $TruckID = $this->input->post('ID');
        $userID = $this->session->userdata('ID');
        $data = array('UserID' => $userID, 'TruckID' => $TruckID);
        $this->db->insert('tblWatchList', $data);
        echo json_encode(array('success' => true));
    }

    public function setTvMode(){
        $this->load->model('Deal_model');
        $TruckID = $this->input->post('ID');
        $TvMode = $this->input->post('TvMode');
         $data = array('TvMode'=>$TvMode);
         $this->Deal_model->update(array('ID' => $TruckID), $data);
        echo json_encode(array('success' => true));
    }

    public function getTvModeData(){
        $this->load->model('Deal_model');
        $TruckID = $this->input->post('ID');
        $direction = $this->input->post('direction');
        $result = $this->Deal_model->getTvModeData($TruckID, $direction);
        if($result == false){
            echo json_encode(array('success' => false));
        }else{
            echo json_encode(array('success' => true, 'data'=>$result));
        }
       
    }

    public function deleteTruckFromWatchList()
    {
        $TruckID = $this->input->post('ID');
        $userID = $this->session->userdata('ID');
        $this->db->where('UserID', $userID);
        $this->db->where('TruckID', $TruckID);
        $this->db->delete('tblWatchList');
        echo json_encode(array('success' => true));
    }

    public function updateFianlPrice() {
        $this->load->model('Deal_model');

        $ID = $this->input->post('ID');
        $FinalPrice = $this->input->post('FinalPrice');  

        $result =  $this->Deal_model->update(array('ID' => $ID), array('FinalPrice'=>$FinalPrice));

        $logData = array(
            'UserID' => $this->session->userdata('ID'),
            'Action' => 'Edit Past Result',
            'Objective' => $ID,
            'Result' => 'Success'
        );
        $this->Log_model->addLog($logData);

        echo json_encode(array('success'=> true));    
    }



    public function getTruckById()
    {     
        $id = $this->input->post('id');
        $this->db->select('*');
        $this->db->where('ID', $id);
        $this->db->from('viewActiveDeals');
        $result =  $this->db->get()->row_array();
        echo json_encode($result);
    }

    public function updateTruckById()
    {

        $this->load->model('Deal_model');


        $ID = $this->input->post('ID');

        $truck = $this->Deal_model->getTruck($ID);

        $data = array();

        $fileUploadCheck = false;


        if (!empty($_FILES["PrimaryImage"]["name"])) {


            if (file_exists('assets/images/primaryImages/' . $truck['PrimaryImage'])) {
                unlink('assets/images/primaryImages/' . $truck['PrimaryImage']);
            }

            if (!empty($truck['BannerPrimaryImage']) && file_exists('assets/images/primaryImages/' . $truck['BannerPrimaryImage'])) {
                unlink('assets/images/primaryImages/' . $truck['BannerPrimaryImage']);
            }

            $date = new DateTime();
            $filename = 'deals' . $date->getTimestamp();

            $config['upload_path'] = 'assets/images/primaryImages/';
            $config['allowed_types'] = 'jpg|jpeg|png|gif';
            $config['overwrite'] = true;
            $config['file_name'] = $filename;

            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('PrimaryImage')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('success' => false, 'message' => $error));
                return;
            }
            $d = $this->upload->data();

            $data['PrimaryImage'] = $d['file_name'];
            $data['pmW'] = $d['image_width'];
            $data['pmH'] = $d['image_height'];

            $fileUploadCheck = true;
        }

        $dealType = $this->input->post('DealType');



        if ($dealType == 'Auction') {
            $data['StartDate'] = $this->input->post('StartDate');
            $data['EndDate'] = $this->input->post('EndDate');
            $data['BuyPremium'] = $this->input->post('BuyPremium');
            $data['Price'] = $this->input->post('Price');
            $data['Shipping'] = $this->input->post('Shipping');
            $data['Customs'] = $this->input->post('Customs');
            $data['Commission'] = $this->input->post('Commission');            
            $data['Total'] = $this->input->post('Total');
        } else if ($dealType == 'For Sale') {
            $data['Price'] = $this->input->post('Price');
            $data['Shipping'] = $this->input->post('Shipping');
            $data['Customs'] = $this->input->post('Customs');
            $data['Commission'] = $this->input->post('Commission');
            $data['Margin'] = $this->input->post('Margin');
            $data['Total'] = $this->input->post('Total');
        } else if ($dealType == 'Consignment') {
            $data['Price'] = $this->input->post('Price');
            $data['Commission'] = $this->input->post('Commission');
            $data['Margin'] = $this->input->post('Margin');
            $data['Total'] = $this->input->post('Total');
        } else if ($dealType == 'Inventory') {
            $data['Price'] = $this->input->post('Price');
            $data['Margin'] = $this->input->post('Margin');
            $data['Total'] = $this->input->post('Total');
        }

        $data['Note'] = $this->input->post('Note');

        $result =  $this->Deal_model->update(array('ID' => $ID), $data);


        $logData = array(
            'UserID' => $this->session->userdata('ID'),
            'Action' => 'Edit Truck',
            'Objective' => $ID,
            'Result' => 'Success'
        );
        $this->Log_model->addLog($logData);

        if ($fileUploadCheck) {   //  file upload

            echo json_encode(array(
                'success' => true,
                'pictures' => array(array(
                    'ID' => $ID,
                    'Width' => $data['pmW'],
                    'Height' => $data['pmH'],
                    'DealType' => $truck['DealType'],
                    'url' => base_url('assets/images/primaryImages/' .  $data['PrimaryImage'])
                ))
            ));
        } else {                              // no file uploading

            echo json_encode(array('success' => true));
        }
    }


    public function deleteTruckById()
    {
        $ID = $this->input->post('id');
        $userID = $this->session->userdata('ID');

        $this->db->where('UserID', $userID);
        $this->db->where('TruckID', $ID);
        $this->db->delete('tblWatchList');

        $this->load->model('Deal_model');

        $truck = $this->Deal_model->getTruck($ID);

        if ($truck['DealStatus'] != '') {
            echo json_encod(array('message' => 'Deal is on Pending Status'));
            return;
        }
        
        if (!empty($truck)) {

            // delete from maquinaria JR
            $this->deleteFromMachinary($ID);
            
            // delete primary image
            if (file_exists('assets/images/primaryImages/' . $truck['PrimaryImage'])) {
                unlink('assets/images/primaryImages/' . $truck['PrimaryImage']);
            }

            // delete thumb image
            if (file_exists('assets/images/thumbImages/' . $truck['PrimaryImage'])) {
                unlink('assets/images/thumbImages/' . $truck['PrimaryImage']);
            }

            // delete banner image
            if (!empty($truck['BannerPrimaryImage']) && file_exists('assets/images/primaryImages/' . $truck['BannerPrimaryImage'])) {
                unlink('assets/images/primaryImages/' . $truck['BannerPrimaryImage']);
            }

            // delete gallery
            
            $this->db->select('*');
            $this->db->where('TruckID', $ID);
            $this->db->from('tblresource');
            $rows = $this->db->get()->result_array();
            foreach ($rows as $row) {
                if (file_exists('assets/images/sliderImages/' . $row['Filename'])) {
                    unlink('assets/images/sliderImages/' . $row['Filename']);
                }
                if (!empty($row['BannerFilename']) && file_exists('assets/images/sliderImages/' . $row['BannerFilename'])) {
                    unlink('assets/images/sliderImages/' . $row['BannerFilename']);
                }
            }
            
            $this->db->where('TruckID', $ID);
            $result =  $this->db->delete('tblresource');
            if ($result == false) {
                echo json_encode(array('message' => 'Failed to delete gallery'));
                return;
            }
        }

        $result =  $this->Deal_model->deleteTruck($ID);

        echo json_encode(array('message' => $result));
    }


    public function getStatisticDataByUser()
    {
        $display_users = array("Zheng", "David", "JuanCarlos", "Alvaro", "Alberto", "Diana", "Fernanda", "Rodolfo", 'Jorge', 'Other');

        $interval = $this->input->post('interval');
        $this->load->model('Deal_model');

        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $this->load->model('User_model');

        $allUser = $this->User_model->getAllUser();

        $allUserIDList = array();
        $cnt_others = 0;
        foreach ($allUser as $user) {          
                $item = array();
                $item['name'] = $user['USERNAME'];
                $item['num'] = $this->Deal_model->getTruckCountByUserID($user['ID'], $startDate, $endDate, $interval);
                array_push($allUserIDList, $item);            
        }

        usort($allUserIDList, function($a, $b) {
            return $a['num'] < $b['num'];
        });        

        echo json_encode($allUserIDList);
    }

    public  function getStatisticDataByDateRange()
    {
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $date = new DateTime($startDate);

        $period = new DatePeriod(
            new DateTime($startDate),
            new DateInterval('P1D'),
            new DateTime($endDate)
       );

       $dealsCountArray = array(0);
       $dateArray = array("");
       $totalCountArray = array();

       $this->load->model('Deal_model');

       $graphStart = 0;

       foreach ($period as $key => $val) {
            $dateVal = $val->format('Y-m-d');           
            $deal_count = $this->Deal_model->getTruckCountByDateAdded($dateVal);
            $total_count = $this->Deal_model->getTotalTruckCountByDateAdded($dateVal);
            if ($deal_count != 0)
                $graphStart = 1;
            
            if ($graphStart == 1) {
                array_push($dateArray, $val->format('d'));
                array_push($dealsCountArray, $deal_count);
                array_push($totalCountArray, $total_count);
            }
            
       }

       echo json_encode(array('date' => $dateArray, 'counts' => $dealsCountArray, 'total_counts' => $totalCountArray));
    }       

    public function getStatisticDataByCategory()
    {
        $interval = $this->input->post('interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');        

        $this->load->model('Deal_model');
        $allCategoryList = array();
        $categoryList = $this->Deal_model->getAllCategory();
        foreach ($categoryList as $category) {
            $item = array();
            $item['name'] = $category['EqCategory'];
            $item['num'] = $this->Deal_model->getTruckCountByCategoryName($category['EqCategory'], $interval, $startDate, $endDate);

            array_push($allCategoryList, $item);
        }     

        usort($allCategoryList, function ($a, $b) {
            return $b['num'] - $a['num'];
        });

        echo json_encode($allCategoryList);
    }

    public function getStatisticDataByDealType() {

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);

        $interval = $this->input->post('interval');
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');        

        $this->load->model('Deal_model');
        $data = array();

        $dealTypeList = $this->Deal_model->getAllDealType();

        foreach ($dealTypeList as $dealType) {
            $item = array();
            $item['name'] = lang($dealType['DealType']);
            $item['num'] = $this->Deal_model->getTruckCountByDealType($dealType['DealType'], $interval, $startDate, $endDate);
            array_push($data, $item);

            if ($dealType['DealType'] == 'Auction' && $item['num'] > 0) {
                $item['name'] = lang('Expired');
                $item['num'] = $this->Deal_model->getExpiredTruckCount($startDate, $endDate);
                array_push($data, $item);

                $item = array();
                $item['name'] = lang('Expiring within a week');
                $item['num'] = $this->Deal_model->getExpiringInWeekTruckCount($interval, $startDate, $endDate);
                array_push($data, $item);
            }               
        }

        // Get Published Deals
        $item = array();
        $item['name'] = lang('Published Deals');
        $item['num'] = $this->Deal_model->getActivePublishedDealsCount($interval, $startDate, $endDate);
        array_push($data, $item);

        // Get old Non Auction Deals
        $this->db->select('ActiveDealTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $this->db->limit(1);
        $row = $this->db->get()->row_array();

        $activeDealTime = $row['ActiveDealTime'];

        if ($activeDealTime < 2)
            $activeDealTime = 2;

        $item = array();
        if ($language == 'english')
            $item['name'] = ($activeDealTime - 2) . '+ days Non Auction Deals';
        else if ($language == 'spanish') 
            $item['name'] = 'Tratos agregados hace ' . ($activeDealTime - 2) . '+ días (no subastas)';

        $item['num'] = $this->Deal_model->getOutdatedDealsCount();
        array_push($data, $item);
        
        echo json_encode($data);
    }


    public function uploadImageForPost()
    {

        // save post image
        $imageData = $this->input->post('imageData');
        $siteName = $this->input->post('siteName');
        $uploadDirName = 'facebook';
        if ($siteName == 'facebook') {
            $uploadDirName = 'facebook';
        } else {
            $uploadDirName = 'facebook';
        }
        $image_parts = explode(";base64,", $imageData);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_type = $image_type_aux[1];
        $image_base64 = base64_decode($image_parts[1]);

        $date = new DateTime();
        $filename = $date->getTimestamp() . '.' . $image_type;

        $file = 'assets/images/' . $uploadDirName . '/' . $filename;

        $fileLink = base_url($file);
        $result = file_put_contents($file, $image_base64);
        if ($result == false) {
            echo json_encode(array('success' => false, 'message' => 'file stream error'));
        } else {


            $this->_ci = &get_instance();
            $this->_ci->load->config('facebook');

            $appId = $this->_ci->config->item('facebook_api_id');
            $appSecret = $this->_ci->config->item('facebook_app_secret');
            $appRedirectUrl = base_url('auctions');
            $fbPermission = array('publish_actions');

            $fb =  new Facebook(array(
                'app_id' => $appId,
                'app_secret' => $appSecret,
                'default_graph_version' => 'v2.6'
            ));

            //get redirect login helper
            $helper = $fb->getRedirectLoginHelper();

            //Try to get access token
            try {
                if ($this->session->has_userdata('facebook_access_token')) {
                    $accessToken = $_SESSION['facebook_access_token'];
                } else {
                    $accessToken = $helper->getAccessToken();
                }
            } catch (FacebookResponseException $e) {
                echo json_encode(array('success' => false, 'message' => $e->getMessage()));
                exit;
            } catch (FacebookSDKException $e) {
                echo json_encode(array('success' => false, 'message' => $e->getMessage()));
                exit;
            }



            if (isset($accessToken)) {
                if ($this->session->has_userdata('facebook_access_token')) {
                    $fb->setDefaultAccessToken($this->session->userdata('facebook_access_token'));
                } else {
                    // Put short-lived access token in session                   
                    $this->session->set_userdata('facebook_access_token', (string) $accessToken);

                    // OAuth 2.0 client handler helps to manage access tokens
                    $oAuth2Client = $fb->getOAuth2Client();

                    // Exchanges a short-lived access token for a long-lived one
                    $longLivedAccessToken = $oAuth2Client->getLongLivedAccessToken($this->session->userdata('facebook_access_token'));
                    $this->session->set_userdata('facebook_access_token', (string) $longLivedAccessToken);

                    // Set default access token to be used in script
                    $fb->setDefaultAccessToken($this->session->userdata('facebook_access_token'));
                }

                //FB post content
                $message = 'Test';
                $title = 'Auction Post';
                $link = 'https://https://www.machineryhuntersplatform.net/';
                $description = 'this is test post';
                $picture = $fileLink;

                $attachment = array(
                    'message' => $message,
                    'name' => $title,
                    'link' => $link,
                    'description' => $description,
                    'picture' => $picture,
                );

                try {
                    // Post to Facebook
                    $fb->post('/me/feed', $attachment, $accessToken);

                    // Display post submission status
                    echo json_encode(array('success' => true, 'message' => 'Your data has been posted on facebook successfully'));
                } catch (FacebookResponseException $e) {
                    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
                    exit;
                } catch (FacebookSDKException $e) {
                    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
                    exit;
                }
            } else {
                // Get Facebook login URL
                $fbLoginURL = $helper->getLoginUrl($appRedirectUrl, $fbPermission);
                echo json_encode(array('success' => true, 'redirectUrl' => $fbLoginURL));
            }
        }
    }


    public function getAllMediaDataByID($TruckID)
    {

        $picture_data = array();

        $this->db->select('*');
        $this->db->where('ID', $TruckID);
        $this->db->from('tblDeals');
        $primary = $this->db->get()->row_array();

        $temp = array();
        $temp['ID'] = $primary['ID'];
        $temp['Primary'] = 1;
        $temp['Height'] = $primary['pmH'];
        $temp['Width'] =  $primary['pmW'];
        $temp['BannerHeight'] = $primary['BannerPmH'];
        $temp['BannerWidth'] =  $primary['BannerPmW'];
        $temp['url'] = base_url('assets/images/primaryImages/' . $primary['PrimaryImage']);
        $temp['bannerUrl'] = base_url('assets/images/primaryImages/' . $primary['BannerPrimaryImage']);
        $temp['bannerFilename'] =  $primary['BannerPrimaryImage'];
        $downloadName =  $primary['EqYear'] . $primary['EqMake'] . $primary['EqModel'];
        $temp['DownloadName'] = $downloadName . '0';
        $dealType = $primary['DealType'];
        $temp['DealType'] = $dealType;
        array_push($picture_data, $temp);

        $this->db->select('*');
        $this->db->where('TruckID', $TruckID);
        $this->db->where('Kind', 'picture');
        $this->db->from('tblresource');
        $pictures = $this->db->get()->result_array();
        /*
        *  neededWidth = 380px, neededHeight = 237px;
        */

        if (count($pictures) > 0) {

            $i = 1;

            foreach ($pictures as $item) {

                $temp = array();
                $temp['ID'] = $item['ID'];
                $temp['Primary'] = 0;
                $temp['Height'] = $item['Height'];
                $temp['Width'] =  $item['Width'];
                $temp['BannerHeight'] = $item['BannerHeight'];
                $temp['BannerWidth'] =  $item['BannerWidth'];
                $temp['url'] = base_url('assets/images/sliderImages/' . $item['Filename']);
                $temp['bannerUrl'] = base_url('assets/images/sliderImages/' . $item['BannerFilename']);
                $temp['bannerFilename'] =  $item['BannerFilename'];
                $temp['DownloadName'] = $downloadName . $i;
                $temp['DealType'] = $dealType;
                array_push($picture_data, $temp);
                $i += 1;
            }
        }

        $video_data = array();

        $this->db->select('*');
        $this->db->where('TruckID', $TruckID);
        $this->db->where('Kind', 'video');
        $this->db->from('tblresource');
        $video = $this->db->get()->row_array();
        if (!empty($video)) {
            $video_data['ID'] = $video['ID'];
            $video_data['url'] = base_url('assets/images/video/' . $video['Filename']);
        } else {
            $video_data = NULL;
        }

        $viewData = array('success' => true, 'pictures' => $picture_data, 'video' => $video_data);
        return $viewData;
    }

    function getGalleryImageData()
    {
        $picture_data = array();
        $TruckID = $this->input->post('TruckID');       

        $this->db->select('*');
        $this->db->where('TruckID', $TruckID);
        $this->db->where('Kind', 'picture');
        $this->db->from('tblresource');
        $pictures = $this->db->get()->result_array();

        /*
        *  neededWidth = 380px, neededHeight = 237px;
        */

        if (count($pictures) > 0) {
            foreach ($pictures as $item) {
                $temp = array();
                $temp['ID'] = $item['ID'];             
                $temp['Height'] = $item['Height'];
                $temp['Width'] =  $item['Width'];               
                $temp['url'] = base_url('assets/images/sliderImages/' . $item['Filename']);               
                array_push($picture_data, $temp);               
            }
        }
      

        $viewData = array('success' => true, 'pictures' => $picture_data);
        echo json_encode( $viewData );
    }





    public function Media()
    {
        $TruckID = $this->input->post('ID');
        echo json_encode($this->getAllMediaDataByID($TruckID));
    }



    public function deleteMediaData()
    {

        $IDs = $this->input->post('IDs');

        $this->load->model("User_model");
        $ID = $this->session->userdata('ID');
        $userData = $this->User_model->getUserInfo($ID);

        $this->load->model('Activity_model');
        
        //delete file
        $this->db->select('*');
        $this->db->where_in('ID', $IDs);
        $this->db->from('tblresource');
        $rows = $this->db->get()->result_array();
        
        foreach ($rows as $row) {

            if (file_exists('assets/images/sliderImages/' . $row['Filename'])) {
                unlink('assets/images/sliderImages/' . $row['Filename']);
            }
            if (!empty($row['BannerFilename']) && file_exists('assets/images/sliderImages/' . $row['BannerFilename'])) {
                unlink('assets/images/sliderImages/' . $row['BannerFilename']);
            }
        }

        // delete rows from database
        $this->db->where_in('ID', $IDs);
        $result =  $this->db->delete('tblresource');
        if ($result == false) {
            echo json_encode(array('success' => false, 'message'=>'Delete from Resource error'));
            return;
        }

        $TruckID = $this->input->post('TruckID');
        // get  rows  
        $result = $this->getAllMediaDataByID($TruckID);

        echo json_encode($result);
    }

    public function  AddSliderImage()
    {
        $TruckID = $this->input->post('TruckID');

        $this->db->select('*');
        $this->db->where('ID', $TruckID);
        $this->db->from('tblDeals');
        $item = $this->db->get()->row_array();

        $data = array();

        if (isset($_FILES["files"]["name"])) {
            $count =  count($_FILES["files"]["name"]);

            for ($i = 0; $i < $count; $i++) {
                if (!empty($_FILES["files"]["name"][$i])) {

                    $_FILES['file']['name'] = $_FILES["files"]["name"][$i];
                    $_FILES['file']['type'] = $_FILES['files']['type'][$i];
                    $_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
                    $_FILES['file']['error'] = $_FILES['files']['error'][$i];
                    $_FILES['file']['size'] = $_FILES['files']['size'][$i];


                    $date = new DateTime();
                    $filename = $date->getTimestamp();
                    $config['upload_path'] = 'assets/images/sliderImages/';
                    $config['allowed_types'] = 'jpg|jpeg|png|gif';
                    $config['overwrite'] = true;
                    $config['file_name'] = 'Truck' . $TruckID . $i . "_" . $filename;
                    $this->load->library('upload', $config);
                    $this->upload->initialize($config);

                    if (!$this->upload->do_upload('file')) {
                        $error =  $this->upload->display_errors();                        
                        echo json_encode(array('message' => $error, 'success' => false));
                        return;
                    }
                    $d = $this->upload->data();
                    $avatar = $d['file_name'];
                    $width = $d['image_width'];
                    $height = $d['image_height'];

                    $pictureData = array(
                        'TruckID' => $TruckID,
                        'Filename' =>  $avatar,
                        'Kind' => 'picture',
                        'Width' => $width,
                        'Height' => $height
                    );
                    $this->db->insert('tblresource', $pictureData);

                    // array_push($data, array('ID' => $this->db->insert_id(), 'Primary'=>false, 'Width' => $width,  'Height' => $height, 'url' => base_url('assets/images/sliderImages/' . $avatar)));
                }
            }
        }
        echo json_encode($this->getAllMediaDataByID($TruckID));
        // echo json_encode(array('success' => true, 'pictures' => $data));
    }


    public function AddBannerPrimaryAndSliderImage()
    {
        $TruckID = $this->input->post('TruckID');
        $images = $this->input->post('images');
        $this->load->model('Deal_model');


        if (count($images) > 0) {

            $i = 0;
            foreach ($images as $image) {


                $imageData =  $image['imgdata'];
                $ID = $image['ID'];
                $Primary = $image['Primary'];

                $image_parts = explode(";base64,", $imageData);
                $image_type_aux = explode("image/", $image_parts[0]);
                $image_type = $image_type_aux[1];
                $image_base64 = base64_decode($image_parts[1]);

                $image_info = getimagesizefromstring($image_base64);
                $width = $image_info[0];
                $height = $image_info[1];



                if ($Primary == 1) {

                    $date = new DateTime();
                    $filename = 'Truck' . $i . $date->getTimestamp() . '.' . $image_type;
                    $file = 'assets/images/primaryImages/' . $filename;
                    file_put_contents($file, $image_base64);
                    $data = array();
                    $data['BannerPrimaryImage'] = $filename;
                    $data['BannerPmW'] = $width;
                    $data['BannerPmH'] = $height;

                    $this->Deal_model->update(array('ID' => $ID), $data);
                } else {


                    $date = new DateTime();
                    $filename = 'TruckBanner' . $i . $date->getTimestamp() . '.' . $image_type;
                    $file = 'assets/images/sliderImages/' . $filename;
                    file_put_contents($file, $image_base64);
                    $data = array();

                    $data['BannerFilename'] = $filename;
                    $data['BannerWidth'] = $width;
                    $data['BannerHeight'] = $height;

                    $this->Deal_model->updateTruckResource(array('ID' => $ID), $data);
                }

                $i += 1;
            }
        }

        echo json_encode($this->getAllMediaDataByID($TruckID));
    }

    public function AddSliderBannerImage()
    {
        $TruckID = $this->input->post('TruckID');
        $images = $this->input->post('images');
        $this->load->model('Deal_model');
        if (count($images) > 0) {
            $i = 0;
            foreach ($images as $image) {

                $imageData =  $image['imgdata'];
                $ID = $image['ID'];

                $image_parts = explode(";base64,", $imageData);
                $image_type_aux = explode("image/", $image_parts[0]);
                $image_type = $image_type_aux[1];
                $image_base64 = base64_decode($image_parts[1]);

                $image_info = getimagesizefromstring($image_base64);
                $width = $image_info[0];
                $height = $image_info[1];

                $date = new DateTime();
                $filename = 'TruckBanner' . $i . $date->getTimestamp() . '.' . $image_type;

                $file = 'assets/images/sliderImages/' . $filename;
                file_put_contents($file, $image_base64);
                $data = array();
                $data['BannerFilename'] = $filename;
                $data['BannerWidth'] = $width;
                $data['BannerHeight'] = $height;

                $this->Deal_model->updateTruckResource(array('ID' => $ID), $data);
                $i += 1;
            }
        }

        echo json_encode($this->getAllMediaDataByID($TruckID));
    }

    public function  AddVideo()
    {
        $TruckID = $this->input->post('truck_video_id');

        //delete file
        $this->db->select('*');
        $this->db->where('TruckID', $TruckID);
        $this->db->where('Kind', 'video');
        $this->db->from('tblresource');
        $row = $this->db->get()->row_array();
        if (!empty($row)) {
            unlink('assets/images/video/' . $row['Filename']);
        }

        // delete rows from database
        $this->db->where('TruckID', $TruckID);
        $this->db->where('Kind', 'video');

        $result =  $this->db->delete('tblresource');
        if ($result == false) {
            echo json_encode(array('success' => false, 'message' => 'Delete Video from Resource Error'));
            return;
        }

        $inserted_id = 0;
        $avatar = "";
        $date = new DateTime();
        $filename = $date->getTimestamp();

        if (isset($_FILES["avatar"]["name"])) {
            $config['upload_path'] = 'assets/images/video/';
            $config['allowed_types'] = 'mp4';
            $config['overwrite'] = true;
            $config['file_name'] = 'Truck' . $TruckID . "_" . $filename;
            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('avatar')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('message' => $error, 'success' => false));
                return;
            }
            $data = $this->upload->data();
            $avatar = $data['file_name'];

            $videoData = array(
                'TruckID' => $TruckID,
                'Filename' =>  $avatar,
                'Kind' => 'video'
            );
            $this->db->insert('tblresource', $videoData);
            $inserted_id = $this->db->insert_id();
        }

        if ($avatar == "") {            
            echo json_encode(array('message' => "failed", 'success' => false));
            return;
        }

        echo json_encode(array('success' => true, 'ID' => $inserted_id, 'url' => base_url('assets/images/video/' . $avatar)));
    }


    public function  deleteVideo()
    {
        $TruckID = $this->input->post('TruckID');

        //delete file       
        $this->db->select('*');
        $this->db->where('TruckID', $TruckID);
        $this->db->where('Kind', 'video');
        $this->db->from('tblresource');
        $rows = $this->db->get()->result_array();
        foreach ($rows as $row) {
            unlink('assets/images/video/' . $row['Filename']);
        }

        $this->load->model("User_model");
        $ID = $this->session->userdata('ID');
        $userData = $this->User_model->getUserInfo($ID);

        $this->load->model('Activity_model');

        // delete rows from database
        $this->db->where('TruckID', $TruckID);
        $this->db->where('Kind', 'video');
        $result =  $this->db->delete('tblresource');
        if ($result == false) {            
            echo json_encode(array('success' => false, 'message'=> 'Delete Video from Resource Error'));
        } else {
            echo json_encode(array('success' => true));
        }
    }

    public function editPrimaryImage()
    {
        $this->load->model('Deal_model');


        $TruckID = $this->input->post('truck_picture_id');

        $truck = $this->Deal_model->getTruck($TruckID);

        if (file_exists('assets/images/primaryImages/' . $truck['PrimaryImage'])) {
            unlink('assets/images/primaryImages/' . $truck['PrimaryImage']);
        }
        if (!empty($truck['BannerPrimaryImage']) && file_exists('assets/images/primaryImages/' . $truck['BannerPrimaryImage'])) {
            unlink('assets/images/primaryImages/' . $truck['BannerPrimaryImage']);
        }

        $date = new DateTime();
        $filename = 'deals' . $date->getTimestamp();

        if (!empty($_FILES["primary_picture"]["name"])) {
            $config['upload_path'] = 'assets/images/primaryImages/';
            $config['allowed_types'] = 'jpg|jpeg|png|gif';
            $config['overwrite'] = true;
            $config['file_name'] = $filename;

            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('primary_picture')) {
                $error =  $this->upload->display_errors();
                echo json_encode(array('success' => false));
                return;
            }
            $data = $this->upload->data();
            $filename = $data['file_name'];
            $pmW = $data['image_width'];
            $pmH = $data['image_height'];

            $data = array('PrimaryImage' => $filename, 'pmW' => $pmW, 'pmH' => $pmH);
            $this->Deal_model->update(array('ID' => $TruckID), $data);
        }

        // echo json_encode(array(
        //     'success' => true,
        //     'pictures' => array(array(
        //         'ID' => $TruckID,
        //         'Width' => $pmW,
        //         'Height' => $pmH,
        //         'DealType' => $truck['DealType'],
        //         'Primary' =>true,
        //         'url' => base_url('assets/images/primaryImages/' . $filename)
        //     ))
        // ));

        echo json_encode($this->getAllMediaDataByID($TruckID));
    }

    public function checkHasLinkOnDatabase(){
        $link = $this->input->post('link');

        $this->load->model('Deal_model');

        $dealID = $this->Deal_model->findLink($link);

        if ($dealID == null)
            echo false;
        else
            echo true;
    }

    public function checkHasSNDatabase() {
        $SN = $this->input->post('SN');

        $this->db->select('ID');
        $this->db->where('EqSN', $SN);
        $this->db->limit(1);
        $this->db->from('tblDeals');
        $result = $this->db->get()->row_array();

        if ($result == null)
            echo false;
        else    
            echo true;
    }

    public function resizeImage($source, $width, $height, $maintain_ratio = FALSE) {
        $this->load->library('image_lib');
        $config['image_library'] = 'gd2';
        $config['source_image'] = $source;
        $config['create_thumb'] = FALSE;
        $config['maintain_ratio'] = $maintain_ratio;
        $config['width'] = $width;
        $config['height'] = $height;
        $config['quality'] = '100%';

        $this->image_lib->clear();
        $this->image_lib->initialize($config);
        $this->image_lib->resize();
    }

    public function make_banner_image($source, $deal_type) {
        $image_data = file_get_contents($source);
        $image_part = explode('.', $source);
        $temp = 'assets/images/machinary/temp.'.$image_part[1];
        file_put_contents($temp, $image_data);

        $this->load->library('image_lib');
        $this->resizeImage($source, 1500, 1125);        

        // Make Opacity Background
        $config['source_image'] = 'assets/images/machinary/back.jpg';
        $config['new_image'] = 'assets/images/machinary/uploading.jpg';
        $config['wm_overlay_path'] = $source;
        $config['wm_vrt_offset'] = 0;
        $config['wm_hor_offset'] = 0;
        $config['wm_type'] = 'overlay';
        $config['wm_opacity'] = 60;
        $config['wm_vrt_alignment'] = 'top';
        $config['wm_hor_alignment'] = 'left';
        
        
        $this->image_lib->clear();        
        $this->image_lib->initialize($config);
        $this->image_lib->watermark();

        // Resize Image with Main_ratio
        $this->resizeImage($temp, 0, 1125, TRUE);

        // put image on opactiy background
        $config['source_image'] = 'assets/images/machinary/uploading.jpg';
        $config['new_image'] = 'assets/images/machinary/uploading.jpg';
        $config['wm_overlay_path'] = $temp;
        $config['wm_vrt_offset'] = 0;
        $config['wm_type'] = 'overlay';
        $config['wm_opacity'] = 100;
        $config['wm_vrt_alignment'] = 'top';
        $config['wm_hor_alignment'] = 'center';
        
        $this->image_lib->clear();        
        $this->image_lib->initialize($config);
        $this->image_lib->watermark();

        // put banner
        $config['source_image'] = 'assets/images/machinary/uploading.jpg';
        $config['new_image'] = 'assets/images/machinary/uploading.jpg';
        $config['wm_overlay_path'] = 'assets/images/ribbon/'.strtolower($deal_type).'-banner-footer.png';
        $config['wm_hor_offset'] = 0;
        $config['wm_vrt_offset'] = 889;
        $config['wm_type'] = 'overlay';
        $config['wm_opacity'] = 100;
        $config['wm_vrt_alignment'] = 'top';
        $config['wm_hor_alignment'] = 'left';
        
        $this->image_lib->clear();        
        $this->image_lib->initialize($config);
        $this->image_lib->watermark();

        if ($deal_type == 'Inventory' || $deal_type == 'Consignment') {
            $config['source_image'] = 'assets/images/machinary/uploading.jpg';
            $config['new_image'] = 'assets/images/machinary/uploading.jpg';
            $config['wm_overlay_path'] = 'assets/images/ribbon/com_mark_reverse.png';
            $config['wm_hor_offset'] = 60;
            $config['wm_vrt_offset'] = 412;
            $config['wm_type'] = 'overlay';
            $config['wm_opacity'] = 100;
            $config['wm_vrt_alignment'] = 'top';
            $config['wm_hor_alignment'] = 'left';
            
            $this->image_lib->clear();        
            $this->image_lib->initialize($config);
            $this->image_lib->watermark();
        }

        // put com_mark        

        unlink($source);
        unlink($temp);

        return true;
    }

    public function publishDealtoMachinary() {
        ini_set('max_execution_time', 300);
        
        $deal_id = $this->input->post('id');
        $title = $this->input->post('title');     
        $price = $this->input->post('price');
        $sale_mode = $this->input->post('sale_mode');
        $description = $this->input->post('description');
        $uploadingImages = array();
        $product_img = "";

        $this->load->model('Deal_model');
        $deal_data = $this->Deal_model->getTruckById($deal_id);

        $Category = $deal_data['EqCategory'];
        $ret = $this->Deal_model->checkPublishable($Category);

        if ($ret == false) {
            echo json_encode(array('success' => false, 'message' => 'Can not publish this deal'));
            return;
        }

        $this->load->library('ftp');
        $config['hostname'] = 'ftp.maquinariajr.com';
        $config['username'] = 'maquinariajr';
        $config['password'] = 'M$@quin@ri@2O19';
        $config['debug'] = TRUE;
        $config['passive'] = FALSE;
        
        if (!$this->ftp->connect($config)) {
            echo json_encode(array('success' => false, 'message' => 'ftp connection error'));
            return;
        }

        
        $deal_type = $deal_data['DealType'];
        array_push($uploadingImages, 'assets/images/primaryImages/'.$deal_data['PrimaryImage']);

        $this->db->select('*');
        $this->db->where('TruckID', $deal_id);
        $this->db->where('Kind', 'picture');
        $this->db->from('tblresource');
        $pictures = $this->db->get()->result_array();

        foreach ($pictures as $picture) {
            array_push($uploadingImages, 'assets/images/sliderImages/'.$picture['Filename']);
        }
        //upload images


        $cnt = 0;
        foreach ($uploadingImages as $uploadingImage) {            
            $cnt ++;
            $image_parts = explode(".", $uploadingImage);
            if (count($image_parts) == 1)
                $image_type = substr($uploadingImage, strlen($uploadingImage) - 4);
            else 
                $image_type = $image_parts[1];

            $date = new DateTime();
            $filename = $date->getTimestamp() . '.' . $image_type;

            $banner_file = 'assets/images/machinary/' . $filename;
            $uploadingImageData = file_get_contents($uploadingImage);

            $result = file_put_contents($banner_file, $uploadingImageData);
            if ($result == false) {
                echo json_encode(array('success' => false, 'message' => 'file stream error first'));
                return;
            }

            $result = $this->make_banner_image($banner_file, $deal_type);

            if ($result == false) {
                echo json_encode(array('success' => false, 'message' => 'make banner image error'));
                return;
            }

            $uploadingImageData = file_get_contents('assets/images/machinary/uploading.jpg');

            $file = 'assets/images/machinary/uploading.jpg';
            $thumbnail_img = 'assets/images/machinary/thumb-uploading.jpg';
            $small_img = 'assets/images/machinary/small-uploading.jpg';
            $icon_img = 'assets/images/machinary/icon-uploading.jpg';
            $smicon_img = 'assets/images/machinary/smicon-uploading.jpg';
            
            $result = file_put_contents($thumbnail_img, $uploadingImageData);
            if ($result == false) {
                echo json_encode(array('success' => false, 'message' => 'file stream error thumb'));
                return;
            }
            $result = file_put_contents($small_img, $uploadingImageData);
            if ($result == false) {
                echo json_encode(array('success' => false, 'message' => 'file stream error small'));
                return;
            }
            $result = file_put_contents($icon_img, $uploadingImageData);
            if ($result == false) {
                echo json_encode(array('success' => false, 'message' => 'file stream error icon'));
                return;
            }
            $result = file_put_contents($smicon_img, $uploadingImageData);   
            if ($result == false) {
                echo json_encode(array('success' => false, 'message' => 'file stream error small icon'));
                return;
            }
    
            // Image Resize Here
            $this->resizeImage($small_img, 463, 313);
            $this->resizeImage($icon_img, 272, 135);
            $this->resizeImage($smicon_img, 150, 150);
            
            // Here upload image through FTP        
    
            $remote_file_name = time() . $title . '.jpg';
            $remote_file_name = str_replace(" ", "-", $remote_file_name);
            $remote_file_name = str_replace('/', '-', $remote_file_name);
            $remote_original_file = 'public_html/webupload/original/products/' . $remote_file_name;
            $remote_thumb_file = 'public_html/webupload/thumb/products/' . $remote_file_name;
            $remote_small_file = 'public_html/webupload/small/products/' . $remote_file_name;
            $remote_icon_file = 'public_html/webupload/icon/products/' . $remote_file_name;
            $remote_smicon_file = 'public_html/webupload/smallicon/products/' . $remote_file_name;

            if (!$this->ftp->upload($file, $remote_original_file)){
                echo json_encode(array('success' => false, 'message' => 'There was a problem in sending 1'.$cnt));
                return;
            } 
    
            if (!$this->ftp->upload($thumbnail_img, $remote_thumb_file)){
                echo json_encode(array('success' => false, 'message' => 'There was a problem in sending 2'));
                return;
            } 
    
            if (!$this->ftp->upload($small_img, $remote_small_file)){
                echo json_encode(array('success' => false, 'message' => 'There was a problem in sending 3'));
                return;
            } 
    
            if (!$this->ftp->upload($icon_img, $remote_icon_file)){
                echo json_encode(array('success' => false, 'message' => 'There was a problem in sending 4'));
                return;
            } 
    
            if (!$this->ftp->upload($smicon_img, $remote_smicon_file)){
                echo json_encode(array('success' => false, 'message' => 'There was a problem in sending 5'));
                return;
            } 
            
            unlink($file);
            unlink($thumbnail_img);
            unlink($small_img);
            unlink($icon_img);
            unlink($smicon_img);

            $product_img .= $remote_file_name.';';
        }

        $product_img = substr($product_img, 0, strlen($product_img) - 1);

        $this->load->model('Deal_model');
        $year = $deal_data['EqYear'];
        if ($year == '0' || $year == 0)
            $year = $deal_data['TruckYear'];
        $id = $this->Deal_model->publishToMachinary($title, $price, $deal_data['EqCategory'], $year, $deal_data['EqMake'], $deal_data['EqModel'], $deal_data['Country'], $sale_mode, $description, $product_img, $deal_data['Type']);

        if ($id == null) {
            echo json_encode(array('success' => false, 'message' => 'Publising to MaquinariaJR error'));
            return;
        }
        
        $user_id = $this->session->userdata('ID');
        
        $link = $this->Deal_model->add_machinary_link($deal_id, $id, $user_id);

        echo json_encode(array('success' => true, 'message' => $link));
    }

    private function deleteFromMachinary($dealid) {
        $this->load->model('Deal_model');
        $machinaryID = $this->Deal_model->getMachinaryID($dealid);

        if ($machinaryID == null) { 
            return array('success' => false, 'message' => 'Not published yet');            
        }

        // ftp connect
        $this->load->library('ftp');
        $config['hostname'] = 'ftp.maquinariajr.com';
        $config['username'] = 'maquinariajr';
        $config['password'] = 'M$@quin@ri@2O19';
        $config['debug'] = FALSE;
        $config['passive'] = FALSE;
        
        if (!$this->ftp->connect($config)) {
            return array('success' => false, 'message' => 'ftp connection error');            
        }

        $remote_file_name = $this->Deal_model->getMachinaryImage($machinaryID);
        if ($remote_file_name == null) {
            return array('success' => false, 'message' => 'Can not get image from this product');            
        }

        $remote_original_file = 'public_html/webupload/original/products/' . $remote_file_name;
        $remote_thumb_file = 'public_html/webupload/thumb/products/' . $remote_file_name;
        $remote_small_file = 'public_html/webupload/small/products/' . $remote_file_name;
        $remote_icon_file = 'public_html/webupload/icon/products/' . $remote_file_name;
        $remote_smicon_file = 'public_html/webupload/smallicon/products/' . $remote_file_name;
        
        $this->ftp->delete_file($remote_original_file);
        $this->ftp->delete_file($remote_thumb_file);
        $this->ftp->delete_file($remote_small_file);
        $this->ftp->delete_file($remote_icon_file);
        $this->ftp->delete_file($remote_smicon_file);

        $this->ftp->close();
        $this->Deal_model->delete_machinary_link($dealid);
        $this->Deal_model->delete_machinary_from_maquinaria($machinaryID);

        return array('success' => true, 'message' => true);
    }

    public function unPublishDealtoMachinary() {
        
        $dealid = $this->input->post('id');

        echo json_encode($this->deleteFromMachinary($dealid));
    }
 
    public function convertImage() {
        $this->load->model("User_model");
        $ID = $this->session->userdata('ID');
        $userData = $this->User_model->getUserInfo($ID);

        $this->load->model('Activity_model');
        $this->Activity_model->add(
            $userData['USERNAME'], 
            'Download Image Catalog', 
            '', 
            0, 
            'Deals.Management', 
            'Success', 
            '');
        echo 'success';
    }

    public function getEquipmentCategory(){
        $DealType = $this->input->post('DealType');        

        $this->db->select('EqCategory');
        if ($DealType != 'All Deals')
            $this->db->where('DealType', $DealType);        
        $this->db->from('viewActiveDeals');
        $this->db->group_by('EqCategory');
        $result = $this->db->get()->result_array();

        echo json_encode($result);
    }

    public function getEquipmentCategoryForWatchList() {
        $DealType = $this->input->post('DealType');
        $this->db->select('tblDeals.EqCategory');
        $this->db->from('tblWatchList');
        $this->db->join('tblDeals', 'tblWatchList.TruckID = tblDeals.ID');        
        if ($DealType != 'All Deals')
            $this->db->where('tblDeals.DealType', $DealType);
        $this->db->group_by('tblDeals.EqCategory');
        $result = $this->db->get()->result_array();

        echo json_encode($result);
    }

    public function getActiveDealsStatus() {
        $this->load->model('Deal_model');

        $auction = $this->Deal_model->getActiveDealsCountByType('Auction');
        $ForSale = $this->Deal_model->getActiveDealsCountByType('For Sale');
        $consignment = $this->Deal_model->getActiveDealsCountByType('Consignment');
        $inventory = $this->Deal_model->getActiveDealsCountByType('Inventory');

        echo json_encode(array(
            'Auction' => $auction,
            'ForSale' => $ForSale,
            'Consignment' => $consignment,
            'Inventory' => $inventory
        ));
    }

    public function getAuctionStatus() {
        $this->load->model('Deal_model');

        $today = date('Y-m-d');
        $seven = date('Y-m-d', time() + 7 * 24 * 3600);
        $thirty = date('Y-m-d', time() + 30 * 24 * 3600);

        $today_count = $this->Deal_model->getAuctionInPeriod($today, $today);
        $seven_count = $this->Deal_model->getAuctionInPeriod($today, $seven);
        $thirty_count = $this->Deal_model->getAuctionInPeriod($today, $thirty);
        $auction = $this->Deal_model->getActiveDealsCountByType('Auction');

        echo json_encode(array(
            'Today' => $today_count,
            'Seven' => $seven_count,
            'Thirty' => $thirty_count,
            'auction' => $auction
        ));
    }

    public function getTodayAddedDealStatus() {
        $this->load->model('Deal_model');

        $auction = $this->Deal_model->getTodayDealsCountByType('Auction');
        $ForSale = $this->Deal_model->getTodayDealsCountByType('For Sale');
        $consignment = $this->Deal_model->getTodayDealsCountByType('Consignment');
        $inventory = $this->Deal_model->getTodayDealsCountByType('Inventory');

        echo json_encode(array(
            'Auction' => $auction,
            'ForSale' => $ForSale,
            'Consignment' => $consignment,
            'Inventory' => $inventory
        ));
    }

    public function getSearchHelpDealsStatus() {

        $this->load->model('Sales_model');
        $noDeal = $this->Sales_model->getDepositNoDealCount();
        $pending = $this->Sales_model->getDepositPendingDealCount();
        
        $this->load->model('Assignment_model');
        $searchHelp = $this->Assignment_model->getSearchHelpCount();

        echo json_encode(array(
            'NoDeal' => $noDeal,
            'Pending' => $pending,
            'SearchHelp' => $searchHelp
        ));
    }

    public function updateEndDate() {
        $ID = $this->input->post('ID');
        $EndDate = $this->input->post('EndDate');

        $this->db->set('EndDate', $EndDate);
        $this->db->set('FinalPrice', 0);
        $this->db->where('ID', $ID);
        $this->db->update('tblDeals');

        $cnt = $this->db->affected_rows();

        if ($cnt == 0) {
            echo json_encode(array(
                'success' => false,
                'message' => 'Unknwn ID'
            ));
            return;
        }

        echo json_encode(array(
            'success' => true
        ));
    }

    public function markDealForExit() {
        $ID = $this->input->post('ID');
        $Mark = $this->input->post('Mark');

        $this->db->set('MarkForExit', $Mark);
        $this->db->where('ID', $ID);
        $this->db->update('tblDeals');
    }
}
    


