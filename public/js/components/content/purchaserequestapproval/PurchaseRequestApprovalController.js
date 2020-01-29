/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import PurchaseRequestApprovalService from './PurchaseRequestApprovalService.js';
import NothingSlectedAlert from '../../utils/NothingSelectedAlert.js';
import Required from '../../elements/Required.js';
import SelectLabel from '../../elements/SelectLabel.js';
import Select from '../../elements/Select.js';
import CheckBoxInline from '../../elements/CheckBoxInline.js';

class PurchaseRequestApprovalController {
    
    static tableAutoUpdate(table) {
        
        setInterval(function() {
            if ( $('#purchaserequestapproval').hasClass('active') ) {
                
                table.ajax.reload(null, false);
                
            }
        }, 5000);
        
    }
    
    static tableColumns() {
        
        return new Array(
            { title: "PurchReq. ID", data: "purchase_request_id", visible: false },
            { title: "PurchReq. #", data: "purchase_request_number" },
            { title: "PurchReq. Title", data: "purchase_request_title" },
            { title: "Date", data: "purchase_request_created_date" },
            { title: "Status ID", data: "purchase_request_status", visible: false },
            { title: "Created By", data: "created_by", render: function(data, type, row) {
                    return type === 'display' && data.length > 13 ?
                        data.substr( 0, 13 ) +'…' :
                        data;
                }
            },
            { title: "Purc. Group ID", data: "purchase_request_purchase_group", visible: false },
            { title: "Purc. Group", data: "purchase_request_purchase_group_name" },
            { title: "App. Status", data: null, render: function(data, type, row) {
                    if ( row.current_approval_count ===  row.required_approval_count) {
                        return "Done " + row.current_approval_count + "/" + row.required_approval_count;
                    } else {
                        return "Pending " + (() => { return row.current_approval_count; })() + "/" + row.required_approval_count;
                    }
                }
            },
            { title: "Previously Approved By", data: null, render: function(data, type, row) {
                    if ( row.current_approval_user && row.approver_sequence ) {
                        let prev_app = row.current_approval_user.split(",");
                        return prev_app[ row.approver_sequence-2 ];
                    } else {
                        return null;
                    }
                }
            },
            { title: "Last Edit", data: "edited_by", render: function(data, type, row) {
                    if (data) {
                        return type === 'display' && data.length > 13 ?
                            data.substr( 0, 13 ) +'…' :
                            data;
                    } else {
                        return null;
                    }
                }
            }
        );
        
    }
    
