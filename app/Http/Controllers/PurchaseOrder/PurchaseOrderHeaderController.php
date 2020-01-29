<?php

namespace App\Http\Controllers\PurchaseOrder;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PurchaseQuote\PurchaseQuoteHeaderController;
use App\Http\Controllers\PurchaseQuote\PurchaseQuoteLineController;
use App\Http\Controllers\NumberSequence\NumberSequenceController;
use App\Http\Controllers\PurchaseOrder\PurchaseOrderLineVersionController;
use App\Http\Controllers\PurchaseOrder\PurchaseOrderLineController;
use App\Http\Controllers\PurchaseQuotePurchaseOrderAuthorization\PurchaseQuotePurchaseOrderAuthorizationController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;

class PurchaseOrderHeaderController extends Controller
{
    protected $purchase_quote_header_controller;
    protected $purchase_quote_line_controller;
    protected $number_sequence_controller;
    protected $purchase_order_line_version_controller;
    protected $purchase_order_line_controller;
    protected $purchase_quote_purchase_order_authorization_controller;
    protected $purchase_orders;
    protected $purchase_quotes_for_purchase_order;
    protected $authorized_purchase_quote_lines;
    protected $new_purchase_order_number;

    const DOCUMENT = "Purchase Order";
    const PURCHASE_QUOTE_GRAND_TOTAL_JOIN = "purchase_quote_grand_total_join";
    const GRAND_TOTAL = "grand_total";
    const AUTHORIZED_USERS = "authorized_users";
    const AUTHORIZED_DATES = "authorized_dates";
    const PURCHASE_ORDER_AUTHORIZATION_JOIN = "purchase_order_authorization_join";
    const PURCHASE_QUOTE_AUTHORIZATION_JOIN = "purchase_quote_authorization_join";
    
    public function __construct() {
        parent::__construct();
        $this->purchase_quote_header_controller = new PurchaseQuoteHeaderController();
        $this->purchase_quote_line_controller =  new PurchaseQuoteLineController();
        $this->number_sequence_controller = new NumberSequenceController();
        $this->purchase_order_line_version_controller = new PurchaseOrderLineVersionController();
        $this->purchase_order_line_controller = new PurchaseOrderLineController();
        $this->purchase_quote_purchase_order_authorization_controller = new PurchaseQuotePurchaseOrderAuthorizationController();
    }
    
    public function listAllPurchaseOrders(Request $request) {
        $this->getAllPurchaseOrders($request->company);
        return response()->json([ "purchase_orders" => $this->purchase_orders ]);
    }

    public function listPurchaseQuotesForPurchaseOrders(Request $request) {
        $this->getPurchaseQuotesForPurchaseOrders($request->company);
        return response()->json([ "purchase_quotes_for_purchase_orders" => $this->purchase_quotes_for_purchase_order ]);
    }
    
    public function listAuthorizedPurchaseQuoteLines(Request $request) {
        $this->authorized_purchase_quote_lines = $this->purchase_quote_line_controller->getPurchaseQuoteLines($request->purchase_quote_id);
        return response()->json([ "authorized_purchase_quote_lines" => $this->authorized_purchase_quote_lines ]);
    }
    
