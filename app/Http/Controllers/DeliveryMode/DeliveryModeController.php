<?php

namespace App\Http\Controllers\DeliveryMode;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DeliveryModeController extends Controller
{
    protected $delivery_modes;
    
    public function listDeliveryModes() {
        $this->getDeliveryModes();
        return response()->json([ "delivery_modes" => $this->delivery_modes ]);
    }
    
    public function getDeliveryModes() {
        $this->delivery_modes = DB::table( $this->tables[ self::TBL_DELIVERY_MODE ][0] )->get();
    }
}
