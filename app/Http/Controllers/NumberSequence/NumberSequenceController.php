<?php

namespace App\Http\Controllers\NumberSequence;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class NumberSequenceController extends Controller
{
    public function getNumberSequenceId($document, $year, $company) {
        return DB::table( $this->tables[ self::TBL_NUMBER_SEQUENCE ][0] )->where( [ [ $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][1], $document ], [ $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][2], $year ], [ $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][8] , $company ], [ $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][7], 1 ] ] )->value( $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][0] );
    }
    
    public function generateNewNumber($document, $year, $company) {
        $id = $this->getNumberSequenceId($document, $year, $company);
        return $this->setNumberPrefix($id, $this->setNumberLength($id, $this->checkLastNumber($id) + 1));
    }
    
    public function checkLastNumber($id) {
        return DB::table( $this->tables[ self::TBL_NUMBER_SEQUENCE ][0] )->where( $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][0], $id )->value( $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][6] );
    }
    
    public function getNumberPrefix($id) {
        return DB::table( $this->tables[ self::TBL_NUMBER_SEQUENCE ][0] )->where( $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][0], $id )->value( $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][4] );
    }
    
    public function setNumberPrefix($id, $new_number) {
        if ( $this->getNumberPrefix($id) ) {
            return $this->getNumberPrefix($id) . $new_number;
        } else {
            return $new_number;
        }
    }
    
    public function getNumberLength($id) {
        return DB::table( $this->tables[ self::TBL_NUMBER_SEQUENCE ][0] )->where( $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][0], $id )->value($this->tables[ self::TBL_NUMBER_SEQUENCE ][1][5]);
    }
    
    public function setNumberLength($id, $new_number) {
        /*rework ->*/$this->updateNumberIncrement($id, $new_number);
        while ( ( $this->getNumberLength($id) - strlen($new_number) ) > 0 ) {
            $new_number =  0 . $new_number;
        }
        return $new_number;
    }
    
    public function updateNumberIncrement($id, $new_number) {
        return DB::table( $this->tables[ self::TBL_NUMBER_SEQUENCE ][0] )->where( $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][0], $id )->update( [ $this->tables[ self::TBL_NUMBER_SEQUENCE ][1][6] => $new_number ] );
    }
}
