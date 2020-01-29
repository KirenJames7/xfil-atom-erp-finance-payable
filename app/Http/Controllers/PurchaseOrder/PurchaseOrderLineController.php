<?php

namespace App\Http\Controllers\PurchaseOrder;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PurchaseOrder\PurchaseOrderLineVersionController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;

class PurchaseOrderLineController extends Controller
{
    protected $purchase_order_line_version_controller;
    protected $purchase_order_lines;

    public function __construct() {
        parent::__construct();
        $this->purchase_order_line_version_controller = new PurchaseOrderLineVersionController();
    }

    public function listPurchaseOrderLines(Request $request) {
        $this->purchase_order_lines = $this->getPurchaseOrderLines($request->purchase_order_id);
        return response()->json([ "data" => $this->purchase_order_lines ]);
    }
    
    public function getPurchaseOrderLines($purchase_order) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_ORDER_LINE ][0] )->where( $this->tables[ self::TBL_PURCHASE_ORDER_LINE ][0].".".$this->tables[ self::TBL_PURCHASE_ORDER_LINE ][1][1], $this->purchase_order_line_version_controller->getLatestPurchaseOrderLineVerison($purchase_order) )->get();
    }
    
    public function insertPurchaseOrderLines($purchase_order_line) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_ORDER_LINE ][0] )->insert( $purchase_order_line );
    }
    
    public function setPurchaseOrderLines($purchase_order_line_version, $purchase_order_lines) {
        foreach ( $purchase_order_lines as $purchase_order_line ) {
            //$purchase_order_line = Arr::collapse($purchase_order_line);
            unset($purchase_order_line["purchase_quote_line_id"]);
            unset($purchase_order_line["purchase_quote_version"]);
            $purchase_order_line["purchase_order_version"] = $purchase_order_line_version;
            if ( !$this->insertPurchaseOrderLines($purchase_order_line) ) {
                return false;
            }
        }
        return true;
    }
}
