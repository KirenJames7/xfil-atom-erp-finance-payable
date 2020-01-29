<?php

namespace App\Http\Controllers\LDAPAuth\User\PurchaseGroup;

use Illuminate\Http\Request;
use App\Http\Controllers\LDAPAuth\User\UserController;
use Illuminate\Support\Facades\DB;

class PurchaseGroupUserController extends UserController
{
    const USERS = "users";
    const USERS_JOIN = "users_join";
    
    protected $all_users;
    protected $users;

    public function listUserPurchaseGroups($user_id, $company) {
        return $this->setUserPurchaseGroups($user_id, $company);
    }
    
    public function listUserLeaderGroups($user_id, $company) {
        return $this->setUserLeaderGroups($user_id, $company);
    }
    
    public function isUserApprover($user_id, $company) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], $user_id ], [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][3], 1 ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company ] ] )->exists();
    }
    
    public function isUserLeader($user_id, $company) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], $user_id ], [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][4], 1 ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company ] ] )->exists();
    }
    
    public function getPurchaseGroupUsers($purchase_group) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->select( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][0], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][3], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][4], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][5] )->where( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1], $purchase_group[ $this->tables[ self::TBL_PURCHASE_GROUP ][1][0] ] )->get();
    }
    
    public function setPurchaseGroupUsers($purchase_group) {
        $tempArr = [];
        foreach ( json_decode(json_encode($this->getPurchaseGroupUsers($purchase_group), true), true) as $purchase_group_user ) {
            array_push($tempArr, array_values($purchase_group_user));
        }
        return $tempArr;
    }
    
    public function getUserPurchaseGroups($user_id, $company) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0])->join( $this->tables[ self::TBL_PURCHASE_GROUP ][0], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][3], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )->select( $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][1] )->where( [ [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], $user_id ], [ $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][4], $company ] ] )->orderBy( $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )->get();
    }
    
    public function setUserPurchaseGroups($user_id, $company) {
        $tempArr = [];
        foreach ( json_decode(json_encode($this->getUserPurchaseGroups($user_id, $company) , true), true) as $user_purchase_group ) {
            array_push($tempArr, array_values($user_purchase_group));
        }
        return $tempArr;
    }
    
    public function getUserLeaderGroups($user_id, $company) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], $user_id ], [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][4], 1 ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company ] ] )->pluck($this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1]);
    }
    
    public function setUserLeaderGroups($user_id, $company) {
        return $this->getUserLeaderGroups($user_id, $company);
    }
    
    public function getUserApproverGroups($user_id, $company) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], $user_id ], [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][3], 1 ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company ] ] )->pluck($this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1]);
    }
    
    public function setUserApproverGroups($user_id, $company) {
        return $this->getUserApproverGroups($user_id, $company);
    }
    
    public function getExistingUsers($purchase_group, $company) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->where( [ [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company ], [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1], $purchase_group ] ] )->pluck($this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1]);
    }
    
    public function extractUsers($users) {
        $userArr = [];
        unset($users["count"]);
        foreach ( $users as $user ) {
            array_push($userArr, $user["samaccountname"][0]);
        }
        return $userArr;
    }
    
    public function getAllUsers($purchase_group, $company) {
        $this->ldapConnect();
        $this->ldapBind(env('LDAP_USERNAME'), env('LDAP_PASSWORD'));
        if ( $this->bind ) {
            $this->filter = "(&(objectCategory=person))";
            $this->attributes = array("sAMAccountName");
            $this->result = ldap_search($this->ldap_connect, $this->ldap_config['basedn'], $this->filter, $this->attributes);
            $this->all_users = ldap_get_entries($this->ldap_connect, $this->result);
            
            if ( $purchase_group ) {
                return array_values(array_diff($this->extractUsers($this->all_users), json_decode(json_encode($this->getExistingUsers($purchase_group, $company), true), true)));
            } else {
                return array_values($this->extractUsers($this->all_users));
            }
        }
    }
    
    public function listUsers(Request $request) {
        $this->users = $this->getAllUsers($request->purchase_group, $request->company);
        return response()->json([ "users" => $this->users ]);
    }
}