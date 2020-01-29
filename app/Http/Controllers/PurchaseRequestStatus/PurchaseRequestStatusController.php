<?php

namespace App\Http\Controllers\PurchaseRequestStatus;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class PurchaseRequestStatusController extends Controller
{
    protected $purchase_request_statuses;
    
    public function listPurchaseRequestStatuses() {
        $this->purchase_request_statuses = $this->getPurchaseRequestStatuses();
        return response()->json([ "purchaserequeststatuses" => $this->purchase_request_statuses ]);
    }
    
    public function getPurchaseRequestStatuses() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST_STATUS ][0] )->get();
    }
}