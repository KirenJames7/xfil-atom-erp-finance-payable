/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import PurchaseOrderService from './PurchaseOrderService.js';
import ReportTemplate from '../../utils/ReportTemplate.js';
import Table from '../../elements/Table.js';
import Button from '../../elements/Button.js';
import CheckBoxInline from '../../elements/CheckBoxInline.js';
import Select from '../../elements/Select.js';
import SelectLabel from '../../elements/SelectLabel.js';
import ModalForm from '../../elements/ModalForm.js';
import ModalFormCustom from '../../elements/ModalFormCustom.js';
import Label from '../../elements/Label.js';
import Required from '../../elements/Required.js';
import Input from '../../elements/Input.js';
import TextArea from '../../elements/TextArea.js';

class PurchaseOrderController {
    
    static tableAutoUpdate(table, selected_row, table_row_count, time_out_id) {
        
        time_out_id = setInterval(function() {
            
            if ( $('#purchaseorder').hasClass("active") && $('#authorized-purchase-quote-modal').is(':visible') ) {
                
                table.ajax.reload(null, false);
                if ( selected_row.selected_authorized_purchase_quote === undefined && table_row_count !== table.data().count() ) {
                    table.scroller.toPosition(table.data().count(), false);
                    table_row_count = table.data().count();
                }
            
            } else {
                clearInterval(time_out_id);
            }
            
        }, 4000);
        
    }
    
    static purchaseOrderAutoUpdate(table, selected_row, table_row_count, purchase_order_time_out_id) {
        
        purchase_order_time_out_id = setInterval(() => {
            
            if ( $('#purchaseorder').hasClass("active") ) {
                
                table.ajax.reload(null, false);
                if ( selected_row.purchase_order === undefined && table_row_count !== table.data().count() ) {
                    table.scroller.toPosition(table.data().count(), false);
                    table_row_count = table.data().count();
                }
                
            } else {
                clearInterval(purchase_order_time_out_id);
            }
            
        }, 4000);
        
    }
    
//    static purchaseOrderAutoUpdate(table, selected_row, purchase_quote_time_out_id) {
//        
//        purchase_quote_time_out_id = setInterval(function() {
//            
//            if ( $('#purchaseprocurement').hasClass("active") ) {
//                
//                if ( selected_row.selected_purchase_request !== undefined && selected_row.selected_purchase_request.purchase_request_status_id > 3 ) {
//                
//                    table.ajax.url("purchasequotes?purchase_request=" + selected_row.selected_purchase_request.purchase_request_id);
//                    table.ajax.reload(null, false);
//                    
//                }
//            
//            } else {
//                clearInterval(purchase_quote_time_out_id);
//            }
//            
//        }, 4000);
//        
//    }
//    
//    static purchaseOrderLinesAutoUpdate(table, selected_row, purchase_quote_lines_time_out_id) {
//        
//        purchase_quote_lines_time_out_id = setInterval(function() {
//            
//            if ( $('#purchaseprocurement').hasClass("active") ) {
//                
//                if ( selected_row.selected_purchase_quote !== undefined ) {
//                
//                    table.ajax.url("purchasequotelines?purchase_quote=" + selected_row.selected_purchase_quote.purchase_quote_id);
//                    table.ajax.reload(null, false);
//                    
//                }
//            
//            } else {
//                clearInterval(purchase_quote_lines_time_out_id);
//            }
//            
//        }, 4000);
//        
//    }
    
