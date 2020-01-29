/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import PurchaseRequestService from './PurchaseRequestService.js';
import PurchaseQuoteService from './PurchaseQuoteService.js';
import Label from '../../elements/Label.js';
import Input from '../../elements/Input.js';
import InputHelp from '../../elements/InputHelp.js';
import TextArea from '../../elements/TextArea.js';
import Required from '../../elements/Required.js';
import Button from '../../elements/Button.js';
import CheckBox from '../../elements/CheckBox.js';
import CheckBoxInline from '../../elements/CheckBoxInline.js';
import Table from '../../elements/Table.js';
import ModalForm from '../../elements/ModalForm.js';
import ModalFormCustom from '../../elements/ModalFormCustom.js';
import SelectLabel from '../../elements/SelectLabel.js';
import Select from '../../elements/Select.js';
import NothingSlectedAlert from '../../utils/NothingSelectedAlert.js';
import DataCompare from '../../utils/DataCompare.js';
import DateAddDays from '../../utils/DateAddDays.js';

class PurchaseRequestController {
    
    static tableAutoUpdate(table, selected_row, table_row_count, time_out_id) {
        
        time_out_id = setInterval(function() {
            
            if ( $('#purchaseprocurement').hasClass("active") ) {
                
                table.ajax.reload(null, false);
                if ( selected_row.selected_purchase_request === undefined && table_row_count !== table.data().count() ) {
                    table.scroller.toPosition(table.data().count(), false);
                    table_row_count = table.data().count();
                }
            
            } else {
                clearInterval(time_out_id);
            }
        }, 4000);
        
    }
    
    static purchaseQuoteAutoUpdate(table, selected_row, purchase_quote_time_out_id) {
        
        purchase_quote_time_out_id = setInterval(function() {
            
            if ( $('#purchaseprocurement').hasClass("active") ) {
                
                if ( selected_row.selected_purchase_request !== undefined && selected_row.selected_purchase_request.purchase_request_status_id > 3 ) {
                
                    table.ajax.url("purchasequotes?purchase_request=" + selected_row.selected_purchase_request.purchase_request_id);
                    table.ajax.reload(null, false);
                    
                }
            
            } else {
                clearInterval(purchase_quote_time_out_id);
            }
            
        }, 4000);
        
    }
    
    static purchaseQuoteLinesAutoUpdate(table, selected_row, purchase_quote_lines_time_out_id) {
        
        purchase_quote_lines_time_out_id = setInterval(function() {
            
            if ( $('#purchaseprocurement').hasClass("active") ) {
                
                if ( selected_row.selected_purchase_quote !== undefined ) {
                
                    table.ajax.url("purchasequotelines?purchase_quote=" + selected_row.selected_purchase_quote.purchase_quote_id);
                    table.ajax.reload(null, false);
                    
                }
            
            } else {
                clearInterval(purchase_quote_lines_time_out_id);
            }
            
        }, 4000);
        
    }
    
