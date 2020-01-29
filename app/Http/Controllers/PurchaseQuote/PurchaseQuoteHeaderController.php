<?php

namespace App\Http\Controllers\PurchaseQuote;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\NumberSequence\NumberSequenceController;
use App\Http\Controllers\PurchaseRequest\PurchaseRequestController;
use App\Http\Controllers\PurchaseQuote\PurchaseQuoteLineVersionController;
use App\Http\Controllers\PurchaseQuote\PurchaseQuoteLineController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;

class PurchaseQuoteHeaderController extends Controller
{
    protected $number_sequence;
    protected $purchase_request;
    protected $purchase_quote_headers;
    protected $purchase_quote_line_version;
    protected $purchase_quote_line;
    protected $new_purchase_quote_number;
    protected $new_purchase_quote_expiry;
    
    const DOCUMENT = "Purchase Quote";
    const PURCHASE_QUOTE_VERSION = "purchase_quote_version";
    const LATEST_VERSION_JOIN = "latest_version_join";
    const GRAND_TOTAL = "grand_total";
    const PURCHASE_QUOTE_GRAND_TOTAL = "purchase_quote_grand_total";
    const MAXIMIM_PURCHASE_QUOTE_GRAND_TOTAL = "maximum_purchase_quote_grand_total";
    const MAXIMUM_QUOTE_JOIN = "maximum_quote_join";
    const CRITERIA_VALIDITY = "criteria_validity";
    const REQUIRED_AUTHORIZATION_USERS = "required_authorization_users";
    const REQUIRED_AUTHORIZATION_COUNT = "required_authorization_count";
    const REQUIRED_AUTHORIZATION_SEQUENCE = "required_authorization_sequence";
    const CURRENT_AUTHORIZATION_USERS = "current_authorization_users";
    const CURRENT_AUTHORIZATION_COUNT = "current_authorization_count";
    const CURRENT_AUTHORIZATION_DATES = "current_authorization_dates";
    const AUTHORIZED_PURCHASE_QUOTES_JOIN = "authorized_purchase_quotes_join";
    const CURRENT_AUTHORIZATION_JOIN = "current_authorization_join";
    const PURCHASE_QUOTE_IDS = "purchase_quote_ids";
    
    public function __construct() {
        parent::__construct();
        $this->number_sequence = new NumberSequenceController();
        $this->purchase_request = new PurchaseRequestController();
        $this->purchase_quote_line_version = new PurchaseQuoteLineVersionController();
        $this->purchase_quote_line = new PurchaseQuoteLineController();
    }
    
    public function listPurchaseQuotes(Request $request) {
        $this->getPurchaseQuotes($request->purchase_request);
        return response()->json([ "data" => $this->purchase_quote_headers ]);
    }
    
