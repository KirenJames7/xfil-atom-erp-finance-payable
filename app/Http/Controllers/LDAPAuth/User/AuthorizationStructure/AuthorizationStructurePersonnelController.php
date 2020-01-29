<?php

namespace App\Http\Controllers\LDAPAuth\User\AuthorizationStructure;

use Illuminate\Http\Request;
use App\Http\Controllers\LDAPAuth\User\UserController;
use Illuminate\Support\Facades\DB;

class AuthorizationStructurePersonnelController extends UserController
{
    protected $ldap_users = [];
    protected $filter;
    protected $attributes;
    protected $result;
    protected $users;
    protected $all_users;
    
    public function listUserAuthorizationStructures($company, $user_id) {
        return $this->setUserAuthorizationStructures($company, $user_id);
    }
    
    public function getUserAttributes($request) {
        $this->filter = "(&(objectCategory=person))";
        $this->attributes = array("sAMAccountName");
        $this->result = ldap_search($this->ldap_connect, $this->filter, $this->attributes);
        $this->users = ldap_get_entries($this->ldap_connect, $this->result);
        $this->all_users = $this->allUsers($this->users, $request->company);
        return;
    }
    
    public function listUsers(Request $request) {
        $this->ldapConnect();
        $this->ldapBind(env('LDAP_USERNAME'), env('LDAP_PASSWORD'));
        if ( $this->bind ) {
            $this->getUserAttributes($request);
            return response()->json([ "users" => $this->all_users ]);
        }
    }
    
    public function existingUsers($company) {
        //change requried
        //return json_decode(json_encode(DB::table( $this->tables[ self::TBL_USER ][0] )->where([ [ $this->tables[ self::TBL_USER ][1][3], 1 ], [ $this->tables[ self::TBL_USER ][1][4], $company ] ])->distinct()->pluck( $this->tables[ self::TBL_USER ][1][1] ), true));
    }
    
    public function allUsers($users, $company) {
        foreach ($users as $user) {
            if ( $user["samaccountname"][0] ) {
                array_push($this->ldap_users, $user["samaccountname"][0]);
            }
        }
        return array_values(array_diff($this->ldap_users, $this->existingUsers($company)));
    }
    
    public function getAuthorizationStructurePersonnel($authorization_criteria) {
        return DB::table( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->select( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][0], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][3] )->where( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][1], $authorization_criteria[ $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0] ] )->get();
    }
    
    public function setAuthorizationStructurePersonnel($authorization_criteria) {
        $tempArr = [];
        foreach ( json_decode(json_encode($this->getAuthorizationStructurePersonnel($authorization_criteria), true), true) as $authorization_structure_personnel ) {
            array_push($tempArr, array_values($authorization_structure_personnel));
        }
        return $tempArr; 
    }
    
    public function insertAuthorizationStructurePersonnel($param) {
        
    }
    
    public function isUserAuthorizer($user_id, $company) {
        return DB::table( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->where( [ [ $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][2], $user_id ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company ] ] )->exists();
    }
    
    //user auth structs
    public function getUserAuthorizationStructures($company, $user_id) {
        return DB::table( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][1], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][2], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][1], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )
            ->select( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][1], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][1], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3] )
            ->where( [ [ $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL][1][2], $user_id ], [ $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][4], $company ] ] )
            ->get();
    }
    
    public function setUserAuthorizationStructures($company, $user_id) {
        $temp = [];
        foreach ( $this->getUserAuthorizationStructures($company, $user_id) as $structure ) {
            array_push($temp, array_values(json_decode(json_encode($structure, true), true)));
        }
        return $temp;
    }
    
    public function getUserAuthorizerStructures($company, $user_id) {
        return DB::table( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][1], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][2], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][1], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )
            ->where( [ [ $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL][1][2], $user_id ], [ $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][4], $company ] ] )
            ->pluck( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0] );
    }
}
