<?php

namespace App\Http\Controllers\PurchaseRequestApproveReject;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PurchaseRequest\PurchaseRequestController;
use Illuminate\Support\Facades\DB;

class PurchaseRequestApproveRejectController extends Controller
{
    protected $purchase_request;
    protected $purchase_request_approve_reject;
    protected $purchase_request_approve_reject_insert;

    const PURCHASE_REQUEST_LIST = "purchase_request_list";
    const PURCHASE_REQUEST_LIST_STATUS_JOIN = "purchase_request_list_status";
    const PURCHASE_REQUEST_CREATED_BY_JOIN = "purchase_request_created_by";
    const PURCHASE_REQUEST_EDITED_BY_JOIN = "purchase_request_edited_by";
    const PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN = "purchase_request_approval_matrix";
    const PURCHASE_REQUEST_GROUP = "purchase_request_group";
    const PURCHASE_REQUEST_APPROVED = "purchase_request_approved";
    const PURCHASE_REQUEST_REJECTED = "purchase_request_rejected";
    const APPROVED_PURCHASE_REQUEST = "approved_purchase_request";
    const REJECTED_PURCHASE_REQUEST = "rejected_purchase_request";
    const CURRENT_SEQUENCE_APPROVAL_PURCHASE_REQUESTS = "current_sequence_approval_purchase_requests";
    const CURRENT_SEQUENCE_APPROVAL_COUNT = "current_sequence_approval_count";
    const CURRENT_SEQUENCE_APPROVAL_USERS = "current_sequence_approval_users";
    const REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE = "required_purchase_group_approval_count_users_sequence";
    const REQUIRED_PURCHASE_GROUP_SEQUENCE = "required_purchase_group_sequence";
    const REQUIRED_APPROVAL_COUNT_SEQUENCE = "required_approval_count_sequence";
    const REQUIRED_APPROVAL_USERS_SEQUENCE = "required_approval_users_sequence";
    const REQUIRED_APPROVAL_SEQUENCE = "required_approval_sequence";
    const REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE = "required_purchase_request_group_approval_count_users_sequence";
    const REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE_JOIN = "required_purchase_request_group_approval_count_users_sequence_join";
    const REQURIED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_OPTIONAL = "required_purchase_group_approval_count_users_optional";
    const REQUIRED_PURCHASE_GROUP_OPTIONAL = "required_purchase_group_optional";
    const REQUIRED_APPROVAL_COUNT_OPTIONAL = "required_approval_count_optional";
    const REQUIRED_APPROVAL_USERS_OPTIONAL = "required_approval_users_optional";
    const REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL = "required_purchase_request_group_approval_count_users_optional";
    const REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL_JOIN = "required_purchase_request_group_approval_count_users_optional_join";
    const CURRENT_OPTIONAL_APPROVAL_PURCHASE_REQUESTS = "current_optional_approval_purchase_requests";
    const CURRENT_OPTIONAL_APPROVAL_COUNT = "current_optional_approval_count";
    const CURRENT_OPTIONAL_APPROVAL_USERS = "current_optional_approval_users";
    const CURRENT_OPTIONAL_APPROVAL = "current_optional_approval";
    const SEQUENCE_APPROVAL = "sequence_approval";
    const SEQUENCE_APPROVAL_JOIN = "sequence_approval_join";
    const OPTIONAL_APPROVAL = "optional_approval";
    const OPTIONAL_APPROVAL_JOIN = "optional_approval_join";
    const CURRENT_APPROVAL_COUNT ="current_approval_count";
    const REQUIRED_APPROVAL_COUNT = "required_approval_count";
    const CURRENT_APPROVAL_USER = "current_approval_user";
    const REQUIRED_APPROVAL_USER = "required_approval_user";
    const REJECTED_APPROVAL_PURCHASE_REQUEST = "rejected_approval_purchase_request";
    const PURCHASE_GROUP_JOIN = "purchase_group_join";
    const PURCHASE_GROUP = "purchase_group";
    const PURCHASE_GROUP_REQUIRED_APPROVAL_COUNT = "purchase_group_required_approval_count";
    const PURCHASE_GROUP_REQUIRED_APPROVAL_USER = "purchase_group_required_approval_user";
    const PURCHASE_GROUP_REQUIRED_APPROVAL_SEQUENCE = "purchase_group_required_approval_sequence";
    const UNAPPROVED = "unapproved";
    const CREATED_BY = "created_by";
    const EDITED_BY = "edited_by";
    const APPROVER_FINAL = "approver_final";
    const APPROVER = "approver";
    const APPROVER_GROUP = "approver_group";
    const APPROVER_SEQUENCE = "approver_sequence";
    const PURCHASE_REQUEST_ID = "purchase_request_id";
    const PURCHASE_REQUEST_NUMBER = "purchase_request_number";
    const PURCHASE_REQUEST_TITLE = "purchase_request_title";
    const PURCHASE_REQUEST_REQUIREMENT = "purchase_request_requirement";
    const PURCHASE_REQUEST_APPROX_VALUE = "purchase_request_approx_value";
    const PURCHASE_REQUEST_STATUS = "purchase_request_status";
    const PURCHASE_REQUEST_CREATED_DATE = "purchase_request_created_date";
    const PURCHASE_REQUEST_PURCHASE_GROUP = "purchase_request_purchase_group";
    const PURCHASE_REQUEST_PURCHASE_GROUP_NAME = "purchase_request_purchase_group_name";


