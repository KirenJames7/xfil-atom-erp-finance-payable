<?php

namespace App\Http\Controllers\LDAPAuth\User\AuthorizationStructure;

use Illuminate\Http\Request;
use App\Http\Controllers\LDAPAuth\User\UserController;

class AuthorizationStructureCriteriaOptionController extends UserController
{
    protected $criteria_options;

    public function insertCriteriaOption($param) {
        //add new criteria options
    }
    
    public function listCriteriaOptions() {
        $this->criteria_options = DB::table( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_CRITERIA_OPTION ][0] )->distinct()->pluck( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_CRITERIA_OPTION ][1][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_CRITERIA_OPTION ][1][1] );
        return response()->json([ "criteria_options" => $this->criteria_options ]);
    }
}