<?php

namespace App\Http\Controllers\PurchaseQuote;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PurchaseQuote\PurchaseQuoteLineVersionController;
use App\Http\Controllers\PurchaseQuote\PurchaseQuoteFixedAssetAttributeValueController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;

class PurchaseQuoteLineController extends Controller
{
    protected $purchase_quote_fixed_asset_attribute_value;
    protected $purchase_quote_line_version;
    protected $purchase_quote_lines;
    
    public function __construct() {
        parent::__construct();
        $this->purchase_quote_line_version = new PurchaseQuoteLineVersionController();
        $this->purchase_quote_fixed_asset_attribute_value = new PurchaseQuoteFixedAssetAttributeValueController();
    }
    
    public function listPurchaseQuoteLines(Request $request) {
        $this->purchase_quote_lines = $this->getPurchaseQuoteLines($request->purchase_quote);
        return response()->json([ "data" => $this->purchase_quote_lines ]);
    }
    
    public function getPurchaseQuoteLines($purchase_quote) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0] )->where( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][1][1], $this->purchase_quote_line_version->getLatestPurchaseQuoteLineVersion($purchase_quote) )->get();
    }

    public function insertPurchaseQuoteLines($purchase_quote_line) {        
        if ( Arr::has($purchase_quote_line, "fixed_asset_attributes") ) {
            $fixed_asset_attributes_values = json_decode(Arr::pull($purchase_quote_line, "fixed_asset_attributes"), true);
            return $this->purchase_quote_fixed_asset_attribute_value->insertPurchaseQuoteFixedAssetAttributesValues(DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0] )->insertGetId( $purchase_quote_line ), $fixed_asset_attributes_values);
        } else {
            return DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_LINE ][0] )->insert( $purchase_quote_line );
        }
    }
    
    public function setPurchaseQuoteLines($purchase_quote_line_version, $purchase_quote_lines) {
        foreach ( $purchase_quote_lines as $purchase_quote_line ) {
            $purchase_quote_line = Arr::collapse($purchase_quote_line);
            $purchase_quote_line["purchase_quote_version"] = $purchase_quote_line_version;
            if ( !$this->insertPurchaseQuoteLines($purchase_quote_line) ) {
                return false;
            }
        }
        return true;
    }
}
