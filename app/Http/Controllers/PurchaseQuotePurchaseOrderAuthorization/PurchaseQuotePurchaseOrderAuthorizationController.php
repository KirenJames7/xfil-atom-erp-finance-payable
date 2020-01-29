<?php

namespace App\Http\Controllers\PurchaseQuotePurchaseOrderAuthorization;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PurchaseQuote\PurchaseQuoteHeaderController;
use App\Http\Controllers\PurchaseQuote\PurchaseQuoteLineController;
use Illuminate\Support\Facades\DB;

class PurchaseQuotePurchaseOrderAuthorizationController extends Controller
{
    protected $purchase_quote_header_controller;
    protected $purchase_quote_line_controller;
    protected $purchase_quote_authorization;
    protected $purchase_request_purchase_quote_authorization;
    protected $purchase_request_purchase_quote_purchase_quote_lines_authorization;
    protected $purchase_quote_purchase_order_authorize_reject_insert;
    
    const QUOTE_COUNT = "quote_count";
    const PURCHASE_REQUEST = "purchase_request";
    const PURCHASE_REQUEST_CREATED_DATE = "purchase_request_created_date";
    const CRITERIA_VALIDATION_JOIN = "criteria_validation_join";
    const CRITERIA_VALIDATION = "criteria_validation";
    const CRITERIA_VALIDITY = "criteria_validity";
    const REQUIRED_AUTHORIZATION_JOIN = "required_authorization_join";
    const CURRENT_AUTHORIZATION_JOIN = "current_authorization_join";
    const CURRENT_AUTHORIZATION_COUNT = "current_authorization_count";
    const REQUIRED_AUTHORIZATION_USERS = "required_authorization_users";
    const REQUIRED_AUTHORIZATION_COUNT = "required_authorization_count";
    const REQUIRED_AUTHORIZATION_SEQUENCE = "required_authorization_sequence";
    const CURRENT_AUTHORIZATION_USERS = "current_authorization_users";
    const CURRENT_AUTHORIZATION_DATES = "current_authorization_dates";
    const AUTHORIZED_PURCHASE_QUOTES_JOIN = "authorized_purchase_quotes_join";
    const PURCHASE_QUOTE_IDS = "purchase_quote_ids";
    const PURCHASE_QUOTE_GRAND_TOTAL_JOIN = "purchase_quote_grand_total_join";
    const GRAND_TOTAL = "grand_total";
    const MAXIMUM_QUOTE_JOIN = "maximum_quote_join";
    const MAXIMUM_PURCHASE_QUOTE_GRAND_TOTAL = "maximum_purchase_quote_grand_total";
    
    public function __construct() {
        parent::__construct();
        $this->purchase_quote_header_controller = new PurchaseQuoteHeaderController();
        $this->purchase_quote_line_controller = new PurchaseQuoteLineController();
    }

    public function listPurchaseQuotesForAuthorization(Request $request) {
        $this->getPurchaseQuotesForAuthorization($request->company, $request->user_id);
        return response()->json([ "purchase_quote_authorization" => $this->purchase_quote_authorization ]);
    }
    
    public function listPurchaseRequestPurchaseQuotesForAuthorization(Request $request) {
        $this->getPurchaseRequestPurchaseQuotesForAuthorization($request->purchase_request, $request->company);
        return response()->json([ "purchase_request_purchase_quote_authorization" => $this->purchase_request_purchase_quote_authorization ]);
    }
    
    public function listPurchaseRequestPurchaseQuotesPurchaseQuoteLinesForAuthorization(Request $request) {
        $this->purchase_request_purchase_quote_purchase_quote_lines_authorization = $this->purchase_quote_line_controller->getPurchaseQuoteLines($request->purchase_quote);
        return response()->json([ "data" => $this->purchase_request_purchase_quote_purchase_quote_lines_authorization ]);
    }
    
