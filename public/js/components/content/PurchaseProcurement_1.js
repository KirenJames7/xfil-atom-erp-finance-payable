/* 
 * Copyright (C) 2019 kirenj
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import Label from '../elements/Label.js';
import Input from '../elements/Input.js';
import InputHelp from '../elements/InputHelp.js';
import TextArea from '../elements/TextArea.js';
import Required from '../elements/Required.js';
import Button from '../elements/Button.js';
import CheckBoxInline from '../elements/CheckBoxInline.js';
import Table from '../elements/Table.js';
import Modal from '../elements/Modal.js';
import ModalForm from '../elements/ModalForm.js';
import ModalFormCustom from '../elements/ModalFormCustom.js';
import SelectLabel from '../elements/SelectLabel.js';
import Select from '../elements/Select.js';

let data = [
    [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
    [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
    [ "Ashton Cox&", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
    [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
    [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
    [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
    [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
    [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
    [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
    [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
    [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ],
    [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
    [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
    [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
    [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
    [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
    [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
    [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
    [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
    [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
    [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
    [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ],
    [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
    [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
    [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
    [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
    [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
    [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
    [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
    [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
    [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
    [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
    [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ],
    [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
    [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
    [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
    [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
    [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
    [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
    [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
    [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
    [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
    [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
    [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ],
    [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
    [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
    [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
    [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
    [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
    [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
    [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
    [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
    [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
    [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
    [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ],
    [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
    [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
    [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
    [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
    [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
    [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
    [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
    [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
    [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
    [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
    [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ]
];

class PurchaseProcurement {
    
    render() {
        $(document).ready(function() {
            setTimeout(function() {
                $('#purchaseprocurement').on('click', function(){
                    let selectedrow = {};
                    let swaltext = document.createElement('p');
                    
                    function nothingSelectedSWAL() {
                        swal({
                            title: "Nothing Selected!",
                            text: "Please select a record to proceed.",
                            icon: "info",
                            closeOnClickOutside: false,
                            closeOnEsc: false,
                            buttons: {
                                confirm: {
                                    text: "OK"
                                }
                            }
                        });
                    }
                    
                    setTimeout(function() {
                        
                        let purchaseprocurement_request = $('#purchase-request').DataTable({
                            paging: false,
                            info: false,
                            data: data,
                            scrollY: 200,
                            scrollCollapse:true,
                            responsive: true,
                            processing: true,
                            columns: [
                                { title: "Name" },
                                { title: "Position" },
                                { title: "Location" },
                                { title: "Code" },
                                { title: "Date" },
                                { title: "Salary", className: "text-right" }
                            ],
                            dom: "Bfrtip",
                            buttons: [
                                {
                                    text: "New",
                                    className: "btn btn-raised btn-primary waves-effect waves-light",
                                    action: function() {                                       
                                        $.blockUI({
                                            message: new ModalFormCustom('purchase-request-modal', 'New Purchase Request', { form_method: "POST", form_id: "purchase-request", form_enctype: "application/x-www-form-urlencoded" },
                                                '<div class="row">' +
                                                    '<div class="col">' +
                                                        '<div class="form-group">' +
                                                            new Label('purchase-request-requirement', [], [], 'Purchase Requirement' + Required ).render() + new TextArea([], 'purchase-request-requirement', { required: true, rows:10 }).render() +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div class="row justify-content-between">' +
                                                    '<div class="col-md-4">' +
                                                        '<div class="form-group">' +
                                                            new Label('purchase-request-approx-value', [], [], 'Purchase Approx Value').render() + new Input('text', [], 'purchase-request-approx-value', {}).render() +
                                                        '</div>' +
                                                    '</div>' +
                                                    '<div class="col-md-4">' +
                                                        '<div class="form-group">' +
                                                            new Label('purchase-request-by', [], [], 'Purchase Requested By').render() + new Input('text', [], 'purchase-request-by', {}).render() +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>'
                                                ,
                                                [ 
                                                    new Button(['btn-raised', 'btn-warning'], 'discard', 'Discard').render(), 
                                                    new Button(['btn-raised', 'btn-secondary'], 'save', 'Save').render(), 
                                                    new Button(['btn-raised', 'btn-success'], 'send-for-approval', 'Send for Approval').render()
                                                ]).render()
                                        });
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
                                    className: "btn btn-raised btn-danger waves-effect waves-light",
                                    action: function() {
                                        if (selectedrow.purchase_resquest) {
                                            swaltext.innerHTML = "Are you sure you want to DELETE the Purchase Request:<br /><b>" + selectedrow.purchase_resquest[0] + "</b><br /><b>WARNING!</b><br />In proceeding Purchase Reuest # will be deleted";
                                            swal({
                                                title: "Delete?",
                                                content: swaltext,
                                                icon: "error",
                                                dangerMode: true,
                                                closeOnClickOutside: false,
                                                closeOnEsc: false,
                                                buttons: {
                                                    cancel: {
                                                        text: "Nope! Not " + selectedrow.purchase_resquest[0] ,
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
                                            nothingSelectedSWAL();
                                        }
                                    }
                                },
                                {
                                    text: "Cancel",
                                    className: "btn btn-raised btn-danger waves-effect waves-light",
                                    action: function() {
                                        if (selectedrow.purchase_resquest) {
                                            swaltext.innerHTML = "Are you sure you want to CANCEL the Purchase Request:<br /><b>" + selectedrow.purchase_resquest[0] + "</b><br /><b>WARNING!</b><br />In proceeding Purchase Reuest # will be Cancelled";
                                            swal({
                                                title: "Cancel?",
                                                content: swaltext,
                                                icon: "error",
                                                dangerMode: true,
                                                closeOnClickOutside: false,
                                                closeOnEsc: false,
                                                buttons: {
                                                    cancel: {
                                                        text: "Nope! Not " + selectedrow.purchase_resquest[0] ,
                                                        visible: true
                                                    },
                                                    confirm: {
                                                        text: "Cancel"
                                                    }
                                                }
                                            })
//                                            .then((deleteIt)=>{
//                                                if (deleteIt) {
//
//                                                }
//                                            });

                                        } else {
                                            nothingSelectedSWAL();
                                        }
                                    }
                                },
                                {
                                    text: "Send for Approval",
                                    className: "btn btn-raised btn-success waves-effect waves-light",
                                    action: function() {
                                        if (selectedrow.purchase_resquest) {
                                            swaltext.innerHTML = "Are you sure you want to REQUEST APPROVAL for the Purchase Request:<br /><b>" + selectedrow.purchase_resquest[0] + "</b>";
                                            swal({
                                                title: "Send For Approval?",
                                                content: swaltext,
                                                icon: "info",
                                                closeOnClickOutside: false,
                                                closeOnEsc: false,
                                                buttons: {
                                                    cancel: {
                                                        text: "Re-evaluate",
                                                        visible: true
                                                    },
                                                    confirm: {
                                                        text: "Send"
                                                    }
                                                }
                                            })
//                                            .then((deleteIt)=>{
//                                                if (deleteIt) {
//
//                                                }
//                                            });

                                        } else {
                                            nothingSelectedSWAL();
                                        }
                                    }
                                }
                            ],
                            initComplete : function() {
                                this.api().buttons().container().append(new CheckBoxInline([], {}, 'global', 'all', 'Global Purchase Requests').render() + 
                                    new CheckBoxInline([], {}, 'self', 'self', 'Created By Me').render() + 
                                    new SelectLabel("Status").render() + new Select(['purchase-request-status'], 'purchase-request-status', { multiple: "multiple" }, { 1: "Invalid", 2: "Evaluating", 3: "Approved", 4: "Rejected", 5: "Procurementing", 6: "Completed", 7: "Cancelled" }, 1).render());
                                $('select.purchase-request-status').SumoSelect({ selectAll: true });
                                $('select.purchase-request-status')[0].sumo.selectItem('2');
                            }
                        });
                        
                        $('select.purchase-request-status').on('change', function() {
                            console.log($(this).val());
                        });
                        
                        //inspired by https://stackoverflow.com/questions/31586354/jquery-datatables-scroll-to-bottom-when-a-row-is-added
                        let $scrollBody = $(purchaseprocurement_request.table().node()).parent();
                        $scrollBody.scrollTop($scrollBody.get(0).scrollHeight);
                        
                        let purchaseprocurement_quote = $('#purchase-quote').DataTable({
                            paging: false,
                            info: false,
                            scrollY: 200,
                            scrollCollapse:true,
                            responsive: true,
                            processing: true,
                            columns: [
                                { title: "Name" },
                                { title: "Position" },
                                { title: "Location" },
                                { title: "Code" },
                                { title: "Date" },
                                { title: "Salary", className: "text-right" }
                            ],
                            dom: "Bfrtip",
                            buttons: [
                                {
                                    text: "New",
                                    className: "btn btn-raised btn-primary waves-effect waves-light new-quote",
                                    action: function() {
                                        $.blockUI({
                                            message: new ModalFormCustom('purchase-quote-modal', 'New Purchase Quote', { form_method: "POST", form_id: "purchase-quote", form_enctype: "application/x-www-form-urlencoded" },
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
                                                            new Label('vendor-po-box', [], [], 'Vendor PO BOX' + Required).render() +
                                                            new Input('text', [ "col-md-5" ], 'vendor-po-box', { required: true }).render() +
                                                        '</div>' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-address-line-1', [], [], 'Vedor Address Line 1' + Required).render() +
                                                            new Input('text', [], 'vendor-address-line-1', { required: true }).render() +
                                                        '</div>' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-address-line-2', [], [], 'Vedor Address Line 2').render() +
                                                            new Input('text', [], 'vendor-address-line-2', {}).render() +
                                                        '</div>' +
                                                    '</div>' +
                                                    '<div class="col-md-3">' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-city', [], [], 'Vedor City' + Required).render() +
                                                            new Input('text', [], 'vendor-city', { required: true }).render() +
                                                        '</div>' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-province-state', [], [], 'Vedor Province State' + Required).render() +
                                                            new Input('text', [], 'vendor-province-state', { required: true }).render() +
                                                        '</div>' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-country', [], [], 'Vedor Country' + Required).render() +
                                                            new Input('text', [], 'vendor-country', { required: true }).render() +
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
                                            maxWidth: "90%"
                                        });
                                        
                                        $('#purchase-quote-date').datepicker({
                                            dateFormat: "yy-mm-dd",
                                            showButtonPanel: true,
                                            showOtherMonths: true,
                                            selectOtherMonths: true
                                        });
                                        
                                        $('#vendor-code').inputpicker({
                                            data:[
                                                { vendor_id: "1", vendor_code: "V000001", vendor_name: "SOFTLOGIC COMPUTERS (PVT) LTD", vendor_po_box: "50", vendor_address_line_1: "Duplication Road", vendor_address_line_2: "", vendor_city: "Colombo 3", vendor_province_state: "Western Province", vendor_country: "Sri Lanka" },
                                                { vendor_id: "2", vendor_code: "V000002", vendor_name: "DMS ELECTRONICS (PVT) LTD", vendor_po_box: "75", vendor_address_line_1: "High Level Road", vendor_address_line_2: "", vendor_city: "Nugegoda", vendor_province_state: "Western Province", vendor_country: "Sri Lanka" },
                                                { vendor_id: "3", vendor_code: "V000003", vendor_name: "THE COMPUTER COMPANY (PVT) LTD", vendor_po_box: "50", vendor_address_line_1: "Galle Road", vendor_address_line_2: "", vendor_city: "Colombo 6", vendor_province_state: "Western Province", vendor_country: "Sri Lanka" },
                                                { vendor_id: "4", vendor_code: "V000004", vendor_name: "ALI EXPRESS", vendor_po_box: "2740", vendor_address_line_1: "Road 1", vendor_address_line_2: "", vendor_city: "Sanghai", vendor_province_state: "Shanghai", vendor_country: "China" },
                                                { vendor_id: "5", vendor_code: "V000005", vendor_name: "AMAZON", vendor_po_box: "635", vendor_address_line_1: "Freeway", vendor_address_line_2: "", vendor_city: "Los Angeles", vendor_province_state: "California", vendor_country: "United States of America"  },
                                                { vendor_id: "6", vendor_code: "V000006", vendor_name: "EBAY", vendor_po_box: "4400", vendor_address_line_1: "Green Point", vendor_address_line_2: "", vendor_city: "Manhattan", vendor_province_state: "New York", vendor_country: "United States of America"  }
                                            ],
                                            fields:[
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
                                        let newpurchasequotelines = $('#new-purchase-quote-lines').DataTable({
                                            paging: false,
                                            info: false,
                                            scrollY: 200,
                                            scrollCollapse:true,
                                            responsive: true,
                                            processing: true,
                                            columns: [
                                                { title: "Item Code" },
                                                { title: "Item Description" },
                                                { title: "Product Description" },
                                                { title: "UoM" },
                                                { title: "Currency" },
                                                { title: "Price" },
                                                { title: "Qty" },
                                                { title: "Line Total" }
                                            ],
                                            dom: "Bfrtip",
                                            buttons: [
                                                {
                                                    text: "Add",
                                                    className: "btn btn-raised btn-primary waves-effect waves-light",
                                                    action: function() {
                                                        let currenttable = this.table();
                                                        let lastrow = currenttable.row(':last', { order: 'applied' }).data();
                                                        if (lastrow !== undefined) {
                                                            if (!lastrow.every(e => $("#" + $(e).attr("id")).val() !== "")) {
                                                                return false;
                                                            }
                                                        }

                                                        addcounter += 1;
                                                        currenttable.row.add([ 
                                                            new Input("text", [], "item-code" + addcounter, { required: true }).render(),
                                                            new Input("text", [], "item-attribute-description" + addcounter, { required: true }).render(),
                                                            new Input("text", [], "product-description" + addcounter, { required: true }).render(),
                                                            new Input("text", [], "item-unit-of-measure" + addcounter, { required: true }).render(),
                                                            new Input("text", [], "currency" + addcounter, { required: true }).render(),
                                                            new Input("text", [], "item-unit-price" + addcounter, { required: true }).render(),
                                                            new Input("text", [], "item-quantity" + addcounter, { required: true }).render(),
                                                            new Input("text", [], "line-total" + addcounter, { required: true }).render() 
                                                        ]).draw(false).node();
                                                        
                                                        $('#item-code' + addcounter).inputpicker({
                                                            data:[
                                                                { item_code: "LAPTOP", item_descripsion: "LAPTOP", item_type: "FA", item_unit_of_measure: "PCS" },
                                                                { item_code: "SWITCH", item_descripsion: "SWITCH", item_type: "FA", item_unit_of_measure: "PCS" },
                                                                { item_code: "LAPTOPBAG", item_descripsion: "LAPTOP BAG", item_type: "CA", item_unit_of_measure: "PCS" },
                                                                { item_code: "MOUSE", item_descripsion: "MOUSE", item_type: "CA", item_unit_of_measure: "PCS" },
                                                                { item_code: "DELIVERYCHG", item_descripsion: "DELIVERY CHARGES", item_type: "SER", item_unit_of_measure: "NOS" },
                                                                { item_code: "SERVICINGCHG", item_descripsion: "SERVICE CHARGES", item_type: "SER", item_unit_of_measure: "NOS" }
                                                            ],
                                                            fields:[
                                                                { name: 'item_code', text: 'ITEM CODE' },
                                                                { name: 'item_descripsion', text: 'ITEM DESCRIPSION' }
                                                            ],
                                                            headShow: true,
                                                            fieldText : 'item_code',
                                                            fieldValue: 'item_code',
                                                            filterOpen: true,
                                                            autoOpen: true
                                                        });
                                                        
                                                        $('#currency' + addcounter).inputpicker({
                                                            data: [
                                                                { currency_code: "LKR", currency_name: "Sri Lankan Rupee" },
                                                                { currency_code: "USD", currency_name: "United States Dollar" },
                                                                { currency_code: "GBP", currency_name: "British Pound Sterling" },
                                                                { currency_code: "EUR", currency_name: "Euro" }
                                                            ],
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
                                                        
                                                        $('#item-code' + addcounter).on("change", function(e) {
                                                            e.stopImmediatePropagation();
                                                            e.preventDefault();
                                                            if ($('#item-code' + addcounter).val() !== "") {
                                                                $('#item-attribute-description' + addcounter).val($('#item-code' + addcounter).inputpicker('element', $('#item-code' + addcounter).val())["item_descripsion"]);
                                                                $('#item-unit-of-measure' + addcounter).val($('#item-code' + addcounter).inputpicker('element', $('#item-code' + addcounter).val())["item_unit_of_measure"]);
                                                                if ($('#item-code' + addcounter).inputpicker('element', $('#item-code' + addcounter).val())["item_type"] === "FA") {
//                                                                    console.log("test")
//                                                                    return;
                                                                }
                                                            }
                                                        });
                                                        
                                                        $('#item-unit-price' + addcounter + ' , #item-quantity' + addcounter).on("change", function() {
                                                            calcLineTotal('#item-unit-price' + addcounter + ' , #item-quantity' + addcounter);
                                                        });
                                                        
                                                        function calcLineTotal(elem) {
                                                            let $container = $(elem).parent().parent().parent();
                                                            let price = $container.find('#item-unit-price' + addcounter).val() || 0.00;
                                                            let quantity = $container.find('#item-quantity' + addcounter).val() || 0.00;
                                                            let line_total = parseFloat(price) * parseFloat(quantity);
                                                            $('#line-total' + addcounter).val(line_total.toFixed(4));
                                                        }
                                                    }
                                                },
                                                {
                                                    text: "Delete",
                                                    className: "btn btn-raised btn-danger waves-effect waves-light",
                                                    action: function() {
                                                        console.log("Delete")
                                                    }
                                                },
                                                {
                                                    text: "Add Discount",
                                                    className: "btn btn-raised btn-info waves-effect waves-light",
                                                    action: function() {
                                                        console.log("Discount")
                                                    }
                                                },
                                                {
                                                    text: "Add VAT",
                                                    className: "btn btn-raised btn-secondary waves-effect waves-light",
                                                    action: function() {
                                                        console.log("VAT")
                                                    }
                                                },
                                                {
                                                    text: "Add SVAT",
                                                    className: "btn btn-raised btn-secondary waves-effect waves-light",
                                                    action: function() {
                                                        console.log("SVAT")
                                                    }
                                                },
                                                {
                                                    text: "Add NBT",
                                                    className: "btn btn-raised btn-secondary waves-effect waves-light",
                                                    action: function() {
                                                        console.log("NBT")
                                                    }
                                                },
                                                {
                                                    text: "Add MBT",
                                                    className: "btn btn-raised btn-secondary waves-effect waves-light",
                                                    action: function() {
                                                        console.log("MBT")
                                                    }
                                                },
                                            ]
                                        });
                                        $('#vendor-code').on("change", function(e) {
                                            e.stopImmediatePropagation();
                                            e.preventDefault();
                                            if ($(this).val() !== "") {
                                                $('#vendor-name').val($('#vendor-code').inputpicker('element', $(this).val())["vendor_name"]).attr('disabled', true);
                                                $('#vendor-po-box').val($('#vendor-code').inputpicker('element', $(this).val())["vendor_po_box"]).attr('disabled', true);
                                                $('#vendor-address-line-1').val($('#vendor-code').inputpicker('element', $(this).val())["vendor_address_line_1"]).attr('disabled', true);
                                                $('#vendor-address-line-2').val($('#vendor-code').inputpicker('element', $(this).val())["vendor_address_line_2"]).attr('disabled', true);
                                                $('#vendor-city').val($('#vendor-code').inputpicker('element', $(this).val())["vendor_city"]).attr('disabled', true);
                                                $('#vendor-province-state').val($('#vendor-code').inputpicker('element', $(this).val())["vendor_province_state"]).attr('disabled', true);
                                                $('#vendor-country').val($('#vendor-code').inputpicker('element', $(this).val())["vendor_country"]).attr('disabled', true);
                                            } else {
                                                return false;
                                            }
                                        });
                                    }
                                },
                                {
                                    text: "Delete",
                                    className: "btn btn-raised btn-danger waves-effect waves-light",
                                    action: function() {
                                        if (selectedrow.purchase_quote) {
                                            swaltext.innerHTML = "Are you sure you want to DELETE the Purchase Request:<br /><b>" + selectedrow.purchase_quote[0] + "</b><br /><b>WARNING!</b><br />In proceeding Purchase Reuest # will be deleted";
                                            swal({
                                                title: "Delete?",
                                                content: swaltext,
                                                icon: "error",
                                                dangerMode: true,
                                                closeOnClickOutside: false,
                                                closeOnEsc: false,
                                                buttons: {
                                                    cancel: {
                                                        text: "Nope! Not " + selectedrow.purchase_quote[0] ,
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
                                            nothingSelectedSWAL();
                                        }
                                    }
                                },
                                {
                                    text: "Extend Quote",
                                    className: "btn btn-raised btn-info waves-effect waves-light",
                                    action: function() {
                                        if (selectedrow.purchase_quote) {
                                            swaltext.innerHTML = "Are you sure you want to EXTEND the Purchase Quote:<br /><b>" + selectedrow.purchase_quote[0] + "</b><br /><b>WARNING!</b><br />In proceeding Purchase Reuest # will be Extended";
                                            swal({
                                                title: "Extend?",
                                                content: swaltext,
                                                icon: "info",
                                                closeOnClickOutside: false,
                                                closeOnEsc: false,
                                                buttons: {
                                                    cancel: {
                                                        text: "Nope! Not " + selectedrow.purchase_quote[0] ,
                                                        visible: true
                                                    },
                                                    confirm: {
                                                        text: "Extend"
                                                    }
                                                }
                                            })
//                                            .then((deleteIt)=>{
//                                                if (deleteIt) {
//
//                                                }
//                                            });
                                        } else {
                                            nothingSelectedSWAL();
                                        }
                                    }
                                },
                                {
                                    text: "Request Authorization",
                                    className: "btn btn-raised btn-success waves-effect waves-light",
                                    action: function() {
                                        //check PQs & PQLs
                                        swaltext.innerHTML = "Are you sure you want to Submit For Evaluation & Authorization the following Purchase Quotes:<br /><b>" + 'selectedrow.purchase_quote[0]' + "</b><br /><b>WARNING!</b><br />In proceeding Purchase Reuest # will be Extended";
                                        swal({
                                            title: "Submit For Evaluation & Authorization?",
                                            content: swaltext,
                                            icon: "info",
                                            closeOnClickOutside: false,
                                            closeOnEsc: false,
                                            buttons: {
                                                cancel: {
                                                    text: "Nope! Not " + 'selectedrow.purchase_quote[0]' ,
                                                    visible: true
                                                },
                                                confirm: {
                                                    text: "Submit For Evaluation & Authorization"
                                                }
                                            }
                                        })
//                                            .then((deleteIt)=>{
//                                                if (deleteIt) {
//
//                                                }
//                                            });
                                    }
                                }
                            ],
                            initComplete: function() {
                                this.api().buttons().container().append(new SelectLabel("Status").render() + new Select(['purchase-quote-status'], 'purchase-quote-status', { multiple: "multiple" }, { 1: "Open", 2: "Active", 3: "Expired", 4: "Selected", 5: "Rejected", 6: "Authorized" }, 0).render());
                                $('select.purchase-quote-status').SumoSelect({ selectAll: true });
                                $('select.purchase-quote-status')[0].sumo.disable();
                                $('select.purchase-quote-status')[0].sumo.selectItem('Open');
                            },
                            drawCallback: function() {                                
                                if (this.api().data().any()) {
                                    this.api().buttons().enable();
                                } else {
                                    this.api().buttons().disable();
                                }
                            }
                        });
                        
                        purchaseprocurement_quote.on('draw', function() {
                            if (purchaseprocurement_quote.data().any()){
                                $('select.purchase-quote-status')[0].sumo.enable();
                            } else {
                                purchaseprocurement_quote.buttons('.new-quote').enable()
                                $('select.purchase-quote-status')[0].sumo.disable();
                            }
                        });
                        
                        $('select.purchase-quote-status').on('change', function() {
                            console.log($(this).val())
                        });
                        
                        let purchaseprocurement_quote_lines = $('#purchase-quote-lines').DataTable({
                            paging: false,
                            info: false,
                            scrollY: 200,
                            scrollCollapse:true,
                            responsive: true,
                            processing: true,
                            columns: [
                                { title: "Name" },
                                { title: "Position" },
                                { title: "Location" },
                                { title: "Code" },
                                { title: "Date" },
                                { title: "Salary", className: "text-right" }
                            ]
                        });
                        
                        purchaseprocurement_request.on('click', 'tr', function() {
                            if (!$(this).hasClass("selected")) {
                                purchaseprocurement_request.$('tr.selected').removeClass("selected");
                                $(this).addClass("selected");
                                selectedrow.purchase_resquest = purchaseprocurement_request.row(this).data();
                                console.log(purchaseprocurement_quote.rows().count())
                                if (purchaseprocurement_quote.rows().count()) {
                                    delete selectedrow.purchase_quote;
                                    purchaseprocurement_quote.clear();
                                    purchaseprocurement_quote_lines.clear().draw();
                                } else {
                                    purchaseprocurement_quote.rows.add(data).draw();
                                    //purchaseprocurement_quote.draw();
                                }
                                
                            }
                        });
                        
                        purchaseprocurement_request.on('dblclick', 'tr', function() {
                            selectedrow.purchase_resquest = purchaseprocurement_request.row(this).data();
                            $.blockUI({
                                message: new ModalForm('purchase-request-modal', 'View Purchase Request', { form_method: "POST", form_id: "purchase-request", form_enctype: "application/x-www-form-urlencoded" },
                                    [ 
                                        new Label('purchase-request-requirement', [], [], 'Purchase Requirement' + Required ).render() + new TextArea([], 'purchase-request-requirement', { required: true, rows:10 }).render(),
                                        new Label('purchase-request-by', [], [], 'Purchase Requested By').render() + new Input('text', [ "col-md-4" ], 'purchase-request-by', {}).render()
                                    ],
                                    [ 
                                        new Button(['btn-raised', 'btn-warning'], 'discard', 'Discard').render(), 
                                        new Button(['btn-raised', 'btn-secondary'], 'save', 'Save').render(), 
                                        new Button(['btn-raised', 'btn-success'], 'send-for-approval', 'Send for Approval').render()
                                    ]).render()
                            });
                            //inspired by https://jsfiddle.net/u2cdfsmq/2/
                            $('textarea').on('input', function() {
                                //write a limit
                                $(this).height('auto');
                                $(this).height($(this)[0].scrollHeight + 'px');
                            });
                            $('#purchase-request-requirement').val(selectedrow.purchase_resquest[1] + ' ' + selectedrow.purchase_resquest[1]);
                            $('#purchase-request-by').val(selectedrow.purchase_resquest[0]);
                        });
                        
                        purchaseprocurement_quote.on('click', 'tr', function(){
                            if (!$(this).hasClass("selected")) {
                                purchaseprocurement_quote.$('tr.selected').removeClass("selected");
                                $(this).addClass("selected");
                                selectedrow.purchase_quote = purchaseprocurement_quote.row(this).data();
                                if (purchaseprocurement_quote_lines.rows().data()) {
                                    purchaseprocurement_quote_lines.clear();
                                }
                                purchaseprocurement_quote_lines.rows.add(data).draw();
                            }
                        });
                        
                        $(document).on('click', '#discard', function() {
                            $.unblockUI();
                            $('form')[0].reset();
                            document.body.style.overflowY = "auto";
                            purchaseprocurement_quote.rows.add(data).draw();
                        });
                        
                    }, 1000);
                });
            }, 1000);
        });
        return (
            '<div class="row">' +
                '<div class="col-12">' +
                    '<div class="card">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title text-center"> Purchase Requests </h5>' +
                            new Table('purchase-request', ['table', 'table-bordered', 'table-striped', 'table-hover']).render() +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-12">' +
                    '<div class="card">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title text-center"> Purchase Quotes</h5>' +
                            new Table('purchase-quote', ['table', 'table-bordered', 'table-striped', 'table-hover']).render() +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-12">' +
                    '<div class="card">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title text-center"> Purchase Quote Lines</h5>' +
                            new Table('purchase-quote-lines', ['table', 'table-bordered', 'table-striped', 'table-hover']).render() +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }
}

export default new PurchaseProcurement().render();