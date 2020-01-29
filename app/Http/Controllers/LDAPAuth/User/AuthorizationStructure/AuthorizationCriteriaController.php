<?php

namespace App\Http\Controllers\LDAPAuth\User\AuthorizationStructure;

use Illuminate\Http\Request;
use App\Http\Controllers\LDAPAuth\User\UserController;
use App\Http\Controllers\LDAPAuth\User\AuthorizationStructure\AuthorizationStructurePersonnelController;
use Illuminate\Support\Facades\DB;

class AuthorizationCriteriaController extends UserController
{
    protected $authorization_structure_personnel;

    public function __construct() {
        parent::__construct();
        $this->authorization_structure_personnel = new AuthorizationStructurePersonnelController();
    }

    public function listAuthorizationStuctureCriteria($param) {
        
    }
    
    public function getAuthorizationStructureCriteriaOptions($param) {
        
    }
    
    public function getAuthorizationCriteria($authorization_structure) {
        return DB::table( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0] )->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][2], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][0] )->select( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][1] )->where( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][1], $authorization_structure[ $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] ] )->get();
    }
    
    public function setAuthorizationCriteria($authorization_structure) {
        $tempArr = [];
        foreach ( json_decode(json_encode($this->getAuthorizationCriteria($authorization_structure), true), true) as $authorization_criteria ) {
            array_push($authorization_criteria, $this->authorization_structure_personnel->setAuthorizationStructurePersonnel($authorization_criteria));
            array_push($tempArr, array_values($authorization_criteria));
        }
        return $tempArr;
    }
    
    public function insertAuthorizationCriteria($param) {
        
    }
}
