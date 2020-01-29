<?php

namespace App\Http\Controllers\LDAPAuth\User\PurchaseGroup;

use Illuminate\Http\Request;
use App\Http\Controllers\LDAPAuth\User\UserController;
use Illuminate\Support\Facades\DB;

class PurchaseGroupController extends UserController
{
    protected $ldap_users = [];
    protected $filter;
    protected $attributes;
    protected $result;
    protected $users;
    protected $all_users;
    protected $purchase_group = [];
    protected $purchase_group_user;


    public function __construct() {
        parent::__construct();
        //$this->ldapConnect();
        $this->purchase_group_user = new PurchaseGroupUserController();
    }
    
    public function listPurchaseGroupsAdministration(Request $request) {
        $this->purchase_groups = $this->setPurchaseGroups($request->company);
        return response()->json([ "purchasegroup" => $this->purchase_group ]);
    }
    
    public function listUsers(Request $request) {
        //$this->ldapConnect();
        //$this->ldapBind($this->ldap_connect, env('LDAP_USERNAME'), env('LDAP_PASSWORD'));
        if ( $this->bind ) {
            $this->filter = "(&(objectCategory=person))";
            $this->attributes = array("sAMAccountName");
            $this->result = ldap_search($this->ldap_connect, $this->filter, $this->attributes);
            $this->users = ldap_get_entries($this->ldap_connect, $this->result);
            $this->all_users = $this->allUsers($this->users,  $request->company);
            return $this->all_users;
        }
    }
    
    public function getPurchaseGroups($company) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP ][0] )->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][3], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )->select( $this->tables[ self::TBL_PURCHASE_GROUP ][1][0], $this->tables[ self::TBL_PURCHASE_GROUP ][1][1], $this->tables[ self::TBL_PURCHASE_GROUP ][1][2], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][1], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3] )->where( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][4], $company )->orderBy( $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )->get();
    }
    
    public function setPurchaseGroups($company) {
        foreach ( json_decode(json_encode($this->getPurchaseGroups($company), true), true) as $purchase_group ) {
            $tempArr = $this->purchase_group_user->setPurchaseGroupUsers($purchase_group);
            $purchase_group = array_values($purchase_group);
            array_push($purchase_group, $tempArr);
            array_push($this->purchase_group, $purchase_group);
        }
    }
}