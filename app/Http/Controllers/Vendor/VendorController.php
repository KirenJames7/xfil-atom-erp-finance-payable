<?php

namespace App\Http\Controllers\Vendor;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\NumberSequence\NumberSequenceController;
use App\Http\Controllers\Vendor\VendorContactController;

class VendorController extends Controller
{
    protected $number_sequence;
    protected $vendors;
    protected $new_vendor;
    protected $new_vendor_code;
    protected $vendor_contact;

    public function __construct() {
        parent::__construct();
        $this->number_sequence = new NumberSequenceController();
        $this->vendor_contact = new VendorContactController();
    }

    public function listAllVendors(Request $request) {
        $this->vendors = $this->getAllVendors($request->company);
        return response()->json([ "vendors" => $this->vendors ]);
    }
    
    public function getAllVendors($company) {
        return DB::table( $this->tables[ self::TBL_VENDOR ][0] )->select( $this->tables[ self::TBL_VENDOR ][1][0], $this->tables[ self::TBL_VENDOR ][1][1], $this->tables[ self::TBL_VENDOR ][1][2], $this->tables[ self::TBL_VENDOR ][1][3], $this->tables[ self::TBL_VENDOR ][1][4], $this->tables[ self::TBL_VENDOR ][1][5], $this->tables[ self::TBL_VENDOR ][1][6], $this->tables[ self::TBL_VENDOR ][1][7], $this->tables[ self::TBL_VENDOR ][1][8] )->where($this->tables[ self::TBL_VENDOR ][1][9], $company)->orderBy( $this->tables[ self::TBL_VENDOR ][1][1], 'asc' )->get();
    }
    
    public function getAllVendorsAPI() {
        
    }
    
    public function insertVendor() {
        return DB::table( $this->tables[ self::TBL_VENDOR ][0] )->insertGetId( $this->new_vendor );
    }
    
    public function vendorCreation(Request $request) {
        $this->new_vendor = array(
            "vendor_code" => $this->new_vendor_code = $this->number_sequence->generateNewNumber("Vendor Code", null, $request->company),
            "vendor_name" => $request->get('vendor-name'),
            "vendor_po_box" => $request->get('vendor-po-box'),
            "vendor_address_line_1" => $request->get('vendor-address-line-1'),
            "vendor_country" => $request->get('vendor-country'),
            "vendor_province_state" => $request->get('vendor-province-state'),
            "vendor_city" => $request->get('vendor-city'),
            "vendor_company" => $request->company
        );
        if ( $request->get('vendor-address-line-2') ) {
            $this->new_vendor["vendor_address_line_2"] = $request->get('vendor-address-line-2');
        }
        
        if ( $this->vendor_contact->newVendorContact($this->insertVendor(), json_decode($request->vendor_contact_persons, true), json_decode($request->vendor_contact_information, true)) ) {
            return response()->json([ "created" => true, "vendor_code" => $this->new_vendor_code ]);
        } else {
            return response()->json([ "created" => false ]);
        }
    }
    
    public function viewVendorTransactions() {
        
    }
}
