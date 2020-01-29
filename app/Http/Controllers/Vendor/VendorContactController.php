<?php

namespace App\Http\Controllers\Vendor;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Vendor\VendorContactInformationController;

class VendorContactController extends Controller
{
    protected $vendor_contacts;
    protected $vendor_contact_information;
    protected $new_vendor_contact;
    
    public function __construct() {
        parent::__construct();
        $this->vendor_contact_information = new VendorContactInformationController();
    }
    
    public function listVendorContacts(Request $request) {
        $this->vendor_contacts = $this->getVendorContacts($request->vendor_id);
        return response()->json([ "vendor_contacts" => $this->vendor_contacts ]);
    }
    
    public function getVendorContacts($vendor_id) {
        return DB::table( $this->tables[ self::TBL_VENDOR_CONTACT ][0] )->join( $this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][0], $this->tables[ self::TBL_VENDOR_CONTACT ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT ][1][0], "=", $this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][1][1] )->join( $this->tables[ self::TBL_CONTACT_TYPE ][0], $this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][1][2], "=", $this->tables[ self::TBL_CONTACT_TYPE ][0].".".$this->tables[ self::TBL_CONTACT_TYPE ][1][0] )->select( $this->tables[ self::TBL_VENDOR_CONTACT ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT ][1][0], $this->tables[ self::TBL_VENDOR_CONTACT ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT ][1][2], $this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][1][0], $this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][1][2], $this->tables[ self::TBL_CONTACT_TYPE ][0].".".$this->tables[ self::TBL_CONTACT_TYPE ][1][1], $this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][1][3] )->where( [ [ $this->tables[ self::TBL_VENDOR_CONTACT ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT ][1][1], $vendor_id ], [ $this->tables[ self::TBL_VENDOR_CONTACT ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT ][1][3], 1 ], [ $this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][0].".".$this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][1][4], 1 ] ] )->get();
    }

    public function insertVendorContact() {
        return DB::table( $this->tables[ self::TBL_VENDOR_CONTACT ][0] )->insertGetId( $this->new_vendor_contact );
    }
    
    public function newVendorContact($vendor_id, $contact_persons, $contact_information) {
        
        foreach ($contact_persons as $contact_person) {
            $this->new_vendor_contact = array(
                "vendor" => $vendor_id,
                "vendor_contact_person" => $contact_person['vendor_contact_person'],
                "vendor_contact_active" => 1
            );
            $this->vendor_contact_information->newVendorContactInformation($this->insertVendorContact(), $contact_person, $contact_information);
        }
        return true;
        
    }
}