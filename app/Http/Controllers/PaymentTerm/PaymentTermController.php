<?php

namespace App\Http\Controllers\PaymentTerm;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class PaymentTermController extends Controller
{
    protected $payment_terms;
    
    public function listPaymentTerms() {
        $this->getPaymentTerms();
        return response()->json([ "payment_terms" => $this->payment_terms ]);
    }
    
    public function getPaymentTerms() {
        $this->payment_terms = DB::table( $this->tables[ self::TBL_PAYMENT_TERM ][0] )->get();
    }
}
