<?php

namespace App\Http\Controllers\PurchaseRequest;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\NumberSequence\NumberSequenceController;
use App\Http\Controllers\LDAPAuth\User\PurchaseGroup\PurchaseGroupUserController;
use App\Http\Controllers\PurchaseRequestApproveReject\PurchaseRequestApproveRejectController;
use Illuminate\Support\Facades\DB;

class PurchaseRequestController extends Controller
{
    protected $number_sequence;
    protected $purchase_group_user;
    protected $purchase_request_approve_reject;
    protected $purchase_request;
    protected $new_purchase_request_number;

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
    const PURCHASE_REQUEST_CREATED_DATE = "purchase_request_created_date";
    const EDITED_BY = "edited_by";
    const DOCUMENT = "Purchase Request";
    
    public function __construct() {
        parent::__construct();
        $this->number_sequence = new NumberSequenceController();
        //$this->purchase_group_user = new PurchaseGroupUserController();
        //$this->purchase_request_approve_reject = new PurchaseRequestApproveRejectController();
    }
    
    public function listPurchaseRequests(Request $request) {
        $this->purchase_request = $this->setPurchaseRequests($request->userid, $request->company, $request->purchasegroups);
        return response()->json([ "purchaserequests" => $this->purchase_request ]);        
    }
    