    static tableColumns() {
        
        return new Array(
            { title: "PurchReq. ID", data: "purchase_request_id", visible: false },
            { title: "PurchReq. #", data: "purchase_request_number" },
            { title: "PurchReq. Title", data: "purchase_request_title" },
            { title: "Status ID", data: "purchase_request_status_id", visible: false },
            { title: "Status", data: "purchase_request_status" },
            { title: "Created By", data: "created_by", render: function(data, type, row) {
                    return type === 'display' && data.length > 13 ?
                        data.substr( 0, 13 ) +'…' :
                        data;
                }
            },
            { title: "Date", data: "purchase_request_created_date" },
            { title: "Purc. Group ID", data: "purchase_group_id", visible: false },
            { title: "Purc. Group", data: "purchase_group_name" },
            { title: "App. Status", data: null, render: function(data, type, row) {
                    switch ( row.purchase_request_status ) {
                        case "Cancelled": {
                            return null;  
                        };
                        break;
                        case "Rejected": {
                            return "Rejected";
                        };
                        break;
                    }
                    if ( row.current_approval_count ===  row.required_approval_count) {
                        return "Done " + row.current_approval_count + "/" + row.required_approval_count;
                    } else {
                        return "Pending " + (() => { return row.current_approval_count || 0; })() + "/" + row.required_approval_count;
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
    
    static editPurchaseRequest(selected_row) {
        
        $(document).on('click', '.submit-edit', function(element) {
            
            element.stopImmediatePropagation();
            
            if ( !new DataCompare([ selected_row.selected_purchase_request.purchase_request_title, selected_row.selected_purchase_request.purchase_request_requirement, selected_row.selected_purchase_request.purchase_request_approx_value, selected_row.selected_purchase_request.purchase_group_id ], [ $('#purchase-request-title').val(), $('#purchase-request-requirement').val(), $('#purchase-request-approx-value').val() || null, Number($('#edit-purchase-request-purchase-group').val()) ]).compare() ) {
                
                let existing = {
                    purchase_request_title: selected_row.selected_purchase_request.purchase_request_title,
                    purchase_request_requirement: selected_row.selected_purchase_request.purchase_request_requirement,
                    purchase_request_approx_value: selected_row.selected_purchase_request.purchase_request_approx_value,
                    purchase_process_group: selected_row.selected_purchase_request.purchase_group_id,
                    purchase_request_status: selected_row.selected_purchase_request.purchase_request_status_id,
                    last_edited_by: selected_row.selected_purchase_request.edited_by
                };

                let changes = {
                    purchase_request_title: $('#purchase-request-title').val(),
                    purchase_request_requirement: $('#purchase-request-requirement').val(),
                    purchase_request_approx_value: $('#purchase-request-approx-value').val() || null,
                    purchase_process_group: $('#edit-purchase-request-purchase-group').val(),
                    purchase_request_status: (() => { switch ( element.target.id ) { case "edit-save": { return 1; }; break; case "edit-send-for-approval": { return 2; }; break; } })(),
                    last_edited_by: JSON.parse(window.localStorage.getItem('current_user_id'))
                };
                
                swal({
                    icon: (function() { switch ( element.target.id ) { case "edit-save": { return "warning"; } break; case "edit-send-for-approval": { return "info"; } } })(),
                    title: (function() { switch ( element.target.id ) { case "edit-save": { return "Only Save?"; } break; case "edit-send-for-approval": { return "Save & Submit for Approval"; } } })(),
                    text: (function() { switch ( element.target.id ) { case "edit-save": { return "Save without sending for approval?"; } break; case "edit-send-for-approval": { return "Are you sure?"; } } })(),
                    buttons: {
                        cancel: true,
                        confirm: {
                            text: (function() { switch ( element.target.id ) { case "edit-save": { return "Just Save"; } break; case "edit-send-for-approval": { return "Submit for Approval"; } } })()
                        }
                    },
                    closeOnEsc: false,
                    closeOnClickOutside: false
                }).then(async (submit) => {
                    if ( submit ) {
                        await new PurchaseRequestService().editPurchaseRequest(selected_row.selected_purchase_request.purchase_request_id, existing, changes).then((response) => {
                            if ( response.saved ) {
                                swal({
                                    icon: "success",
                                    title: "Changes Saved " + selected_row.selected_purchase_request.purchase_request_number,
                                    text: "Changes saved but not submitted for approval",
                                    buttons: false,
                                    timer: 3000,
                                    closeOnEsc: false,
                                    closeOnClickOutside: false
                                });
                            }

                            if ( response.evaluation ) {
                                swal({
                                    icon: "success",
                                    title: "Changes Saved & Submitted " + selected_row.selected_purchase_request.purchase_request_number,
                                    text: "Changes saved and submitted for approval",
                                    buttons: false,
                                    timer: 3000,
                                    closeOnEsc: false,
                                    closeOnClickOutside: false
                                });
                            }

                            if ( response.error ) {
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
                            
                            $.unblockUI();
                            $('form')[0].reset();
                            document.body.style.overflowY = "auto";
                            
                        });
                    }
                });
                
            } else {
                if ( element.target.id === "edit-send-for-approval" ) {
                    swal({
                        icon: "info",
                        title: "Save & Submit for Approval",
                        text: "Are you sure?",
                        buttons: {
                            cancel: true,
                            confirm: {
                                text: "Submit for Approval"
                            }
                        },
                        closeOnEsc: false,
                        closeOnClickOutside: false
                    }).then(async (submit) => {
                        if ( submit ) {
                            await new PurchaseRequestService().sendPurchaseRequestForApproval(selected_row.selected_purchase_request.purchase_request_id).then((response) => {
                                if ( response.evaluation ) {
                                    swal({
                                        icon: "success",
                                        title: "Submitted " + selected_row.selected_purchase_request.purchase_request_number,
                                        text: "Submitted for approval",
                                        buttons: false,
                                        timer: 3000,
                                        closeOnEsc: false,
                                        closeOnClickOutside: false
                                    });
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
                                
                                $.unblockUI();
                                $('form')[0].reset();
                                document.body.style.overflowY = "auto";
                            });
                        }
                    });
                } else {
                    swal({
                        icon: "info",
                        title: "No Changes Detected",
                        text: "No changes were detected",
                        buttons: false,
                        timer: 3000,
                        closeOnEsc: false,
                        closeOnClickOutside: false
                    });
                }
                
            }
        });
        
    }
    	
    static viewPurchaseRequest() {
        
        
        
    }
    
    static selectPurchaseRequest(purchaseprocurement_request, purchaseprocurement_quote, purchaseprocurement_quote_lines, selected_row) {
        
        purchaseprocurement_request.on('click', 'tr', async function(event) {
            delete selected_row.selected_purchase_quote;
            selected_row.selected_purchase_request = purchaseprocurement_request.row(this).data();
            purchaseprocurement_quote_lines.clear().draw();
            if ( $('tfoot').children().is(":visible") ) {
                $('tfoot').children().remove();
            }
            if ( selected_row.selected_purchase_request.purchase_request_status_id > 1 ) {
                $('.delete-purchase-request').attr("disabled", true);
            } else {
                $('.delete-purchase-request').removeAttr("disabled");
            }
            
            if ( selected_row.selected_purchase_request.purchase_request_status_id > 5 ) {
                $('.cancel-purchase-request').attr("disabled", true);
            } else {
                $('.cancel-purchase-request').removeAttr("disabled");
            }
            //console.log(selected_row.selected_purchase_request);
            if ( purchaseprocurement_request.row(this, { selected: true }).data() === purchaseprocurement_request.row(this).data() ) {
                event.stopPropagation();
                return false;
            }
            
            if ( selected_row.selected_purchase_request.purchase_request_status_id > 3 ) {
                await new PurchaseQuoteService().getPurchaseRequestQuotes(selected_row.selected_purchase_request.purchase_request_id).then((response) => {
                    if ( response.data.length ) {
                        purchaseprocurement_quote.clear();
                        purchaseprocurement_quote.rows.add(response.data).draw();
                        $('select.purchase-quote-status')[0].sumo.selectItem('1');
                        $('select.purchase-quote-status')[0].sumo.selectItem('2');
                        $('select.purchase-quote-status')[0].sumo.selectItem('5');
                        $('select.purchase-quote-status')[0].sumo.selectItem('6');
                    } else {
                        purchaseprocurement_quote.clear().draw();
                        $('select.purchase-quote-status')[0].sumo.unSelectAll();
                    }
                });
            } else {
                purchaseprocurement_quote.clear().draw();
                $('select.purchase-quote-status')[0].sumo.unSelectAll();
            }
            
        });
////                if (purchaseprocurement_quote.rows().count()) {
////                    delete selectedrow.purchase_quote;
////                    purchaseprocurement_quote.clear();
////                    purchaseprocurement_quote_lines.clear().draw();
////                } else {
////                    purchaseprocurement_quote.rows.add(purchasequotedata).draw();
////                    //purchaseprocurement_quote.draw();
////                }
        
    }
    
    static newPurchaseRequest() {
        
        $(document).on('click', '.submit', (element) => {
            //validate data
            swal({
                icon: (function() { switch ( element.target.id ) { case "save-purchase-request": { return "warning"; } break; case "send-for-approval": { return "info"; } } })(),
                title: (function() { switch ( element.target.id ) { case "save-purchase-request": { return "Only Save?"; } break; case "send-for-approval": { return "Save & Submit for Approval?"; } } })(),
                text: (function() { switch ( element.target.id ) { case "save-purchase-request": { return "Save without sending for approval?"; } break; case "send-for-approval": { return "Are you sure?"; } } })(),
                buttons: {
                    cancel: true,
                    confirm: {
                        text: (function() { switch ( element.target.id ) { case "save-purchase-request": { return "Just Save"; } break; case "send-for-approval": { return "Submit for Approval"; } } })()
                    }
                },
                closeOnEsc: false,
                closeOnClickOutside: false
            }).then(async (submit) => {
                if ( submit ) {
                    let formData = $('#new-purchase-request').serializeArray();
                    formData.push({ name: "userid", value: JSON.parse(window.localStorage.getItem('current_user_id')) }, { name: "purchase-request-status", value: (function() { switch ( element.target.id ) { case "save-purchase-request": { return 1; } break; case "send-for-approval": { return 2; } break; } })() }, { name: "purchase-process-group", value: $('select.purchase-process-group').val() }, { name: "company", value: window.localStorage.getItem('current_user_company') }, { name: "_token", value: $('meta[name="csrf-token"]').attr("content") });
                    await new PurchaseRequestService().newPurchaseRequest(formData).then((response) => {
                        //button fireworks
                        if ( response.saved ) {
                            swal({
                                icon: "success",
                                title: "Saved " + response.newpurchaserequestnumber,
                                text: "Saved but not submitted for approval",
                                buttons: false,
                                timer: 3000,
                                closeOnEsc: false,
                                closeOnClickOutside: false
                            });
                        }

                        if ( response.evaluation ) {
                            swal({
                                icon: "success",
                                title: "Saved & Submitted " + response.newpurchaserequestnumber,
                                text: "Submitted for approval",
                                buttons: false,
                                timer: 3000,
                                closeOnEsc: false,
                                closeOnClickOutside: false
                            });
                        }

                        if ( response.error ) {
                            swal({
                                icon: "error",
                                title: "Opsss",
                                text: "Something went terribly wrong. Please contact System Administrator",
                                buttons: false,
                                timer: 3000,
                                closeOnEsc: false,
                                closeOnClickOutside: false
                            });
                        }
                        $.unblockUI();
                        $('form')[0].reset();
                        document.body.style.overflowY = "auto";
                    });
                }
            });
        });
        
    }
    
    static deletePurchaseRequest() {
        
        
        
    }
    
    static cancelPurchaseRequestValidation(selected_row, swal_text) {
        
        $(document).on('click', '.cancel-confirm', async (event) => {
            
            event.stopImmediatePropagation();
            swal.stopLoading();
            if ( $('#remark').val() ) {
                await new PurchaseRequestService().cancelPurchaseRequest(selected_row.selected_purchase_request.purchase_request_id, JSON.parse(window.localStorage.getItem('current_user_id')), $('#remark').val()).then((response) => {
                    if ( response.cancelled ) {
                        swal_text.innerHTML = "PR# <b>" + selected_row.selected_purchase_request.purchase_request_number + "</b> cancelled successfully";
                        return swal({
                            icon: "success",
                            title: "Successfully Cancelled",
                            content: swal_text,
                            buttons: false,
                            timer: 3000,
                            closeOnEsc: false,
                            closeOnClickOutside: false
                        });
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
    
    static cancelPurchaseRequest() {
        
        
        
    }
    
    static extendPurchaseQuoteValidation(selected_row, swal_text) {
        
        $(document).on('click', '.extend-confirm', async (event) => {
            
            event.stopImmediatePropagation();
            swal.stopLoading();
            if ( $('#validity').val() && Date.parse(new Date(selected_row.selected_purchase_quote.purchase_quote_date).addDays(selected_row.selected_purchase_quote.validity_period + Number($('#validity').val()))) > Date.parse(new Date().toISOString().split('T')[0]) ) {
                let data = new Array(
                    { name: "purchase_quote", value: selected_row.selected_purchase_quote.purchase_quote_id },
                    { name: "validity", value: $('#validity').val() },
                    { name: "_token", value: $('meta[name="csrf-token"]').attr("content") }
                );
                await new PurchaseQuoteService().extendPurchaseQuote(data).then((response) => {
                    if ( response.updated ) {
                        swal_text.innerHTML = "PQ# <b>" + selected_row.selected_purchase_quote.purchase_quote_number + "</b> extended successfully. <br />New expiry date: <b>" + response.newpurchasequoteexpiry + "</b>";
                        return swal({
                            icon: "success",
                            title: "Successfully Extended",
                            content: swal_text,
                            buttons: false,
                            timer: 3000,
                            closeOnEsc: false,
                            closeOnClickOutside: false
                        });
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
                if ( !$('#validity').val() ) {
                    $('#validity').after('<div class="error"><br /><span class="text-danger">Please enter to proceed</span></div>');
                } else {
                    $('#validity').after('<div class="error"><br /><span class="text-danger">Entered Period results in expiry</span></div>');
                }
                $('#validity').css("border-color", "#a94442");
            }
            
        });
        
    }
    
    tableCreator(selected_row, swal_text, table_row_count, time_out_id, purchase_quote_time_out_id, purchase_quote_lines_time_out_id) {
        
        let purchaseprocurement_request = $('#purchase-request').DataTable({
            info: false,
            ajax: {
                url: "/purchaserequests?userid="+ window.localStorage.getItem('current_user_id') + "&company=" + window.localStorage.getItem('current_user_company') + (function(){ return JSON.parse(window.localStorage.getItem('current_user_leader_groups')).length ? JSON.parse(window.localStorage.getItem('current_user_leader_groups')).map((purchase_group, index) => { return "&purchasegroups[" + index + "]=" + purchase_group; }).join("") : "&purchasegroups[0]=null"; })(),
                dataSrc: "purchaserequests"
            },
            //serverSide: true,
            select: {
                style: "single"
            },
            scrollY: 200,
            scrollCollapse: true,
            responsive: true,
            scroller: true,
            saveState: true,
            columns: PurchaseRequestController.tableColumns(),
            rowId: "purchase_request_id",
            dom: "Bfrtip",
            buttons: [
                {
                    text: "New",
                    className: "btn btn-raised btn-primary waves-effect waves-light",
                    action: function() {                                       
                        $.blockUI({
                            message: new ModalFormCustom('new-purchase-request-modal', 'New Purchase Request', { form_method: "POST", form_id: "new-purchase-request", form_enctype: "application/x-www-form-urlencoded" },
                                '<div class="row">' +
                                    '<div class="col">' +
                                        '<div class="form-group">' +
                                            new Label("purchase-request-title", [], [], "Purchase Request Title" + Required).render() +
                                            new Input("text", [], "purchase-request-title", { required: true }).render() +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="col">' +
                                        '<div class="form-group">' +
                                            new Label("purchase-request-requirement", [], [], "Purchase Requirement" + Required ).render() +
                                            new TextArea([], 'purchase-request-requirement', { required: true, rows:10 }).render() +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="col-md-2">' +
                                        '<div class="form-group">' +
                                            new Label('purchase-request-approx-value', [], [], 'Approx Value').render() +
                                            new Input('text', [], 'purchase-request-approx-value', {}).render() +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-md-4">' +
                                        '<div class="form-group">' +
                                            new Label('purchase-request-by', [], [], 'Purchase Requested By').render() +
                                            new Input('text', [], 'purchase-request-by', {}).render() +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-md-6" style="padding-top:1.75rem">' +
                                            new SelectLabel('Purc. Group' + Required).render() + new Select([ 'purchase-process-group' ], "new-purchase-request-purchase-group", { required: true }, {}, 0).render() +
                                    '</div>' +
                                '</div>'
                                ,
                                [ 
                                    new Button([ 'btn-raised', 'btn-warning' ], 'discard', 'Discard').render(), 
                                    new Button([ 'btn-raised', 'btn-secondary', 'submit' ], 'save-purchase-request', 'Save').render(), 
                                    new Button([ 'btn-raised', 'btn-success', 'submit' ], 'send-for-approval', 'Send for Approval').render()
                                ]).render()
                        });
                        $('select').SumoSelect();
                        
                        let purchase_groups  = JSON.parse(window.localStorage.getItem('current_user_purchase_groups'));
                        purchase_groups.map((purchase_group, index) => {
                            $('select.purchase-process-group')[0].sumo.add(purchase_group[0], purchase_group[1], index);
                        });
                        $('select.purchase-process-group').parents('.SumoSelect').css('width', "250px");
                        
                        //inspired by https://jsfiddle.net/u2cdfsmq/2/
                        $('textarea').on('input', function() {
                            //write a limit
                            $(this).height('auto');
                            $(this).height($(this)[0].scrollHeight + 'px');
                        });
                    }
                },
                {
                    text: "Delete",
                    className: "btn btn-raised btn-danger waves-effect waves-light delete-purchase-request",
                    action: function() {
                        if ( selected_row.selected_purchase_request ) {
                            swal_text.innerHTML = "Are you sure you want to DELETE the Purchase Request: <b>" + selected_row.selected_purchase_request.purchase_request_number + "</b><br /><br /><b>WARNING!</b><br />In proceeding Purchase Request #<b>" + selected_row.selected_purchase_request.purchase_request_number + "</b> will be deleted";
                            swal({
                                title: "Delete?",
                                content: swal_text,
                                icon: "error",
                                dangerMode: true,
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                                buttons: {
                                    cancel: {
                                        text: "Nope! Not " + selected_row.selected_purchase_request.purchase_request_number ,
                                        visible: true
                                    },
                                    confirm: {
                                        text: "Delete"
                                    }
                                }
                            }).then(async (deleteIt) => {
                                if (deleteIt) {
                                    await new PurchaseRequestService().deletePurchaseRequest(selected_row.selected_purchase_request.purchase_request_id).then((response) => {
                                        if ( response.deleted ) {
                                            swal_text.innerHTML = "PR# <b>" + selected_row.selected_purchase_request.purchase_request_number + "</b> deleted successfully";
                                            swal({
                                                icon: "success",
                                                title: "Successfully Deleted",
                                                content: swal_text,
                                                buttons: false,
                                                timer: 3000,
                                                closeOnEsc: false,
                                                closeOnClickOutside: false
                                            });
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
                    text: "Cancel",
                    className: "btn btn-raised btn-danger waves-effect waves-light cancel-purchase-request",
                    action: function() {
                        if ( selected_row.selected_purchase_request ) {
                            swal_text.innerHTML = "Are you sure you want to CANCEL the Purchase Request:<br /><b>" + selected_row.selected_purchase_request.purchase_request_number + "</b><br /><br /><b>WARNING!</b><br />In proceeding Purchase Reuest #<b>" + selected_row.selected_purchase_request.purchase_request_number + "</b> will be Cancelled";
                            swal({
                                title: "Cancel?",
                                content: swal_text,
                                icon: "error",
                                dangerMode: true,
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                                buttons: {
                                    cancel: {
                                        text: "Nope! Not " + selected_row.selected_purchase_request.purchase_request_number,
                                        visible: true
                                    },
                                    confirm: {
                                        text: "Cancel",
                                        closeModal: false
                                    }
                                }
                            }).then((cancelIt)=>{
                                if (cancelIt) {
                                    if ( $('span.text-danger').is(':visible') ) {
                                        $('div.error').remove();
                                    }
                                    swal_text.innerHTML = "Please enter Cancellation Remark" + Required + "<br /><br /><span class='bmd-form-group'><input class='swal-content__input' id='remark' type='text' required></span>";
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
                                                className: "cancel-confirm"
                                            }
                                        }
                                    }).then(async (confirm) => {
                                        if ( confirm ) {
                                            PurchaseRequestController.cancelPurchaseRequestValidation(selected_row, swal_text);
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
            initComplete : async function() {
                
                let purchase_request_statuses = await new PurchaseRequestService().getPurchaseRequestStatuses().then((response) => { return response; });
                this.api().buttons().container().append(
                    (function() { if ( JSON.parse(window.localStorage.getItem('current_user_purchase_procurement_global')) ) { return new CheckBoxInline([], {}, "global", "all", "Global").render(); } else { return ""; } })() + 
                    new CheckBoxInline([], {}, "self", "self", "Self").render() + 
                    new SelectLabel("Status").render() + new Select(["purchase-request-status"], "purchase-request-status", { multiple: "multiple" }, {}, 1).render() +
                    new SelectLabel("Purc. Group").render() + new Select(['purchase-group'], "purchase-group", { multiple: "multiple" }, {}, 1).render()
                );
                                
                $('select').SumoSelect({ selectAll: true });
                
                purchase_request_statuses.purchaserequeststatuses.map((status, index) => {
                    $('select.purchase-request-status')[0].sumo.add(status.purchase_request_status_id, status.purchase_request_status, index);
                });
                
                let purchase_groups  = JSON.parse(window.localStorage.getItem('current_user_purchase_groups'));
                purchase_groups.map((purchase_group, index) => {
                    $('select.purchase-group')[0].sumo.add(purchase_group[0], purchase_group[1], index);
                });
                $('select.purchase-group').parents('.SumoSelect').css('width', "220px");
                
                let column_status = this.api().columns(3);
                $(document).on("change", "select.purchase-request-status",function() {
                    column_status.search($(this).val().map((value) => { return value; }).join("|"), true, false).draw();
                });
                
                let column_purchase_group = this.api().columns(7);
                $(document).on("change", "select.purchase-group",function() {
                    column_purchase_group.search($(this).val().map((value) => { return value; }).join("|"), true, false).draw();
                });
                
                $('select.purchase-group')[0].sumo.selectAll();
                
                $('select.purchase-request-status')[0].sumo.selectItem('1');
                $('select.purchase-request-status')[0].sumo.selectItem('2');
                $('select.purchase-request-status')[0].sumo.selectItem('4');
                $('select.purchase-request-status')[0].sumo.selectItem('5');
                
                this.api().table().scroller.toPosition(this.api().data().count(), false);
                
            }
        });

        purchaseprocurement_request.on('dblclick', 'tr', function() {
            if ( selected_row.selected_purchase_request ) {
                delete selected_row.selected_purchase_request;
            }
            selected_row.selected_purchase_request = purchaseprocurement_request.row(this).data();
            $.blockUI({
                message: new ModalFormCustom('edit-purchase-request-modal', (selected_row.selected_purchase_request.purchase_request_status_id > 1 ? "View " : "Edit ") + selected_row.selected_purchase_request.purchase_request_number, { form_method: "POST", form_id: "edit-purchase-request", form_enctype: "application/x-www-form-urlencoded" },
                    '<div class="row">' +
                        '<div class="col">' +
                            '<div class="form-group">' +
                                new Label("purchase-request-title", [], [], "Purchase Request Title" + Required).render() +
                                new Input("text", [], "purchase-request-title", { required: true }).render() +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col">' +
                            '<div class="form-group">' +
                                new Label("purchase-request-requirement", [], [], "Purchase Requirement" + Required ).render() +
                                new TextArea([], 'purchase-request-requirement', { required: true, rows:10 }).render() +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-md-2">' +
                            '<div class="form-group">' +
                                new Label('purchase-request-approx-value', [], [], 'Approx Value').render() +
                                new Input('text', [], 'purchase-request-approx-value', {}).render() +
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-4">' +
                            '<div class="form-group">' +
                                new Label('purchase-request-by', [], [], 'Purchase Requested By').render() +
                                new Input('text', [], 'purchase-request-by', {}).render() +
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-6" style="padding-top:1.75rem">' +
                                new SelectLabel('Purc. Group' + Required).render() + new Select([ 'edit-purchase-process-group' ], "edit-purchase-request-purchase-group", {}, {}, 0).render() +
                        '</div>' +
                    '</div>'
                    ,
                    [ 
                        new Button([ 'btn-raised', 'btn-warning' ], 'discard', 'Discard').render(), 
                        new Button([ 'btn-raised', 'btn-secondary', 'submit-edit' ], 'edit-save', 'Save').render(), 
                        new Button([ 'btn-raised', 'btn-success', 'submit-edit' ], 'edit-send-for-approval', 'Send for Approval').render()
                    ]).render()
            });
            //inspired by https://jsfiddle.net/u2cdfsmq/2/
            $('textarea').on('input', function() {
                //write a limit
                $(this).height('auto');
                $(this).height($(this)[0].scrollHeight + 'px');
            });
            $('#purchase-request-title').val(selected_row.selected_purchase_request.purchase_request_title);
            $('#purchase-request-requirement').val(selected_row.selected_purchase_request.purchase_request_requirement);
            $('#purchase-request-approx-value').val(selected_row.selected_purchase_request.purchase_request_approx_value);
            $('#purchase-request-by').val(selected_row.selected_purchase_request.purchase_request_by);
            $('.edit-purchase-process-group').SumoSelect();
            //console.log($('#edit-purchase-request-purchase-group').val())
            $('select.edit-purchase-process-group').parents('.SumoSelect').css('width', "250px");
            let purchase_groups  = JSON.parse(window.localStorage.getItem('current_user_purchase_groups'));
            purchase_groups.map((purchase_group, index) => {
                $('.edit-purchase-process-group')[0].sumo.add(purchase_group[0], purchase_group[1], index);
            });
            $('.edit-purchase-process-group')[0].sumo.unSelectItem('1');
            $('.edit-purchase-process-group')[0].sumo.selectItem(`${selected_row.selected_purchase_request.purchase_group_id}`);
            //console.log($('#edit-purchase-request-purchase-group').val())
            if ( selected_row.selected_purchase_request.purchase_request_status_id > 1 ) {
                $('#edit-purchase-request-modal input').attr("disabled", true);
                $('textarea').attr("disabled", true);
                $('select.edit-purchase-process-group')[0].sumo.disable();
                $('#edit-save').attr("disabled", true);
                $('#edit-send-for-approval').attr("disabled", true);
                $('#discard').text("Close");
            }
            
            PurchaseRequestController.editPurchaseRequest(selected_row);
        });
        
        //purchsase quote
        
        let line_items = {};
                
        function floatConvert(num) {
            return typeof num === 'string' ? num.replace(/,/g, '') * 1 : typeof num === 'number' ? num : 0;
        }
        
        function reCalculateLineTotal() {
            line_items.line_price = $('#' + $(line_items.line_price_element['0']).attr("id")).val();
            line_items.line_qty = $('#' + $(line_items.line_qty_element['0']).attr("id")).val();
            line_items.line_discount = $('#' + $(line_items.line_discount_element['0']).attr("id")).val();
            line_items.line_nbt = $('#' + $(line_items.line_nbt_element['0']).attr("id")).val();
            line_items.line_olt = $('#' + $(line_items.line_olt_element['0']).attr("id")).val();
            line_items.line_vat = $('#' + $(line_items.line_vat_element['0']).attr("id")).val();

            $('#' + $(line_items.line_total_element['0']).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(((((floatConvert(line_items.line_price) * floatConvert(line_items.line_qty)) - floatConvert(line_items.line_discount)) + (floatConvert(line_items.line_nbt) + floatConvert(line_items.line_olt))) + floatConvert(line_items.line_vat))));
            return;
        }

        function reCalculateAll(rows, updated_columns) {
            updated_columns.each(function(element, index) {
                line_items.line_price_element = rows[index].filter(element => element.includes("unit-price"));
                line_items.line_qty_element = rows[index].filter(element => element.includes("quantity"));
                line_items.line_discount_element = rows[index].filter(element => element.includes("line-discount"));
                line_items.line_nbt_element = rows[index].filter(element => element.includes("line-nbt"));
                line_items.line_olt_element = rows[index].filter(element => element.includes("line-olt"));
                line_items.line_vat_element = rows[index].filter(element => element.includes("line-vat"));
                line_items.line_total_element = rows[index].filter(element => element.includes("line-total"));

                line_items.line_price = $('#' + $(line_items.line_price_element['0']).attr("id")).val();
                line_items.line_qty = $('#' + $(line_items.line_qty_element['0']).attr("id")).val();
                line_items.line_discount = $('#' + $(line_items.line_discount_element['0']).attr("id")).val();
                line_items.line_nbt = $('#' + $(line_items.line_nbt_element['0']).attr("id")).val();
                line_items.line_olt = $('#' + $(line_items.line_olt_element['0']).attr("id")).val();
                line_items.line_vat = $('#' + $(line_items.line_vat_element['0']).attr("id")).val();

                $('#' + $(line_items.line_total_element['0']).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(((((floatConvert(line_items.line_price) * floatConvert(line_items.line_qty)) - floatConvert(line_items.line_discount)) + (floatConvert(line_items.line_nbt) + floatConvert(line_items.line_olt))) + floatConvert(line_items.line_vat))));
            });
            return;
        }

        function footerTotaling(table) {
            let total = table.columns('.new-line-total').data().toArray()[0].reduce((a, element) => a + floatConvert($('#' + $(element).attr("id")).val()), 0);
            let total_discount = table.columns('.new-discount').data().toArray()[0].reduce((a, element) => a + floatConvert($('#' + $(element).attr("id")).val()), 0);
            let total_nbt = table.columns('.new-nbt').data().toArray()[0].reduce((a, element) => a + floatConvert($('#' + $(element).attr("id")).val()), 0);
            let total_olt = table.columns('.new-olt').data().toArray()[0].reduce((a, element) => a + floatConvert($('#' + $(element).attr("id")).val()), 0);
            let total_vat = table.columns('.new-vat').data().toArray()[0].reduce((a, element) => a + floatConvert($('#' + $(element).attr("id")).val()), 0);
            let total_svat = table.columns('.new-svat').data().toArray()[0].reduce((a, element) => a + floatConvert($('#' + $(element).attr("id")).val()), 0);
            if (table.data().length) {
                $('tfoot#new-purchase-quote-lines-footer').html(
                    '<tr>' +
                        '<td class="totalling-tag text-right">SUB TOTAL</td>' +
                        '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total + total_discount - (total_vat + total_nbt + total_olt)) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="totalling-tag text-right">TOTAL DISCOUNT</td>' +
                        '<td class="totalling text-right">(' + $.fn.dataTable.render.number(",", ".", 4).display(total_discount) + ')</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="totalling-tag text-right">TOTAL BEFORE TAX</td>' +
                        '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display((total - (total_nbt + total_olt)) - total_vat) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="totalling-tag text-right">TOTAL NBT</td>' +
                        '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_nbt) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="totalling-tag text-right">TOTAL OLT</td>' +
                        '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_olt) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="totalling-tag text-right">TOTAL VAT</td>' +
                        '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_vat) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="totalling-tag text-right">TOTAL SVAT</td>' +
                        '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_svat) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="totalling-tag text-right"><strong>GRAND TOTAL</strong></td>' +
                        '<td class="totalling text-right"><strong>' + $.fn.dataTable.render.number(",", ".", 4).display(total) + '</strong></td>' +
                    '</tr>'
                );
            }
        }
        
        let purchaseprocurement_quote = $('#purchase-quote').DataTable({
            info: false,
            scrollY: 200,
            scrollCollapse:true,
            responsive: true,
            select: {
                style: "single"
            },
            scroller: true,
            saveState: true,
            rowId: "purchase_quote_id",
            columns: [
                { title: "Purchase Quote ID", data: "purchase_quote_id",  visible: false },
                { title: "Purchase Quote #", data: "purchase_quote_number", width: "15%" },
                { title: "Vendor ID", data: "vendor", visible: false },
                { title: "Vendor Code", data: "vendor_code" },
                { title: "Vendor", data: "vendor_name", width: "35%" },
                { title: "Vendor PQ #", data: "vendor_quote_reference_number" },
                { title: "Status ID", data: "purchase_quote_status_id", visible: false, className: "status" },
                { title: "Status", data: "purchase_quote_status" },
                { title: "PQ Date", data: "created_date" },
                { title: "User ID", data: "created_by", visible: false },
                { title: "Created By", data: "user_name", render: function(data, type, row) {
                        return type === 'display' && data.length > 17 ?
                            data.substr( 0, 17 ) +'…' :
                            data;
                    }
                }
            ],
            dom: "Bfrtip",
            buttons: [
                {
                    text: "New",
                    className: "btn btn-raised btn-primary waves-effect waves-light new-quote",
                    action: async function() {
                        let vendors = await new PurchaseQuoteService().getVendors(window.localStorage.getItem('current_user_company')).then((response) => { return response.vendors; });
                        $.blockUI({
                            message: new ModalFormCustom("purchase-quote-modal", "New Purchase Quote", { form_method: "POST", form_id: "purchase-quote", form_enctype: "application/x-www-form-urlencoded" },
                            [ 
                                '<div class="row">' +
                                    '<div class="col-md-2">' +
                                        '<div class="form-group">' +
                                            new Label('vendor-code', [], [], 'Vendor Code' + Required).render() +
                                            new Input('text', [ "col-md-11" ], 'vendor-code', { required: true }).render() +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            new Label('purchase-quote-date', [], [], 'Purchase Quote Date' + Required).render() +
                                            new Input('text', [ "col-md-10" ], 'purchase-quote-date', { required: true }).render() +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            new Label('vendor-quote-reference-number', [], [], 'Vendor Quote Number' + Required).render() +
                                            new Input('text', [ "col-md-10" ], 'vendor-quote-reference-number', { required: true }).render() +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-md-4">' +
                                        '<div class="form-group">' +
                                            new Label('vendor-name', [], [], 'Vendor Name' + Required).render() +
                                            new Input('text', [], 'vendor-name', { required: true }).render() +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            new Label('validity-period', [], [], 'Validity Period' + Required).render() +
                                            new Input('text', [ "col-md-6" ], 'validity-period', { required: true }).render() +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-md-3">' +
                                        '<div class="form-group">' +
                                            new Label('vendor-po-box', [], [], 'Vendor PO BOX').render() +
                                            new Input('text', [ "col-md-5" ], 'vendor-po-box', {}).render() +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            new Label('vendor-address-line-1', [], [], 'Vedor Address Line 1').render() +
                                            new Input('text', [], 'vendor-address-line-1', {}).render() +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            new Label('vendor-address-line-2', [], [], 'Vedor Address Line 2').render() +
                                            new Input('text', [], 'vendor-address-line-2', {}).render() +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-md-3">' +
                                        '<div class="form-group">' +
                                            new Label('vendor-city', [], [], 'Vedor City').render() +
                                            new Input('text', [], 'vendor-city', {}).render() +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            new Label('vendor-province-state', [], [], 'Vedor Province State').render() +
                                            new Input('text', [], 'vendor-province-state', {}).render() +
                                        '</div>' +
                                        '<div class="form-group">' +
                                            new Label('vendor-country', [], [], 'Vedor Country').render() +
                                            new Input('text', [], 'vendor-country', {}).render() +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="col">' +
                                        new Table('new-purchase-quote-lines', ['table', 'table-bordered', 'table-striped', 'table-hover']).render() +
                                    '</div>' +
                                '</div>'
                            ],
                            [ 
                                new Button(['btn-raised', 'btn-warning'], 'discard', 'Discard').render(), 
                                new Button(['btn-raised', 'btn-success'], 'save', 'Create').render()
                            ]).render()
                        });
                        //write attribute setter for modal
                        $('#purchase-quote-modal .modal-dialog').css({
                            maxWidth: "95%"
                        });

                        $('#purchase-quote-date').datepicker({
                            dateFormat: "yy-mm-dd",
                            showButtonPanel: true,
                            showOtherMonths: true,
                            selectOtherMonths: true
                        });

                        $('#vendor-code').inputpicker({
                            data: vendors,
                            fields: [
                                { name: 'vendor_code', text: 'VENDOR CODE' },
                                { name: 'vendor_name', text: 'VENDOR NAME' }
                            ],
                              headShow: true,
                              fieldText : 'vendor_code',
                              fieldValue: 'vendor_id',
                              filterOpen: true,
                              autoOpen: true
                        });

                        let addcounter = 0;
                        $('#new-purchase-quote-lines').append($("<tfoot/>").attr("id", "new-purchase-quote-lines-footer"));
                        let newpurchasequotelines = $('#new-purchase-quote-lines').DataTable({
                            paging: false,
                            info: false,
                            scrollY: 200,
                            scrollCollapse:true,
                            responsive: true,
                            processing: true,
                            columns: [
                                { title: "Item Code", width: "15vh" },
                                { title: "Item Description", width: "50vh" },
                                { title: "Product Description", className: "product-description hidden-column" },
                                { title: "UoM", width: "3vh" },
                                { title: "Currency", width: "4vh" },
                                { title: "Price" },
                                { title: "Qty" },
                                { title: "Discount", visible: false, className: "new-discount" },
                                { title: "NBT", visible: false, className: "new-nbt" },
                                { title: "OLT", visible: false, className: "new-olt" },
                                { title: "VAT", visible: false, className: "new-vat" },
                                { title: "SVAT", visible: false, className: "new-svat" },
                                { title: "Line Total", className: "new-line-total" },
                                { title: "FA Attr", className: "hidden-column" }
                            ],
                            dom: "Bfrtip",
                            buttons: [
                                {
                                    text: "Add",
                                    className: "btn btn-raised btn-primary waves-effect waves-light",
                                    action: async function() {
                                        let items = await new PurchaseQuoteService().getItems(window.localStorage.getItem('current_user_company')).then((response) => { return response.items; });
                                        let currencies = await new PurchaseQuoteService().getCurrencies().then((response) => { return response.currencies; });
                                        let currenttable = this.table();
                                        let lastrow = currenttable.row(':last', { order: 'applied' }).data();
                                        if (lastrow !== undefined) {
                                            if (!lastrow.every(element => $("#" + $(element).attr("id")).val() !== "")) {
                                                return false;
                                            }
                                        }

                                        addcounter += 1;
                                        currenttable.row.add([ 
                                            new Input("text", [], "item-code" + addcounter, { required: true }).render(),
                                            new Input("text", [], "item-attribute-description" + addcounter, { required: true }).render(),
                                            new Input("text", [], "product-description" + addcounter, { required: true }).render(),
                                            new Input("text", [ "text-center" ], "item-unit-of-measure" + addcounter, { required: true }).render(),
                                            new Input("text", [ "text-center" ], "currency" + addcounter, { required: true }).render(),
                                            new Input("text", [ "text-right" ], "item-unit-price" + addcounter, { required: true }).render(),
                                            new Input("text", [ "text-right" ], "item-quantity" + addcounter, { required: true }).render(),
                                            new Input("text", [ "text-right" ], "item-line-discount" + addcounter, { required: true, readonly: true }).render(),
                                            new Input("text", [ "text-right" ], "item-line-nbt" + addcounter, { required: true, readonly: true }).render(),
                                            new Input("text", [ "text-right" ], "item-line-olt" + addcounter, { required: true, readonly: true }).render(),
                                            new Input("text", [ "text-right" ], "item-line-vat" + addcounter, { required: true, readonly: true }).render(),
                                            new Input("text", [ "text-right" ], "item-line-svat" + addcounter, { required: true, readonly: true }).render(),
                                            new Input("text", [ "text-right" ], "line-total" + addcounter, { required: true, readonly: true }).render(),
                                            new Input("text", [], "fixed-asset-attributes" + addcounter, {}).render()
                                        ]).draw(false).node();

                                        $('#item-code' + addcounter).inputpicker({
                                            data: items,
                                            fields:[
                                                { name: 'item_code', text: 'ITEM CODE' },
                                                { name: 'item_descripsion', text: 'ITEM DESCRIPTION' },
                                                { name: 'item_type_code', text: 'ITEM TYPE' },
                                                { name: 'fixed_asset_category_code', text: 'FA TYPE' },
                                                { name: 'unit_of_measure_code', text: 'BASE UoM' }
                                            ],
                                            headShow: true,
                                            fieldText : 'item_code',
                                            fieldValue: 'item_code',
                                            filterOpen: true,
                                            autoOpen: true
                                        });

                                        $('#currency' + addcounter).inputpicker({
                                            data: currencies,
                                            fields: [
                                                { name: "currency_code", text: 'CURRENCY' },
                                                { name: "currency_name", text: 'NAME' }
                                            ],
                                            headShow: true,
                                            fieldText : "currency_code",
                                            fieldValue: "currency_code",
                                            filterOpen: true,
                                            autoOpen: true
                                        });

                                        $('#item-code' + addcounter).on("change", async function() {
                                            if ( $('#item-code' + addcounter).val() !== "" ) {
                                                let item_uom = await new PurchaseQuoteService().getItemUOMs(window.localStorage.getItem('current_user_company'), $('#item-code' + addcounter).val()).then((response) => { return response.item_unit_of_measure; });
                                                $('#item-attribute-description' + addcounter).val($('#item-code' + addcounter).inputpicker('element', $('#item-code' + addcounter).val())["item_descripsion"]);
                                                
                                                $('#item-unit-of-measure' + addcounter).inputpicker({
                                                    data: item_uom,
                                                    fields: [
                                                        { name: 'unit_of_measure_code', text: 'CODE' },
                                                        { name: 'unit_of_measure', text: 'UOM' }
                                                    ],
                                                    headShow: true,
                                                    fieldText : 'unit_of_measure_code',
                                                    fieldValue: 'unit_of_measure_code',
                                                    filterOpen: true,
                                                    autoOpen: true
                                                });
                                                
                                                $('#item-unit-of-measure' + addcounter).inputpicker('val', $('#item-code' + addcounter).inputpicker('element', $('#item-code' + addcounter).val())["unit_of_measure_code"]);
                                                $("#product-description" + addcounter).val("null");
                                                if ($('#item-code' + addcounter).inputpicker('element', $('#item-code' + addcounter).val())["item_type_code"] === "FA") {
                                                    await new PurchaseQuoteService().getFixedAssetAttributes(window.localStorage.getItem('current_user_company'), $('#item-code' + addcounter).inputpicker('element', $('#item-code' + addcounter).val())["fixed_asset_category_code"]).then((response) => {
                                                        
                                                        $('#purchase-quote-modal .modal-container').block({
                                                            message: new ModalFormCustom("item-attribute-description-modal", "Please fill in Item Attributes", { form_method: "POST", form_id: "item-attribute-description", form_enctype: "application/x-www-form-urlencoded" },
                                                            [
                                                                '<div class="row">' +
                                                                    '<div class="col">' +
                                                                    response.fixed_asset_attributes.map((attribute) => {
                                                                        return (
                                                                            '<div class="form-group">' +
                                                                                new Label(attribute.toLowerCase(), [], [], attribute + Required).render() +
                                                                                new Input('text', [ "attribute" ], attribute.toLowerCase(), { required: true }).render() +
                                                                            '</div>'
                                                                        );
                                                                    }).join('') +
                                                                    '</div>' +
                                                                '</div>'
                                                            ],
                                                            [
                                                                new Button(['btn-raised', 'btn-success'], 'apply', 'Apply').render()
                                                            ]).render()
                                                        });
                                                        //check focus
                                                        $('#apply').on("click", function(event) {
                                                            event.stopImmediatePropagation();
                                                            let formData = $('form#item-attribute-description').serializeArray();
                                                            console.log(formData)
                                                            formData.forEach((field) => {
                                                                console.log(field.value)
                                                                console.log(addcounter)
                                                                $('#item-attribute-description' + addcounter).val($('#item-attribute-description' + addcounter).val() + " " + field.value);
                                                            });
                                                            $("#fixed-asset-attributes" + addcounter).val('[' + formData.map(attribute => { return JSON.stringify({ fixed_asset_attribute: attribute.name.toUpperCase(), fixed_asset_attribute_value: attribute.value }); }).join(',') + ']');
                                                            $('#purchase-quote-modal .modal-container').unblock();
                                                        });
                                                    });
                                                    //check
                                                    $('#item-attribute-description input:text').focus();
                                                } else {
                                                    $("#fixed-asset-attributes" + addcounter).val("null");
                                                }
                                            }
                                        });

                                        function calcLineTotal(elem) {
                                            let $container = $(elem).parent().parent().parent();
                                            let price = $container.find('#item-unit-price' + addcounter).val() || 0.00;
                                            let quantity = $container.find('#item-quantity' + addcounter).val() || 0.00;
                                            let line_total = (floatConvert(price) * floatConvert(quantity));
                                            $('#item-unit-price' + addcounter).val($.fn.dataTable.render.number(",", ".", 4).display(floatConvert(price)));
                                            $('#item-quantity' + addcounter).val($.fn.dataTable.render.number(",", ".", 4).display(floatConvert(quantity)));
                                            $('#line-total' + addcounter).val($.fn.dataTable.render.number(",", ".", 4).display(line_total));
                                            footerTotaling(currenttable);
                                        }

                                        $('#item-unit-price' + addcounter + ' , #item-quantity' + addcounter).on("change", function() {
                                            calcLineTotal('#item-unit-price' + addcounter + ' , #item-quantity' + addcounter);
                                        });
                                    }
                                },
                                {
                                    text: "Delete",
                                    className: "btn btn-raised btn-danger waves-effect waves-light",
                                    action: function() {
                                        if ( selected_row.new_purchase_quote_line ) {
                                            this.table().row('.selected').remove().draw(false);
                                            delete selected_row.new_purchase_quote_line;
                                        } else {
                                            new NothingSlectedAlert().render();
                                        }
                                    }
                                },
                                {
                                    text: "Add Product Info",
                                    className: "btn btn-raised btn-info waves-effect waves-light",
                                    action: function() {
                                        if ( selected_row.new_purchase_quote_line ) {
                                            $('#purchase-quote-modal .modal-container').block({
                                                message: new ModalForm("add-product-info-modal", "Add Product Info", { form_method: "POST", form_id: "product-info", form_enctype: "application/x-www-form-urlencoded" },
                                                    [ 
                                                        new Label("product-description", [], [], "Product Information" + Required ).render() +
                                                        new TextArea([], 'product-description', { required: true, rows:10 }).render()
                                                    ],
                                                    [ 
                                                        new Button(["btn-raised", "btn-warning"], "cancel", "Cancel").render(), 
                                                        new Button(["btn-raised", "btn-secondary"], "add-product-description", "Add").render()
                                                    ]).render()
                                            });

                                            //inspired by https://jsfiddle.net/u2cdfsmq/2/
                                            $('textarea').on('input', function() {
                                                //write a limit
                                                $(this).height('auto');
                                                $(this).height($(this)[0].scrollHeight + 'px');
                                            });

                                            $('#add-product-info-modal .modal-dialog').css({
                                                width: "525px"
                                            });
                                            
                                            $('#product-description').parents('.col-md-6').attr("class", "col-md-12");

                                            $(document).on("click", "#cancel", function() {
                                                $('#purchase-quote-modal .modal-container').unblock();
                                            });

                                            $(document).on("click", "#add-product-description", function() {
                                                if ( !$('textarea#product-description').val().trim().length ) {
                                                    return false;
                                                }
                                                
                                                let product_description = $('textarea#product-description').val();
                                                
                                                let input = selected_row.new_purchase_quote_line.filter(element => element.includes("product-description"));
                                                
                                                $('#' + $(input[0]).attr("id")).val(product_description);                                          

                                                $('#purchase-quote-modal .modal-container').unblock();
                                            });
                                        } else {
                                            new NothingSlectedAlert().render();
                                        }
                                    }
                                },
                                {
                                    text: "Add Discount",
                                    className: "btn btn-raised btn-info waves-effect waves-light",
                                    action: function() {
                                        //line total calculations & footer callback
                                        let currenttable = this.table();
                                        $('#purchase-quote-modal .modal-container').block({
                                            message: new ModalForm("add-discount-modal", "Add Discount", { form_method: "POST", form_id: "add-discount", form_enctype: "application/x-www-form-urlencoded" },
                                                [ 
                                                    new Label("discount-amount", [], [], "Discount Amount" + Required ).render() +
                                                    new Input("text", [], "discount-amount", { required: true }).render(),
                                                    new CheckBox([], "apply-all", {}, 0, "Apply to All").render()
                                                ],
                                                [ 
                                                    new Button(["btn-raised", "btn-warning"], "cancel", "Cancel").render(), 
                                                    new Button(["btn-raised", "btn-secondary"], "add-discount-amount", "Apply").render()
                                                ]).render()
                                        });

                                        $('#add-discount-modal .modal-dialog').css({
                                            width: "525px"
                                        });

                                        $(document).on("click", "#cancel", function() {
                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });

                                        $(document).on("click", "#add-discount-amount", function() {
                                            if (!$('#discount-amount').val()) {
                                                return false;
                                            }

                                            let discount_amount = $('#discount-amount').val();
                                            let apply_all = $('#apply-all').is(":checked");
                                            if (!currenttable.column(".new-discount").visible()) {
                                                currenttable.column(".new-discount").visible(true);
                                            }
                                            let input;
                                            currenttable.columns(".new-discount").every(function() {
                                                input = this.data().toArray();
                                            });
                                            if (apply_all) {
                                                input.each(function(element, index) {
                                                    $('#' + $(input[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(discount_amount));
                                                });
                                                reCalculateAll(currenttable.rows().data().toArray(), input);
                                                footerTotaling(currenttable);
                                            } else {
                                                if ( selected_row.new_purchase_quote_line ) {
                                                    let unselected = input;
                                                    input = selected_row.new_purchase_quote_line.filter(element => element.includes("line-discount"));
                                                    $('#' + $(input[0]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(discount_amount));
                                                    unselected = unselected.filter(element => element !== input[0]);
                                                    unselected.each(function(element, index){
                                                        if ($('#' + $(unselected[index]).attr("id")).val() === "") {
                                                            $('#' + $(unselected[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(0));
                                                        }
                                                    });
                                                    reCalculateLineTotal();
                                                    footerTotaling(currenttable);
                                                } else {
                                                    new NothingSlectedAlert().render();
                                                }
                                            }

                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });
                                    }
                                },
                                {
                                    text: "Add NBT",
                                    className: "btn btn-raised btn-secondary waves-effect waves-light",
                                    action: function() {
                                        let currenttable = this.table();
                                        $('#purchase-quote-modal .modal-container').block({
                                            message: new ModalForm("add-nbt-modal", "Add NBT", { form_method: "POST", form_id: "add-nbt", form_enctype: "application/x-www-form-urlencoded" },
                                                [ 
                                                    new Label("nbt-amount", [], [], "NBT Amount" + Required ).render() +
                                                    new Input("text", [], "nbt-amount", { required: true }).render(),
                                                    new CheckBox([], "apply-all", {}, 0, "Apply to All").render()
                                                ],
                                                [ 
                                                    new Button(["btn-raised", "btn-warning"], "cancel", "Cancel").render(), 
                                                    new Button(["btn-raised", "btn-secondary"], "add-nbt-amount", "Apply").render()
                                                ]).render()
                                        });
                                        $('#add-nbt-modal .modal-dialog').css({
                                            width: "525px"
                                        });

                                        $(document).on("click", "#cancel", function() {
                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });

                                        $(document).on("click", "#add-nbt-amount", function(e) {
                                            if (!$('#nbt-amount').val()) {
                                                return false;
                                            }

                                            let nbt_amount = $('#nbt-amount').val();
                                            let apply_all = $('#apply-all').is(":checked");
                                            if (!currenttable.column(".new-nbt").visible()) {
                                                currenttable.column(".new-nbt").visible(true);
                                            }
                                            let input;
                                            currenttable.columns(".new-nbt").every(function() {
                                                input = this.data().toArray();
                                            });
                                            if (apply_all) {                                                       
                                                input.each(function(element, index) {
                                                    $('#' + $(input[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(nbt_amount));
                                                });
                                                reCalculateAll(currenttable.rows().data().toArray(), input);
                                                footerTotaling(currenttable);
                                            } else {
                                                if ( selected_row.new_purchase_quote_line ) {
                                                    let unselected = input;
                                                    input = selected_row.new_purchase_quote_line.filter(element => element.includes("line-nbt"));
                                                    $('#' + $(input[0]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(nbt_amount));
                                                    unselected = unselected.filter(element => element !== input[0]);
                                                    unselected.each(function(element, index){
                                                        if ($('#' + $(unselected[index]).attr("id")).val() === "") {
                                                            $('#' + $(unselected[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(0));
                                                        }
                                                    });
                                                    reCalculateLineTotal();
                                                    footerTotaling(currenttable);
                                                } else {
                                                    new NothingSlectedAlert().render();
                                                }
                                            }

                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });
                                    }
                                },
                                {
                                    text: "Add OLT",
                                    className: "btn btn-raised btn-secondary waves-effect waves-light",
                                    action: function() {
                                        let currenttable = this.table();
                                        $('#purchase-quote-modal .modal-container').block({
                                            message: new ModalForm("add-olt-modal", "Add OLT", { form_method: "POST", form_id: "add-olt", form_enctype: "application/x-www-form-urlencoded" },
                                                [ 
                                                    new Label("olt-amount", [], [], "OLT Amount" + Required ).render() +
                                                    new Input("text", [], "olt-amount", { required: true }).render(),
                                                    new CheckBox([], "apply-all", {}, 0, "Apply to All").render()
                                                ],
                                                [ 
                                                    new Button(["btn-raised", "btn-warning"], "cancel", "Cancel").render(), 
                                                    new Button(["btn-raised", "btn-secondary"], "add-olt-amount", "Apply").render()
                                                ]).render()
                                        });
                                        $('#add-nbt-modal .modal-dialog').css({
                                            width: "525px"
                                        });

                                        $(document).on("click", "#cancel", function() {
                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });

                                        $(document).on("click", "#add-olt-amount", function(e) {
                                            if (!$('#olt-amount').val()) {
                                                return false;
                                            }

                                            let olt_amount = $('#olt-amount').val();
                                            let apply_all = $('#apply-all').is(":checked");
                                            if (!currenttable.column(".new-olt").visible()) {
                                                currenttable.column(".new-olt").visible(true);
                                            }
                                            let input;
                                            currenttable.columns(".new-olt").every(function() {
                                                input = this.data().toArray();
                                            });
                                            if (apply_all) {                                                       
                                                input.each(function(element, index) {
                                                    $('#' + $(input[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(olt_amount));
                                                });
                                                reCalculateAll(currenttable.rows().data().toArray(), input);
                                                footerTotaling(currenttable);
                                            } else {
                                                if ( selected_row.new_purchase_quote_line ) {
                                                    let unselected = input;
                                                    input = selected_row.new_purchase_quote_line.filter(element => element.includes("line-olt"));
                                                    $('#' + $(input[0]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(olt_amount));
                                                    unselected = unselected.filter(element => element !== input[0]);
                                                    unselected.each(function(element, index){
                                                        if ($('#' + $(unselected[index]).attr("id")).val() === "") {
                                                            $('#' + $(unselected[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(0));
                                                        }
                                                    });
                                                    reCalculateLineTotal();
                                                    footerTotaling(currenttable);
                                                } else {
                                                    new NothingSlectedAlert().render();
                                                }
                                            }

                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });
                                    }
                                },
                                {
                                    text: "Add VAT",
                                    className: "btn btn-raised btn-secondary waves-effect waves-light",
                                    action: function() {
                                        let currenttable = this.table();
                                        $('#purchase-quote-modal .modal-container').block({
                                            message: new ModalForm("add-vat-modal", "Add VAT", { form_method: "POST", form_id: "add-vat", form_enctype: "application/x-www-form-urlencoded" },
                                                [ 
                                                    new Label("vat-amount", [], [], "VAT Amount" + Required ).render() +
                                                    new Input("text", [], "vat-amount", { required: true }).render(),
                                                    new CheckBox([], "apply-all", {}, 0, "Apply to All").render()
                                                ],
                                                [ 
                                                    new Button(["btn-raised", "btn-warning"], "cancel", "Cancel").render(), 
                                                    new Button(["btn-raised", "btn-secondary"], "add-vat-amount", "Apply").render()
                                                ]).render()
                                        });
                                        $('#add-vat-modal .modal-dialog').css({
                                            width: "525px"
                                        });

                                        $(document).on("click", "#cancel", function() {
                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });

                                        $(document).on("click", "#add-vat-amount", function(e) {
                                            if (!$('#vat-amount').val()) {
                                                return false;
                                            }

                                            let vat_amount = $('#vat-amount').val();
                                            let apply_all = $('#apply-all').is(":checked");
                                            if (!currenttable.column(".new-vat").visible()) {
                                                currenttable.column(".new-vat").visible(true);
                                            }
                                            let input;
                                            currenttable.columns(".new-vat").every(function() {
                                                input = this.data().toArray();
                                            });
                                            if (apply_all) {                                                       
                                                input.each(function(element, index) {
                                                    $('#' + $(input[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(vat_amount));
                                                });
                                                reCalculateAll(currenttable.rows().data().toArray(), input);
                                                footerTotaling(currenttable);
                                            } else {
                                                if ( selected_row.new_purchase_quote_line ) {
                                                    let unselected = input;
                                                    input = selected_row.new_purchase_quote_line.filter(element => element.includes("line-vat"));
                                                    $('#' + $(input[0]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(vat_amount));
                                                    unselected = unselected.filter(element => element !== input[0]);
                                                    unselected.each(function(element, index){
                                                        if ($('#' + $(unselected[index]).attr("id")).val() === "") {
                                                            $('#' + $(unselected[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(0));
                                                        }
                                                    });
                                                    reCalculateLineTotal();
                                                    footerTotaling(currenttable);
                                                } else {
                                                    new NothingSlectedAlert().render();
                                                }
                                            }

                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });
                                    }
                                },
                                {
                                    text: "Add SVAT",
                                    className: "btn btn-raised btn-secondary waves-effect waves-light",
                                    action: function() {
                                        let currenttable = this.table();
                                        $('#purchase-quote-modal .modal-container').block({
                                            message: new ModalForm("add-svat-modal", "Add SVAT", { form_method: "POST", form_id: "add-svat", form_enctype: "application/x-www-form-urlencoded" },
                                                [ 
                                                    new Label("svat-amount", [], [], "SVAT Amount" + Required ).render() +
                                                    new Input("text", [], "svat-amount", { required: true }).render(),
                                                    new CheckBox([], "apply-all", {}, 0, "Apply to All").render()
                                                ],
                                                [ 
                                                    new Button(["btn-raised", "btn-warning"], "cancel", "Cancel").render(), 
                                                    new Button(["btn-raised", "btn-secondary"], "add-svat-amount", "Apply").render()
                                                ]).render()
                                        });
                                        $('#add-svat-modal .modal-dialog').css({
                                            width: "525px"
                                        });

                                        $(document).on("click", "#cancel", function() {
                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });

                                        $(document).on("click", "#add-svat-amount", function() {
                                            if (!$('#svat-amount').val()) {
                                                return false;
                                            }

                                            let svat_amount = $('#svat-amount').val();
                                            let apply_all = $('#apply-all').is(":checked");
                                            if (!currenttable.column(".new-svat").visible()) {
                                                currenttable.column(".new-svat").visible(true);
                                            }
                                            let input;
                                            currenttable.columns(".new-svat").every(function() {
                                                input = this.data().toArray();
                                            });
                                            if (apply_all) {                                                       
                                                input.each(function(element, index) {
                                                    $('#' + $(input[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(svat_amount));
                                                });
                                                reCalculateAll(currenttable.rows().data().toArray(), input);
                                                footerTotaling(currenttable);
                                            } else {
                                                if ( selected_row.new_purchase_quote_line ) {
                                                    let unselected = input;
                                                    input = selected_row.new_purchase_quote_line.filter(element => element.includes("line-svat"));
                                                    $('#' + $(input[0]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(svat_amount));
                                                    unselected = unselected.filter(element => element !== input[0]);
                                                    unselected.each(function(element, index){
                                                        if ($('#' + $(unselected[index]).attr("id")).val() === "") {
                                                            $('#' + $(unselected[index]).attr("id")).val($.fn.dataTable.render.number(",", ".", 4).display(0));
                                                        }
                                                    });
                                                    reCalculateLineTotal();
                                                    footerTotaling(currenttable);
                                                } else {
                                                    new NothingSlectedAlert().render();
                                                }
                                            }

                                            $('#purchase-quote-modal .modal-container').unblock();
                                        });
                                    }
                                }
                            ],
                            drawCallback: function() {
                                if ( !$('#vendor-code').val() ) {
                                    this.api().buttons().disable();
                                }
                            }
                        });

                        newpurchasequotelines.on("click", "tr", function() {
                            if (!$(this).hasClass("selected")) {
                                newpurchasequotelines.$('tr.selected').removeClass("selected");
                                $(this).addClass("selected");
                                selected_row.new_purchase_quote_line = newpurchasequotelines.row(this).data();
                                line_items.line_price_element = selected_row.new_purchase_quote_line.filter(element => element.includes("unit-price"));
                                line_items.line_qty_element = selected_row.new_purchase_quote_line.filter(element => element.includes("quantity"));
                                line_items.line_discount_element = selected_row.new_purchase_quote_line.filter(element => element.includes("line-discount"));
                                line_items.line_nbt_element = selected_row.new_purchase_quote_line.filter(element => element.includes("line-nbt"));
                                line_items.line_olt_element = selected_row.new_purchase_quote_line.filter(element => element.includes("line-olt"));
                                line_items.line_vat_element = selected_row.new_purchase_quote_line.filter(element => element.includes("line-vat"));
                                line_items.line_svat_element = selected_row.new_purchase_quote_line.filter(element => element.includes("line-svat"));
                                line_items.line_total_element = selected_row.new_purchase_quote_line.filter(element => element.includes("line-total"));
                            }
                        });

                        $('#vendor-code').on("change", function() {
                            function emptyValue(elements, values) {
                                let pointer = elements.length;
                                while ( pointer ) {
                                    if ( values[ elements.length - pointer ] ) {
                                        elements[ elements.length - pointer ].val(values[ elements.length - pointer ]).attr("disabled", true).parents(".form-group").addClass("is-filled");
                                    } else {
                                        if ( $('#vendor-code').val() === '1' ) {
                                            elements[ elements.length - pointer ].val(values[ elements.length - pointer ]).removeAttr("disabled").parents(".form-group").removeClass("is-filled");
                                        } else {
                                            elements[ elements.length - pointer ].val(values[ elements.length - pointer ]).attr("disabled", true).parents(".form-group").removeClass("is-filled");
                                        }
                                    }
                                    pointer--;
                                }
                            }

                            emptyValue(
                            [
                                $('#vendor-name'),
                                $('#vendor-po-box'),
                                $('#vendor-address-line-1'),
                                $('#vendor-address-line-2'),
                                $('#vendor-city'),
                                $('#vendor-province-state'),
                                $('#vendor-country') 
                            ],
                            [
                                $('#vendor-code').inputpicker('element', $(this).val())["vendor_name"],
                                $('#vendor-code').inputpicker('element', $(this).val())["vendor_po_box"],
                                $('#vendor-code').inputpicker('element', $(this).val())["vendor_address_line_1"],
                                $('#vendor-code').inputpicker('element', $(this).val())["vendor_address_line_2"],
                                $('#vendor-code').inputpicker('element', $(this).val())["vendor_city"],
                                $('#vendor-code').inputpicker('element', $(this).val())["vendor_province_state"],
                                $('#vendor-code').inputpicker('element', $(this).val())["vendor_country"]
                            ]);
                            
                            if ( $(this).val() !== "" ) {
                                newpurchasequotelines.buttons().enable();
                            }
                        });
                        
                        $(document).on('click', '#save', function() {
                            let lastrow = newpurchasequotelines.row(':last', { order: 'applied' }).data();
                            if ( lastrow === undefined || lastrow !== undefined ) {
                                if ( !newpurchasequotelines.data().any() ||  !lastrow.every(element => $("#" + $(element).attr("id")).val() !== "")) {
                                    swal({
                                        icon: "error",
                                        title: (() => { if ( newpurchasequotelines.data().any() ) { return "Incomplete Line Detected"; } else { return "No Lines Detected"; } })(),
                                        text: (() => { if ( newpurchasequotelines.data().any() ) { return "Please complete or delete lines to proceed."; } else { return "Please add lines to proceed."; } })(),
                                        buttons: false,
                                        timer: 3000,
                                        closeOnEsc: false,
                                        closeOnClickOutside: false
                                    });
                                    return false;
                                }
                            }
                            
                            const new_purchase_quote_lines = newpurchasequotelines.data().toArray();
                            //https://www.freecodecamp.org/news/how-to-clone-an-array-in-javascript-1d3183468f6a/
                            const new_purchase_quote_lines_data = JSON.parse(JSON.stringify(new_purchase_quote_lines));
                            //let test = {};
                            new_purchase_quote_lines_data.each((row) => {
                                let index = row.length;
                                while ( index >= 0 ) {
                                    if ( $('#' + $(row[ index ]).attr("id")).val() !== undefined && $('#' + $(row[ index ]).attr("id")).val() !== "null" && $(row [ index ]).attr("name").replace(/[0-9]/g, '') !== "line-total" ) {
                                        row[ index ] = { [ $(row [ index ]).attr("name").replace(/[0-9]/g, '').replace(/-/g, '_') ] : (() => { if ( $(row [ index ]).attr("name").replace(/[0-9]/g, '').replace(/-/g, '_') === "fixed_asset_attributes" ) { return $('#' + $(row[ index ]).attr("id")).val(); } else { return $('#' + $(row[ index ]).attr("id")).val().replace(/,/g, ''); } })()  };
                                    } else {
                                        //inspired by https://stackoverflow.com/questions/24812930/how-to-remove-element-from-array-in-foreach-loop
                                        row.splice(index, 1);
                                    }
                                    index--;
                                }
                            });
                            
                            let formData = new Array(
                                { name: "purchase_quote_header_data", value: JSON.stringify(
                                        [ 
                                            { purchase_request: selected_row.selected_purchase_request.purchase_request_id },
                                            { vendor: $('#vendor-code').val() },
                                            { vendor_quote_reference_number: $('#vendor-quote-reference-number').val() },
                                            { created_by: window.localStorage.getItem('current_user_id') },
                                            { purchase_quote_date: $('#purchase-quote-date').val() },
                                            { validity_period: $('#validity-period').val() },
                                            { purchase_quote_status: 2 }
                                        ]
                                    )
                                },
                                { name: "purchase_quote_line_data", value: JSON.stringify(new_purchase_quote_lines_data) },
                                { name: "purchase_request", value: selected_row.selected_purchase_request.purchase_request_id },
                                { name: "user_id", value: window.localStorage.getItem('current_user_id') },
                                { name: "company", value: window.localStorage.getItem('current_user_company') },
                                { name: "_token", value: $('meta[name="csrf-token"]').attr("content") }
                            );
                            swal_text.innerHTML = "Create Purchase Quote for <br /><b>Vendor: " + $('#vendor-name').val() + "? </b>";
                            swal({
                                title: "Create Purchase Quote",
                                content: swal_text,
                                icon: "info",
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                                buttons: {
                                    cancel: {
                                        visible: true
                                    },
                                    confirm: {
                                        text: "Create"
                                    }
                                }
                            }).then(async (createIt) => {
                                if ( createIt ) {
                                    await new PurchaseQuoteService().newPurchaseQuote(formData).then((response) => {
                                        if ( response.created ) {
                                            swal({
                                                icon: "success",
                                                title: "Created " + response.newpurchasequotenumber,
                                                text: "Purchase Quote created successfully",
                                                buttons: false,
                                                timer: 3000,
                                                closeOnEsc: false,
                                                closeOnClickOutside: false
                                            });
                                        } else {
                                            swal({
                                                icon: "error",
                                                title: "Opsss",
                                                text: "Something went terribly wrong. Please contact System Administrator",
                                                buttons: false,
                                                timer: 3000,
                                                closeOnEsc: false,
                                                closeOnClickOutside: false
                                            });
                                        }
                                        $.unblockUI();
                                        $('form')[0].reset();
                                        document.body.style.overflowY = "auto";
                                    });
                                }
                            });
                        });
                    }
                },
                {
                    text: "Delete",
                    className: "btn btn-raised btn-danger waves-effect waves-light delete",
                    action: function() {
                        if (selected_row.selected_purchase_quote) {
                            swal_text.innerHTML = "Are you sure you want to DELETE the Purchase Request:<br /><b>" + selected_row.selected_purchase_quote[0] + "</b><br /><b>WARNING!</b><br />In proceeding Purchase Reuest # will be deleted";
                            swal({
                                title: "Delete?",
                                content: swal_text,
                                icon: "error",
                                dangerMode: true,
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                                buttons: {
                                    cancel: {
                                        text: "Nope! Not " + selected_row.selected_purchase_quote[0] ,
                                        visible: true
                                    },
                                    confirm: {
                                        text: "Delete"
                                    }
                                }
                            })
//                                            .then((deleteIt)=>{
//                                                if (deleteIt) {
//
//                                                }
//                                            });
                        } else {
                            new NothingSlectedAlert().render();
                        }
                    }
                },
                {
                    text: "Extend Quote",
                    className: "btn btn-raised btn-info waves-effect waves-light extend",
                    action: function() {
                        if ( selected_row.selected_purchase_quote ) {
                            swal_text.innerHTML = "Are you sure you want to EXTEND the Purchase Quote:<br /><b>" + selected_row.selected_purchase_quote.purchase_quote_number + "</b><br /><b>WARNING!</b><br />In proceeding Purchase Quote " + selected_row.selected_purchase_quote.purchase_quote_number + " will be Extended further";
                            swal({
                                title: "Extend?",
                                content: swal_text,
                                icon: "info",
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                                buttons: {
                                    cancel: {
                                        text: "Nope! Not " + selected_row.selected_purchase_quote.purchase_quote_number ,
                                        visible: true
                                    },
                                    confirm: {
                                        text: "Extend"
                                    }
                                }
                            }).then((extendIt) => {
                                if (extendIt) {
                                    if ( $('span.text-danger').is(':visible') ) {
                                        $('div.error').remove();
                                    }
                                    swal_text.innerHTML = "Please enter Extention Period (in # of days)" + Required + "<br /><br /><span class='bmd-form-group'><input class='swal-content__input' id='validity' type='text' oninput='this.value = this.value.replace(/^0+/, \"\").replace(/[^0-9]/g, \"\")' required></span>";
                                    return swal({
                                        icon: "warning",
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
                                                className: "extend-confirm"
                                            }
                                        }
                                    }).then(async (confirm) => {
                                        if ( confirm ) {
                                            PurchaseRequestController.extendPurchaseQuoteValidation(selected_row, swal_text);
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
                    text: "Request Authorization",
                    className: "btn btn-raised btn-success waves-effect waves-light authorization",
                    action: function() {
                        swal_text.innerHTML = "Submit Purchase Quotes:<br />" + this.table().columns(1).data().toArray()[0].map((quote) => { return "<b>" + quote + "</b>"; }).join("<br />") + "<br /><br /><b>WARNING!</b><br />In proceeding Purchase Quotes will be submitted to Authorization Personnel";
                        swal({
                            title: "Submit For Evaluation & Authorization?",
                            content: swal_text,
                            icon: "info",
                            closeOnClickOutside: false,
                            closeOnEsc: false,
                            buttons: {
                                cancel: {
                                    text: "Nope!" ,
                                    visible: true
                                },
                                confirm: {
                                    text: "Submit for Authorization"
                                }
                            }
                        }).then(async (submitIt) => {
                            if ( submitIt ) {
                                let data =  new Array(
                                    { name: "purchase_request", value: selected_row.selected_purchase_request.purchase_request_id },
                                    { name: "_token", value: $('meta[name="csrf-token"]').attr("content") }
                                );
                                await new PurchaseQuoteService().sendPurchaseQuotesForAuthorization(data).then((response) => {
                                    if ( response.updated ) {
                                        swal_text.innerHTML = "PR# <b>" + selected_row.selected_purchase_request.purchase_request_number + "</b> containing PQ#<br />" + this.table().columns(1).data().toArray()[0].map((quote) => { return "<b>" + quote + "</b>"; }).join("<br />") + "<br />has been sent for Authorization.";
                                        return swal({
                                            icon: "success",
                                            title: "Successfully Sent for Authorization",
                                            content: swal_text,
                                            buttons: false,
                                            timer: 3000,
                                            closeOnEsc: false,
                                            closeOnClickOutside: false
                                        });
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
                    }
                }
            ],
            initComplete: async function() {
                let purchase_quote_statuses = await new PurchaseQuoteService().getPurcaseQuoteStatuses().then((response) => { return response.purchasequotestatuses; });
                this.api().buttons().container().append(
                    new SelectLabel("Status").render() +
                    new Select(['purchase-quote-status'], 'purchase-quote-status', { multiple: "multiple" }, {}, 0).render()
                );
                $('select.purchase-quote-status').SumoSelect({ selectAll: true });
                
                purchase_quote_statuses.map((status, index) => {
                    $('select.purchase-quote-status')[0].sumo.add(status.purchase_quote_status_id, status.purchase_quote_status, index);
                });
                
                $('select.purchase-quote-status')[0].sumo.disable();
                
                let column_status = this.api().columns(6);
                $(document).on("change", "select.purchase-quote-status",function() {
                    column_status.search($(this).val().map((value) => { return value; }).join("|"), true, false).draw();
                });
            },
            drawCallback: function() {                                
                if ( this.api().data().any() ) {
                    this.api().buttons('.new-quote').enable();
                } else {
                    this.api().buttons().disable();
                }
            }
        });
        
        purchaseprocurement_quote.on('draw', function(event) {
            event.stopPropagation();
            if ( selected_row.selected_purchase_request.purchase_request_status_id >= 4 && selected_row.selected_purchase_request.purchase_request_status_id <= 6 ) {
                if ( purchaseprocurement_quote.data().any() ) {
                    $('select.purchase-quote-status')[0].sumo.enable();
                } else {
                    purchaseprocurement_quote.buttons('.new-quote').enable();
                    $('select.purchase-quote-status')[0].sumo.disable();
                }
            } else {
                $('select.purchase-quote-status')[0].sumo.disable();
            }
            
            purchaseprocurement_quote.columns('.status').every(function() {
                if ( this.data().toArray().length && this.data().toArray().some(e => e === 2) && !this.data().toArray().some((e) => e > 3) && !selected_row.selected_purchase_request.purchase_authorization ) {
                    purchaseprocurement_quote.buttons('.authorization').enable();
                } else if ( this.data().toArray().some(e => e === 6) ) {
                    purchaseprocurement_quote.buttons('.new-quote').disable();
                } else {
                    purchaseprocurement_quote.buttons('.authorization').disable();
                }
            });
        });
        
        //purchase quote lines
        
        $('#purchase-quote-lines').append($("<tfoot/>").attr("id", "purchase-quote-lines-footer"));
        let total_discount, total_vat, total_svat, total_nbt, total_olt, total;
        let purchaseprocurement_quote_lines = $('#purchase-quote-lines').DataTable({
            paging: false,
            info: false,
            scrollY: 500,
            scrollCollapse:true,
            responsive: true,
            columns: [
                { title: "Line ID", data: "purchase_quote_line_id", visible: false },
                { title: "Item", data: "item_code" },
                { title: "Item Description", data: "item_attribute_description", width: "35%", render: function(data, type, row) {
                        return type === 'display' && data.length > 56 ?
                            data.substr( 0, 56 ) +'…' :
                            data;
                    }
                },
                { title: "Product Description", data: "product_description", visible: false },
                { title: "UoM", data: "item_unit_of_measure", width: "5%" },
                { title: "Currency", data: "currency", width: "5%" },
                { title: "Price", data: "item_unit_price", render: $.fn.dataTable.render.number(",", ".", 4), className: "price" },
                { title: "Qty", data: "item_quantity", render: $.fn.dataTable.render.number(",", ".", 4), className: "qty" },
                { title: "Discount", data: "item_line_discount", className: "dis vas", render: $.fn.dataTable.render.number(",", ".", 4) },
                { title: "NBT", data: "item_line_nbt", className: "nbt vas", render: $.fn.dataTable.render.number(",", ".", 4) },
                { title: "OLT", data: "item_line_olt", className: "olt vas", render: $.fn.dataTable.render.number(",", ".", 4) },
                { title: "VAT", data: "item_line_vat", className: "vat vas", render: $.fn.dataTable.render.number(",", ".", 4)  },
                { title: "SVAT", data: "item_line_svat", className: "svat vas", render: $.fn.dataTable.render.number(",", ".", 4) },
                { title: "Line Total", className: "total", data: null, render: function(data, type, row) {
                        return $.fn.dataTable.render.number(",", ".", 4).display(((((row.item_unit_price * row.item_quantity) - row.item_line_discount) + Number(row.item_line_nbt) + Number(row.item_line_olt))+ Number(row.item_line_vat)));
                    }
                }
            ],
            footerCallback: function(row, data, start, end, display) {
                this.api().columns('.dis').every(function(){
                    total_discount = this.data().toArray().reduce((a,b) => Number(a) + Number(b), 0);
                });

                this.api().columns('.nbt').every(function(){
                    total_nbt = this.data().toArray().reduce((a,b) => Number(a) + Number(b), 0);
                });

                this.api().columns('.olt').every(function(){
                    total_olt = this.data().toArray().reduce((a,b) => Number(a) + Number(b), 0);
                });

                this.api().columns('.vat').every(function(){
                    total_vat = this.data().toArray().reduce((a,b) => Number(a) + Number(b), 0);
                });

                this.api().columns('.svat').every(function(){
                    total_svat = this.data().toArray().reduce((a,b) => Number(a) + Number(b), 0);
                });

                total = this.api().cells(null, '.total').render('display').reduce((a, b) => floatConvert(a) + floatConvert(b), 0);

                if (data.length) {
                    $('tfoot#purchase-quote-lines-footer').html(
                        '<tr>' +
                            '<td class="totalling-tag text-right">SUB TOTAL</td>' +
                            '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total + total_discount - (total_vat + total_nbt + total_olt)) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="totalling-tag text-right">TOTAL DISCOUNT</td>' +
                            '<td class="totalling text-right">(' + $.fn.dataTable.render.number(",", ".", 4).display(total_discount) + ')</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="totalling-tag text-right">TOTAL BEFORE TAX</td>' +
                            '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display((total - (total_nbt + total_olt)) - total_vat) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="totalling-tag text-right">TOTAL NBT</td>' +
                            '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_nbt) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="totalling-tag text-right">TOTAL OLT</td>' +
                            '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_olt) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="totalling-tag text-right">TOTAL VAT</td>' +
                            '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_vat) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="totalling-tag text-right">TOTAL SVAT</td>' +
                            '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_svat) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="totalling-tag text-right"><strong>GRAND TOTAL</strong></td>' +
                            '<td class="totalling text-right"><strong>' + $.fn.dataTable.render.number(",", ".", 4).display(total) + '</strong></td>' +
                        '</tr>'
                    );
                }
            }
        });
                
        purchaseprocurement_quote.on('click', 'tr', async function(event){
            selected_row.selected_purchase_quote = purchaseprocurement_quote.row(this).data();
            //selection issue
            if ( purchaseprocurement_quote.row(this, { selected: true }).data() === purchaseprocurement_quote.row(this).data() ) {
                event.stopPropagation();
                return false;
            } else {
                await new PurchaseQuoteService().getPurchaseRequestQuoteLines(selected_row.selected_purchase_quote.purchase_quote_id).then((response) => {
                    if ( response.data ) {
                        purchaseprocurement_quote_lines.clear();
                        purchaseprocurement_quote_lines.rows.add(response.data).draw();
                        purchaseprocurement_quote_lines.columns('.vas').every(function() {
                            if (this.data().toArray().every(e => Number(e) === 0)) {
                                this.visible(false);
                            } else {
                                this.visible(true);
                            }
                        });
                    }
                });
                if ( selected_row.selected_purchase_quote.purchase_quote_status_id < 4 ) {
                    purchaseprocurement_quote.buttons('.extend').enable();
                } else {
                    purchaseprocurement_quote.buttons('.extend').disable();
                }
                if ( selected_row.selected_purchase_quote.purchase_quote_status_id < 3 ) {
                    purchaseprocurement_quote.buttons('.delete').enable();
                } else {
                    purchaseprocurement_quote.buttons('.delete').disable();
                }
            }
        });
        
        PurchaseRequestController.selectPurchaseRequest(purchaseprocurement_request, purchaseprocurement_quote, purchaseprocurement_quote_lines, selected_row);
        PurchaseRequestController.tableAutoUpdate(purchaseprocurement_request, selected_row, table_row_count, time_out_id);
        PurchaseRequestController.newPurchaseRequest();
        PurchaseRequestController.purchaseQuoteAutoUpdate(purchaseprocurement_quote, selected_row, purchase_quote_time_out_id);
        PurchaseRequestController.purchaseQuoteLinesAutoUpdate(purchaseprocurement_quote_lines, selected_row, purchase_quote_lines_time_out_id);
        
    }
    
    builder() {
        
        $(document).ready(() => {
            $(document).on("click", "#purchaseprocurement", () => {
                let selected_row = {};
                let swal_text = document.createElement("div");
                swal_text.className = "swal-text text-center";
                let table_row_count;
                let time_out_id;
                let purchase_quote_time_out_id;
                let purchase_quote_lines_time_out_id;
                this.tableCreator(selected_row, swal_text, table_row_count, time_out_id, purchase_quote_time_out_id, purchase_quote_lines_time_out_id);
                if ( selected_row.selected_purchase_request ) {
                    delete selected_row.selected_purchase_request;
                }
            });
        });
        
    }
    
}

export default new PurchaseRequestController().builder();