    static viewPurchaseRequestApproveReject(selected_row) {
        
        if ( $('.row').siblings() ) {
            $('.row:not(:first)').remove();
            $('.row').after(
                '<div class="row">' +
                    '<div class="col-8">' +
                        '<div class="card">' +
                            '<div class="card-body">' +
                                '<h6 class="card-title text-center"> Purchase Request: ' + selected_row.selected_purchase_request_approve_reject.purchase_request_number + ' </h6>' +
                                '<h6><span class="badge badge-secondary">Purchase Request Date:</span></h6>' +
                                '<p>' + selected_row.selected_purchase_request_approve_reject.purchase_request_created_date + '</p>' +
                                '<h6><span class="badge badge-secondary">Purchase Requirement:</span></h6>' +
                                '<p>' + selected_row.selected_purchase_request_approve_reject.purchase_request_requirement + '</p>' +
                                '<h6><span class="badge badge-secondary">Purchase Created By:</span></h6>' +
                                '<p>' + selected_row.selected_purchase_request_approve_reject.created_by + '</p>' +
                                '<h6><span class="badge badge-secondary">Purchase Request By:</span></h6>' +
                                '<p>' +
                                    "selected_row.selected_purchase_request_approve_reject" +
                                '</p>' +
                                '<h6><span class="badge badge-secondary">Purchase Request Approx. Estimate:</span></h6>' +
                                '<p>' +
                                    (() => { return new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(selected_row.selected_purchase_request_approve_reject.purchase_request_approx_value || 0); })() +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-4">' +
                        '<div class="card">' +
                            '<div class="card-body">' +
                                '<h6 class="card-title text-center"> Approval Info </h6>' +
                                (() => {
                                    let req_app_user = selected_row.selected_purchase_request_approve_reject.required_approval_user.split(",");
                                    if ( selected_row.selected_purchase_request_approve_reject.approver_sequence ) {
                                        let req_app_seq_sort = [];
                                        let req_app_user_sort = [];
                                        let cur_app_user = (() => { if (selected_row.selected_purchase_request_approve_reject.current_approval_user) { return selected_row.selected_purchase_request_approve_reject.current_approval_user.split(","); } else { return []; } })();
                                        let req_app_seq = req_app_seq_sort = selected_row.selected_purchase_request_approve_reject.required_approval_sequence.split(",");
                                        req_app_seq_sort.sort(function(first, second) { return first-second; });
                                        req_app_seq.forEach((seq, index) => {
                                            req_app_user_sort[req_app_seq_sort[index]-1] = req_app_user[seq-1];
                                        });
                                        
                                        return req_app_user_sort.map((user) => {
                                            if ( cur_app_user.includes(user) ) {
                                                return (
                                                    '<h6><span class="badge badge-success">APPROVED - {Date}</span></h6>' +
                                                    '<p>' +
                                                        user +
                                                    '</p>'
                                                );
                                            } else {
                                                return (
                                                    '<h6><span class="badge badge-warning">PENDING</span></h6>' +
                                                    '<p>' +
                                                        user +
                                                    '</p>'
                                                );
                                            }
                                        }).join('');
                                    } else {
                                        return req_app_user.map((user) => {
                                            return (
                                                '<h6><span class="badge badge-warning">PENDING</span></h6>' +
                                                '<p>' +
                                                    user +
                                                '</p>'
                                            );
                                        }).join('');
                                    }
                                })() +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }
        
    }
    
    static selectPurchaseRequestApproveReject(purchaserequestapproval, selected_row) {
        
        purchaserequestapproval.on('click', 'tr', function(event) {
            selected_row.selected_purchase_request_approve_reject = purchaserequestapproval.row(this).data();
            if ( purchaserequestapproval.row(this, { selected: true }).data() === purchaserequestapproval.row(this).data() ) {
                event.stopPropagation();
                return false;
            } else {
                PurchaseRequestApprovalController.viewPurchaseRequestApproveReject(selected_row);
            }

        });
        
    }
    
    static rejectPurchaseRequestValidation(selected_row, swal_text) {
        
        $(document).on('click', '.reject-confirm', async (event) => {
            
            event.stopImmediatePropagation();
            swal.stopLoading();
            if ( $('#remark').val() ) {
                await new PurchaseRequestApprovalService().rejectPurchaseRequest(selected_row.selected_purchase_request_approve_reject.purchase_request_id, window.localStorage.getItem('current_user_id'), $('#remark').val(), $('meta[name="csrf-token"]').attr("content")).then((response) => {
                    if ( response.rejected ) {
                        swal_text.innerHTML = "PR# <b>" + selected_row.selected_purchase_request_approve_reject.purchase_request_number + "</b> rejected";
                        return swal({
                            icon: "success",
                            title: "Rejected",
                            content: swal_text,
                            buttons: false,
                            timer: 3000,
                            closeOnEsc: false,
                            closeOnClickOutside: false
                        });
                        if ( $('.row').siblings() ) {
                            $('.row:not(:first)').remove();
                        }
                    } else {
                        swal({
                            icon: "error",
                            title: "Opsss ",
                            text: "Something went terribly wrong. Please contact System Administrator",
                            buttons: false,
                            timer: 3000,
                            closeOnEsc: false,
                            closeOnClickOutside: false
                        });
                    }
                });
            } else {
                if ( $('span.text-danger').is(':visible') ) {
                    $('div.error').remove();
                }
                $('#remark').after('<div class="error"><br /><span class="text-danger">Please enter to proceed</span></div>');
                $('#remark').css("border-color", "#a94442");
            }
            
        });
        
    }
    
    tableCreator() {
        
        
        
    }
    
    builder() {
        
        $(document).ready(function() {
            $(document).on("click", "#purchaserequestapproval", function() {
                let selected_row = {};
                let swal_text = document.createElement("div");
                swal_text.className = "swal-text text-center";

                let purchaserequestapproval = $('#purchase-request-approval').DataTable({
                    info: false,
                    ajax: {
                        url: "purchaserequestapprovereject?company=" + window.localStorage.getItem('current_user_company') + "&user_id=" + window.localStorage.getItem('current_user_id') + (function(){ return JSON.parse(window.localStorage.getItem('current_user_approver_groups')).length ? JSON.parse(window.localStorage.getItem('current_user_approver_groups')).map((purchase_group, index) => { return "&purchase_groups[" + index + "]=" + purchase_group; }).join("") : "&purchase_groups[0]=null"; })(),
                        dataSrc: "purchase_request_approve_reject"
                    },
                    select: {
                        style: "single"
                    },
                    saveState: true,
                    rowId: "purchase_request_id",
                    responsive: true,
                    processing: true,
                    scrollY: 225,
                    scrollCollapse: true,
                    scroller: true,
                    columns: PurchaseRequestApprovalController.tableColumns(),
                    dom: "Bfrtip",
                    buttons: [
                        {
                            text: "Approve",
                            className: "btn btn-raised btn-success waves-effect waves-light",
                            action: function() {
                                if ( selected_row.selected_purchase_request_approve_reject ) {
                                    swal_text.innerHTML = "Are you sure you want to APPROVE the Purchase Request: <b>" + selected_row.selected_purchase_request_approve_reject.purchase_request_number + "</b><br /><br />" + new CheckBoxInline([], {}, "petty-cash", 0, "Petty Cash Request").render(); + "<br /><br /><b>WARNING!</b><br />In proceeding Purchase Request #<b>" + selected_row.selected_purchase_request_approve_reject.purchase_request_number + "</b> will be approved";
                                    swal({
                                        title: "Approve Purchase Request?",
                                        content: swal_text,
                                        icon: "info",
                                        dangerMode: true,
                                        closeOnClickOutside: false,
                                        closeOnEsc: false,
                                        buttons: {
                                            cancel: {
                                                text: "Nope! Not " + selected_row.selected_purchase_request_approve_reject.purchase_request_number ,
                                                visible: true
                                            },
                                            confirm: {
                                                text: "Approve"
                                            }
                                        }
                                    }).then(async (approveIt) => {
                                        if ( approveIt ) {
                                            await new PurchaseRequestApprovalService().approvePurchaseRequest(selected_row.selected_purchase_request_approve_reject.purchase_request_id, window.localStorage.getItem('current_user_id'), (() => { if ( $('#petty-cash').is(':checked') ) { return 1; } else { return $('#petty-cash').val(); } })(), $('meta[name="csrf-token"]').attr("content")).then((response) => {
                                                if ( response.approved ) {
                                                    swal_text.innerHTML = "PR# <b>" + selected_row.selected_purchase_request_approve_reject.purchase_request_number + "</b> approved";
                                                    swal({
                                                        icon: "success",
                                                        title: "Approved",
                                                        content: swal_text,
                                                        buttons: false,
                                                        timer: 3000,
                                                        closeOnEsc: false,
                                                        closeOnClickOutside: false
                                                    }).then(() => {
                                                        if ( $('#petty-cash').is(':checked') ) {
                                                            swal({
                                                                icon: "success",
                                                                title: "Petty Cash Request",
                                                                text: "Finance team has been notified",
                                                                buttons: false,
                                                                timer: 3000,
                                                                closeOnEsc: false,
                                                                closeOnClickOutside: false
                                                            });
                                                        }
                                                    });
                                                    if ( $('.row').siblings() ) {
                                                        $('.row:not(:first)').remove();
                                                    }
                                                } else {
                                                    swal({
                                                        icon: "error",
                                                        title: "Opsss ",
                                                        text: "Something went terribly wrong. Please contact System Administrator",
                                                        buttons: false,
                                                        timer: 3000,
                                                        closeOnEsc: false,
                                                        closeOnClickOutside: false
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    new NothingSlectedAlert().render();
                                }
                            }
                        },
                        {
                            text: "Reject",
                            className: "btn btn-raised btn-danger waves-effect waves-light",
                            action: function() {
                                if ( selected_row.selected_purchase_request_approve_reject ) {
                                    swal_text.innerHTML = "Are you sure you want to REJECT the Purchase Request:<br /><b>" + selected_row.selected_purchase_request_approve_reject.purchase_request_number + "</b><br /><br /><b>WARNING!</b><br />In proceeding Purchase Reuest #<b>" + selected_row.selected_purchase_request_approve_reject.purchase_request_number + "</b> will be Rejected";
                                    swal({
                                        title: "Reject Purchase Request?",
                                        content: swal_text,
                                        icon: "warning",
                                        dangerMode: true,
                                        closeOnClickOutside: false,
                                        closeOnEsc: false,
                                        buttons: {
                                            cancel: {
                                                text: "Nope! Not " + selected_row.selected_purchase_request_approve_reject.purchase_request_number,
                                                visible: true
                                            },
                                            confirm: {
                                                text: "Reject",
                                                closeModal: false
                                            }
                                        }
                                    }).then((rejectIt)=>{
                                        if ( rejectIt ) {
                                            swal_text.innerHTML = "Please enter Reject Remark" + Required + "<br /><br /><span class='bmd-form-group'><input class='swal-content__input' id='remark' type='text' required></span>";
                                            return swal({
                                                icon: "info",
                                                content: swal_text,
                                                dangerMode: true,
                                                closeOnClickOutside: false,
                                                closeOnEsc: false,
                                                buttons: {
                                                    cancel: {
                                                        visible: true
                                                    },
                                                    confirm: {
                                                        closeModal: false,
                                                        className: "reject-confirm"
                                                    }
                                                }
                                            }).then(async (confirm) => {
                                                if ( confirm ) {
                                                    PurchaseRequestApprovalController.rejectPurchaseRequestValidation(selected_row, swal_text);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    new NothingSlectedAlert().render();
                                }
                            }
                        }
                    ],
                    initComplete: function() {
                        this.api().buttons().container().append(
                            new SelectLabel("Purc. Group").render() + new Select(['purchase-group'], "purchase-group", { multiple: "multiple" }, {}, 1).render()
                        );

                        $('select').SumoSelect({ selectAll: true });

                        let purchase_groups  = JSON.parse(window.localStorage.getItem('current_user_purchase_groups'));
                        purchase_groups = purchase_groups.filter(e => JSON.parse(window.localStorage.getItem('current_user_approver_groups')).includes(e[0]));
                        
                        purchase_groups.map((purchase_group, index) => {
                            $('select.purchase-group')[0].sumo.add(purchase_group[0], purchase_group[1], index);
                        });
                        $('select.purchase-group').parents('.SumoSelect').css('width', "220px");

                        let column_purchase_group = this.api().columns(6);
                        $(document).on("change", "select.purchase-group",function() {
                            column_purchase_group.search($(this).val().map((value) => { return value; }).join("|"), true, false).draw();
                        });

                        $('select.purchase-group')[0].sumo.selectAll();
                    }
                });
                
                PurchaseRequestApprovalController.tableAutoUpdate(purchaserequestapproval);
                PurchaseRequestApprovalController.selectPurchaseRequestApproveReject(purchaserequestapproval, selected_row);
            });
        });
        
    }
    
}

export default new PurchaseRequestApprovalController().builder();