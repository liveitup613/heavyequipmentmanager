<?php
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

class Maintenance extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        //MY_Output's disable_cache() method
        $this->output->disable_cache();
        date_default_timezone_set('America/Phoenix');
    }

    public function googleContacts() {
        $data = file_get_contents('php://input');

        echo json_encode($data);
    }

    public function index() {
        if (!$this->input->is_cli_request()) {
            echo "This script can only be accessed via the command line" . PHP_EOL;
            return;
        }    

        $this->deleteOldDeals();
        //$this->lookForDeletedDeals();
        $this->unpublishFinishedAuction();
    }

    private function deleteOldDeals() {
        $this->db->select('ActiveDealTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $this->db->limit(1);
        $row = $this->db->get()->row_array();

        $activeDealTime = $row['ActiveDealTime'];
        
        $this->db->select('ID');
        $date = date('Y-m-d H:i:s', strtotime('-'. $activeDealTime . 'days'));
        $dealTypeArray = array('Consignment', 'For Sale');
        $this->db->where_in('DealType', $dealTypeArray);
        $this->db->where('DateAdded <', $date);
        $this->db->where('DealStatus', '');
        $this->db->from('viewActiveDeals');
        $result = $this->db->get()->result_array();

        $this->load->model('Activity_model');

        foreach ($result as $row) {
            //break;
            $ret = $this->deleteTruck($row['ID']);

            if ($ret == true) {
                $this->Activity_model->add('System', 'Delete Old Deal', 'tblDeals', $row['ID'], 'Maintenance', 'Success', '', '');
            }
            else
            {
                $this->Activity_model->add('System', 'Delete Old Deal', 'tblDeals', $row['ID'], 'Maintenance', 'Error', 'Error Occured', '');
            }
        }
    }

    private function lookForDeletedDeals() {
        $this->db->select('ActiveDealTime');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $this->db->limit(1);
        $row = $this->db->get()->row_array();

        $activeDealTime = $row['ActiveDealTime'];

        $this->db->select('ID, Link, DealStatus');
        $this->db->like('Link', 'Craigslist');
        $this->db->where('DealStatus', '');
        $this->db->from('viewActiveDeals');
        $result = $this->db->get()->result_array();

        $this->load->model('Activity_model');
        $this->load->library('Simple_html_dom');

        foreach($result as $row) {
            if ($row['DealStatus'] != '')
                continue;

            $html = file_get_html($row['Link']);

            $deleted = $this->checkIfDeleted($html, $activeDealTime);

            if ($deleted == true){
                $ret = $this->deleteTruck($row['ID']); 

                if ($ret == true) {
                    $this->Activity_model->add('System', 'Delete Broken Link Deal', 'tblDeals', $row['ID'], 'Maintenance', 'Success', '', '');
                }
                else
                {
                    $this->Activity_model->add('System', 'Delete Broken Link Deal', 'tblDeals', $row['ID'], 'Maintenance', 'Error', 'Error Occured', '');
                }
            }
        }
    }

    private function checkIfDeleted($html, $activeDealTime) {
        echo $html;

        $removedArray = $html->find('.removed');        
        if (isset($removedArray[0]))        
            return true;
        
        $postDateArray = $html->find('.timeago');
        if (isset($postDateArray[0])) {            
            $postDay = $postDateArray[0]->innertext();
            $expiredDay = date("Y-m-d H:i:s", strtotime("-".$activeDealTime." days"));
            if ($postDay < $expiredDay)
                return true;
        }

        return false;
    }


    private function deleteTruck($ID) {
        $this->db->where('TruckID', $ID);
        $this->db->delete('tblWatchList');

        $this->load->model('Deal_model');

        $truck = $this->Deal_model->getTruck($ID);
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
                return false;
            }
        }

        $result =  $this->Deal_model->deleteTruck($ID);
        return true;
    }

    private function deleteFromMachinary($dealid) {
        $this->load->model('Deal_model');
        $machinaryID = $this->Deal_model->getMachinaryID($dealid);

        if ($machinaryID == null) { 
            return false;
        }

        // ftp connect
        $this->load->library('ftp');
        $config['hostname'] = 'ftp.maquinariajr.com';
        $config['username'] = 'maquinariajr';
        $config['password'] = 'M$@quin@ri@2O19';
        $config['debug'] = FALSE;
        $config['passive'] = FALSE;
        
        if (!$this->ftp->connect($config)) {
            return false;
        }

        $remote_file_name = $this->Deal_model->getMachinaryImage($machinaryID);
        if ($remote_file_name == null) {
            return false;
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

        return true;
    }

    public function unpublishFinishedAuction() {
        $this->db->select('UnpublishAuction');
        $this->db->where('ID', 1);
        $this->db->from('tblconfig');
        $this->db->limit(1);
        $row = $this->db->get()->row_array();

        $UnpublishEndedAuctionDate = $row['UnpublishAuction'];

        $this->db->select('ID');
        $date = date('Y-m-d H:i:s', strtotime('-'. $UnpublishEndedAuctionDate . 'days')); 
        $this->db->where('EndDate <', $date);   
        $this->db->where('MaquinariaJRLink != ', '') ;
        $this->db->from('viewAuctionResults');
        $result = $this->db->get()->result_array();

        $this->load->model('Activity_model');

        foreach ($result as $row) {
            $ret = $this->deleteFromMachinary($row['ID']);

            if ($ret == true) 
                $this->Activity_model->add('System', 'Unpublish Ended Auction', 'tblDeals', $row['ID'], 'Maintenance', 'Success', '', '');
            else
                $this->Activity_model->add('System', 'Unpublish Ended Auction', 'tblDeals', $row['ID'], 'Maintenance', 'Error', 'Error Occured', '');
        }
    }

    public function addNewDeal() {
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
        $Price = $this->input->post('Price');   
        $PrimaryImage = "";        
        $UserID = 3;
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
        $truckData['SourcingAppID'] = $this->input->post('WebsiteID');

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

        
        if ($Price != NULL) {
            $truckData['Price'] = $Price;
        }    
        else
            $truckData['Price'] = 0;

        if ($EqYear != NULL) {
            $this->db->select('Customs');
            $this->db->where('EqCategory', $eqCategory);
            $this->db->where_in('EqYear', array($EqYear - 1, $EqYear, $EqYear + 1));
            $this->db->order_by('DateAdded', 'desc');
            $this->db->limit(5);
            $this->db->from('tblDeals');
            $result = $this->db->get()->result_array();

            $truckData['Customs'] = $this->getAverageValue($result, 'Customs');
        }
        else
            $truckData['Customs'] = 0;
        
        $this->db->select('Shipping');
        $this->db->where('EqCategory', $eqCategory);
        if ($Country != NULL)
            $this->db->where('Country', $Country);
        if ($State != NULL)  
            $this->db->where('State', $State);
        $this->db->where_in('DealType', array('Auction', 'For Sale'));
        $this->db->limit(5);
        $this->db->order_by('DateAdded', 'desc');
        $this->db->from('tblDeals');
        $result = $this->db->get()->result_array();

        $truckData['Shipping'] = $this->getAverageValue($result, 'Shipping');

        $truckData['Commission'] = 2500;
        $truckData['Total'] = intval($truckData['Price']) + $truckData['Customs'] + $truckData['Shipping'] + 2500;
        
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

            echo json_encode(array('success' => false, 'message' => 'Add Deal Error'));
            return;
        }

        $this->db->set('DealID', 'concat("HK", LPAD(ID, 6, "0"))', false);
        $this->db->where('ID', $getID);
        $this->db->update('tblDeals');

        $PrimaryImageUrl = $this->input->post('primaryImageUrl');        
        $fileFilter = explode('.', $PrimaryImageUrl);
        $fileExt = $fileFilter[count($fileFilter) - 1];
        $question_mark_position = strpos($fileExt, '?');
        if ($question_mark_position !== FALSE)
            $fileExt = substr($fileExt, 0, $question_mark_position);
        
        $date = new DateTime();
        $filename = $date->getTimestamp();

        $filename = 'deals' . $filename . '.' . $fileExt;

        $destUrl = 'assets/images/primaryImages/' . $filename;
        $thumbUrl = 'assets/images/thumbImages/'.$filename;

        // File Upload

        try {
            $image_content = @file_get_contents($PrimaryImageUrl);
            if ($image_content ===  FALSE) {
                $this->db->where('ID', $getID);
                $this->db->delete('tblDeals');
                echo json_encode(array('success' => false));
                return;
            }
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
        }
        catch (Exception $e) {
            $this->db->where('ID', $getID);
            $this->db->delete('tblDeals');
            echo json_encode(array('success' => false));
            return;
        }

        // Add 10 Scrapped Photos 

        for ($i = 1; $i <= 15; $i++) {
            $sliderImageUrl = $this->input->post('scrappedImage'.$i);
            if ($sliderImageUrl == NULL)
                break;

            if ($sliderImageUrl == '' || $sliderImageUrl == $PrimaryImageUrl)
                continue;

            if (substr($sliderImageUrl, 0, 4) != 'http')
                continue;

            $fileFilter = explode('.', $sliderImageUrl);
            $fileExt = $fileFilter[count($fileFilter) - 1];
            $question_mark_position = strpos($fileExt, '?');
            if ($question_mark_position !== FALSE)
                $fileExt = substr($fileExt, 0, $question_mark_position);
    
            $date = new DateTime();
            $filename = $date->getTimestamp();
    
            $filename = 'Truck' . $getID . $i . "_" . $filename . '.'. $fileExt;
    
            $destUrl = 'assets/images/sliderImages/' . $filename;
    
            // File Upload

            try{
                $image_content = @file_get_contents($sliderImageUrl);
                if ($image_content === FALSE) {
                    $this->db->where('ID', $getID);
                    $this->db->delete('tblDeals');
                    echo json_encode(array('success' => false));
                    return;
                }
                file_put_contents($destUrl, $image_content);
            }
            catch (Exception $e) {
                $this->db->where('ID', $getID);
                $this->db->delete('tblDeals');
                echo json_encode(array('success' => false));
                return;
            }
    
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

        echo json_encode(array('success' => true, 'data' => array('ID' => $getID, 'url' => base_url($destUrl), 'pmW' => $width, 'pmH' => $height)));
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
            $Average = (intval($Average / 50) * 50);      
            return $Average;            
        }
        return 0;
    }

    public function removeDeal() {
        $ID = $this->input->post('ID');
        $result = $this->deleteTruck($ID);

        if ($result == false) {
            echo json_encode(array(
                'success' => false,                
            ));
            return;
        }

        echo json_encode(array(
            'success' => true
        ));
    }

    public function updateDeal() {
        $ID = $this->input->post('ID');
        $EndDate = $this->input->post('EndDate');

        $this->db->where('ID', $ID);
        $this->db->update('tblDeals', array(
            'EndDate' => $EndDate
        ));

        echo json_encode(array(
            'success' => true
        ));
    }
}