    public function setNewPurchaseRequest($request) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )->insert( [ $this->tables[ self::TBL_PURCHASE_REQUEST ][1][1] => $this->new_purchase_request_number = $this->number_sequence->generateNewNumber(self::DOCUMENT, date('Y'), $request->company), $this->tables[ self::TBL_PURCHASE_REQUEST ][1][2] => $request->get('purchase-request-title'), $this->tables[ self::TBL_PURCHASE_REQUEST ][1][3] => $request->get('purchase-request-requirement'), $this->tables[ self::TBL_PURCHASE_REQUEST ][1][4] => $request->get('purchase-request-approx-value'), $this->tables[ self::TBL_PURCHASE_REQUEST ][1][5] => $request->get('purchase-request-status'), $this->tables[ self::TBL_PURCHASE_REQUEST ][1][6] => $request->userid, $this->tables[ self::TBL_PURCHASE_REQUEST ][1][9] => $request->get('purchase-request-by'), $this->tables[ self::TBL_PURCHASE_REQUEST ][1][11] => $request->get('purchase-process-group') ] );
    }
    
    public function insertPurchaseRequest(Request $request) {
        if ( $this->setNewPurchaseRequest($request) ) {
            if ( $request->get('purchase-request-status') === "1" ) {
                return response()->json([ "saved" => true, "newpurchaserequestnumber" => $this->new_purchase_request_number ]);
            } else {
                return response()->json([ "evaluation" => true, "newpurchaserequestnumber" => $this->new_purchase_request_number ]);
            }
        } else {
            return response()->json([ "error" => true ]);
        }
    }
    
    public function setDeletePurchaseRequest($request) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $request->purchaserequest )->delete();
    }
    
    public function deletePurchaseRequest(Request $request) {
        if ( $this->setDeletePurchaseRequest($request) ) {
            return response()->json([ "deleted" => true ]);
        }
    }
    
    public function setCancelPurchaseRequest($request) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $request->purchaserequest )->update( [ $this->tables[ self::TBL_PURCHASE_REQUEST ][1][8] => $request->userid, $this->tables[ self::TBL_PURCHASE_REQUEST ][1][5] => 7, $this->tables[ self::TBL_PURCHASE_REQUEST ][1][10] => $request->remark ] );
    }
    
    public function cancelPurchaseRequest(Request $request) {
        if ( $this->setCancelPurchaseRequest($request) ) {
            return response()->json([ "cancelled" => true ]);
        }
    }
    
    public function setEditPurchaseRequest($purchase_request, $changes) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $purchase_request )->update( $changes );
    }
    
    public function editPurchaseRequest(Request $request) {
        $changes = array_diff($request->changes, $request->exising);
        if ( $this->setEditPurchaseRequest($request->purchaserequest, $changes) ) {
            if ( $request->changes['purchase_request_status'] === "1" ) {
                return response()->json([ "edited" => true ]);
            } else {
                return response()->json([ "evaluation" => true ]);
            }
        } else {
            return response()->json([ "error" => true ]);
        }
    }
    
    public function setPurchaseRequestForApproval($purchase_request) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $purchase_request )->update( [ $this->tables[ self::TBL_PURCHASE_REQUEST ][1][5] => 2 ] );
    }
    
    public function sendPurchaseRequestForApproval(Request $request) {
        if ( $this->setPurchaseRequestForApproval($request->purchaserequest) ) {
            return response()->json([ "evaluation" => true ]);
        } else {
            return response()->json([ "evaluation" => false ]);
        }
    }
    
    //check usability
    public function setPurchaseRequestStatus($purchase_request_id, $status_id) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $purchase_request_id )->update( [ $this->tables[ self::TBL_PURCHASE_REQUEST ][1][5] => $status_id ] );
    }
    
    public function getRequiredPurchaseGroupApprovalCountUsersSequence() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0]." AS ".self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE )
            ->join( $this->tables[ self::TBL_PURCHASE_GROUP ][0], self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )
            ->join( $this->tables[ self::TBL_USER ][0], self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->select( self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1]." AS ".self::REQUIRED_PURCHASE_GROUP_SEQUENCE, DB::raw("COUNT(". self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2] .")"." AS ".self::REQUIRED_APPROVAL_COUNT_SEQUENCE), DB::raw("GROUP_CONCAT(". $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1] ." ORDER BY ". self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][5] ." ASC".")"." AS ".self::REQUIRED_APPROVAL_USERS_SEQUENCE), DB::raw("GROUP_CONCAT(". self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][5] ." ORDER BY ". self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][5] ." ASC".")"." AS ".self::REQUIRED_APPROVAL_SEQUENCE) )
            ->where( [ [ self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][3], "=", 1 ], [ $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][2], "=", 1 ] ] )
            ->groupBy( self::REQUIRED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1] );
    }
    
    public function getCurrentSequenceApprovalPurchaseRequests() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0]." AS ".self::PURCHASE_REQUEST_APPROVED )
            ->select( DB::raw("DISTINCT(". self::PURCHASE_REQUEST_APPROVED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1].")"." AS ".self::APPROVED_PURCHASE_REQUEST) )
            ->where( self::PURCHASE_REQUEST_APPROVED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][2], "=", 1 )
            ->whereNotIn( self::PURCHASE_REQUEST_APPROVED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1], function ($select) {
                $select->select( self::PURCHASE_REQUEST_REJECTED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1] )
                        ->from( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0]." AS ".self::PURCHASE_REQUEST_REJECTED )
                        ->where( self::PURCHASE_REQUEST_REJECTED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][2], "=", 0 );
            });
    }
    
    public function getRequiredPurchaseGroupApprovalCountUsersOptional() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0]." AS ".self::REQURIED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_OPTIONAL )
            ->join( $this->tables[ self::TBL_PURCHASE_GROUP ][0], self::REQURIED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_OPTIONAL.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1], "=", $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )
            ->join( $this->tables[ self::TBL_USER ][0], self::REQURIED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_OPTIONAL.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->select( self::REQURIED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_OPTIONAL.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1]." AS ".self::REQUIRED_PURCHASE_GROUP_OPTIONAL, DB::raw(1 ." AS ".self::REQUIRED_APPROVAL_COUNT_OPTIONAL), DB::raw("GROUP_CONCAT(". $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1] ." ORDER BY ". $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1] ." ASC".")"." AS ".self::REQUIRED_APPROVAL_USERS_OPTIONAL) )
            ->where( [ [ $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][2], "=", 0 ], [ self::REQURIED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_OPTIONAL.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][3], "=", 1 ] ] )
            ->groupBy( self::REQURIED_PURCHASE_GROUP_APPROVAL_COUNT_USERS_OPTIONAL.".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1] );
    }
    
    public function getCurrentOptionalApprovalPurchaseRequests() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0]." AS ".self::PURCHASE_REQUEST_APPROVED )
            ->select( DB::raw("DISTINCT(" .self::PURCHASE_REQUEST_APPROVED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1]. ")"." AS ".self::APPROVED_PURCHASE_REQUEST) )
            ->where( self::PURCHASE_REQUEST_APPROVED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][2], "=",1 )
            ->whereNotIn( self::PURCHASE_REQUEST_APPROVED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1], function ($select) {
                $select->select( self::PURCHASE_REQUEST_REJECTED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1] )
                        ->from( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0]." AS ".self::PURCHASE_REQUEST_REJECTED  )
                        ->where( self::PURCHASE_REQUEST_REJECTED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][2], "=", 0 );
            });
    }
    
    public function getCurrentOptionalApprovalCount() {
        return DB::table( DB::raw( "(".$this->getCurrentOptionalApprovalPurchaseRequests()->toSql().")"." AS ".self::CURRENT_OPTIONAL_APPROVAL_PURCHASE_REQUESTS ) )
            ->addBinding($this->getCurrentOptionalApprovalPurchaseRequests()->getBindings(), "select")
            ->join( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0], self::CURRENT_OPTIONAL_APPROVAL_PURCHASE_REQUESTS.".".self::APPROVED_PURCHASE_REQUEST, "=", $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1] )
            ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][3], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->select( self::CURRENT_OPTIONAL_APPROVAL_PURCHASE_REQUESTS.".".self::APPROVED_PURCHASE_REQUEST, DB::raw("COUNT(". $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][3] .")"." AS ".self::CURRENT_OPTIONAL_APPROVAL_COUNT), DB::raw("GROUP_CONCAT(". $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1] .")"." AS ".self::CURRENT_OPTIONAL_APPROVAL_USERS) )
            ->groupBy( self::CURRENT_OPTIONAL_APPROVAL_PURCHASE_REQUESTS.".".self::APPROVED_PURCHASE_REQUEST );
    }
    
    public function getCurrentOptionalApprovalCountSelect() {
        return DB::table( DB::raw( "(".$this->getCurrentOptionalApprovalCount()->toSql().")"." AS ".self::CURRENT_OPTIONAL_APPROVAL ) )
            ->addBinding($this->getCurrentOptionalApprovalCount()->getBindings(), "select")
            ->select( self::CURRENT_OPTIONAL_APPROVAL.".".self::APPROVED_PURCHASE_REQUEST, self::CURRENT_OPTIONAL_APPROVAL.".".self::CURRENT_OPTIONAL_APPROVAL_COUNT, self::CURRENT_OPTIONAL_APPROVAL.".".self::CURRENT_OPTIONAL_APPROVAL_USERS );
    }
    
    public function getRequiredPurchaseRequestGroupApprovalCountUsersOptional() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0]." AS ".self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL )
            ->joinSub( $this->getRequiredPurchaseGroupApprovalCountUsersOptional(), self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL_JOIN, function ($join) {
                $join->on( self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL_JOIN.".".self::REQUIRED_PURCHASE_GROUP_OPTIONAL, "=", self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11] );
            })
            ->select( self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL_JOIN.".".self::REQUIRED_APPROVAL_COUNT_OPTIONAL, self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL_JOIN.".".self::REQUIRED_APPROVAL_USERS_OPTIONAL )
            ->whereNotIn( self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_OPTIONAL.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], function ($select) {
                $select->select( self::PURCHASE_REQUEST_REJECTED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1] )
                        ->from( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0]." AS ".self::PURCHASE_REQUEST_REJECTED  )
                        ->where( self::PURCHASE_REQUEST_REJECTED.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][2], "=", 0 );
            });
    }
    
    public function getCurrentSequenceApprovalCount() {
        return DB::table( DB::raw( "(".$this->getCurrentSequenceApprovalPurchaseRequests()->toSql().")"." AS ".self::CURRENT_SEQUENCE_APPROVAL_PURCHASE_REQUESTS ) )
            ->addBinding($this->getCurrentSequenceApprovalPurchaseRequests()->getBindings(), "select")
            ->join( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0], self::CURRENT_SEQUENCE_APPROVAL_PURCHASE_REQUESTS.".".self::APPROVED_PURCHASE_REQUEST, "=", $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1] )
            ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][3], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->select( self::CURRENT_SEQUENCE_APPROVAL_PURCHASE_REQUESTS.".".self::APPROVED_PURCHASE_REQUEST, DB::raw("COUNT(". $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][3] .")"." AS ".self::CURRENT_SEQUENCE_APPROVAL_COUNT), DB::raw("GROUP_CONCAT(". $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1] ." ORDER BY ". $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][0] ." ASC".")"." AS ".self::CURRENT_SEQUENCE_APPROVAL_USERS) )
            ->groupBy( self::CURRENT_SEQUENCE_APPROVAL_PURCHASE_REQUESTS.".".self::APPROVED_PURCHASE_REQUEST );
    }
    
    public function getRequiredPurchaseRequestGroupApprovalCountUsersSequence() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0]." AS ".self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE )
            ->joinSub( $this->getRequiredPurchaseGroupApprovalCountUsersSequence(), self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE_JOIN, function ($join){
                $join->on( self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE_JOIN.".".self::REQUIRED_PURCHASE_GROUP_SEQUENCE, "=", self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11] );
            })
            ->select( self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE_JOIN.".".self::REQUIRED_APPROVAL_COUNT_SEQUENCE, self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE_JOIN.".".self::REQUIRED_APPROVAL_USERS_SEQUENCE, self::REQUIRED_PURCHASE_REQUEST_GROUP_APPROVAL_COUNT_USERS_SEQUENCE_JOIN.".".self::REQUIRED_APPROVAL_SEQUENCE );
    }
    
    public function getOptionalApproval() {
        return DB::table( DB::raw( "(".$this->getRequiredPurchaseRequestGroupApprovalCountUsersOptional()->toSql().")"." AS ".self::OPTIONAL_APPROVAL ) )
            ->addBinding($this->getRequiredPurchaseRequestGroupApprovalCountUsersOptional()->getBindings(), "select")
            ->leftJoinSub( $this->getCurrentOptionalApprovalCountSelect(), self::OPTIONAL_APPROVAL_JOIN, function ($join) {
                $join->on( self::OPTIONAL_APPROVAL_JOIN.".".self::APPROVED_PURCHASE_REQUEST, "=", self::OPTIONAL_APPROVAL.".".$this->tables[self::TBL_PURCHASE_REQUEST ][1][0] );
            })
            ->select( self::OPTIONAL_APPROVAL.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0]." AS ".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], self::OPTIONAL_APPROVAL_JOIN.".".self::CURRENT_OPTIONAL_APPROVAL_COUNT." AS ".self::CURRENT_APPROVAL_COUNT, self::OPTIONAL_APPROVAL.".".self::REQUIRED_APPROVAL_COUNT_OPTIONAL." AS ".self::REQUIRED_APPROVAL_COUNT, self::OPTIONAL_APPROVAL_JOIN.".".self::CURRENT_OPTIONAL_APPROVAL_USERS." AS ".self::CURRENT_APPROVAL_USER, self::OPTIONAL_APPROVAL.".".self::REQUIRED_APPROVAL_USERS_OPTIONAL." AS ".self::REQUIRED_APPROVAL_USER, DB::raw("NULL"." AS ".self::REQUIRED_APPROVAL_SEQUENCE) );
    }
    
    public function getRejected() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0]." AS ".self::REJECTED_APPROVAL_PURCHASE_REQUEST )
            ->select( self::REJECTED_APPROVAL_PURCHASE_REQUEST.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1]." AS ".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], DB::raw("NULL"." AS ".self::CURRENT_APPROVAL_COUNT), DB::raw("NULL"." AS ".self::REQUIRED_APPROVAL_COUNT), DB::raw("NULL"." AS ".self::CURRENT_APPROVAL_USER), DB::raw("NULL"." AS ".self::REQUIRED_APPROVAL_USER), DB::raw("NULL"." AS ".self::REQUIRED_APPROVAL_SEQUENCE) )
            ->where( self::REJECTED_APPROVAL_PURCHASE_REQUEST.".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][2] , "=", 0 );
    }
    
    public function getUpApprovedRequests() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_GROUP ][0] )
            ->join( $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0], $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0], "=", $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][1] )
            ->join( $this->tables[ self::TBL_USER ][0], $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2], "=", $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][0] )
            ->select( $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0]." AS ".self::PURCHASE_GROUP, DB::raw("COUNT(". $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][2] .")"." AS ".self::PURCHASE_GROUP_REQUIRED_APPROVAL_COUNT), DB::raw("GROUP_CONCAT(". $this->tables[ self::TBL_USER ][0].".".$this->tables[ self::TBL_USER ][1][1] .")"." AS ".self::PURCHASE_GROUP_REQUIRED_APPROVAL_USER), DB::raw("GROUP_CONCAT(". $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][5] .")"." AS ".self::PURCHASE_GROUP_REQUIRED_APPROVAL_SEQUENCE) )
            ->where( [ [ $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][2], 1 ], [ $this->tables[ self::TBL_PURCHASE_GROUP_USER ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP_USER ][1][3], 1 ] ] )
            ->groupBy( $this->tables[ self::TBL_PURCHASE_GROUP ][0].".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] );
    }
    
    public function getUnApproved() {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )
            ->joinSub( $this->getUpApprovedRequests(), self::PURCHASE_GROUP_JOIN, function ($join) {
                $join->on( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", self::PURCHASE_GROUP_JOIN.".".self::PURCHASE_GROUP );
            })
            ->select( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0]." AS ".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], DB::raw("0"." AS ".self::CURRENT_APPROVAL_COUNT), self::PURCHASE_GROUP_JOIN.".".self::PURCHASE_GROUP_REQUIRED_APPROVAL_COUNT." AS ".self::REQUIRED_APPROVAL_COUNT, DB::raw("NULL"." AS ".self::CURRENT_APPROVAL_USER), self::PURCHASE_GROUP_JOIN.".".self::PURCHASE_GROUP_REQUIRED_APPROVAL_USER." AS ".self::REQUIRED_APPROVAL_USER, self::PURCHASE_GROUP_JOIN.".".self::PURCHASE_GROUP_REQUIRED_APPROVAL_SEQUENCE." AS ".self::REQUIRED_APPROVAL_SEQUENCE )
            ->whereNotIn( $this->tables[ self::TBL_PURCHASE_REQUEST ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], function ($select) {
                $select->select( DB::raw("DISTINCT(". $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0].".".$this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][1][1] .")") )
                        ->from( $this->tables[ self::TBL_PURCHASE_REQUEST_APPROVE_REJECT ][0] );
            });
            
    }
    
    public function getUnion() {
        return DB::table( DB::raw( "(".$this->getCurrentSequenceApprovalCount()->toSql().")"." AS ".self::SEQUENCE_APPROVAL ) )
            ->addBinding($this->getCurrentSequenceApprovalCount()->getBindings(), "select")
            ->joinSub( $this->getRequiredPurchaseRequestGroupApprovalCountUsersSequence(), self::SEQUENCE_APPROVAL_JOIN, function ($join) {
                $join->on( self::SEQUENCE_APPROVAL_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", self::SEQUENCE_APPROVAL.".".self::APPROVED_PURCHASE_REQUEST );
            })
            ->select( self::SEQUENCE_APPROVAL.".".self::APPROVED_PURCHASE_REQUEST." AS ".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], self::SEQUENCE_APPROVAL.".".self::CURRENT_SEQUENCE_APPROVAL_COUNT." AS ".self::CURRENT_APPROVAL_COUNT, self::SEQUENCE_APPROVAL_JOIN.".".self::REQUIRED_APPROVAL_COUNT_SEQUENCE." AS ".self::REQUIRED_APPROVAL_COUNT, self::SEQUENCE_APPROVAL.".".self::CURRENT_SEQUENCE_APPROVAL_USERS." AS ".self::CURRENT_APPROVAL_USER, self::SEQUENCE_APPROVAL_JOIN.".".self::REQUIRED_APPROVAL_USERS_SEQUENCE." AS ".self::REQUIRED_APPROVAL_USER, self::SEQUENCE_APPROVAL_JOIN.".".self::REQUIRED_APPROVAL_SEQUENCE." AS ".self::REQUIRED_APPROVAL_SEQUENCE )
            ->unionAll($this->getOptionalApproval())
            ->unionAll($this->getRejected())
            ->unionAll($this->getUnApproved());
    }
    
    public function getPurchaseRequests($user_id, $company, $purchase_groups) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0]." AS ".self::PURCHASE_REQUEST_LIST )
            ->leftJoin( $this->tables[ self::TBL_PURCHASE_REQUEST_STATUS ][0]." AS ".self::PURCHASE_REQUEST_LIST_STATUS_JOIN , self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][5], "=", self::PURCHASE_REQUEST_LIST_STATUS_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST_STATUS ][1][0] )
            ->leftJoin( $this->tables[ self::TBL_USER ][0]." AS ".self::PURCHASE_REQUEST_CREATED_BY_JOIN, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][6], "=", self::PURCHASE_REQUEST_CREATED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][0] )
            ->leftJoin( $this->tables[ self::TBL_USER ][0]." AS ".self::PURCHASE_REQUEST_EDITED_BY_JOIN, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][8], "=", self::PURCHASE_REQUEST_EDITED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][0] )
            ->leftJoin( $this->tables[ self::TBL_PURCHASE_GROUP ][0]." AS ".self::PURCHASE_REQUEST_GROUP, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][11], "=", self::PURCHASE_REQUEST_GROUP.".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0] )
            ->leftJoinSub( $this->getUnion() ,self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN, function ($join) {
                $join->on( self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "=", self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0] );
            })
            ->select( self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][1], self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][2], self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][3], self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][4], self::PURCHASE_REQUEST_LIST_STATUS_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST_STATUS ][1][0], self::PURCHASE_REQUEST_LIST_STATUS_JOIN.".".$this->tables[ self::TBL_PURCHASE_REQUEST_STATUS ][1][1], self::PURCHASE_REQUEST_CREATED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][1]." AS ".self::CREATED_BY, DB::raw( "DATE(". self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][7] .")"." AS ".self::PURCHASE_REQUEST_CREATED_DATE), self::PURCHASE_REQUEST_EDITED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][1]." AS ".self::EDITED_BY, self::PURCHASE_REQUEST_GROUP.".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0], self::PURCHASE_REQUEST_GROUP.".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][1], self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::CURRENT_APPROVAL_COUNT, self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::REQUIRED_APPROVAL_COUNT, self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::CURRENT_APPROVAL_USER, self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::REQUIRED_APPROVAL_USER, self::PURCHASE_REQUEST_APPROVAL_MATRIX_JOIN.".".self::REQUIRED_APPROVAL_SEQUENCE, self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][12] )
            ->where( [ [ self::PURCHASE_REQUEST_CREATED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][4], $company ], [ self::PURCHASE_REQUEST_CREATED_BY_JOIN.".".$this->tables[ self::TBL_USER ][1][0], $user_id ] ] )
            ->orWhereIn( self::PURCHASE_REQUEST_GROUP.".".$this->tables[ self::TBL_PURCHASE_GROUP ][1][0], $purchase_groups )
            ->orderBy( self::PURCHASE_REQUEST_LIST.".".$this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], "asc" )
            ->get();
    }
    
    public function setPurchaseRequests($user_id, $company, $purchase_groups) {
        return $this->getPurchaseRequests($user_id, $company, $purchase_groups);
    }
    
    public function setPurchaseQuoteForAuthorization($purchase_request) {
        return DB::table( $this->tables[ self::TBL_PURCHASE_REQUEST ][0] )->where( $this->tables[ self::TBL_PURCHASE_REQUEST ][1][0], $purchase_request )->update( [ $this->tables[ self::TBL_PURCHASE_REQUEST ][1][12] => 1 ] );
    }
}