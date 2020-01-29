/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import VendorDetailsService from './VendorDetailsService.js';
import Button from '../../elements/Button.js';
import ModalFormCustom from '../../elements/ModalFormCustom.js';
import Label from '../../elements/Label.js';
import Required from '../../elements/Required.js';
import Input from '../../elements/Input.js';
import InputHelp from '../../elements/InputHelp.js';
import TextArea from '../../elements/TextArea.js';
import Select from '../../elements/Select.js';
import NothingSlectedAlert from '../../utils/NothingSelectedAlert.js';

class VendorDetailsController {
    
    static tableAutoUpdate(table) {
        
        setInterval(function() {
            if ( $('#vendordetails').hasClass('active') ) {
                
                table.ajax.reload(null, false);
                
            }
        }, 5000);
        
    }
    
    static tableColumns() {
        
        return new Array(
            { title: "Vendor ID", data: "vendor_id", visible: false },
            { title: "Vendor Code", data: "vendor_code" },
            { title: "Vendor Name", data: "vendor_name" },
            { title: "P.O. Box", data: "vendor_po_box" },
            { title: "Address Line 1", data: "vendor_address_line_1" },
            { title: "Address Line 2", data: "vendor_address_line_2" },
            { title: "City", data: "vendor_city" },
            { title: "Province / State", data: "vendor_province_state" },
            { title: "Country", data: "vendor_country" }
        );
        
    }
    
