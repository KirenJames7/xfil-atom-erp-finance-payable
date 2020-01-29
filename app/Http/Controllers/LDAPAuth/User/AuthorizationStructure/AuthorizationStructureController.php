<?php

namespace App\Http\Controllers\LDAPAuth\User\AuthorizationStructure;

use Illuminate\Http\Request;
use App\Http\Controllers\LDAPAuth\User\UserController;
use App\Http\Controllers\LDAPAuth\User\AuthorizationStructure\AuthorizationCriteriaController;
use Illuminate\Support\Facades\DB;

class AuthorizationStructureController extends UserController
{
    protected $authorization_criteria;
    protected $authorization_structure = [];

    public function __construct() {
        parent::__construct();
        $this->authorization_criteria = new AuthorizationCriteriaController();
    }

    public function listAuthorizationStructures(Request $request) {
        $this->setAuthorizationStructures($request->company);
        return response()->json([ "authorizationstructure" => $this->authorization_structure ]);
    }
    
    public function getAuthorizationStrucutres($company) {
        return DB::table( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0] )->select( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][1], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][2], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3] )->where( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][4], $company )->get();
    }
    
    public function setAuthorizationStructures($company) {
        foreach ( json_decode(json_encode($this->getAuthorizationStrucutres($company), true), true) as $authorization_structure ) {
            $tempArr = $this->authorization_criteria->setAuthorizationCriteria($authorization_structure);
            $authorization_structure = array_values($authorization_structure);
            array_push($authorization_structure, $tempArr);
            array_push($this->authorization_structure, $authorization_structure);
        }
    }
    
    public function insertAuthorizationStructure(Request $request) {
        
    }
}