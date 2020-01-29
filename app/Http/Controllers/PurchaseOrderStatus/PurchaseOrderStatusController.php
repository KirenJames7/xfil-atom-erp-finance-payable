<?php

namespace App\Http\Controllers\PurchaseOrderStatus;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class PurchaseOrderStatusController extends Controller
{
    protected $purchase_order_stauses;
    public function listPurchaseOrderStatuses() {
        $this->getPurchaseOrderStatuses();
        return response()->json([ "purchaseorderstatuses" => $this->purchase_order_stauses ]);
    }
    
    public function getPurchaseOrderStatuses() {
        $this->purchase_order_stauses = DB::table( $this->tables[ self::TBL_PURCHASE_ORDER_STATUS ][0] )->get();
    }
}
