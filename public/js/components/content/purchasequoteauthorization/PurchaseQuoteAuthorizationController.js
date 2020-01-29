/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import PurchaseQuoteAuthorizationService from './PurchaseQuoteAuthorizationService.js';
import Table from '../../elements/Table.js';
import ModalFormCustom from '../../elements/ModalFormCustom.js';
import Button from '../../elements/Button.js';
import Link from '../../elements/Link.js';
import SelectLabel from '../../elements/SelectLabel.js';
import Select from '../../elements/Select.js';
import Required from '../../elements/Required.js';
import NothingSelectedAlert from '../../utils/NothingSelectedAlert.js';

class PurchaseQuoteAuthorizationController {
    
    static tableAutoUpdate(table, selected_row, table_row_count, time_out_id) {
        
        time_out_id = setInterval(function() {
            
            if ( $('#purchasequoteauthorization').hasClass("active") ) {
                
                table.ajax.reload(null, false);
                if ( selected_row.selected_purchase_request_quote_authorization === undefined && table_row_count !== table.data().count() ) {
                    table.scroller.toPosition(table.data().count(), false);
                    table_row_count = table.data().count();
                }
            
            } else {
                clearInterval(time_out_id);
            }
        }, 4000);
        
    }
    
    static purchaseQuoteHeaderAutoUpdate(table, time_out_id) {
        
        time_out_id = setInterval(function() {
            
            if ( $('#purchasequoteauthorization').hasClass("active") && $('#purchase-quote-authorization-modal').is(':visible') ) {
                
                table.ajax.reload(null, false);
            
            } else {
                clearInterval(time_out_id);
            }
        }, 4000);
        
    }
    
    static tableColumns() {
        
        
        
    }
    
