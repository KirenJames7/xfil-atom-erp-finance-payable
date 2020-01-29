<?php

namespace App\Http\Controllers\PurchaseQuote;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class PurchaseQuoteFixedAssetAttributeValueController extends Controller
{
    public function insertPurchaseQuoteFixedAssetAttributesValues($purchase_quote_line, $fixed_asset_attributes_values) {
        foreach ( $fixed_asset_attributes_values as $fixed_asset_attribute_value ) {
            $fixed_asset_attribute_value["purchase_quote"] = $purchase_quote_line;
            if ( !DB::table( $this->tables[ self::TBL_PURCHASE_QUOTE_FIXED_ASSET_ATTRIBUTE_VALUE ][0] )->insert( $fixed_asset_attribute_value ) ) {
                return false;
            }
        }
        return true;
    }
}
