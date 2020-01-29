<?php

namespace App\Http\Controllers\DeliveryTerm;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DeliveryTermController extends Controller
{
    protected $delivery_terms;
    
    public function listDeliveryTerms() {
        $this->getDeliveryTerms();
        return response()->json([ "delivery_terms" => $this->delivery_terms ]);
    }
    
    public function getDeliveryTerms() {
        $this->delivery_terms = DB::table( $this->tables[ self::TBL_DELIVERY_TERM ][0] )->get();
    }
}
