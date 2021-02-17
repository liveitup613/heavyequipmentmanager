<?php
defined('BASEPATH') or exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

class Share extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        //MY_Output's disable_cache() method
        date_default_timezone_set('America/Phoenix');
        $this->output->disable_cache();
    }

    public function publishment($PublicID) {
        $this->load->model('Share_model');
        $this->load->model('Redirects_model');

        $denyOrg = ['facebook', 'whatsapp', 'google', 'gmail', 'slack'];
        $targetCount = count($denyOrg);
        $isDeny = false; $i = 0;

        $PublicID = base64_decode($PublicID);
        $ShareID = explode('_', $PublicID)[2];

        $IP = $this->get_client_ip();
        $query = @unserialize(file_get_contents('http://ip-api.com/php/' . $IP));

        $org = isset($query['org']) ? $query['org'] : 'Unknown';
        $isp = isset($query['isp']) ? $query['isp'] : 'Unknown';
        $org = strtolower($org);
        $isp = strtolower($isp);

        while ($i < $targetCount) {
            if(strpos($org, $denyOrg[$i]) !== false || strpos($isp, $denyOrg[$i]) !== false) {
                $isDeny = true;
                break;
            }
            $i++;
        }

        if(!$isDeny) {
            $RedirectData = array();
            $RedirectData['PostID']         = $ShareID;
            $RedirectData['IP']             = $IP;
            $RedirectData['Country']        = isset($query['country']) ? $query['country'] : 'Unknown';
            $RedirectData['CountryCode']    = isset($query['countryCode']) ? $query['countryCode'] : 'Unknown';
            $RedirectData['City']           = isset($query['city']) ? $query['city'] : 'Unknown';
            $RedirectData['State']          = isset($query['regionName']) ? $query['regionName'] : 'Unknown';
            $RedirectData['Zip']            = isset($query['zip']) ? $query['zip'] : 'Unknown';
            $RedirectData['lat']            = isset($query['lat']) ? $query['lat'] : 'Unknown';
            $RedirectData['lon']            = isset($query['lon']) ? $query['lon'] : 'Unknown';

            $today = time();
            $Date = date('Y-m-d H:i:s', $today);

            $RedirectData['Date']           = $Date;

            $RID = $this->Redirects_model->insert($RedirectData);

            $ShareData = $this->Share_model->getShareDataByID($ShareID);
            $this->Share_model->update(array('ID' => $ShareID), array('Redirects' => $ShareData['Redirects'] + 1));
            if($ShareData['Platform'] == 'WhatsApp' || $ShareData['Platform'] == 'Gmail') {
                if($this->Redirects_model->getTotalCountByShareID($ShareID) == 1) {
                    $this->Share_model->update(array('ID' => $ShareID), array('Redirects' => 0));
                }
            }
        }

        $ShareData = $this->Share_model->getShareDataByID($ShareID);

        $this->db->select('*');
        $this->db->where('ID', $ShareData['DealID']);
        $this->db->from('viewActiveDeals');
        $DealData =  $this->db->get()->row_array();

        $redirect_link = "https://www.maquinariajr.com";
        if($DealData['MaquinariaJRLink']) {
            $redirect_link = $DealData['MaquinariaJRLink'];
        }
        $ShareData['redirect_link'] = $redirect_link;
        $ShareData['primary_link'] = base_url('assets/images/primaryImages/').$DealData['PrimaryImage'];
        $this->load->view('publish/shared', $ShareData);
    }

    public function get_client_ip() {
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if(isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }
}