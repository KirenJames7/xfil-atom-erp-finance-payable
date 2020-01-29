<?php

namespace App\Http\Controllers\MethodOfPayment;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class MethodOfPaymentController extends Controller
{
    protected $method_of_payment;
    
    public function listMethodsofPayment() {
        $this->getMethodsofPayment();
        return response()->json([ "methods_of_payment" => $this->method_of_payment ]);
    }
    
    public function getMethodsofPayment() {
        $this->method_of_payment = DB::table( $this->tables[ self::TBL_METHOD_OF_PAYMENT ][0] )->get();
    }
}
