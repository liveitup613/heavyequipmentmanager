<?php

class User_model extends CI_Model {

    private $tblname = 'tbluser';
    
    public function login($username, $password) {

        $this->db->select('ID, USERNAME, LANGUAGE');
        $this->db->where('USERNAME', $username);
        $this->db->where('PASSWORD', $password);
        $this->db->where('PERMISSION !=', 'disabled');
        $this->db->limit(1);
        $this->db->from('tbluser');
        $ret = $this->db->get()->row_array();

        if ($ret == null)
            return null;

        return $ret;
    }

    public function getUserInfo($ID) {

        $this->db->select('concat(NAME, " ", LASTNAME) as FULLNAME');
        $this->db->select('PROFILEPICTURE, EMAIL, PHONE, NAME, LASTNAME, USERNAME, PERMISSION, ID, SUPERVISOR, SALESREP, VERIFY, SURVEY, LEADS, EMPLOYEE, ACCOUNTING, NOAUTOASSIGN');
        $this->db->from('tbluser');
        $this->db->where('ID', $ID);
        return $this->db->get()->row_array();
    }

    public function getUserPhoto($ID){
        $this->db->select('PROFILEPICTURE');
        $this->db->from('tbluser');
        $this->db->where('ID', $ID);
        return $this->db->get()->row_array();
    }

    public function getAll() {

        $this->db->select('*');
        $this->db->from('tbluser');
        $this->db->where('USERNAME !=','m@cHunter' );
        $this->db->order_by('PERMISSION');
        return $this->db->get()->result_array();
    }


    public function getAllUser() {
        $this->db->select('*');
        $this->db->from('tbluser');
        return $this->db->get()->result_array();
    }

    public function addUser($data) {
        
        $this->db->insert('tbluser', $data);

        $this->db->select('ID');
        $this->db->where($data);
        $this->db->from('tbluser');
        $ret = $this->db->get()->row_array();

        return $ret['ID'];
    }

    public function update($criteria, $data) {
        $this->db->where($criteria);
        $this->db->update('tbluser', $data);

        $this->db->select('ID');
        $this->db->where($criteria);
        $this->db->from('tbluser');
        $result = $this->db->get()->row_array();
        if ($result == null)
            return null;
        return $result['ID'];
    }


    public function getPassword($ID){
        $this->db->select('PASSWORD');
        $this->db->from('tbluser');
        $this->db->where('ID', $ID);
        return $this->db->get()->row_array();
    }
     
    public function savePassword($ID, $newPassword){
        $data = array('PASSWORD'=>$newPassword);
        $this->db->where('ID', $ID);
        $this->db->update('tbluser', $data);
    }

    public function deleteUser($ID) {
        $this->db->where('ID', $ID);
        $this->db->delete('tbluser');
    }

    public function getConfigurationData(           
        $searchText,
        $supervisor,
        $salesRep,
        $verify,
        $survey,            
        $leads,
        $orderIndex,
        $sort,
        $start,
        $length
    )
    {
        $this->db->from($this->tblname);
        $this->db->where('USERNAME !=', 'm@cHunter');
        $totalCount = $this->db->count_all_results();

        $this->db->select('*');             
        if ($searchText != '')   {
            $this->db->group_start();
            $this->db->like('USERNAME', $searchText);
            $this->db->group_end();
        }               
        if ($supervisor != 'All')
            $this->db->where('SUPERVISOR', $supervisor);
        if ($salesRep != 'All')
            $this->db->where('SALESREP', $salesRep);
        if ($verify != 'All')
            $this->db->where('VERIFY', $verify);        
        if ($survey != 'All')
            $this->db->where('SURVEY', $survey); 
        if ($leads != 'All')
            $this->db->where('LEADS', $leads); 
        
        $this->db->from($this->tblname);    
        $this->db->where('USERNAME !=', 'm@cHunter');
        $this->db->where('PERMISSION !=', 'disabled');
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
}