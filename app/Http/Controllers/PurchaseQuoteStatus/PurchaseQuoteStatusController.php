<?php

namespace App\Http\Controllers\PurchaseQuoteStatus;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class PurchaseQuoteStatusController extends Controller
{
    protected $purchase_quote_statuses;
    
    public function listPurchaseQuoteStatuses() {
        $this->getPurchaseQuoteStatuses();
        return response()->json([ "purchasequotestatuses" => $this->purchase_quote_statuses ]);
    }
    
    public function getPurchaseQuoteStatuses() {
        $this->purchase_quote_statuses = DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_STATUS ][0] )->get();
    }
}