    public function getPurchaseQuotesForAuthorization($company, $user_id) {
        //DB::enableQueryLog();
        $this->purchase_quote_authorization = DB::table( DB::raw( "(".$this->getPurchaseRequestInformation()->toSql().")"." AS ".self::PURCHASE_REQUEST ) )
            ->addBinding($this->getPurchaseRequestInformation()->getBindings(), "select")
            ->joinSub( $this->purchase_quote_header_controller->getPurchaseQuoteCriteriaValidation(), self::CRITERIA_VALIDATION_JOIN, function ($join) {
                $join->on( self::PURCHASE_REQUEST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] );
            })
            ->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0], self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][1] )
            ->joinSub( $this->purchase_quote_header_controller->getRequiredAuthorization($company), self::REQUIRED_AUTHORIZATION_JOIN, function ($join) {
                $join->on( self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], "=", self::REQUIRED_AUTHORIZATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0] );
            })
            ->joinSub( $this->purchase_quote_header_controller->getCurrentAuthorizedPurchaseQuotes(), self::CURRENT_AUTHORIZATION_JOIN, function ($join) {
                $join->on( self::PURCHASE_REQUEST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", self::CURRENT_AUTHORIZATION_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] );
            })
            ->select( self::PURCHASE_REQUEST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], self::PURCHASE_REQUEST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][1], self::PURCHASE_REQUEST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][2], DB::raw("DATE(".self::PURCHASE_REQUEST.".".self::PURCHASE_REQUEST_CREATED_DATE.")"." AS ".self::PURCHASE_REQUEST_CREATED_DATE), self::PURCHASE_REQUEST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][6], self::PURCHASE_REQUEST.".".$this->tables[ self::TBL_USER ][1][8], self::PURCHASE_REQUEST.".".self::QUOTE_COUNT, self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0], self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][1], self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3], self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][1], self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][2], self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], self::CRITERIA_VALIDATION_JOIN.".".self::CRITERIA_VALIDITY, self::REQUIRED_AUTHORIZATION_JOIN.".".self::REQUIRED_AUTHORIZATION_USERS, DB::raw("IF(".self::REQUIRED_AUTHORIZATION_JOIN.".".self::REQUIRED_AUTHORIZATION_SEQUENCE.",".self::REQUIRED_AUTHORIZATION_JOIN.".".self::REQUIRED_AUTHORIZATION_COUNT.","."1".")"." AS ".self::REQUIRED_AUTHORIZATION_COUNT), self::REQUIRED_AUTHORIZATION_JOIN.".".self::REQUIRED_AUTHORIZATION_SEQUENCE, self::CURRENT_AUTHORIZATION_JOIN.".".self::PURCHASE_QUOTE_IDS, self::CURRENT_AUTHORIZATION_JOIN.".".self::CURRENT_AUTHORIZATION_COUNT, self::CURRENT_AUTHORIZATION_JOIN.".".self::CURRENT_AUTHORIZATION_USERS, self::CURRENT_AUTHORIZATION_JOIN.".".self::CURRENT_AUTHORIZATION_DATES, $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][3] )
            ->where( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][2], 3 )
            ->whereRaw( "RIGHT(".self::CURRENT_AUTHORIZATION_JOIN.".".self::CURRENT_AUTHORIZATION_COUNT.","." CHAR_LENGTH(".self::CURRENT_AUTHORIZATION_JOIN.".".self::CURRENT_AUTHORIZATION_COUNT.")"."-"." LOCATE("."';'".",".self::CURRENT_AUTHORIZATION_JOIN.".".self::CURRENT_AUTHORIZATION_COUNT.")".")"."+"."0"."=".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][3]."-"."1" )
            ->whereIn( self::CRITERIA_VALIDATION_JOIN.".".self::CRITERIA_VALIDITY, [ null, 1 ] )
            ->get();
            //dd(DB::getQueryLog());
    }
    
    public function getPurchaseRequestInformation() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )
            ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][6], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][2] )
            ->join( $this->tables[ self::TBL_PURCHASE_GROUP ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][3], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )
            ->select( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][1], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][2], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][7], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][6], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][8], DB::raw("COUNT(". $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0] .")"." AS ".self::QUOTE_COUNT) )
            ->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][12], 1 )
            ->whereIn( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9], [ 2, 5 ] )
            ->groupBy( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] );
    }
    
    public function getPurchaseQuoteCriteriaValidation($purchase_request) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_GROUP ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][3], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][1] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][2], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][0] )
            ->joinSub( $this->purchase_quote_header_controller->getMaxTotalPurchaseQuotes(), self::MAXIMUM_QUOTE_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", self::MAXIMUM_QUOTE_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] );
            })
            ->select( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][1], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][1], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][2], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], DB::raw("CASE WHEN ".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][1]."="."'<'"." THEN "."CASE WHEN ".self::MAXIMUM_QUOTE_JOIN.".".self::MAXIMUM_PURCHASE_QUOTE_GRAND_TOTAL."<".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3]." THEN "."1"." ELSE "."0"." END "."WHEN ".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][1]."="."'>'"." THEN "."CASE WHEN ".self::MAXIMUM_QUOTE_JOIN.".".self::MAXIMUM_PURCHASE_QUOTE_GRAND_TOTAL.">=".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3]." THEN "."1"." ELSE "."0"." END "." END "." AS ".self::CRITERIA_VALIDITY) )
            ->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $purchase_request );
    }
    
    public function getPurchaseRequestPurchaseQuotesForAuthorization($purchase_request, $company) {
        $this->purchase_request_purchase_quote_authorization = DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )->join( $this->tables[ self::TBL_VENDOR ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][3], "=", $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][0] )->join( $this->tables[ self::TBL_PURCHASE_REQUEST ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][2], "=", $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] )->join( $this->tables[ self::TBL_PURCHASE_GROUP ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][3], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][1] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][5], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->joinSub( $this->purchase_quote_header_controller->getRequiredAuthorization($company), self::REQUIRED_AUTHORIZATION_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], "=", self::REQUIRED_AUTHORIZATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0]  );
            })
            ->leftJoinSub( $this->purchase_quote_header_controller->getAuthorizedPurchaseQuotes(), self::CURRENT_AUTHORIZATION_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], "=", self::CURRENT_AUTHORIZATION_JOIN.".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2] );
            })
            ->joinSub( $this->getPurchaseQuoteCriteriaValidation($purchase_request), self::CRITERIA_VALIDATION_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], "=", self::CRITERIA_VALIDATION_JOIN.".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0] );
            })
            ->joinSub( $this->purchase_quote_header_controller->getPurchaseQuoteGrandTotals([ 2, 5 ]), self::PURCHASE_QUOTE_GRAND_TOTAL_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], "=", self::PURCHASE_QUOTE_GRAND_TOTAL_JOIN.".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0] );
            })
            ->select( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][1], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][1], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][2], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][4], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][1], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][8], self::REQUIRED_AUTHORIZATION_JOIN.".".self::REQUIRED_AUTHORIZATION_COUNT, self::REQUIRED_AUTHORIZATION_JOIN.".".self::REQUIRED_AUTHORIZATION_USERS, self::REQUIRED_AUTHORIZATION_JOIN.".".self::REQUIRED_AUTHORIZATION_SEQUENCE, DB::raw("IFNULL(".self::CURRENT_AUTHORIZATION_JOIN.".".self::CURRENT_AUTHORIZATION_COUNT.","."0".")"." AS ".self::CURRENT_AUTHORIZATION_COUNT), self::CURRENT_AUTHORIZATION_JOIN.".".self::CURRENT_AUTHORIZATION_USERS, self::CURRENT_AUTHORIZATION_JOIN.".".self::CURRENT_AUTHORIZATION_DATES, self::PURCHASE_QUOTE_GRAND_TOTAL_JOIN.".".self::GRAND_TOTAL )
            ->where( [ [ $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][2], $purchase_request ], [ $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][12], 1 ] ] )
            ->whereIn( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9], [ 2, 5 ] )
            ->whereIn( self::CRITERIA_VALIDATION_JOIN.".".self::CRITERIA_VALIDITY, [ null, 1 ] )
            ->get();
    }
    
    public function authorizePurchaseQuote(Request $request) {
        if ( $this->setAuthorizePurchaseQuote($request) ) {
            return response()->json([ "authorized" => true ]);
        } else {
            return response()->json([ "authorized" => false ]);
        }
    }
    
    public function setAuthorizePurchaseQuote($request) {
        $this->purchase_quote_purchase_order_authorize_reject_insert = array(
            "authorized_purchase_quote" => $request->purchase_quote_id,
            "purchase_quote_purchase_order_authorized_rejected" => 1,
            "authorized_by" => $request->user_id,
            "purchase_quote_purchase_order_authorization_remark" => $request->remark
        );
        
        if ( $this->insertPurchaseQuotePurchaseOrderAuthorizeReject() && $this->checkAuthorizationComplete($request->purchase_quote_id) ) {
            return $this->purchase_quote_header_controller->setPurchaseQuoteStatus([ $request->purchase_quote_id ], 6);
        } else {
            return $this->purchase_quote_header_controller->setPurchaseQuoteStatus([ $request->purchase_quote_id ], 5);
        }
    }
    
    public function rejectPurchaseQuote(Request $request) {
        if ( $this->setRejectPurchaseQuote($request) ) {
            return response()->json([ "rejected" => true ]);
        } else {
            return response()->json([ "rejected" => false ]);
        }
    }
    
    public function setRejectPurchaseQuote($request) {
        $this->purchase_quote_purchase_order_authorize_reject_insert = array(
            "authorized_purchase_quote" => $request->purchase_quote_id,
            "purchase_quote_purchase_order_authorized_rejected" => 0,
            "authorized_by" => $request->user_id,
            "purchase_quote_purchase_order_authorization_remark" => $request->remark
        );
        
        if ( $this->insertPurchaseQuotePurchaseOrderAuthorizeReject() ) {
            return $this->purchase_quote_header_controller->setPurchaseQuoteStatus([ $request->purchase_quote_id ], 4);
        }
    }
    
    public function insertPurchaseQuotePurchaseOrderAuthorizeReject() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0] )->insert( $this->purchase_quote_purchase_order_authorize_reject_insert );
    }
    
    public function checkAuthorizationComplete($purchase_quote_id) {
        return $this->getPurchaseQuoteRequiredAuthorizationCount($purchase_quote_id) === $this->getPurchaseQuoteCurrentAuthorizationCount($purchase_quote_id);
    }
    
    public function getPurchaseQuoteRequiredAuthorizationCount($purchase_quote_id) {
        if ( DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )->join( $this->tables[ self::TBL_PURCHASE_REQUEST ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][2], "=", $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] )->join( $this->tables[ self::TBL_PURCHASE_GROUP ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][3], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], $purchase_quote_id ], [ $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][2], 1 ] ] )->exists() ) {
            return DB::table(DB::raw( "(".$this->purchase_quote_header_controller->getPurchaseQuoteCriteriaValidation()->toSql().")"." AS ".self::CRITERIA_VALIDATION ) )
                ->addBinding($this->purchase_quote_header_controller->getPurchaseQuoteCriteriaValidation()->getBindings(), "select")
                ->join( $this->tables[ self::TBL_PURCHASE_REQUEST ][0], self::CRITERIA_VALIDATION.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] )
                ->join( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][2] )
                ->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0], self::CRITERIA_VALIDATION.".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0] )
                ->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][1] )
                ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
                ->where( [ [ $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], $purchase_quote_id ], [ self::CRITERIA_VALIDATION.".".self::CRITERIA_VALIDITY, 1 ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][3], 1 ] ] )
                ->get()->count();
        } else {
            return 1;
        }
    }
    
    public function getPurchaseQuoteCurrentAuthorizationCount($purchase_quote_id) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2], $purchase_quote_id ], [ $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][5], 1 ] ] )->count();
    }
    
    public function updateAuthorizedPurchaseOrder($purchase_quote_id, $purchase_order_id) {
        if ( DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0] )->where( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2], $purchase_quote_id )->update( [ $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][3] => $purchase_order_id ] ) ) {
            return $purchase_order_id;            
        }
    }
}
