<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    
    const TBL_USER = "tbl_user";
    const TBL_FEATURE = "tbl_feature";
    const TBL_VENDOR = "tbl_vendor";
    const TBL_CONTACT_TYPE = "tbl_contact_type";
    const TBL_VENDOR_CONTACT = "tbl_vendor_contact";
    const TBL_VENDOR_CONTACT_INFORMATION = "tbl_vendor_contact_information";
    const TBL_NUMBER_SEQUENCE = "tbl_number_sequence";
    const TBL_PURCHASE_GROUP = "tbl_purchase_group";
    const TBL_PURCHASE_GROUP_USER = "tbl_purchase_group_user";
    const TBL_AUTHORIZATION_STRUCTURE = "tbl_authorization_structure";
    const TBL_AUTHORIZATION_STRUCTURE_PERSONNEL = "tbl_authorization_structure_personnel";
    const TBL_AUTHORIZATION_CRITERIA = "tbl_authorization_criteria";
    const TBL_AUTHORIZATION_CRITERIA_OPTION = "tbl_authorization_criteria_option";
    const TBL_PURCHASE_REQUEST = "tbl_purchase_request";
    const TBL_PURCHASE_REQUEST_STATUS = "tbl_purchase_request_status";
    const TBL_PURCHASE_REQUEST_APPROVE_REJECT = "tbl_purchase_request_approve_reject";
    const TBL_PURCHASE_QUOTE_HEADER = "tbl_purchase_quote_header";
    const TBL_PURCHASE_QUOTE_LINE_VERSION = "tbl_purchase_quote_line_version";
    const TBL_PURCHASE_QUOTE_LINE = "tbl_purchase_quote_line";
    const TBL_PURCHASE_QUOTE_STATUS = "tbl_purchase_quote_status";
    const TBL_PURCHASE_QUOTE_FIXED_ASSET_ATTRIBUTE_VALUE = "tbl_purchase_quote_fixed_asset_attribute_value";
    const TBL_PURCHASE_QUOTE_PURCHASE_ORDER_AUTHORIZATION = "tbl_purchase_quote_purchase_order_authorization";
    const TBL_PURCHASE_ORDER_HEADER = "tbl_purchase_order_header";
    const TBL_PURCHASE_ORDER_LINE_VERSION = "tbl_purchase_order_line_version";
    const TBL_PURCHASE_ORDER_LINE = "tbl_purchase_order_line";
    const TBL_PURCHASE_ORDER_STATUS = "tbl_purchase_order_status";
    const TBL_DELIVERY_MODE = "tbl_delivery_mode";
    const TBL_DELIVERY_TERM = "tbl_delivery_term";
    const TBL_PAYMENT_TERM = "tbl_payment_term";
    const TBL_METHOD_OF_PAYMENT = "tbl_method_of_payment";
    
    protected $tables = [];
    private $api_data = [];

    public function __construct() {
        //get list of all tables
        $dbtable = DB::select('SHOW TABLES');
        //build array containing all schema tables
        foreach ($dbtable as $value) {
            $table = [];
            //push table name
            array_push($table, $value->Tables_in_finance_ap);
            //get all columns of table
            $tablecolumns = DB::select('SHOW COLUMNS FROM ' . $value->Tables_in_finance_ap);
            $columns = [];
            foreach ($tablecolumns as $column) {
                //push column name
                array_push($columns, $column->Field);
            }
            //push columns to the table array
            array_push($table, $columns);
            //create a key value pairing to the tables & columns
            $this->tables["$value->Tables_in_finance_ap"] = $table;
        }
    }
    
    //generate a key value pair API from a given data set key & value depends on which record should be key and value
    public function apiGenerator($data, $key, $value) {
        //iterate through records and convert API 
        foreach ($data as $data_record){
            if(is_array($data_record)){
                //if API response contains multiple records
                //convert array to index array
                $temp = array_values($data_record);
                //assign key value pair
                $this->api_data[$temp[$key]] = $temp[$value];
            }else{
                //if API response contains a single record
                //convert array to index array
                $temp = array_values($data);
                //assign key value pair
                $this->api_data[$temp[$key]] = $temp[$value];
                //break out of loop as this is a single record
                break;
            }
        }
        return $this->api_data;
    }
    
    public function getFLAPIUrl() {
        return response()->json([ "url" => env('APP_FL_API') ]);
    }
    
    public function getIMAPIUrl() {
        return response()->json([ "url" => env('APP_IM_API') ]);
    }
}