    public function __construct() {
        parent::__construct();
        $this->purchase_request = new PurchaseRequestController();
    }

    public function listPurchaseRequestApproveReject(Request $request) {
        $this->purchase_request_approve_reject = $this->getPurchaseRequestApproveReject($request->company, $request->user_id, $request->purchase_groups);
        return response()->json([ "purchase_request_approve_reject" => $this->purchase_request_approve_reject ]);
    }
    
    public function approvePurchaseRequest(Request $request) {
        if ( $this->setApprovedPurchaseRequest($request) ) {
            return response()->json([ "approved" => true ]);
        } else {
            return response()->json([ "approved" => false ]);
        }
    }
    
    public function rejectPurchaseRequest(Request $request) {
        if ( $this->setRejectedPurchaseRequest($request) ) {
            return response()->json([ "rejected" => true ]);
        } else {
            return response()->json([ "rejected" => false ]);
        }
    }
    
    public function getPurchaseRequestApproveReject($company, $user_id, $purchase_groups) {
        return DB::table( DB::raw( "(".$this->getPurchaseRequestsSelect($company, $user_id, $purchase_groups)->toSql().")"." AS ".self::APPROVER_FINAL ) )
            ->addBinding( $this->getPurchaseRequestsSelect($company, $user_id, $purchase_groups)->getBindings(), "select" )
            ->select( self::APPROVER_FINAL.".".self::PURCHASE_REQUEST_ID, self::APPROVER_FINAL.".".self::PURCHASE_REQUEST_NUMBER, self::APPROVER_FINAL.".".self::PURCHASE_REQUEST_TITLE, self::APPROVER_FINAL.".".self::PURCHASE_REQUEST_REQUIREMENT, self::APPROVER_FINAL.".".self::PURCHASE_REQUEST_APPROX_VALUE, self::APPROVER_FINAL.".".self::PURCHASE_REQUEST_STATUS, self::APPROVER_FINAL.".".self::CREATED_BY, self::APPROVER_FINAL.".".self::PURCHASE_REQUEST_CREATED_DATE, self::APPROVER_FINAL.".".self::EDITED_BY, self::APPROVER_FINAL.".".self::PURCHASE_REQUEST_PURCHASE_GROUP, self::APPROVER_FINAL.".".self::PURCHASE_REQUEST_PURCHASE_GROUP_NAME, self::APPROVER_FINAL.".".self::CURRENT_APPROVAL_COUNT, self::APPROVER_FINAL.".".self::REQUIRED_APPROVAL_COUNT, self::APPROVER_FINAL.".".self::CURRENT_APPROVAL_USER, self::APPROVER_FINAL.".".self::REQUIRED_APPROVAL_USER, self::APPROVER_FINAL.".".self::REQUIRED_APPROVAL_SEQUENCE, self::APPROVER_FINAL.".".self::APPROVER_SEQUENCE )
            ->whereNull( self::APPROVER_FINAL.".".self::APPROVER_SEQUENCE )
            ->orWhereRaw( self::APPROVER_FINAL.".".self::CURRENT_APPROVAL_COUNT."=".self::APPROVER_FINAL.".".self::APPROVER_SEQUENCE."-1" )
            ->get();
    }
    
