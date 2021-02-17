<?php
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

class Publish extends CI_Controller
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

        $this->Special_field_array = require_once('application/config/sfconfig.php');
        $this->Tranlate_word_array = require_once('application/config/twconfig.php');
    }

    public function preview() {

        $dealId = $this->input->post('DealID');

        $data = array();

        $language = $this->session->userdata('Lang');
        $this->lang->load('words', $language);
        $data['Lang'] = $language;

        $this->load->model('User_model');
        $ID = $this->session->userdata('ID');
        $userInfo = $this->User_model->getUserInfo($ID);
        $data['userInfo'] = $userInfo;

        $this->db->select('*');
        $this->db->where('ID', $dealId);
        $this->db->from('viewActiveDeals');
        $result =  $this->db->get()->row_array();
        $data['detail'] = $result;

        $data['OgTitle'] = $this->getTitleFromDatabase($data['detail']); // Generate OgTitle

        $PriceInfo = ' USD $'.$this->numberWithCommas($data['detail']['Total']);
        $AuctionInfo = '';
        if($data['detail']['DealType'] == 'Auction') {
            $AuctionInfo = ' Subasta : '.$this->changeDateFormat($data['detail']['EndDate']);
        }
        $data['OgTitle'] = $data['OgTitle'].$PriceInfo.$AuctionInfo;

        $detail_list = $this->get_detail_data_for_deal($data['detail']); // get detail_list for OgDescription
        $OgDescription = '';
        for($i = 0; $i < count($detail_list); $i++){
            if($i == 0) {
                $OgDescription = $detail_list[$i];
            }else {
                $OgDescription .= ", ".$detail_list[$i];
            }
        }
        $OgDescription .= ", ".$data['detail']['DealID'];
        $data['OgDescription'] = $OgDescription; // Generate OgDescription

        $redirect_link = "https://www.maquinariajr.com";
        if($data['detail']['MaquinariaJRLink']) {
            $redirect_link = $data['detail']['MaquinariaJRLink'];
        }
        $data['redirect_link'] = $redirect_link;

        $data['user_type'] = isset($this->session->userdata['ID']) ? 'sys_user' : 'visitor';

//        $data['og_url'] = current_url(); // set og_url

        $this->load->model('Share_model');
        $share_data = array();
        $share_data['Date'] = date('Y-m-d H:i:s');
        $share_data['DealID'] = $data['detail']['ID'];
        $share_data['UserID'] = $data['userInfo']['ID'];
        $share_data['UserName'] = $data['userInfo']['USERNAME'];
        $share_data['OgTitle'] = $data['OgTitle'];
        $share_data['OgDescription'] = $data['OgDescription'];

        $ShareID = $this->Share_model->insert($share_data);

        $data['OgLink'] = $this->updateOgLink($ShareID);

        $data['PostID'] = $ShareID;
        echo json_encode( $data );
    }

    public function generateLink() {

        $this->load->model('Share_model');

        $DealID = $this->input->post('DealID');
        $OgTitle = $this->input->post('OgTitle');
        $OgDescription = $this->input->post('OgDescription');
        $ImageData = $this->input->post('ImageData');
        $Platform = $this->input->post('Target');

        $this->load->model('User_model');
        $ID = $this->session->userdata('ID');
        $userInfo = $this->User_model->getUserInfo($ID);
        $data['userInfo'] = $userInfo;

        $share_data = array();
        $share_data['Date'] = date('Y-m-d H:i:s');
        $share_data['DealID'] = $DealID;
        $share_data['UserID'] = $data['userInfo']['ID'];
        $share_data['UserName'] = $data['userInfo']['USERNAME'];
        $share_data['OgTitle'] = $OgTitle;
        $share_data['OgDescription'] = $OgDescription;
        $share_data['Platform'] = $Platform;

        $ShareID = $this->Share_model->insert($share_data);

        $this->updateOgLink($ShareID);

        $ShareImageData = $this->generateShareImage($ImageData);

        if ($ShareImageData['result'] == false) {
            echo json_encode(array('success' => false, 'message' => 'file stream error'));
        } else {
            $criteria = array('ID' => $ShareID);
            $data = array();
            $data['OgImage'] = $ShareImageData['fileLink'];
            $data['OgWidth'] = $ShareImageData['imageWidth'];
            $data['OgHeight'] = $ShareImageData['imageHeight'];
            $this->Share_model->update($criteria, $data);

            $Post = $this->Share_model->getShareDataByID($ShareID);
            echo json_encode(array('success' => true, 'Post' => $Post));
        }
    }

    public function updateOgLink($ShareID) {
        $date = new DateTime();
        $PublicID = $date->getTimestamp(). '_' . rand(1000, 9999) . '_' . $ShareID;
        $PublicID = base64_encode($PublicID);
        $OgLink = base_url('Share/publishment/'.$PublicID);

        $this->Share_model->update(array('ID' => $ShareID), array('OgLink' => $OgLink));

        return $OgLink;
    }

    public function numberWithCommas($x) {
        $str_x = strval($x);
        return preg_replace('/\B(?=(\d{3})+(?!\d))/',',' ,$str_x);
    }

    public function updateOgTitle() {
        $ShareID = $this->input->post('PostID');
        $OgTitle = $this->input->post('OgTitle');

        $criteria = array('ID' => $ShareID);
        $data = array();

        $this->load->model('Share_model');

        if( $OgTitle != NULL ) {
            $data['OgTitle'] = $OgTitle;
        }

        $this->Share_model->update($criteria, $data);
    }

    public function updateOgDescription() {
        $ShareID = $this->input->post('PostID');
        $OgDescription = $this->input->post('OgDescription');

        $criteria = array('ID' => $ShareID);
        $data = array();

        $this->load->model('Share_model');

        if( $OgDescription != NULL ) {
            $data['OgDescription'] = $OgDescription;
        }

        $this->Share_model->update($criteria, $data);
    }

    public function updatePublishment() {
        $ShareID = $this->input->post('PostID');
        $imgdata = $this->input->post('imgdata');
        $Platform = $this->input->post('Platform');
        $IsSamePost = $this->input->post('IsSamePost');

        $criteria = array('ID' => $ShareID);
        $data = array();

        $this->load->model('Share_model');

        $ShareImageData = $this->generateShareImage($imgdata);

        if ($ShareImageData['result'] == false) {
            echo json_encode(array('success' => false, 'message' => 'file stream error'));
        } else {
            $data['OgImage'] = $ShareImageData['fileLink'];
            $data['OgWidth'] = $ShareImageData['imageWidth'];
            $data['OgHeight'] = $ShareImageData['imageHeight'];
            $data['Platform'] = $Platform;

            if($IsSamePost == 0) {
                $this->Share_model->update($criteria, $data);
            } else {
                $this->load->model('User_model');
                $ID = $this->session->userdata('ID');
                $userInfo = $this->User_model->getUserInfo($ID);

                $data['Date'] = date('Y-m-d H:i:s');
                $data['DealID'] = $this->input->post('DealID');
                $data['UserID'] = $userInfo['ID'];
                $data['UserName'] = $userInfo['USERNAME'];
                $data['OgTitle'] = $this->input->post('OgTitle');
                $data['OgDescription'] = $this->input->post('OgDescription');

                $ShareID = $this->Share_model->insert($data);
            }

            $this->updateOgLink($ShareID);
            $ShareData = $this->Share_model->getShareDataByID($ShareID);

            echo json_encode(array('success' => true, 'data' => $ShareData));
        }
    }

    public function generateShareImage($imgdata) {
        $resData = [];
        $imgdata = str_replace('data:image/jpeg;base64,', '', $imgdata);
        $imgdata = str_replace(' ', '+', $imgdata);

        $imgdata = base64_decode($imgdata);

        $date = new DateTime();
        $filename = $date->getTimestamp(). '_' . rand(1000, 9999) . '.jpg';
        $shareImageFolder = 'assets/images/shareImages';
        if( ! file_exists($shareImageFolder)) {
            mkdir($shareImageFolder, 0777, true);
        }
        $file = $shareImageFolder . '/' . $filename;

        $fileLink = base_url($file);
        $result = file_put_contents($file, $imgdata);
        $fileSizeArray = getimagesize($file);
        $aspect_ratio = $fileSizeArray[1] / $fileSizeArray[0];
        $imageWidth = 1200;
        $imageHeight = $imageWidth * $aspect_ratio;
        $this->resizeImage($file, $imageWidth, $imageHeight, true);

        if($result == false) {
            $resData['result'] = false;
        }else {
            $resData['result'] = true;
            $resData['fileLink'] = $fileLink;
            $resData['imageWidth'] = $imageWidth;
            $resData['imageHeight'] = $imageHeight;
        }

        return $resData;
    }

    public function setRedirectsCount() {
        $PostID = $this->input->post('PostID');
        $this->load->model('Share_model');
        $this->Share_model->update(array('ID' => $PostID), array('Redirects' => 0));
        echo json_encode(array('success' => true));
    }

    public function deletePostItem() {
        $PostID = $this->input->post('PostID');
        $this->load->model('Share_model');
        $result = $this->Share_model->deletePostItem($PostID);
        echo json_encode($result);
    }

    public function getPostingDataByDealID() {
        $this->load->model('Share_model');
        $this->load->model('Deal_model');
        $DealID = $this->input->post('DealID');
        $orderIndex = $this->input->post('order[0][column]');
        $sort = $this->input->post('order[0][dir]');
        $start = $this->input->post('start');
        $length = $this->input->post('length');

        $data = $this->Share_model->getPostingDataByDealID(
            $DealID,
            $start,
            $length,
            $orderIndex,
            $sort
        );

        $truckData = $this->Deal_model->getTruckById($DealID);
        $firstPostDate = $this->Share_model->getFirstPostDate($DealID);
        $totalViews = $this->Share_model->getTotalViews($DealID);

        header('content-type:application/json');
        echo '{           
            "recordsTotal": ' . $data["recordsTotal"] . ',
            "recordsFiltered" : ' . $data["recordsFiltered"] . ',
            "truckData" : '. json_encode($truckData) .',
            "firstPostDate" : '. json_encode($firstPostDate) .',
            "totalViews" : '. json_encode($totalViews) .',
            "data" : ' . json_encode($data["data"]) . '
        }';
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

    public function changeDateFormat($date) {  // YYYY-MM-DD -> DD/MM/YYYY
        $dateArray = explode('-', $date);
        $dateStr = $dateArray[2].'/'.$dateArray[1].'/'.$dateArray[0];
        return $dateStr;
    }

    public function getTitleFromDatabase($data) {
        $item = null;

        $len = count($this->Special_field_array);
        for ($i = 0; $i < $len; $i++) {
            $element = $this->Special_field_array[$i];

            if ($element['category'] == $data['EqCategory']) {
                $item = $element;
            }
        }

        $titleStr = '';

        if ($item) {
            $titleItemArray = $item['title'];
            $titleUnitObject = $item['unit'];


            for ($i = 0; $i < count($titleItemArray); $i++) {

                if ($data[$titleItemArray[$i]] && $data[$titleItemArray[$i]] != '0') {
                    $titleStr .= $data[$titleItemArray[$i]];
                }

                $unit = isset($titleUnitObject[$titleItemArray[$i]]) ? $titleUnitObject[$titleItemArray[$i]] : '';
                if ($unit) {
                    $titleStr .= ' ';
                    $titleStr .= $unit;
                } else {
                    $titleStr .= " ";
                }
            }

        }

        return $titleStr;
    }

    public function get_detail_data_for_deal($data) {
        $detail_list = [];

        $item = null;

        $len = count($this->Special_field_array);
        for ($i = 0; $i < $len; $i++) {
            $element = $this->Special_field_array[$i];
            if ($element['category'] == $data['EqCategory']) {
                $item = $element;
            }
        }

        if ($item) {
            $detailItemArray = $item['details'];
            $detailUnitObject = $item['unit'];

            $translate_category = $this->get_translated_word($data['EqCategory']);
            if ($translate_category && $data['EqCategory'] != 'Other') {
                array_push($detail_list, $translate_category);
            }else if( $data['EqCategory'] == 'Other'){
                array_push($detail_list, "Llámanos para más información");
            }

            for ($i = 0; $i < count($detailItemArray); $i++) {
                $str = '';
                if ($detailItemArray[$i] == 'Engine') {
                    if ($data['Engine']) {
                        $str = 'Motor: ' . $data['Engine'];
                    } else {
                        $str = '';
                    }
                } else if ($detailItemArray[$i] == 'TruckTrans') {
                    if ($data['TruckTrans']) {
                        $str = 'Trans: ' . $data['TruckTrans'];
                    } else {
                        $str = '';
                    }
                } else if ($detailItemArray[$i] == 'Suspension') {
                    if ($data['Suspension']) {
                        $str = 'Susp: ' . $data['Suspension'];
                    } else {
                        $str = '';
                    }
                } else if ($detailItemArray[$i] == 'Ripper') {
                    if ($data['Ripper'] == 2) {
                        $str = 'Ripper';
                    } else {
                        $str = '';
                    }
                } else if ($detailItemArray[$i] == 'AuxHyd') {
                    if ($data['AuxHyd'] == 2) {
                        $str = "Kit para martillo";
                    } else {
                        $str = '';
                    }
                } else if ($detailItemArray[$i] == '4WD') {
                    if ($data['4WD'] == 2) {
                        $str = "4x4";
                    } else {
                        $str = '4x2';
                    }
                } else if ($detailItemArray[$i] == 'Ext') {
                    if ($data['Ext'] == 2) {
                        $str = 'Ext';
                    } else {
                        $str = '';
                    }
                } else if ($detailItemArray[$i] == 'Length') {
                    if (intval($data['Length'])) {
                        $str = 'Alcance: ' . $data['Length'];
                    } else {
                        $str = '';
                    }

                } else if ($detailItemArray[$i] == 'Hours') {
                    if (intval($data['Hours'])) {
                        $str = $data['Hours'];
                    } else {
                        $str = '';
                    }

                } else if ($detailItemArray[$i] == 'Type') {
                    if ($data['Type']) {
                        $str = $this->get_translated_word($data['Type']);
                    } else {
                        $str = '';
                    }

                } else {
                    if (intval($data[$detailItemArray[$i]]) == 0 | $data[$detailItemArray[$i]] == '') {
                        $str = '';
                    } else {
                        $str = $data[$detailItemArray[$i]];
                    }
                }

                $unit = isset($detailUnitObject[$detailItemArray[$i]]) ? $detailUnitObject[$detailItemArray[$i]] : "";

                if ($str) {

                    if ($unit) {
                        $str .= " " . $unit;
                    } else {
                        $str .= "";
                    }

                    array_push($detail_list, $str);
                }
            }

        }

        return $detail_list;
    }

    public function get_translated_word($word) {
        for ($i = 0; $i < count($this->Tranlate_word_array); $i++) {
            $element = $this->Tranlate_word_array[$i];
            if ($element['english'] == $word) {
                return $element['spanish'];
            }
        }
        return $word;
    }
}