    static generatePurchaseOrderPopUp(selected_row, table_row_count, time_out_id) {
        
        $.blockUI({
            message: new ModalFormCustom("authorized-purchase-quote-modal", "Generate Purchase Order", { form_method: "POST", form_id: "generate-purchase-order", form_enctype: "application/x-www-form-urlencoded" },
            [ 
                '<div class="row">' +
                    '<div class="col">' +
                        new Table("authorized-purchase-quote", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                    '</div>' +
                '</div>'
            ],
            [ 
                new Button([ "btn-raised", "btn-warning" ], "discard", "Close").render()
            ]).render()
        });

        //write attribute setter for modal
        $('#authorized-purchase-quote-modal .modal-dialog').css({
            maxWidth: "90%"
        });

        let authorizedpurchasequote = $('#authorized-purchase-quote').DataTable({
            info: false,
            scrollY: "90%",
            ajax: {
                url: "/purchasequotesforpurchaseorders?company=" + window.localStorage.getItem('current_user_company'),
                dataSrc: "purchase_quotes_for_purchase_orders"
            },
            //serverSide: true,
            select: {
                style: "single"
            },
            scroller: true,
            scrollCollapse:true,
            saveState: true,
            rowId: "purchase_quote_id",
            responsive: true,
            columns: [
                { title: "Purchase Quote ID", data: "purchase_quote_id", visible: false },
                { title: "Purchase Quote", data: "purchase_quote_number" },
                { title: "Vendor ID", data: "vendor_id", visible: false },
                { title: "Vendor Code", data: "vendor_code" },
                { title: "Vendor Name", data: "vendor_name" },
                { title: "Vendor Ref", data: "vendor_quote_reference_number" },
                { title: "Purchase Request ID", data: "purchase_request_id", visible: false },
                { title: "Purchase Request", data: "purchase_request_number" },
                { title: "Created By ID", data: "user_id", visible: false },
                { title: "Created By", data: "user_display_name" },
                { title: "Total Expense", data: "grand_total", render: $.fn.dataTable.render.number(",", ".", 4), className: "total" },
                { render: function() {
                        return new Button([ "btn-raised", "btn-success", "generate" ], "generate", "Generate").render();
                    }
                }
            ]
        });
        
        authorizedpurchasequote.on('click', 'tr', function() {
            selected_row.selected_authorized_purchase_quote = authorizedpurchasequote.row(this).data();
        });

        PurchaseOrderController.tableAutoUpdate(authorizedpurchasequote, selected_row, table_row_count, time_out_id);
        
        $(document).on("click", ".generate", async function() {
            Promise.all([ new PurchaseOrderService().getDeliveryModes(), new PurchaseOrderService().getDeliveryTerms(), new PurchaseOrderService().getPaymentTerms(), new PurchaseOrderService().getMethodsOfPayment() ]).then((resolved, rejected) => {
                if ( resolved ) {
                    $('#authorized-purchase-quote-modal .modal-container').block({
                        message: new ModalFormCustom("purchase-order-terms-modal", `Please fill in Purchase Order Terms for ${selected_row.selected_authorized_purchase_quote.purchase_quote_number}`, { form_method: "POST", form_id: "purchase-order-terms", form_enctype: "application/x-www-form-urlencoded" },
                        [
                            '<div class="row">' +
                                '<div class="col-6">' +
                                    '<div class="form-group">' +
                                        new Label('delivery-mode', [], [], 'Delivery Mode').render() +
                                        new Input('text', [], 'delivery-mode', {}).render() +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-6">' +
                                    '<div class="form-group">' +
                                        new Label('delivery-term', [], [], 'Delivery Term').render() +
                                        new Input('text', [], 'delivery-term', {}).render() +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="col-4">' +
                                    '<div class="form-group">' +
                                        new Label('delivery-date', [], [], 'Delivery Date').render() +
                                        new Input('text', [], 'delivery-date', {}).render() +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="col-6">' +
                                    '<div class="form-group">' +
                                        new Label('method-of-payment', [], [], 'Method of Payment').render() +
                                        new Input('text', [], 'method-of-payment', {}).render() +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-6">' +
                                    '<div class="form-group">' +
                                        new Label('payment-term', [], [], 'Payment Term').render() +
                                        new Input('text', [], 'payment-term', {}).render() +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                        ],
                        [
                            new Button(['btn-raised', 'btn-success'], 'apply', 'Apply').render()
                        ]).render()
                    });
                    $('#purchase-order-terms-modal .modal-dialog').css({
                        width: '500px'
                    });
                    $('#delivery-mode').inputpicker({
                        data: resolved[0].delivery_modes,
                        fields:[
                            { name: 'delivery_mode_code', text: 'CODE' },
                            { name: 'delivery_mode', text: 'DELIVERY MODE' }
                        ],
                        headShow: true,
                        fieldText : 'delivery_mode_code',
                        fieldValue: 'delivery_mode_id',
                        filterOpen: true,
                        autoOpen: true
                    });
                    $('#delivery-term').inputpicker({
                        data: resolved[1].delivery_terms,
                        fields:[
                            { name: 'delivery_term_code', text: 'CODE' },
                            { name: 'delivery_term', text: 'DELIVERY TERM' }
                        ],
                        headShow: true,
                        fieldText : 'delivery_term_code',
                        fieldValue: 'delivery_term_id',
                        filterOpen: true,
                        autoOpen: true
                    });
                    $('#method-of-payment').inputpicker({
                        data: resolved[3].methods_of_payment,
                        fields:[
                            { name: 'method_of_payment_code', text: 'CODE' },
                            { name: 'method_of_payment', text: 'METHOD OF PAYMENT' }
                        ],
                        headShow: true,
                        fieldText : 'method_of_payment_code',
                        fieldValue: 'method_of_payment_id',
                        filterOpen: true,
                        autoOpen: true
                    });
                    $('#payment-term').inputpicker({
                        data: resolved[2].payment_terms,
                        fields:[
                            { name: 'payment_term_code', text: 'CODE' },
                            { name: 'payment_term', text: 'PAYMENT TERM' }
                        ],
                        headShow: true,
                        fieldText : 'payment_term_code',
                        fieldValue: 'payment_term_id',
                        filterOpen: true,
                        autoOpen: true
                    });
                    $('#delivery-date').datepicker({
                        dateFormat: "yy-mm-dd",
                        showButtonPanel: true,
                        showOtherMonths: true,
                        selectOtherMonths: true
                    });
                    
                    $("#apply").on("click", async function() {
                        const poTerms = {
                            [ $('#delivery-mode').attr("id").replace("-", "_") ]: $('#delivery-mode').val() ? $('#delivery-mode').inputpicker('element', $('#delivery-mode').val())["delivery_mode"] : "",
                            [ $('#delivery-term').attr("id").replace("-", "_") ]: $('#delivery-term').val() ? $('#delivery-term').inputpicker('element', $('#delivery-term').val())["delivery_term_code"] : "",
                            [ $('#delivery-date').attr("id").replace("-", "_") ]: $('#delivery-date').val() || "",
                            [ $('#method-of-payment').attr("id").replace(/-/g, "_") ]: $('#method-of-payment').val() ? $('#method-of-payment').inputpicker('element', $('#method-of-payment').val())["method_of_payment"] : "",
                            [ $('#payment-term').attr("id").replace("-", "_") ]: $('#payment-term').val() ? $('#payment-term').inputpicker('element', $('#payment-term').val())["payment_term"] : ""
                        };
                        
                        const poTermsData = [
                            { [ $('#delivery-mode').attr("id").replace("-", "_") ]: $('#delivery-mode').val() || null },
                            { [ $('#delivery-term').attr("id").replace("-", "_") ]: $('#delivery-term').val() || null },
                            { [ $('#delivery-date').attr("id").replace("-", "_") ]: $('#delivery-date').val() || null },
                            { [ $('#method-of-payment').attr("id").replace(/-/g, "_") ]: $('#method-of-payment').val() || null },
                            { [ $('#payment-term').attr("id").replace("-", "_") ]: $('#payment-term').val() || null }
                        ];
                        
                        await new PurchaseOrderService().getAuthorizedPurchaseQuoteLines(selected_row.selected_authorized_purchase_quote.purchase_quote_id).then(async (response) => {
                            let formData = new Array(
                                { name: "purchase_order_header_data", value: JSON.stringify(
                                        [ 
                                            { vendor: selected_row.selected_authorized_purchase_quote.vendor_id },
                                            ...poTermsData,
                                            { created_by: window.localStorage.getItem('current_user_id') },
                                            { purchase_order_status: 1 }
                                        ]
                                    )
                                },
                                { name: "purchase_order_line_data", value: JSON.stringify(response.authorized_purchase_quote_lines) },
                                { name: "user_id", value: window.localStorage.getItem('current_user_id') },
                                { name: "authorized_purchase_quote", value: selected_row.selected_authorized_purchase_quote.purchase_quote_id },
                                { name: "company", value: window.localStorage.getItem('current_user_company') },
                                { name: "_token", value: $('meta[name="csrf-token"]').attr("content") }
                            );
                            
                            swal({
                                icon: "info",
                                title: "Generate PO?",
                                text: `Generate PO for PQ# ${selected_row.selected_authorized_purchase_quote.purchase_quote_number}`,
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                                buttons: {
                                    cancel: {
                                        visible: true
                                    },
                                    confirm: {
                                        text: "Generate"
                                    }
                                }
                            }).then(async (generateIt) => {
                                if ( generateIt ) {
                                    return await new PurchaseOrderService().newPurchaseOrder(formData);
                                }
                            }).then((result) => {
                                $('#authorized-purchase-quote-modal .modal-container').unblock();
                                if ( result.created ) {
                                    swal({
                                        icon: "success",
                                        title: "Purchase Order Generated",
                                        text: `Purchase Order ${result.newpurchaseordernumber} generated from PQ# ${selected_row.selected_authorized_purchase_quote.purchase_quote_number}`,
                                        buttons: false,
                                        timer: 3000,
                                        closeOnEsc: false,
                                        closeOnClickOutside: false
                                    }).then(() => {
                                       new ReportTemplate(result.newpurchaseordernumber, JSON.parse(window.localStorage.getItem('current_user_company_information')), selected_row.selected_authorized_purchase_quote, response.authorized_purchase_quote_lines, window.localStorage.getItem('current_user'), selected_row.selected_authorized_purchase_quote.authorized_users, selected_row.selected_authorized_purchase_quote.authorized_dates, poTerms).generate();
                                    });
                                } else {
                                    swal({
                                        icon: "error",
                                        title: "Something went wrong!",
                                        text: "Reload application and try again",
                                        buttons: false,
                                        timer: 3000,
                                        closeOnEsc: false,
                                        closeOnClickOutside: false
                                    });
                                }
                            }).catch(err => {
                                if ( err ) {
                                    return false;
                                }
                            });
                        });
                    });
                }
            });
        });
        
    }
    
    builder() {
        
        $(document).ready(function() {
            $(document).on("click", "#purchaseorder", function(){
                let selected_row = {};
                let swal_text = document.createElement("div");
                swal_text.className = "swal-text text-center";
                let table_row_count;
                let time_out_id;
                let po_row_count;
                let po_time_out_id;
                
                PurchaseOrderController.generatePurchaseOrderPopUp(selected_row, table_row_count, time_out_id);

                let purchase_order = $('#purchase-order').DataTable({
                    info: false,
                    ajax: {
                        url: "/purchaseorders?company=" + window.localStorage.getItem('current_user_company'),
                        dataSrc: "purchase_orders"
                    },
                    //serverSide: true,
                    select: {
                        style: "single"
                    },
                    scrollY: 225,
                    scrollCollapse:true,
                    scroller: true,
                    saveState: true,
                    rowId: "purchase_order_id",
                    columns: [
                        { title: "Purchase Order ID", data: "purchase_order_id", visible: false },
                        { title: "Purchase Order", data: "purchase_order_number" },
                        { title: "Vendor ID", data: "vendor_id", visible: false },
                        { title: "Vendor Code", data: "vendor_code" },
                        { title: "Vendor Name", data: "vendor_name" },
                        { title: "Delivery Mode ID", data: "delivery_mode_id", visible: false },
                        { title: "Delivery Mode", data: "delivery_mode_code" },
                        { title: "Delivery Term ID", data: "delivery_term_id", visible: false },
                        { title: "Delivery Term", data: "delivery_term_code" },
                        { title: "Payment Term ID", data: "payment_term_id", visible: false },
                        { title: "Payment Term", data: "payment_term_code" },
                        { title: "Method of Payment ID", data: "method_of_payment_id", visible: false },
                        { title: "Method of Payment", data: "method_of_payment" },
                        { title: "Status ID", data: "purchase_order_status_id", visible: false },
                        { title: "Status", data: "purchase_order_status" },
                        { title: "User ID", data: "user_id", visible: false },
                        { title: "Created By", data: "user_display_name" },
                        { title: "Created Date", data: "created_date" },
//                        { title: "Received Date(s)", data: "received_dates" },
//                        { title: "Received By", data: "received_by" },
//                        { title: "Invoiced Date(s)", data: "invoiced_dates" },
//                        { title: "Invoiced By", data: "invoiced_by" },
                        { title: "Authorized By", data: "authorized_users", visible: false },
                        { title: "Authorized Date", data: "authorized_dates", visible: false }
                    ],
                    dom: "Bfrtip",
                    buttons: [
                        {
                            text: "Generate Purchase Order(s)",
                            className: "btn btn-raised btn-primary waves-effect waves-light",
                            action: function() {                            
                                PurchaseOrderController.generatePurchaseOrderPopUp(selected_row, table_row_count, time_out_id);
                            }
                        }
                    ],
                    initComplete: async function() {
                        this.api().buttons().container().append(new CheckBoxInline([], {}, "global", "all", "Global").render() + 
                                new CheckBoxInline([], {}, "self", "self", "Self").render() + 
                                new SelectLabel("Status").render() + new Select([ "purchase-order-status" ], "purchase-order-status", { multiple: "multiple" }, {}, 0).render());
                        $('select').SumoSelect({ selectAll: true });
                        let purchase_order_statuses = await new PurchaseOrderService().getPurchaseOrderStatuses().then((response) => { return response.purchaseorderstatuses; });
                        
                        purchase_order_statuses.map((status, index) => {
                            $('select.purchase-order-status')[0].sumo.add(status.purchase_order_status_id, status.purchase_order_status, index);
                        });
                        
                        $('select.purchase-order-status')[0].sumo.selectItem("1");

                        let column_status = this.api().columns(13);
                        $(document).on("change", "select.purchase-order-status",function() {
                            column_status.search($(this).val().map((value) => { return value; }).join("|"), true, false).draw();
                        });
                    }
                });


                //inspired by https://stackoverflow.com/questions/31586354/jquery-datatables-scroll-to-bottom-when-a-row-is-added
                let $scrollBody = $(purchase_order.table().node()).parent();
                $scrollBody.scrollTop($scrollBody.get(0).scrollHeight);
                
                function floatConvert(num) {
                    return typeof num === 'string' ? num.replace(/,/g, '') * 1 : typeof num === 'number' ? num : 0;
                }
                
                $('#purchase-order-lines').append($("<tfoot/>").attr("id", "purchase-order-lines-footer"));
                let total_discount, total_vat, total_svat, total_nbt, total_olt, total;
                let purchase_order_lines = $('#purchase-order-lines').DataTable({
                    paging: false,
                    info: false,
                    scrollY: 225,
                    scrollCollapse:true,
                    columns: [
                        { title: "Line ID", data: "purchase_order_line_id", visible: false },
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
                            $('tfoot#purchase-order-lines-footer').html(
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

                purchase_order.on('click', 'tr', function() {
                    if (!$(this).hasClass("selected")) {
                        purchase_order.$('tr.selected').removeClass("selected");
                        $(this).addClass("selected");
                        selected_row.purchase_order = purchase_order.row(this).data();
                        if (purchase_order_lines.rows().data()) {
                            purchase_order_lines.clear();
                        }
                        //purchase_order_lines.rows.add(data).draw();
                    }
                });
                purchase_order.on('click', 'tr', async function(event) {
                    selected_row.purchase_order = purchase_order.row(this).data();
                    //selection issue
                    if ( purchase_order.row(this, { selected: true }).data() === purchase_order.row(this).data() ) {
                        event.stopPropagation();
                        return false;
                    } else {
                        await new PurchaseOrderService().getPurchaseOrderLines(selected_row.purchase_order.purchase_order_id).then((response) => {
                            if ( response.data ) {
                                purchase_order_lines.clear();
                                purchase_order_lines.rows.add(response.data).draw();
                                purchase_order_lines.columns('.vas').every(function() {
                                    if ( this.data().toArray().every(e => Number(e) === 0) ) {
                                        this.visible(false);
                                    } else {
                                        this.visible(true);
                                    }
                                });
                            }
                        });
//                        if ( selected_row.selected_purchase_quote.purchase_quote_status_id < 4 ) {
//                            purchaseprocurement_quote.buttons('.extend').enable();
//                        } else {
//                            purchaseprocurement_quote.buttons('.extend').disable();
//                        }
//                        if ( selected_row.selected_purchase_quote.purchase_quote_status_id < 3 ) {
//                            purchaseprocurement_quote.buttons('.delete').enable();
//                        } else {
//                            purchaseprocurement_quote.buttons('.delete').disable();
//                        }
                    }
                });
                
                PurchaseOrderController.purchaseOrderAutoUpdate(purchase_order, selected_row, po_row_count, po_time_out_id);

                $(document).on('click', '#discard', function() {
                    $.unblockUI();
                    document.body.style.overflowY = "auto";
                });

                //fixing a bug with datatables scrollY when on firefox
                if (Browser.name === "firefox") {
                    $('div.dataTables_scrollBody').css('padding-right', "6px");
                }
                //fixing bug with datatable search
                $('input[type="search"]').addClass("form-control");
                //remove the data table button styling
                $('.dt-button').removeClass("dt-button");
            });
        });
        
    }
    
}

export default new PurchaseOrderController().builder();