    public function getUnion() {
        return DB::table( DB::raw( "(".$this->purchase_request->getCurrentSequenceApprovalCount()->toSql().")"." AS ".self::SEQUENCE_APPROVAL ) )
            ->addBinding($this->purchase_request->getCurrentSequenceApprovalCount()->getBindings(), "select")
            ->joinSub( $this->purchase_request->getRequiredPurchaseRequestGroupApprovalCountUsersSequence(), self::SEQUENCE_APPROVAL_JOIN, function ($join) {
                $join->on( self::SEQUENCE_APPROVAL_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", self::SEQUENCE_APPROVAL.".".self::APPROVED_PURCHASE_REQUEST );
            })
            ->select( self::SEQUENCE_APPROVAL.".".self::APPROVED_PURCHASE_REQUEST." AS ".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], self::SEQUENCE_APPROVAL.".".self::CURRENT_SEQUENCE_APPROVAL_COUNT." AS ".self::CURRENT_APPROVAL_COUNT, self::SEQUENCE_APPROVAL_JOIN.".".self::REQUIRED_APPROVAL_COUNT_SEQUENCE." AS ".self::REQUIRED_APPROVAL_COUNT, self::SEQUENCE_APPROVAL.".".self::CURRENT_SEQUENCE_APPROVAL_USERS." AS ".self::CURRENT_APPROVAL_USER, self::SEQUENCE_APPROVAL_JOIN.".".self::REQUIRED_APPROVAL_USERS_SEQUENCE." AS ".self::REQUIRED_APPROVAL_USER, self::SEQUENCE_APPROVAL_JOIN.".".self::REQUIRED_APPROVAL_SEQUENCE." AS ".self::REQUIRED_APPROVAL_SEQUENCE )
            ->unionAll( $this->purchase_request->getOptionalApproval() )
            ->unionAll( $this->purchase_request->getUnApproved() );
    }
    
