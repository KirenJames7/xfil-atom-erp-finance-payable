<?php

namespace App\Http\Controllers\Feature;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class FeatureController extends Controller
{
    protected $features;

    public function getFeatures() {
        $this->features = DB::table($this->tables[self::TBL_FEATURE][0])->get();
        return response()->json([ 'features' => $this->features ]);
    }
}
