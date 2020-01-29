<?php

namespace App\Http\Controllers\PurchaseQuote;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class PurchaseQuoteLineVersionController extends Controller
{
    public function getLatestPurchaseQuoteLineVersion($purchase_quote) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][1][1], $purchase_quote ], [ $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][1][2], $this->getMaxLineVersion($purchase_quote) ] ] )->value( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][1][0] );
    }
    
    public function getMaxLineVersion($purchase_quote) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][0] )->where( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][1][1], $purchase_quote )->max( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][1][2] );
    }
    
    public function insertPurchaseQuoteLineVersion($purchase_quote_header, $user_id) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE_VERSION ][0] )->insertGetId( [ "purchase_quote" => $purchase_quote_header, "purchase_quote_version" => 1, "created_by" => $user_id ] );
    }
}