    public function getPurchaseGroupApproverSequence($user_id) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0] )->select( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1]." AS ".self::APPROVER_GROUP, $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][5]." AS ".self::APPROVER_SEQUENCE )->where( [ [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], $user_id ], [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][3], 1 ] ] );
    }
    
    public function getPurchaseRequestsSelect($company, $user_id, $purchase_groups) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0]." AS ".self::PURCHASE_REQUEST_LIST )
            ->leftJoin( $this->tables[ self::TBL_PURCHASE_REQUEST_STATUS ][0]." AS ".self::PURCHASE_REQUEST_LIST_STATUS_JOIN , self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][5], "=", self::PURCHASE_REQUEST_LIST_STATUS_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST_STATUS ][1][0] )
            ->leftJoin( $this->tables[ self::TBL_USER ][0]." AS ".self::PURCHASE_REQUEST_CREATED_BY_JOIN, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][6], "=", self::PURCHASE_REQUEST_CREATED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][0] )
            ->leftJoin( $this->tables[ self::TBL_USER ][0]." AS ".self::PURCHASE_REQUEST_EDITED_BY_JOIN, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][8], "=", self::PURCHASE_REQUEST_EDITED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][0] )
            ->leftJoin( $this->tables[ self::TBL_PURCHASE_GROUP ][0]." AS ".self::PURCHASE_REQUEST_GROUP, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", self::PURCHASE_REQUEST_GROUP.".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )
            ->leftJoinSub( $this->getPurchaseGroupApproverSequence($user_id), self::APPROVER, function ($join) {
                $join->on( self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", self::APPROVER.".".self::APPROVER_GROUP );
            })
            ->leftJoinSub( $this->getUnion() ,self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN, function ($join) {
                $join->on( self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] );
            })
            ->select( self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0]." AS ".self::PURCHASE_REQUEST_ID, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][1]." AS ".self::PURCHASE_REQUEST_NUMBER, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][2]." AS ".self::PURCHASE_REQUEST_TITLE, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][3]." AS ".self::PURCHASE_REQUEST_REQUIREMENT, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][4]." AS ".self::PURCHASE_REQUEST_APPROX_VALUE, self::PURCHASE_REQUEST_LIST_STATUS_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST_STATUS ][1][0]." AS ".self::PURCHASE_REQUEST_STATUS, self::PURCHASE_REQUEST_CREATED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][1]." AS ".self::CREATED_BY, DB::raw( "DATE(". self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][7] .")"." AS ".self::PURCHASE_REQUEST_CREATED_DATE), self::PURCHASE_REQUEST_EDITED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][1]." AS ".self::EDITED_BY, self::PURCHASE_REQUEST_GROUP.".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0]." AS ".self::PURCHASE_REQUEST_PURCHASE_GROUP, self::PURCHASE_REQUEST_GROUP.".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][1]." AS ".self::PURCHASE_REQUEST_PURCHASE_GROUP_NAME, DB::raw( "IFNULL"."(".self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::CURRENT_APPROVAL_COUNT.","."0".")"." AS ".self::CURRENT_APPROVAL_COUNT ), self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::REQUIRED_APPROVAL_COUNT." AS ".self::REQUIRED_APPROVAL_COUNT, self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::CURRENT_APPROVAL_USER." AS ".self::CURRENT_APPROVAL_USER, self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::REQUIRED_APPROVAL_USER." AS ".self::REQUIRED_APPROVAL_USER, self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::REQUIRED_APPROVAL_SEQUENCE." AS ".self::REQUIRED_APPROVAL_SEQUENCE, self::APPROVER.".".self::APPROVER_SEQUENCE." AS ".self::APPROVER_SEQUENCE )
            ->where( [ [ self::PURCHASE_REQUEST_CREATED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][4], $company ], [ self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][5], 2 ] ] )
            ->whereIn( self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], $purchase_groups )
            ->orderBy( self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "asc" );
    }
    
    public function setApprovedPurchaseRequest($request) {
        $this->purchase_request_approve_reject_insert = array(
            "purchase_request" => $request->purchase_request_id,
            "approved_rejected" => 1,
            "approved_rejected_by" => $request->user_id
        );
        if ( $request->petty_cash ) {
            $this->purchase_request_approve_reject_insert["petty_cash"] = $request->petty_cash;
        }
        if ( $this->insertPurchaseRequestApproveReject() && $this->checkApprovalComplete($request->purchase_request_id) ) {
            return $this->purchase_request->setPurchaseRequestStatus($request->purchase_request_id, 4);
        } else {
            return true;
        }
    }
    
    public function setRejectedPurchaseRequest($request) {
        $this->purchase_request_approve_reject_insert = array(
            "purchase_request" => $request->purchase_request_id,
            "approved_rejected" => 0,
            "approved_rejected_by" => $request->user_id
        );
        if ( $request->remark ) {
            $this->purchase_request_approve_reject_insert["approve_reject_reason"] = $request->remark;
        }
        if ( $this->insertPurchaseRequestApproveReject() ) {
            return $this->purchase_request->setPurchaseRequestStatus($request->purchase_request_id, 3);
        }
    }
    
    public function insertPurchaseRequestApproveReject() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0] )->insert( $this->purchase_request_approve_reject_insert );
    }
    
    public function checkApprovalComplete($purchase_request_id) {
        return $this->getPurchaseRequestRequiredApprovalCount($purchase_request_id) === $this->getPurchaseRequestCurrentApprovalCount($purchase_request_id);
    }
    
    public function getPurchaseRequestRequiredApprovalCount($purchase_request_id) {
        if ( DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )->join(  $this->tables[ self::TBL_PURCHASE_GROUP ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $purchase_request_id ], [ $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][2], 1 ] ] )->exists() ) {
            return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )->join( $this->tables[ self::TBL_PURCHASE_GROUP ][0], $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )->join( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0], "=", $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1] )->where( [ [ $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $purchase_request_id ], [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][3], 1 ] ] )->count();
        } else {
            return 1;
        }
    }
    
    public function getPurchaseRequestCurrentApprovalCount($purchase_request_id) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0] )->where( [ [ $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1], $purchase_request_id ], [ $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][2], 1 ] ] )->count();
    }
}
