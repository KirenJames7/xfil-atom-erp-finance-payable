<?php

namespace App\Http\Controllers\LDAPAuth\User\UserManagement;

use Illuminate\Http\Request;
use App\Http\Controllers\LDAPAuth\User\UserController;
use Illuminate\Support\Facades\DB;

class UserManagementController extends UserController
{
    protected $users = []; 

    public function listUsers(Request $request) {
        $this->setUsers($request->company);
        return response()->json([ "usermanagement" => $this->users ]);
    }
    
    public function listExistingUsers() {
        $test = $this->getExisingUsers("PV 3716");
        return response()->json([ "currentuser" => $test ]);
    }
    
    public function getUsers($company) {
        return DB::table( $this->tables[ self::TBL_USER ][0] )->select( $this->tables[ self::TBL_USER ][1][0], $this->tables[ self::TBL_USER ][1][1], $this->tables[ self::TBL_USER ][1][5], $this->tables[ self::TBL_USER ][1][6], $this->tables[ self::TBL_USER ][1][7] )->where( [ [ $this->tables[ self::TBL_USER ][1][3], 1 ], [ $this->tables[ self::TBL_USER ][1][4], $company ] ] )->get();
    }
    
    public function setUsers($company) {
        foreach ( json_decode(json_encode($this->getUsers($company), true), true) as $user ) {
            array_push($this->users, array_values($user));
        }
    }
    
    public function getExisingUsers($company) {
        return DB::table( $this->tables[ self::TBL_USER ][0] )->where([ [ $this->tables[ self::TBL_USER ][1][3], 1 ], [ $this->tables[ self::TBL_USER ][1][4], $company ]  ] )->pluck( $this->tables[ self::TBL_USER ][1][1] );
    }
}