    static purchaseQuoteAuthorizeRemarkValidation(selected_row, swal_text) {
        
        $(document).on('click', '.purchase-quote-authorize-confirm', async (event) => {
            
            event.stopImmediatePropagation();
            swal.stopLoading();
            if ( !$('#remark').val() ) {
                console.log(selected_row.selected_purchase_quote_authorize_reject.purchase_quote_id)
                let formData = new Array(
                    { name: "purchase_quote_id", value: selected_row.selected_purchase_quote_authorize_reject.purchase_quote_id },
                    { name: "user_id", value: window.localStorage.getItem('current_user_id') },
                    { name: "remark", value: $('#remark').val() },
                    { name: "_token", value: $('meta[name="csrf-token"]').attr("content") }
                );
                await new PurchaseQuoteAuthorizationService().authorizePurchaseQuote(formData).then((response) => {
                    if ( response.authorized ) {
                        swal_text.innerHTML = "PQ# <b>" + selected_row.selected_purchase_quote_authorize_reject.purchase_quote_number + "</b> authorized";
                        return swal({
                            icon: "success",
                            title: "Authorized",
                            content: swal_text,
                            buttons: false,
                            timer: 3000,
                            closeOnEsc: false,
                            closeOnClickOutside: false
                        });
                        delete selected_row.selected_purchase_quote_authorize_reject;
                        $.unblockUI();
                        $('form')[0].reset();
                        document.body.style.overflowY = "auto";
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
    
    static purchaseQuoteRejectRemarkValidation(selected_row, swal_text, purchasequotelines) {
        
        $(document).on('click', '.purchase-quote-reject-confirm', async (event) => {
            
            event.stopImmediatePropagation();
            swal.stopLoading();
            if ( $('#remark').val() === "" ) {
                let formData = new Array(
                    { name: "purchase_quote_id", value: selected_row.selected_purchase_quote_authorize_reject.purchase_quote_id },
                    { name: "user_id", value: window.localStorage.getItem('current_user_id') },
                    { name: "remark", value: $('#remark').val() },
                    { name: "_token", value: $('meta[name="csrf-token"]').attr("content") }
                );
                await new PurchaseQuoteAuthorizationService().rejectPurchaseQuote(formData).then((response) => {
                    if ( response.rejected ) {
                        swal_text.innerHTML = "PQ# <b>" + selected_row.selected_purchase_quote_authorize_reject.purchase_quote_number + "</b> rejected";
                        return swal({
                            icon: "success",
                            title: "Rejected",
                            content: swal_text,
                            buttons: false,
                            timer: 3000,
                            closeOnEsc: false,
                            closeOnClickOutside: false
                        });
                        purchasequotelines.clear().draw();
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
            $(document).on("click", "#purchasequoteauthorization", function() {
                let selected_row = {};
                let swal_text = document.createElement("div");
                swal_text.className = "swal-text text-center";
                let table_row_count;
                let time_out_id;
                let purchase_quote_header_time_out_id;
                if ( selected_row.selected_purchase_request_quote_authorization ) {
                    delete selected_row.selected_purchase_request_quote_authorization;
                }

                let purchasequoteapproval = $('#purchase-quote-authorization').DataTable({
                    info: false,
                    //responsive: true,
                    ajax: {
                        url: "/purchasequoteauthorization?user_id="+ window.localStorage.getItem('current_user_id') + "&company=" + window.localStorage.getItem('current_user_company'),
                        dataSrc: "purchase_quote_authorization"
                    },
                    //serverSide: true,
                    select: {
                        style: "single"
                    },
                    scrollY: window.innerHeight - (document.getElementById('purchase-quote-authorization').getBoundingClientRect().top + parseInt(window.navbarHeight, 10) + 100),
                    scrollCollapse: true,
                    scroller: true,
                    saveState: true,
                    rowId: "purchase_request_id",
                    columns: [
                        { title: "Purchase Request ID", data: "purchase_request_id", visible: false },
                        { title: "Purchase Request Number", data: "purchase_request_number" },
                        { title: "Purchase Request Number", data: "purchase_request_title" },
                        { title: "Request Date", data: "purchase_request_created_date" },
                        { title: "Authorization Criteria ID", data: "authorization_criteria_id", visible: false },
                        { title: "Authorization Structure", data: null, render: function(data, type, row) {
                                return row.authorization_structure_name + " " + row.authorization_criteria_option + " " + row.authorization_structure_criteria;
                            }
                        },
                        { title: "Number of Quotes", data: "quote_count" }
                    ],
                    dom: "Bfrtip",
                    initComplete: function() {
                        this.api().buttons().container().html(
                            new SelectLabel("Authorization Structures").render() + new Select(['authorizer-structures'], "authorizer-structures", { multiple: "multiple" }, {}, 1).render()
                        );
                                
                        $('select').SumoSelect({ selectAll: true });
                        
                        let authorization_structures  = JSON.parse(window.localStorage.getItem('current_user_authorization_structures'));
                        authorization_structures.map((authorization_structure, index) => {
                            $('select.authorizer-structures')[0].sumo.add(authorization_structure[0], authorization_structure[1] + " " + authorization_structure[2] + " " + authorization_structure[3], index);
                        });
                        
                        $('select.authorizer-structures').parents('.SumoSelect').css('width', "350px");
                        
                        $('select.authorizer-structures')[0].sumo.selectAll();

                        let column_authorization_structures = this.api().columns(4);
                        $(document).on("change", "select.authorizer-structures",function() {
                            column_authorization_structures.search($(this).val().map((value) => { return value; }).join("|"), true, false).draw();
                        });
                    }
                });
                
                PurchaseQuoteAuthorizationController.tableAutoUpdate(purchasequoteapproval, selected_row, table_row_count, time_out_id);

                purchasequoteapproval.on('click', 'tr', function(event) {
                    selected_row.selected_purchase_request_quote_authorization = purchasequoteapproval.row(this).data();
                    
                    if ( purchasequoteapproval.row(this, { selected: true }).data() === purchasequoteapproval.row(this).data() ) {
                        event.stopPropagation();
                    }
                    
                    $.blockUI({
                        message: new ModalFormCustom("purchase-quote-authorization-modal", "Authorize Purchase Quote", { form_method: "POST", form_id: "purchase-quote-authorization", form_enctype: "application/x-www-form-urlencoded" },
                        [ 
                            '<div class="row">' +
                                '<div class="col">' +
                                    new Table("purchase-quotes", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="col">' +
                                    new Table("purchase-quote-lines", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                '</div>' +
                            '</div>'
                        ],
                        [ 
                            new Button([ "btn-raised", "btn-warning" ], "discard", "Close").render()
                        ]).render()
                    });

                    $('#purchase-quote-authorization-modal .modal-dialog').css({
                        maxWidth: "90%"
                    });
                    
                    let purchasequotelines = $('#purchase-quote-lines').DataTable({
                        paging: false,
                        info: false,
                        scrollY: 225,
                        searching: false,
                        scrollCollapse:true,
                        responsive: true,
                        processing: true,
                        columns: [
                            { title: "Line ID", data: "purchase_quote_line_id", visible: false },
                            { title: "Item Code", data: "item_code" },
                            { title: "Item Descripsion", data: "item_attribute_description" },
                            { title: "Product Descripsion", data: "product_description", className: "hidden-column" },
                            { title: "UoM", data: "item_unit_of_measure" },
                            { title: "Currency", data: "currency" },
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
                        ]
                    });

                    let purchasequotes = $('#purchase-quotes').DataTable({
                        info: false,
                        scrollY: 225,
                        ajax: {
                            url: "/purchaserequestpurchasequoteauthorization?purchase_request="+ selected_row.selected_purchase_request_quote_authorization.purchase_request_id + "&company=" + window.localStorage.getItem('current_user_company'),
                            dataSrc: "purchase_request_purchase_quote_authorization"
                        },
                        //serverSide: true,
                        select: {
                            style: "single"
                        },
                        scrollCollapse: true,
                        //responsive: true,
                        scroller: true,
                        saveState: true,
                        rowId: "purchase_quote_id",
                        columns: [
                            { title: "Purchase Quote ID", data: "purchase_quote_id", visible: false },
                            { title: "Purchase Quote #", data: "purchase_quote_number" },
                            { title: "Vendor Code", data: "vendor_code" },
                            { title: "Vendor", data: "vendor_name" },
                            { title: "Vendor Ref", data: "vendor_quote_reference_number" },
                            { title: "Purchase Request", data: "purchase_request_number", render: function(data) {
                                    return Link([], [], "javascript:;", data);
                                }
                            },
                            { title: "Created By", data: "user_display_name" },
                            { title: "Auth. Status", data: null, render: function(data, type, row) {
                                    if ( row.current_authorization_count ===  row.required_authorization_count) {
                                        return "Done " + row.current_authorization_count + "/" + row.required_authorization_count;
                                    } else {
                                        return "Pending " + (() => { return row.current_authorization_count || 0; })() + "/" + row.required_authorization_count;
                                    }
                                } 
                            },
                            { title: "Previous Authorizer", data: null, render: function(data, type, row) {
                                    if ( row.current_authorization_users ) {
                                        let previous_authorizer = row.current_authorization_users.split(",");
                                        return previous_authorizer[ row.current_authorization_count-1 ];
                                    } else {
                                        return null;
                                    }
                                }
                            },
                            { title: "Previous Auth. Date", data: null, render: function(data, type, row) {
                                    if ( row.current_authorization_dates ) {
                                        let previous_authorizer_date = row.current_authorization_dates.split(",");
                                        return previous_authorizer_date[ row.current_authorization_count-1 ];
                                    } else {
                                        return null;
                                    }
                                }
                            },
                            { title: "Current Authorization Count", data: "current_authorization_count", className: "current-authorization-count hidden-column" },
                            { title: "Total Expense", data: "grand_total", render: $.fn.dataTable.render.number(",", ".", 4), className: "total" }
                        ],
                        dom: "Bfrtip",
                        buttons: [
                            {
                                text: "Authorize",
                                className: "btn btn-raised btn-success waves-effect waves-light authorize",
                                action: function() {
                                    if ( selected_row.selected_purchase_quote_authorize_reject ) {
                                        swal_text.innerHTML = "Are you sure you want to AUTHORIZE the Purchase Quote: <b>" + selected_row.selected_purchase_quote_authorize_reject.purchase_quote_number + "</b><br /><br /><b>WARNING!</b><br />In proceeding Purchase Quote #<b>" + selected_row.selected_purchase_quote_authorize_reject.purchase_quote_number + "</b> will be authorized";
                                        swal({
                                            title: "Authorize Purchase Quote?",
                                            content: swal_text,
                                            icon: "info",
                                            dangerMode: true,
                                            closeOnClickOutside: false,
                                            closeOnEsc: false,
                                            buttons: {
                                                cancel: {
                                                    text: "Nope! Not " + selected_row.selected_purchase_quote_authorize_reject.purchase_quote_number ,
                                                    visible: true
                                                },
                                                confirm: {
                                                    text: "Authorize"
                                                }
                                            }
                                        }).then((authorizeIt) => {
                                            if ( authorizeIt ) {
                                                swal_text.innerHTML = "Please enter Remark" + Required + "<br /><br /><span class='bmd-form-group'><input class='swal-content__input' id='remark' type='text' required></span>";
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
                                                            className: "purchase-quote-authorize-confirm"
                                                        }
                                                    }
                                                }).then(async (confirm) => {
                                                    if ( confirm ) {
                                                        PurchaseQuoteAuthorizationController.purchaseQuoteAuthorizeRemarkValidation(selected_row, swal_text);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        new NothingSelectedAlert().render();
                                    }
                                }
                            },
                            {
                                text: "Reject",
                                className: "btn btn-raised btn-danger waves-effect waves-light reject",
                                action: function() {
                                    if ( selected_row.selected_purchase_quote_authorize_reject ) {
                                        swal_text.innerHTML = "Are you sure you want to REJECT the Purchase Quote: <b>" + selected_row.selected_purchase_quote_authorize_reject.purchase_quote_number + "</b><br /><br /><b>WARNING!</b><br />In proceeding Purchase Quote #<b>" + selected_row.selected_purchase_quote_authorize_reject.purchase_quote_number + "</b> will be rejected";
                                        swal({
                                            title: "Reject Purchase Quote?",
                                            content: swal_text,
                                            icon: "warning",
                                            dangerMode: true,
                                            closeOnClickOutside: false,
                                            closeOnEsc: false,
                                            buttons: {
                                                cancel: {
                                                    text: "Nope! Not " + selected_row.selected_purchase_quote_authorize_reject.purchase_quote_number ,
                                                    visible: true
                                                },
                                                confirm: {
                                                    text: "Reject"
                                                }
                                            }
                                        }).then((rejectIt) => {
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
                                                            className: "purchase-quote-reject-confirm"
                                                        }
                                                    }
                                                }).then(async (confirm) => {
                                                    if ( confirm ) {
                                                        PurchaseQuoteAuthorizationController.purchaseQuoteRejectRemarkValidation(selected_row, swal_text, purchasequotelines);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        new NothingSelectedAlert().render();
                                    }
                                }
                            }
                        ]
                    });
                    
                    PurchaseQuoteAuthorizationController.purchaseQuoteHeaderAutoUpdate(purchasequotes, purchase_quote_header_time_out_id);
                    
                    purchasequotes.on('click', 'tr', async function(event) {
                        selected_row.selected_purchase_quote_authorize_reject = purchasequotes.row(this).data();
                        
                        if ( purchasequotes.row(this, { selected: true }).data() === purchasequotes.row(this).data() ) {
                            event.stopPropagation();
                            return false;
                        }
                        
                        if ( selected_row.selected_purchase_quote_authorize_reject.current_authorization_count ) {
                            if ( selected_row.selected_purchase_quote_authorize_reject.current_authorization_count + 1 === selected_row.selected_purchase_request_quote_authorization.authorization_structure_personnel_sequence ) {
                                purchasequotes.buttons('.authorize').enable();
                                purchasequotes.buttons('.reject').enable();
                            }
                        } else {
                            purchasequotes.columns('.current-authorization-count').every(function() {
                                if (this.data().toArray().every(e => Number(e) === 0)) {
                                    purchasequotes.buttons('.authorize').enable();
                                    purchasequotes.buttons('.reject').enable();
                                } else {
                                    purchasequotes.buttons('.authorize').disable();
                                }
                            });
                        }
                        
                        purchasequotelines.clear().draw();
                        await new PurchaseQuoteAuthorizationService().getPurchaseQuotePurchaseQuoteLines(selected_row.selected_purchase_quote_authorize_reject.purchase_quote_id).then((response) => {
                            if ( response.data.length ) {
                                purchasequotelines.rows.add(response.data).draw();
                                purchasequotelines.columns('.vas').every(function() {
                                    if (this.data().toArray().every(e => Number(e) === 0)) {
                                        this.visible(false);
                                    } else {
                                        this.visible(true);
                                    }
                                });
                            }
                        });
                    });

                });

                $(document).on('click', '#discard', function() {
                    delete selected_row.selected_purchase_quote_authorize_reject;
                    $.unblockUI();
                    $('form')[0].reset();
                    document.body.style.overflowY = "auto";
                });
            });
        });
        
    }
    
}

export default new PurchaseQuoteAuthorizationController().builder();