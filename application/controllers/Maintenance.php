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
}
