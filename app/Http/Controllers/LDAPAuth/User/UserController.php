<?php

namespace App\Http\Controllers\LDAPAuth\User;

use Illuminate\Http\Request;
use App\Http\Controllers\LDAPAuth\LDAPAuthController;
use App\Http\Controllers\LDAPAuth\User\PurchaseGroup\PurchaseGroupUserController;
use App\Http\Controllers\LDAPAuth\User\AuthorizationStructure\AuthorizationStructurePersonnelController;
use Illuminate\Support\Facades\DB;

class UserController extends LDAPAuthController
{
    protected $purchase_group_user;
    protected $authorization_structure_personnel;
    protected $filter;
    protected $attributes;
    protected $results;
    protected $session_data;
    protected $user_id;
    const CURRENT_USER = "current_user";
    const CURRENT_USER_ID = "current_user_id";
    const CURRENT_USER_COMPANY = "current_user_company";
    const CURRENT_USER_PRURCHASE_GROUPS = "current_user_purchase_groups";
    const CURRENT_USER_PRURCHASE_GROUP_IDS = "current_user_purchase_group_ids";
    const CURRENT_USER_SYSTEM_ADMINISTRATOR = "current_user_system_administrator";
    const CURRENT_USER_PRURCHASE_PROCUREMENT_GLOBAL = "current_user_purchase_procurement_global";
    const CURRENT_USER_PRURCHASE_ORDER_GLOBAL = "current_user_purchase_order_global";
    const CURRENT_USER_APPROVER = "current_user_approver";
    const CURRENT_USER_APPROVER_GROUPS = "current_user_approver_groups";
    const CURRENT_USER_LEADER = "current_user_leader";
    const CURRENT_USER_LEADER_GROUPS = "current_user_leader_groups";
    const CURRENT_USER_AUTHORIZER = "current_user_authorizer";
    const CURRENT_USER_AUTHORIZATION_STRUCTURES = "current_user_authorization_structures";
    const CURRENT_USER_AUTHORIZER_STRUCTURES = "current_user_authorizer_structures";
    
    public function isUserSystemAdministrator($request) {
        return DB::table( $this->tables[ self::TBL_USER ][0] )->where( [ [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0], $this->user_id ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $request->company ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][5], 1] ] )->exists();
    }
    
    public function isUserPurchaseProcurementGlobal($request) {
        return DB::table( $this->tables[ self::TBL_USER ][0] )->where( [ [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0], $this->user_id ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $request->company ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][6], 1] ] )->exists();
    }
    
    public function isUserPurchaseOrderGlobal($request) {
        return DB::table( $this->tables[ self::TBL_USER ][0] )->where( [ [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0], $this->user_id ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $request->company ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][7], 1] ] )->exists();
    }
    
    public function setUserSession($session_data) {
        session([
            self::CURRENT_USER => $session_data[0]["displayname"][0]
        ]);
        return;
    }
    
    public function getUserAttributes($username) {
        $this->filter = "(&(samAccountName=$username))";
        $this->attributes = array("sAMAccountName", "displayName", "mail");
        $this->result = ldap_search($this->ldap_connect, $this->ldap_config['basedn'], $this->filter, $this->attributes);
        $this->setUserSession(ldap_get_entries($this->ldap_connect, $this->result));
        return;
    }
    
    public function userAuthentication($request) {
        $this->purchase_group_user = new PurchaseGroupUserController();
        $this->authorization_structure_personnel = new AuthorizationStructurePersonnelController();
        $this->ldapConnect();
        $this->ldapBind($request->username, $request->password);
        if ( $this->bind ) {
            $this->getUserAttributes($request->username);
            return response()->json([ "authenticated" => $this->bind, "session" => [ self::CURRENT_USER => session(self::CURRENT_USER), self::CURRENT_USER_ID => $this->user_id, self::CURRENT_USER_COMPANY => $request->company, self::CURRENT_USER_PRURCHASE_GROUPS => $this->purchase_group_user->listUserPurchaseGroups($this->user_id, $request->company), self::CURRENT_USER_SYSTEM_ADMINISTRATOR => $this->isUserSystemAdministrator($request), self::CURRENT_USER_PRURCHASE_PROCUREMENT_GLOBAL => $this->isUserPurchaseProcurementGlobal($request), self::CURRENT_USER_PRURCHASE_ORDER_GLOBAL => $this->isUserPurchaseOrderGlobal($request), self::CURRENT_USER_APPROVER => $this->purchase_group_user->isUserApprover($this->user_id, $request->company), self::CURRENT_USER_APPROVER_GROUPS => $this->purchase_group_user->getUserApproverGroups($this->user_id, $request->company), self::CURRENT_USER_LEADER => $this->purchase_group_user->isUserLeader($this->user_id, $request->company), self::CURRENT_USER_LEADER_GROUPS => $this->purchase_group_user->listUserLeaderGroups($this->user_id, $request->company), self::CURRENT_USER_AUTHORIZER => $this->authorization_structure_personnel->isUserAuthorizer(3, $request->company), self::CURRENT_USER_AUTHORIZATION_STRUCTURES => $this->authorization_structure_personnel->listUserAuthorizationStructures($request->company, 3), self::CURRENT_USER_AUTHORIZER_STRUCTURES => $this->authorization_structure_personnel->getUserAuthorizerStructures($request->company, 3) ] ]);
        } else {
            return response()->json([ "authenticated" => $this->bind ]);
        }
    }
    
    public function userAuthorization($request) {
        if ( DB::table( $this->tables[ self::TBL_USER ][0] )->where( [ [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1], $request->username ], [ $this->tables[ self::TBL_USER ][1][3], 1 ], [ $this->tables[ self::TBL_USER ][1][4], $request->company ] ] )->exists() ) {
            $this->user_id = DB::table( $this->tables[ self::TBL_USER ][0] )->where( [ [ $this->tables[ self::TBL_USER ][1][1], $request->username ], [ $this->tables[ self::TBL_USER ][1][4], $request->company ] ] )->value( $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] );
            return $this->userAuthentication($request);
        } else {
            return response()->json([ "unauthorized" => true ]);
        }
    }
    
    public function userSignIn(Request $request) {
        return $this->userAuthorization($request);
    }
    
    public function userUnauthenticate() {
        session()->flush();
        if (empty(session()->all())) {
            return response()->json([ "unauthenticated" => true ]);
        }
    }
    
    public function userSignOut() {
        return $this->userUnauthenticate();
    }
    
    public function userSessionActiveCheck() {
        if ( session()->has(self::CURRENT_USER) ) {
            return response()->json(true);
        } else {
            return response()->json(false);
        }
    }
}