    public function getPurchaseQuotes($purchase_request) {
        $this->purchase_quote_headers = DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_QUOTE_STATUS ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9], "=", $this->tables[ self::TBL_PURCHASE_QUOTE_STATUS ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_STATUS ][1][0] )
            ->join( $this->tables[ self::TBL_VENDOR ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][3], "=", $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][0] )
            ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][5], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->select( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][1], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][3], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][1], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][2], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][3], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][4], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][5], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][6], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][7], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][8], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][4], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][7], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][8], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9]." AS ".$this->tables[ self::TBL_PURCHASE_QUOTE_STATUS ][1][0], $this->tables[ self::TBL_PURCHASE_QUOTE_STATUS ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_STATUS ][1][1], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][5], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1], DB::raw("DATE(". $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][6] .")"." AS ".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][6]), $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][10], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][11], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][12] )
            ->where( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][2], $purchase_request )
            ->orderBy( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], "ASC" )
            ->get();
    }

    public function newPurchaseQuote(Request $request) {
        if ( $this->purchase_quote_line->setPurchaseQuoteLines($this->purchase_quote_line_version->insertPurchaseQuoteLineVersion($this->insertPurchaseQuoteHeader(Arr::collapse(json_decode($request->get("purchase_quote_header_data"), true)), $request->company), $request->user_id), json_decode($request->get("purchase_quote_line_data"), true)) ) {
            $this->purchase_request->setPurchaseRequestStatus($request->purchase_request, 5);
            return response()->json([ "created" => true, "newpurchasequotenumber" => $this->new_purchase_quote_number ]);
        } else {
            return response()->json([ "created" => false ]);
        }
    }
    
    public function insertPurchaseQuoteHeader($purchase_quote_header, $company) {
        $purchase_quote_header["purchase_quote_number"] = $this->new_purchase_quote_number = $this->number_sequence->generateNewNumber(self::DOCUMENT, date('Y'), $company);
        if ( $purchase_quote_header["vendor"] !== "1" ) {
            return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )->insertGetId( $purchase_quote_header );
        } else {
            //onetime
        }
    }
    
    public function getExpiringPuchaseQuotes() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )->where( DB::raw("DATE_ADD(".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][7].","." INTERVAL ".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][8]." DAY)"), "<=", DB::raw("CURDATE()") )->whereIn( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9], [ 1, 2 ] )->pluck( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0] );
    }
    
    public function setPurchaseQuoteStatus($purchase_quote_id, $status_id) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )->whereIn( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], $purchase_quote_id )->update( [ $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9] => $status_id ] );
    }
    
    public function extendPurchaseQuote(Request $request) {
        if ( $this->setPurchaseQuoteExtention($request->purchase_quote, $request->validity) ) {
            $this->new_purchase_quote_expiry = $this->getPurchaseQuoteNewExpiery($request->purchase_quote);
            return response()->json([ "updated" => true, "newpurchasequoteexpiry" => $this->new_purchase_quote_expiry ]);
        } else {
            return response()->json([ "updated" => false ]);
        }
    }
    
    public function setPurchaseQuoteExtention($purchase_quote, $validity) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )->where( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], $purchase_quote )->update([ $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][8] => $this->getPurchaseQuoteValidity($purchase_quote) + $validity, $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9] => 2 ]);
    }
    
    public function getPurchaseQuoteValidity($purchase_quote) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )->where( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], $purchase_quote )->value( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][8] );
    }
    
    public function getPurchaseQuoteNewExpiery($purchase_quote) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )->where( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], $purchase_quote )->value( DB::raw("DATE_ADD(".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][7].","." INTERVAL ".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][8]." DAY)") );
    }
    
    public function sendPurchaseQuoteForAuthorization(Request $request) {
        if ( $this->setPurchaseQuoteForAuthorization($request->purchase_request) ) {
            return response()->json([ "updated" => true ]);
        } else {
            return response()->json([ "updated" => false ]);
        }
    }
    
    public function setPurchaseQuoteForAuthorization($purchase_request) {
        return $this->purchase_request->setPurchaseQuoteForAuthorization($purchase_request);
    }
    
    public function getAllPurchaseQuotesLatestVersions($statuses) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], "=", $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][1][1] )
            ->join( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][1][0], "=", $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][1] )
            ->select( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], DB::raw("MAX(". $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][1] .")"." AS ".self::PURCHASE_QUOTE_VERSION) )
            ->whereIn( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9], $statuses )
            ->groupBy( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0] );
    }
    
    public function getPurchaseQuoteGrandTotals($statuses) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], "=", $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][1][1] )
            ->join( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][1][0], "=", $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][1] )
            ->join( $this->tables[ self::TBL_PURCHASE_REQUEST ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][2], "=", $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] )
            ->joinSub( $this->getAllPurchaseQuotesLatestVersions($statuses), self::LATEST_VERSION_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][1], "=", self::LATEST_VERSION_JOIN.".".self::PURCHASE_QUOTE_VERSION );
            })
            ->select( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][1], DB::raw("SUM("."("."(".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][6]."*".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][8].")"."-".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][9].")"."+".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][10]."+".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][12]."+".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][13].")"." AS ".self::GRAND_TOTAL) )
            ->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][12], 1 )
            ->groupBy( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][1] );
    }
    
    public function getMaxTotalPurchaseQuotes() {
        return DB::table( DB::raw( "(".$this->getPurchaseQuoteGrandTotals([ 2, 5 ])->toSql().")"." AS ".self::PURCHASE_QUOTE_GRAND_TOTAL ) )
            ->addBinding($this->getPurchaseQuoteGrandTotals([ 2, 5 ])->getBindings(), "select")
            ->select( self::PURCHASE_QUOTE_GRAND_TOTAL.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], DB::raw("MAX(".self::PURCHASE_QUOTE_GRAND_TOTAL.".".self::GRAND_TOTAL.")"." AS ".self::MAXIMIM_PURCHASE_QUOTE_GRAND_TOTAL) )
            ->groupBy( self::PURCHASE_QUOTE_GRAND_TOTAL.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] );
    }
    
    public function getPurchaseQuoteCriteriaValidation() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_GROUP ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][3], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][1] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][2], "=", $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][0] )
            ->joinSub( $this->getMaxTotalPurchaseQuotes(), self::MAXIMUM_QUOTE_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", self::MAXIMUM_QUOTE_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] );
            })
            ->select( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][1], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][1], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][2], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], DB::raw("CASE WHEN ".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][1]."="."'<'"." THEN "."CASE WHEN ".self::MAXIMUM_QUOTE_JOIN.".".self::MAXIMIM_PURCHASE_QUOTE_GRAND_TOTAL."<".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3]." THEN "."1"." ELSE "."0"." END "."WHEN ".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA_OPTION ][1][1]."="."'>'"." THEN "."CASE WHEN ".self::MAXIMUM_QUOTE_JOIN.".".self::MAXIMIM_PURCHASE_QUOTE_GRAND_TOTAL.">=".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][3]." THEN "."1"." ELSE "."0"." END "." END "." AS ".self::CRITERIA_VALIDITY) );
    }
    
    public function getRequiredAuthorization($company) {
        return DB::table( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][1], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][0] )
            ->join( $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0], $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], "=", $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][1] )
            ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->select( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0], DB::raw("GROUP_CONCAT(".$this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][8]." ORDER BY ".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][3].")"." AS ".self::REQUIRED_AUTHORIZATION_USERS), DB::raw("COUNT(".$this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][8].")"." AS ".self::REQUIRED_AUTHORIZATION_COUNT), DB::raw("GROUP_CONCAT(".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][3]." ORDER BY ".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE_PERSONNEL ][1][3].")"." AS ".self::REQUIRED_AUTHORIZATION_SEQUENCE) )
            ->where( [ [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][3], 1 ], [ $this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][0].".".$this->tables[ self::TBL_AUTHORIZATION_STRUCTURE ][1][4], $company ] ] )
            ->groupBy( $this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][0].".".$this->tables[ self::TBL_AUTHORIZATION_CRITERIA ][1][0] );
    }
    
    public function getAuthorizedPurchaseQuotes() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0] )
            ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][4], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->select( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2], DB::raw("COUNT(".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][4].")"." AS ".self::CURRENT_AUTHORIZATION_COUNT), DB::raw("GROUP_CONCAT(".$this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][8]." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][0].")"." AS ".self::CURRENT_AUTHORIZATION_USERS), DB::raw("GROUP_CONCAT("."DATE(".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][1].")"." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][0].")"." AS ".self::CURRENT_AUTHORIZATION_DATES) )
            ->where( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][5], 1 )
            ->whereNotIn( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2], function ($query) {
                $query->select( DB::raw("DISTINCT(". $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2] .")") )
                    ->from( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0] )
                    ->where( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][5], 0 );
            })
            ->groupBy( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2] );
    }
    
    public function getCurrentAuthorizedPurchaseQuotes() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][2] )
            ->leftJoinSub( $this->getAuthorizedPurchaseQuotes(), self::AUTHORIZED_PURCHASE_QUOTES_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], "=", self::AUTHORIZED_PURCHASE_QUOTES_JOIN.".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2] );
            })
            ->select( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], DB::raw("GROUP_CONCAT(".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0]." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0].")"." AS ".self::PURCHASE_QUOTE_IDS), DB::raw("GROUP_CONCAT("."IFNULL(".self::AUTHORIZED_PURCHASE_QUOTES_JOIN.".".self::CURRENT_AUTHORIZATION_COUNT.","."0".")"." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0]." SEPARATOR ';'".")"." AS ".self::CURRENT_AUTHORIZATION_COUNT), DB::raw("GROUP_CONCAT("."IFNULL(".self::AUTHORIZED_PURCHASE_QUOTES_JOIN.".".self::CURRENT_AUTHORIZATION_USERS.","."'null'".")"." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0]." SEPARATOR ';'".")"." AS ".self::CURRENT_AUTHORIZATION_USERS), DB::raw("GROUP_CONCAT("."IFNULL(".self::AUTHORIZED_PURCHASE_QUOTES_JOIN.".".self::CURRENT_AUTHORIZATION_DATES.","."'null'".")"." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0]." SEPARATOR ';'".")"." AS ".self::CURRENT_AUTHORIZATION_DATES) )
            ->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][12], 1 )
            ->whereIn( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9], [ 2, 5 ] )
            ->groupBy( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] );
    }
}
