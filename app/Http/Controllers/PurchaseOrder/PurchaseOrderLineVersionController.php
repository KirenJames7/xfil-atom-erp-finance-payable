<?php

namespace App\Http\Controllers\PurchaseOrder;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class PurchaseOrderLineVersionController extends Controller
{
    public function getMaxLineVersion($purchase_order) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_ORDER_LINE_VERSION ][0] )->where( $this->tables[ self::TBL_PURCHASE_ORDER_LINE_VERSION ][1][1], $purchase_order )->max( $this->tables[ self::TBL_PURCHASE_ORDER_LINE_VERSION ][1][2] );
    }
    
    public function getLatestPurchaseOrderLineVerison($purchase_order) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_ORDER_LINE_VERSION ][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_ORDER_LINE_VERSION ][1][1], $purchase_order ], [$this->tables[ self::TBL_PURCHASE_ORDER_LINE_VERSION ][1][2], $this->getMaxLineVersion($purchase_order) ] ] )->value( $this->tables[ self::TBL_PURCHASE_ORDER_LINE_VERSION ][1][0] );
    }
    
    public function insertPurchaseOrderLineVersion($purchase_order_header, $user_id) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_ORDER_LINE_VERSION ][0] )->insertGetId( [ "purchase_order" => $purchase_order_header, "purchase_order_version" => 1, "created_by" => $user_id ] );
    }
}