    public function getAllPurchaseOrders($company) {
        $this->purchase_orders = DB::table( $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0] )
            ->join( $this->tables[ self::TBL_VENDOR ][0], $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][2], "=", $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][0] )
            ->join( $this->tables[ self::TBL_DELIVERY_MODE ][0], $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][3], "=", $this->tables[ self::TBL_DELIVERY_MODE ][0].".".$this->tables[ self::TBL_DELIVERY_MODE ][1][0] )
            ->join( $this->tables[ self::TBL_DELIVERY_TERM ][0], $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][4], "=", $this->tables[ self::TBL_DELIVERY_TERM ][0].".".$this->tables[ self::TBL_DELIVERY_TERM ][1][0] )
            ->join( $this->tables[ self::TBL_PAYMENT_TERM ][0], $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][6], "=", $this->tables[ self::TBL_PAYMENT_TERM ][0].".".$this->tables[ self::TBL_PAYMENT_TERM ][1][0] )
            ->join( $this->tables[ self::TBL_METHOD_OF_PAYMENT ][0], $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][7], "=", $this->tables[ self::TBL_METHOD_OF_PAYMENT ][0].".".$this->tables[ self::TBL_METHOD_OF_PAYMENT ][1][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_ORDER_STATUS ][0], $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][8], "=", $this->tables[ self::TBL_PURCHASE_ORDER_STATUS ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_STATUS ][1][0] )
            ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][9], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->joinSub( $this->getPurchaseOrderAuthorization($company), self::PURCHASE_ORDER_AUTHORIZATION_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][0], "=", self::PURCHASE_ORDER_AUTHORIZATION_JOIN.".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][3] );
            })
            ->select( $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][0], $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][1], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][0], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][1], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][2], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][3], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][4], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][5], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][6], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][7], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][8], $this->tables[ self::TBL_DELIVERY_MODE ][0].".".$this->tables[ self::TBL_DELIVERY_MODE ][1][0], $this->tables[ self::TBL_DELIVERY_MODE ][0].".".$this->tables[ self::TBL_DELIVERY_MODE ][1][1], $this->tables[ self::TBL_DELIVERY_MODE ][0].".".$this->tables[ self::TBL_DELIVERY_MODE ][1][2], $this->tables[ self::TBL_DELIVERY_TERM ][0].".".$this->tables[ self::TBL_DELIVERY_TERM ][1][0], $this->tables[ self::TBL_DELIVERY_TERM ][0].".".$this->tables[ self::TBL_DELIVERY_TERM ][1][1], $this->tables[ self::TBL_DELIVERY_TERM ][0].".".$this->tables[ self::TBL_DELIVERY_TERM ][1][2], $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][5], $this->tables[ self::TBL_PAYMENT_TERM ][0].".".$this->tables[ self::TBL_PAYMENT_TERM ][1][0], $this->tables[ self::TBL_PAYMENT_TERM ][0].".".$this->tables[ self::TBL_PAYMENT_TERM][1][1], $this->tables[ self::TBL_PAYMENT_TERM ][0].".".$this->tables[ self::TBL_PAYMENT_TERM ][1][2], $this->tables[ self::TBL_METHOD_OF_PAYMENT ][0].".".$this->tables[ self::TBL_METHOD_OF_PAYMENT ][1][0], $this->tables[ self::TBL_METHOD_OF_PAYMENT ][0].".".$this->tables[ self::TBL_METHOD_OF_PAYMENT ][1][1], $this->tables[ self::TBL_METHOD_OF_PAYMENT ][0].".".$this->tables[ self::TBL_METHOD_OF_PAYMENT ][1][2], $this->tables[ self::TBL_PURCHASE_ORDER_STATUS ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_STATUS ][1][0], $this->tables[ self::TBL_PURCHASE_ORDER_STATUS ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_STATUS ][1][1], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][8], DB::raw("DATE(".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][10].")"." AS ".$this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][1][10]), self::PURCHASE_ORDER_AUTHORIZATION_JOIN.".".self::AUTHORIZED_USERS, self::PURCHASE_ORDER_AUTHORIZATION_JOIN.".".self::AUTHORIZED_DATES )
            ->where( $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company )
            ->get();
    }
    
    public function getPurchaseOrderAuthorization($company) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][4], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->select( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][3], DB::raw("GROUP_CONCAT(".$this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][8]." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][0].")"." AS ".self::AUTHORIZED_USERS), DB::raw("GROUP_CONCAT("."DATE(".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][1].")"." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][0].")"." AS ".self::AUTHORIZED_DATES) )->whereNotNull( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][3] )->where( [ [ $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][5], 1 ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company ] ] )->groupBy( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][3] );
    }
    
    public function getPurchaseQuoteAuthorization($company) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0] )->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][4], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )->select( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2], DB::raw("GROUP_CONCAT(".$this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][8]." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][0].")"." AS ".self::AUTHORIZED_USERS), DB::raw("GROUP_CONCAT("."DATE(".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][1].")"." ORDER BY ".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][0].")"." AS ".self::AUTHORIZED_DATES) )->whereNotNull( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2] )->where( [ [ $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][5], 1 ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company ] ] )->groupBy( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2] );
    }
    
    public function getPurchaseQuotesForPurchaseOrders($company) {
        $this->purchase_quotes_for_purchase_order = DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0] )
            ->join( $this->tables[ self::TBL_VENDOR ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][3], "=", $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_REQUEST ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][2], "=", $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] )
            ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][5], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], "=", $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2] )
            ->joinSub( $this->purchase_quote_header_controller->getPurchaseQuoteGrandTotals([ 6 ]), self::PURCHASE_QUOTE_GRAND_TOTAL_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], "=", self::PURCHASE_QUOTE_GRAND_TOTAL_JOIN.".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0] );
            })
            ->joinSub( $this->getPurchaseQuoteAuthorization($company), self::PURCHASE_QUOTE_AUTHORIZATION_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0], "=", self::PURCHASE_QUOTE_AUTHORIZATION_JOIN.".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][2] );
            })
            ->select( DB::raw("DISTINCT(".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][0].")"), $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][1], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][0], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][1], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][2], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][3], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][4], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][5], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][6], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][7], $this->tables[ self::TBL_VENDOR ][0].".".$this->tables[ self::TBL_VENDOR ][1][8], $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][4], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][1], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0], $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][8], self::PURCHASE_QUOTE_GRAND_TOTAL_JOIN.".".self::GRAND_TOTAL, self::PURCHASE_QUOTE_AUTHORIZATION_JOIN.".".self::AUTHORIZED_USERS, self::PURCHASE_QUOTE_AUTHORIZATION_JOIN.".".self::AUTHORIZED_DATES )
            ->where( [ [ $this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_HEADER ][1][9], 6 ], [ $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][4], $company ] ])
            ->whereNull( $this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][0].".".$this->tables[ self::TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION ][1][3] )
            ->get();
    }
    
    public function insertPurchaseOrderHeader($purchase_order_header, $company) {
        $purchase_order_header["purchase_order_number"] = $this->new_purchase_order_number = $this->number_sequence_controller->generateNewNumber(self::DOCUMENT, date('Y'), $company);
        if ( $purchase_order_header["vendor"] !== '1' ) {
            return DB::table( $this->tables[ self::TBL_PURCHASE_ORDER_HEADER ][0] )->insertGetId( $purchase_order_header );
        } else {
            //one time
        }
    }
    
    public function newPurchaseOrder(Request $request) {
        if ( $this->purchase_order_line_controller->setPurchaseOrderLines($this->purchase_order_line_version_controller->insertPurchaseOrderLineVersion($this->purchase_quote_purchase_order_authorization_controller->updateAuthorizedPurchaseOrder($request->authorized_purchase_quote, $this->insertPurchaseOrderHeader(Arr::collapse(json_decode($request->get("purchase_order_header_data"), true)), $request->company)), $request->user_id), json_decode($request->get("purchase_order_line_data"), true)) ) {
            return response()->json([ "created" => true, "newpurchaseordernumber" => $this->new_purchase_order_number ]);
        } else {
            return response()->json([ "created" => false ]);
        }
    }
}
