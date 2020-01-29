<?php

namespace App\Http\Controllers\ContactType;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ContactTypeController extends Controller
{
    protected $contact_types;
            
    public function listAllContactTypes() {
        $this->contact_types = $this->getAllContactTypes();
        return response()->json([ "contact_types" => $this->contact_types ]);
    }
    
    public function getAllContactTypes() {
        return DB::table( $this->tables[ self::TBL_CONTACT_TYPE ][0] )->get();
    }
}