    static createVendor(swal_text) {
        
        $(document).on('click', '#save', async function() {
            let formData = $('#vendor-creation').serializeArray();
            /* DELETE INPUTPICKER ELEMENTS */
            $('.inputpicker-input').each((index, input) => {
                //inspired by https://stackoverflow.com/questions/51724323/javascript-removing-object-from-array-by-key-value
                formData.splice(formData.findIndex(({name}) => name === input.id), 1);
            });
            /* DELETE UNWANTED ELEMENTS */
            formData.splice(formData.findIndex(({name}) => name === $('#vendor-country').attr("id")), 1);
            formData.splice(formData.findIndex(({name}) => name === $('#vendor-province-state').attr("id")), 1);
            formData.splice(formData.findIndex(({name}) => name === $('#vendor-city').attr("id")), 1);
            
            //empty field errors
            if ( $('#vendor-country').val() && $('#vendor-country').val() && $('#vendor-city').val() ) {
                formData.push({ name: "vendor-country", value: $('#vendor-country').inputpicker('element', $('#vendor-country').val())["country_name"] + " - " + $('#vendor-country').inputpicker('element', $('#vendor-country').val())["country_code"] }, { name: "vendor-province-state", value: $('#vendor-province-state').inputpicker('element', $('#vendor-province-state').val())["province_state_name"] + " - " + $('#vendor-province-state').inputpicker('element', $('#vendor-province-state').val())["province_state_code"] }, { name: "vendor-city", value: $('#vendor-city').inputpicker('element', $('#vendor-city').val())["city_name"] + " - " + $('#vendor-city').inputpicker('element', $('#vendor-city').val())["city_post_code_zip_code"] }, { name: "company", value: window.localStorage.getItem('current_user_company') }, { name: "vendor_contact_persons", value: JSON.stringify(window.vendor_contact_person) }, { name: "vendor_contact_information", value: JSON.stringify(window.vendor_contact_info) }, { name: "_token", value: $('meta[name="csrf-token"]').attr("content") });
            }
            
//            swal_text.innerHTML = `Please fill in required fileds (${Required})`
//            swal({
//                title: "Required Field Empty",
//                content: swal_text,
//                icon: "error",
//                buttons: false
//            })
//            return false;
            
            swal_text.innerHTML = "Vendor: <b>" + $('#vendor-name').val() + "</b>";
            swal({
                title: "Create Vendor?",
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
            }).then(async (createVendor) => {
                if ( createVendor ) {
                    await new VendorDetailsService().vendorCreation(formData).then((response) => {
                        swal_text.innerHTML = "Vendor <b>" + response.vendor_code + "</b> created";
                        if ( response.created ) {
                            swal({
                                icon: "success",
                                title: "Successfully Created",
                                content: swal_text,
                                buttons: false,
                                timer: 3000,
                                closeOnEsc: false,
                                closeOnClickOutside: false
                            }).then(() => {
                                delete window.vendor_contact_person;
                                delete window.vendor_contact_info;
                                $.unblockUI();
                                $('form')[0].reset();
                                document.body.style.overflowY = "auto";
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
        });
        
    }
    
    static selectVendor(vendor_details, selected_row) {
        
        vendor_details.on('click', 'tr', function(event) {
            selected_row.selected_item = vendor_details.row(this).data();
            if ( vendor_details.row(this, { selected: true }).data() === vendor_details.row(this).data() ) {
                event.stopPropagation();
                return false;
            }
        });
        
    }
    
    static viewVendor(vendor_details, selected_row) {
        
        vendor_details.on('dblclick', 'tr', function() {
            selected_row.selected_vendor = vendor_details.row(this).data();
            $.blockUI({
                message: new ModalFormCustom('vendor-card-modal', 'Vendor Card', { form_method: "POST", form_id: "vendor-card", form_enctype: "application/x-www-form-urlencoded" }, 
                [
                    '<div class="row">' +
                        '<div class="col">' +
                            '<div class="form-group">' +
                                new Label("vendor-code", [], [], "Vendor Code").render() +
                                new Input("text", [], "vendor-code", { disabled: true }).render() +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col">' +
                            '<div class="form-group">' +
                                new Label("vendor-name", [], [], "Name" + Required ).render() +
                                new Input("text", [], "vendor-name", { required: true, disabled: true }).render() + new InputHelp('Please enter').render() +
                                new InputHelp("Ex: My Company (Pvt) Ltd").render() +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-md-6">' +
                            '<div class="form-group">' +
                                new Label('vendor-po-box', [], [], 'PO BOX' + Required).render() +
                                new Input('text', [ "col-md-4" ], 'vendor-po-box', { required: true, disabled: true }).render() +
                            '</div>' +
                            '<div class="form-group">' +
                                new Label('vendor-address-line-1', [], [], 'Address Line 1' + Required).render() +
                                new Input('text', [], 'vendor-address-line-1', { required: true, disabled: true }).render() +
                            '</div>' +
                            '<div class="form-group">' +
                                new Label('vendor-address-line-2', [], [], 'Address Line 2').render() +
                                new Input('text', [], 'vendor-address-line-2', { disabled: true }).render() +
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-6">' +
                            '<div class="form-group">' +
                                new Label('vendor-city', [], [], 'City' + Required).render() +
                                new Input('text', [], 'vendor-city', { required: true, disabled: true }).render() +
                            '</div>' +
                            '<div class="form-group">' +
                                new Label('vendor-province-state', [], [], 'Province / State' + Required).render() +
                                new Input('text', [], 'vendor-province-state', { required: true, disabled: true }).render() +
                            '</div>' +
                            '<div class="form-group">' +
                                new Label('vendor-country', [], [], 'Country' + Required).render() +
                                new Input('text', [], 'vendor-country', { required: true, disabled: true }).render() +
                            '</div>' +
                        '</div>' +
                    '</div>'
                ],
                [ 
                    new Button(['btn-raised', 'btn-warning'], 'discard', 'Discard').render(), 
                    new Button(['btn-raised', 'btn-success'], 'save', 'Save').render()
                ]).render()
            });
            $('#vendor-code').val(selected_row.selected_vendor.vendor_code);
            $('#vendor-name').val(selected_row.selected_vendor.vendor_name);
            $('#vendor-po-box').val(selected_row.selected_vendor.vendor_po_box);
            $('#vendor-address-line-1').val(selected_row.selected_vendor.vendor_address_line_1);
            $('#vendor-address-line-2').val(selected_row.selected_vendor.vendor_address_line_2);
            $('#vendor-country').val(selected_row.selected_vendor.vendor_country);
            $('#vendor-province-state').val(selected_row.selected_vendor.vendor_province_state);
            $('#vendor-city').val(selected_row.selected_vendor.vendor_city);
            //vedor contact display
        });
        
    }
    
    tableCreator() {
        
        
        
    }
    
    builder() {
        
        $(document).ready(function(){
            $(document).on("click", "#vendordetails", function(){
                let selected_row = {};
                let swal_text = document.createElement('div');
                swal_text.className = "swal-text text-center";

                let vendor_details = $('#vendor-details').DataTable({
                    info: false,
                    ajax: {
                        url: "vendors?company=" + window.localStorage.getItem('current_user_company'),
                        dataSrc: "vendors"
                    },
                    select: {
                        style: "single"
                    },
                    saveState: true,
                    rowId: "vendor_id",
                    scrollY: window.innerHeight - (document.getElementById('vendor-details').getBoundingClientRect().top + parseInt(window.navbarHeight, 10) + 100),
                    scrollCollapse: true,
                    scroller: true,
                    responsive: true,
                    columns: VendorDetailsController.tableColumns(),
                    dom: "Bfrtip",
                    buttons: [
                        {
                            text: "New",
                            className: "btn btn-raised btn-primary waves-effect waves-light",
                            action: async function() {                            
                                $.blockUI({
                                    message: new ModalFormCustom('new-vendor-modal', 'New - Vendor Card', { form_method: "POST", form_id: "vendor-creation", form_enctype: "application/x-www-form-urlencoded" }, 
                                    [ 
                                        '<div class="row">' +
                                            '<div class="col-md-12">' +
                                                '<div class="row">' +
                                                    '<div class="col">' +
                                                        '<div class="form-group">' +
                                                            new Label("vendor-name", [], [], "Name" + Required).render() +
                                                            new Input("text", [], "vendor-name", { required: true }).render() +
                                                            new InputHelp("Ex: My Company (Pvt) Ltd").render() +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div class="row">' +
                                                    '<div class="col-md-6">' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-po-box', [], [], 'PO BOX' + Required).render() +
                                                            new Input('text', [ "col-md-4" ], 'vendor-po-box', { required: true }).render() +
                                                        '</div>' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-address-line-1', [], [], 'Address Line 1' + Required).render() +
                                                            new Input('text', [], 'vendor-address-line-1', { required: true }).render() +
                                                        '</div>' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-address-line-2', [], [], 'Address Line 2').render() +
                                                            new Input('text', [], 'vendor-address-line-2', {}).render() +
                                                        '</div>' +
                                                    '</div>' +
                                                    '<div class="col-md-6">' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-country', [], [], 'Country' + Required).render() +
                                                            new Input('text', [], 'vendor-country', { required: true }).render() +
                                                        '</div>' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-province-state', [], [], 'Province / State' + Required).render() +
                                                            new Input('text', [], 'vendor-province-state', { required: true }).render() +
                                                        '</div>' +
                                                        '<div class="form-group">' +
                                                            new Label('vendor-city', [], [], 'City' + Required).render() +
                                                            new Input('text', [], 'vendor-city', { required: true }).render() +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div class="row justify-content-center">' +
                                                    '<div class="col-md-6" style="text-align:center">' +
                                                        new Button([ "btn-raised", "btn-info" ], "vendor-contact", "Add Contact Person").render() +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'
                                    ],
                                    [ 
                                        new Button(['btn-raised', 'btn-warning'], 'discard', 'Discard').render(),
                                        new Button(['btn-raised', 'btn-success'], 'save', 'Create').render()
                                    ] ).render()
                                });
                                
                                $("#vendor-country").inputpicker({
                                    data: await new VendorDetailsService().getAllCountries().then((resolve) => { return resolve.countries; }),
                                    fields: [
                                        { name: "country_code", text: 'CODE' },
                                        { name: "country_name", text: 'COUNTRY' }
                                    ],
                                    headShow: true,
                                    fieldText : "country_name",
                                    fieldValue: "country_id",
                                    filterOpen: true,
                                    autoOpen: true
                                });

                                $("#vendor-country").on("change", async function() {
                                    
                                    if ( $("#vendor-province-state").val() ) {
                                        $("#vendor-province-state").val('');
                                    }
                                    
                                    if ( $("#vendor-city").val() ) {
                                        $("#vendor-city").val('');
                                    }
                                    
                                    $("#vendor-province-state").inputpicker({
                                        data: await new VendorDetailsService().getAllProvincesStates($('#vendor-country').val()).then((resolve) => { return resolve.country_provinces_states; }),
                                        fields: [
                                            { name: "province_state_code", text: 'CODE' },
                                            { name: "province_state_name", text: 'PROVINCE | STATE' }
                                        ],
                                        headShow: true,
                                        fieldText : "province_state_name",
                                        fieldValue: "province_state_id",
                                        filterOpen: true,
                                        autoOpen: true
                                    });
                                });
                                
                                $("#vendor-province-state").on("change", async function() {
                                    
                                    if ( $("#vendor-city").val() ) {
                                        $("#vendor-city").val('');
                                    }
                                    
                                    $("#vendor-city").inputpicker({
                                        data: await new VendorDetailsService().getAllCities($('#vendor-province-state').val(), $('#vendor-country').val()).then((resolve) => { return resolve.province_state_cities; }),
                                        fields: [
                                            { name: "city_post_code_zip_code", text: 'CODE' },
                                            { name: "city_name", text: 'CITY' }
                                        ],
                                        headShow: true,
                                        fieldText : "city_name",
                                        fieldValue: "city_id",
                                        filterOpen: true,
                                        autoOpen: true
                                    });
                                });

                                $(document).on("click", "#vendor-contact", function(event) {
                                    event.stopImmediatePropagation();
                                    $('.modal-dialog').css("max-width", "90%");
                                    $('#new-vendor-modal .col-md-12').addClass("col-md-6").removeClass("col-md-12").after(
                                        '<div class="col-md-6 contact-person">' +
                                            '<div class="row">' +
                                                '<div class="col-md-4">' +
                                                    '<div class="form-group">' +
                                                        new Label("vendor-contact-person", [], [], "Contact Person" + Required).render() +
                                                        new Input("text", [], "vendor-contact-person", { required: true }).render() +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="row">' +
                                                '<div class="col">' +
                                                    '<div class="form-group">' +
                                                        new Button([ "btn-raised", "btn-secondary" ], "add-contact", "Add Contact Info").render() +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'
                                    );
                                    $(this).remove();
                                });

                                let addcounter = 0;
                                $(document).on("click", "#add-contact", async function() {
                                    if ($('#vendor-contact-person').val() === "") {
                                        return false;
                                    }

                                    if ($('.vendor-contact-information-type:last').val() === "0" || $('.vendor-contact-information:last').val() === "") {
                                        return false;
                                    }

                                    if ( !$('#done-contact').is(":visible") ) {
                                        $(this).parent().after(
                                            '<div class="row justify-content-end">' +
                                                '<div class="col">' +
                                                    '<div class="form-group text-right">' +
                                                        new Button([ "btn-raised", "btn-info" ], "done-contact", "Done").render() +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>'
                                        );
                                    }

                                    addcounter += 1;
                                    $(this).parent().append(
                                        '<div class="row">' +
                                            '<div class="col-md-4">' +
                                                '<div class="form-group">' +
                                                    new Select([ "vendor-contact-information-type" ], "vendor-contact-information-type" + addcounter, {}, {}, 1).render() +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="col-md-8">' +
                                                '<div class="form-group">' +
                                                    new Label("vendor-contact-information" + addcounter, [], [], "Contact Deatils" + Required).render() +
                                                    new Input("text", [ "vendor-contact-information" ], "vendor-contact-information" + addcounter, { required: true }).render() +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'
                                    );

                                    $('select').SumoSelect({ search: true });
                                    await new VendorDetailsService().getContactTypes().then((response) => {
                                        response.contact_types.map((contact_type, index) => {
                                            $('select.vendor-contact-information-type')[addcounter-1].sumo.add(contact_type.contact_type_id, contact_type.contact_type, index);
                                        });
                                    });
                                });

                                window.vendor_contact_person = [];
                                window.vendor_contact_info = [];
                                $(document).on("click", "#done-contact", function(event) {
                                    if ($('.vendor-contact-information-type:last').val() === "0" || $('.vendor-contact-information:last').val() === "") {
                                        return false;
                                    }
                                    event.stopImmediatePropagation();

                                    window.vendor_contact_person.push({ [ $('#vendor-contact-person').attr("id").replace(/-/g, "_") ]: $('#vendor-contact-person').val() });

                                    $('select.vendor-contact-information-type').each(function(index){
                                        window.vendor_contact_info.push(
                                            {
                                                [ $('#vendor-contact-person').attr("id").replace(/-/g, "_") ]: $('#vendor-contact-person').val(),
                                                [ $($('select.vendor-contact-information-type')[index]).attr("id").replace(/[0-9]/g, "").replace(/-/g, "_") ]: $($('select.vendor-contact-information-type')[index]).val(),
                                                [ $($('input.vendor-contact-information')[index]).attr("id").replace(/[0-9]/g, "").replace(/-/g, "_") ]: $($('input.vendor-contact-information')[index]).val()
                                            }
                                        );
                                    });

                                    if ( !$('#contact-person').is(":visible") ) {
                                        $('.contact-person').append(
                                            '<div id="contact-person">' +
                                                '<h3>' + $('#vendor-contact-person').val() + '</h3>' +
                                                '<div>' +
                                                    '<ul>' +
                                                        $('select.vendor-contact-information-type').map(function(index){
                                                            return '<li>' + $($('select.vendor-contact-information-type option:selected')[index]).text() + ': ' + $($('input.vendor-contact-information')[index]).val() + '</li>';
                                                        }).get().join('') +
                                                    '</ul>' +
                                                '</div>' +
                                            '</div>'
                                        ).children().not("div#contact-person").remove();
                                    } else {
                                        $('#contact-person').accordion("destroy");
                                        $('#contact-person').append(
                                            '<h3>' + $('#vendor-contact-person').val() + '</h3>' +
                                            '<div>' +
                                                '<ul>' +
                                                        $('select.vendor-contact-information-type').map(function(index){
                                                            return '<li>' + $($('select.vendor-contact-information-type option:selected')[index]).text() + ': ' + $($('input.vendor-contact-information')[index]).val() + '</li>';
                                                        }).get().join('') +
                                                '</ul>' +
                                            '</div>'
                                        );
                                        $('.contact-person:last').remove();
                                    }

                                    let icons = {
                                        header: "ui-icon-circle-arrow-e",
                                        activeHeader: "ui-icon-circle-arrow-s"
                                    };

                                    $('#contact-person').accordion({ collapsible: true, icons: icons });

                                    if ( !$("#vendor-contact-add").is(":visible") ) {
                                        $(  '<div class="row justify-content-center">' +
                                                '<div class="col-md-6 text-center">' +
                                                    new Button([ "btn-raised", "btn-info" ], "vendor-contact-add", "Add Another Contact Person").render() +
                                                '</div>' +
                                            '</div>'
                                        ).insertAfter($('#vendor-country').parents(".row:first"));
                                    }
                                    addcounter = 0;
                                });

                                $(document).on("click", "#vendor-contact-add", function(event) {
                                    event.stopImmediatePropagation();
                                    $('#contact-person').after(
                                        '<div class="col-md-12 contact-person">' +
                                            '<div class="row">' +
                                                '<div class="col-md-4">' +
                                                    '<div class="form-group">' +
                                                        new Label("vendor-contact-person", [], [], "Contact Person" + Required).render() +
                                                        new Input("text", [], "vendor-contact-person", { required: true }).render() +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="row">' +
                                                '<div class="col">' +
                                                    '<div class="form-group">' +
                                                        new Button([ "btn-raised", "btn-secondary" ], "add-contact", "Add Contact Info").render() +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'
                                    );
                                    $(this).remove();
                                });
                            }
                        },
                        {
                            text: "Vendor Transactions",
                            className: "btn btn-raised btn-info waves-effect waves-light",
                            action: function() {
                                if ( selected_row.selected_vendor ) {
//                                        $.blockUI({
//                                            //message: new ModalForm('vendor-transactions-modal', 'Vendor Transactions', { form_method: "POST", form_id: "vendor-details", form_enctype: "application/x-www-form-urlencoded" }, [ Label('purchase-request-requirement', [], [], 'Purchase Requirement' + Required ) + TextArea([], 'purchase-request-requirement', { required: true, rows:10 }), Label('purchase-request-by', [], [], 'Purchase Requested By') + Input('text', [], 'purchase-request-by', {}) ], [ Button(['btn-raised', 'btn-warning'], 'discard', 'Discard'), Button(['btn-raised', 'btn-secondary'], 'save', 'Save'), Button(['btn-raised', 'btn-success'], 'send-for-approval', 'Send for Approval') ] ).render()
//                                        });
                                } else {
                                    new NothingSlectedAlert().render();
                                }
                            }
                        }
                    ]
                });

                VendorDetailsController.selectVendor(vendor_details, selected_row);
                VendorDetailsController.tableAutoUpdate(vendor_details);
                VendorDetailsController.createVendor(swal_text);
                VendorDetailsController.viewVendor(vendor_details, selected_row);

                $(document).on('click', '#discard', function() {
                    delete window.vendor_contact_person;
                    delete window.vendor_contact_info;
                    $.unblockUI();
                    $('form')[0].reset();
                    document.body.style.overflowY = "auto";
                });

                //fixing a bug with datatables scrollY when on firefox
                if (Browser.name === "firefox") {
                    $('div.dataTables_scrollBody').css('padding-right', "6px");
                }
            });
        });
        
    }
    
}

export default new VendorDetailsController().builder();