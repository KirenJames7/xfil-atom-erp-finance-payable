<?php

namespace App\Http\Controllers\Vendor;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class VendorContactInformationController extends Controller
{
    protected $new_contact_information;

    public function insertVendorContactInformation() {
        return DB::table( $this->tables[ self::TBL_VENDOR_CONTACT_INFORMATION ][0] )->insert( $this->new_contact_information );
    }
    
    public function newVendorContactInformation($contact_person_id, $current_contact_person, $contact_information) {
        foreach ( $contact_information as $information ) {
            if ( $information['vendor_contact_person'] === $current_contact_person['vendor_contact_person'] ) {
                $this->new_contact_information = array(
                    "vendor_contact_person" => $contact_person_id,
                    "vendor_contact_information_type" => $information['vendor_contact_information_type'],
                    "vendor_contact_information" => $information['vendor_contact_information'],
                    "vendor_contact_information_active" => 1
                );
                $this->insertVendorContactInformation();
            }
        }
        return true;
    }
}
