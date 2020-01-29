/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import PurchaseGroupService from './PurchaseGroupService.js';
import Button from '../../elements/Button.js';
import Table from '../../elements/Table.js';
import CheckBoxInline from '../../elements/CheckBoxInline.js';
import Label from '../../elements/Label.js';
import Input from '../../elements/Input.js';
import Required from '../../elements/Required.js';
import NothingSlectedAlert from '../../utils/NothingSelectedAlert.js';
import ModalFormCustom from '../../elements/ModalFormCustom.js';

class PurchaseGroupController {
    
    getPurchaseGroups(company) {
        
        return new Promise(async (resolve) => {
            resolve(await new PurchaseGroupService().getPurchaseGroups(company));
        });
        
    }
    
    static isSequential(sequential, container, index) {
        //refactor
        if ( sequential ) {
        
            container.append(
                new CheckBoxInline([], { checked: true, disabled: true }, `purchase-group-approval-optional-${index}`, 1, "Sequential Approval").render()
            );
            
        } else {
            
            container.append(
                new CheckBoxInline([], { disabled: true }, `purchase-group-approval-optional-${index}`, 1, "Sequential Approval").render()
            );
            
        }
        
    }
    
    static isSequentialColumns(sequential, edit) {
        
        let columns = new Array(
            { title: "Record ID", visible: false },
            { title: "User ID", visible: false },
            { title: "User Name" },
            { title: "Is Approver", className: "approver text-center", render: function(data, type, row) {
                    if ( data === 1 ) {
                        return new CheckBoxInline([], { checked: true, [ `${ (function() { if (edit) { return ""; } else { return "disabled"; } })() }` ]: (function(){ if (edit) { return null; } else { return true; } })() }, "approver", "", "").render();
                    } else {
                        return new CheckBoxInline([], { [ `${ (function() { if (edit) { return ""; } else { return "disabled"; } })() }` ]: (function(){ if (edit) { return null; } else { return true; } })() }, "approver", "", "").render();
                    }
                }
            },
            { title: "Is Leader", className: "leader text-center", render: function(data, type, row) {
                    if ( data === 1 ) {
                        return new CheckBoxInline([], { checked: true, [ `${ (function() { if (edit) { return ""; } else { return "disabled"; } })() }` ]: (function(){ if (edit) { return null; } else { return true; } })() }, "leader", "", "").render();
                    } else {
                        return new CheckBoxInline([], { [ `${ (function() { if (edit) { return ""; } else { return "disabled"; } })() }` ]: (function(){ if (edit) { return null; } else { return true; } })() }, "leader", "", "").render();
                    }
                }
            }
        );
        
        if ( sequential ) {
            
            columns.push({ title: "Sequence",  className: "text-center" });
            
        }
        
        return columns;

    }
    
    static tableEditor(table_element, sequential, selected_row, purchasegroup_administration_addcounter = 0) {
        //refactor
        return $('#purchase-group-user-administration').DataTable({
            paging: false,
            info: false,
            data: table_element.table().data().toArray(),
            searching: false,
            ordering: false,
            responsive: true,
            processing: true,
            columns: PurchaseGroupController.isSequentialColumns(sequential, true),
            dom: "Bfrtip",
            buttons: [
                {
                    text: "Add",
                    className: "btn btn-raised btn-primary waves-effect waves-light",
                    action: function() {
                        //let users = new PurchaseGroupService().getUnAssignedPurchaseGroupUsers().then((response) => { return response.users; });
                        
                        let currenttable = this.table();
                        let lastrow = currenttable.row(':last', { order: 'applied' }).data();
                        if (lastrow !== undefined) {
                            if (!lastrow.every(element => $("#" + $(element).attr("id")).val() !== "")) {
                                return false;
                            }
                        }

                        purchasegroup_administration_addcounter += 1;

                        if ( sequential ) { 

                            currenttable.row.add([
                                null,
                                null,
                                new Input("text", [], "user-name" + purchasegroup_administration_addcounter, { required: true }).render(),
                                new CheckBoxInline([], {}, "purchase-group-approver" + purchasegroup_administration_addcounter, 0, "").render(),
                                new CheckBoxInline([], {}, "purchase-group-leader" + purchasegroup_administration_addcounter, "", "").render(),
                                new Input("text", [], "purchase-group-approver-sequence" + purchasegroup_administration_addcounter, {}).render()
                            ]).order([ 1, "asc" ]).draw(false).node();

                        } else {

                            currenttable.row.add([
                                null,
                                null,
                                new Input("text", [], "user-name" + purchasegroup_administration_addcounter, { required: true }).render(),
                                new CheckBoxInline([], {}, "purchase-group-approver" + purchasegroup_administration_addcounter, 0, "").render(),
                                new CheckBoxInline([], {}, "purchase-group-leader" + purchasegroup_administration_addcounter, "", "").render()
                            ]).order([ 1, "asc" ]).draw(false).node();

                        }

                    }
                },
                {
                    text: "Delete",
                    className: "btn btn-raised btn-danger waves-effect waves-light",
                    action: function() {
                        if (selected_row.purchasegroup_administration) {
                            console.log("deleted")
                        } else {
                            new NothingSlectedAlert().render();
                        }
                    }
                }
            ],
            initComplete: function() {
                PurchaseGroupController.isSequential(sequential, this.api().buttons().container(), 'edit');
            }
        });
        
    }
    
    static tableCreator(sequential , index, tableData, selected_row) {
        //refactor
        return $('#purchase-group-' + index).DataTable({
            paging: false,
            info: false,
            data: tableData,
            searching: false,
            ordering: false,
            responsive: true,
            processing: true,
            columns: PurchaseGroupController.isSequentialColumns(sequential, false),
            dom: "Bfrtip",
            buttons: [
                {
                    text: "Edit",
                    className: "btn btn-raised btn-info waves-effect waves-light",
                    action: function() {
                        delete selected_row.purchasegroup_administration;

                        $.blockUI({
                            message: new ModalFormCustom('edit-purchase-group-modal', 'Edit Purchase Group', { form_method: "POST", form_id: "edit-purchase-group", form_enctype: "application/x-www-form-urlencoded" },
                            [
                                '<div class="row">' +
                                    '<div class="col-md-12">' +
                                        '<div class="form-group">' +
                                            new Label("purchase-group-name", [], [], "Purchase Group Name" + Required).render() +
                                            new Input("text", [], "purchase-group-name", { required: true }).render() +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="col-md-12">' +
                                            new Table("purchase-group-user-administration", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                    '</div>' +
                                '</div>'
                            ],
                            [
                                new Button([ "btn-raised", "btn-danger" ], "discard", "Discard").render(),
                                new Button([ "btn-raised", "btn-success" ], "commit", "Commit").render()
                            ]).render()
                        });

                        $('#purchase-group-name').val($('#' + this.table().node().id).parents(".ui-accordion-content").siblings("h3.ui-accordion-header").text().replace("Approval Optional", "")).attr("disabled", true);

                        let purchasegroup_administration = PurchaseGroupController.tableEditor(this, sequential, selected_row);

                        purchasegroup_administration.on("click", "tr", function() {
                            if (!$(this).hasClass("selected")) {
                                purchasegroup_administration.$("tr.selected").removeClass("selected");
                                $(this).addClass("selected");
                                selected_row.purchasegroup_administration = purchasegroup_administration.row(this).data();
                            }
                        });
                    }
                }
            ],
            initComplete: function() {
                PurchaseGroupController.isSequential(sequential, this.api().buttons().container(), index);
            }
        });
        
    }
    
    tabCreator(purchase_groups) {
        
        let selected_row = {};
        
        $('#administration-tabs').tabs({
            create: function(event, ui) {
                $(ui.panel).html(
                    '<div class="tab-btn-container">' +
                        new Button([ "btn-raised", "btn-primary" ], "new-" + $(ui.panel).attr("id"), "New").render() +
                    '</div>' +
                    '<div class="row">' +
                        purchase_groups.purchasegroup.map(function (group) {
                            return (
                                '<div class="col-md-6">' +
                                    '<div id="' + group[0] + '">' +
                                        '<h3>' + group[1] + '</h3>' +
                                        '<div>' +
                                            new Table("purchase-group-" + group[0], [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                            '<div class="row">' +
                                                '<div class="col-md-6">' +
                                                    "Authorization Structure:<br />" + group[3] +
                                                '</div>' +
                                                '<div class="col-md-6 text-right">' +
                                                    "Auth. Criteria:<br />" + new Intl.NumberFormat( "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format(Number(group[4])) +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'
                            );
                        }).join('') +
                    '</div>'
                );
                purchase_groups.purchasegroup.each(function(data) {
                    $('div#' + data[0]).accordion({ collapsible: true, active: false, heightStyle: "content" });
                    
                    PurchaseGroupController.tableCreator(data[2], data[0], data[5], selected_row);
                });
            }
        });
        
    }
    
    tabActive(purchase_groups) {
        //revisit
        $('#administration-tabs').on('tabsactivate', function(event, ui) {
            switch ( $(ui.newPanel).attr("id") ) {
                case "purchasegroup": {
                    new PurchaseGroupController().tabCreator(purchase_groups);
                };
                break;
            }
        });
        
    }
    
    newPurchaseGroup(assinged_users = []) {
        //refactor
        $(document).on("click", "#new-purchasegroup", function() {
            $.blockUI({
                message: new ModalFormCustom('new-purchase-group-modal', 'New Purchase Group', { form_method: "POST", form_id: "purchase-group", form_enctype: "application/x-www-form-urlencoded" },
                [
                    '<div class="row">' +
                        '<div class="col-md-12">' +
                            '<div class="form-group">' +
                                new Label("purchase-group-name", [], [], "Purchase Group Name" + Required).render() +
                                new Input("text", [], "purchase-group-name", { required: true }).render() +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-md-12">' +
                                new Table("purchase-group-user-administration", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                        '</div>' +
                    '</div>'
                ],
                [
                    new Button([ "btn-raised", "btn-danger" ], "discard", "Discard").render(),
                    new Button([ "btn-raised", "btn-success" ], "commit", "Commit").render()
                ]).render()
            });

            let purchasegroupuseraddcounter = 0;
            let purchasegroupuser = $("#purchase-group-user-administration").DataTable({
                paging: false,
                info: false,
                searching: false,
                scrollY: 225,
                scrollCollapse:true,
                responsive: true,
                processing: true,
                columns: [
                    { title: "User Name", className: "user" },
                    { title: "Is Approver", className: "approver" },
                    { title: "Is Leader", className: "leader" },
                    { title: "Sequence", className: "sequence", visible: false }
                ],
                dom: "Bfrtip",
                buttons: [
                    {
                        text: "Add",
                        className: "btn btn-raised btn-info waves-effect waves-light",
                        action: async function() {
                            let users = await new PurchaseGroupService().getUnAssignedPurchaseGroupUsers(null, window.localStorage.getItem('current_user_company')).then(response => { return response.users; });

                            let currenttable = this.table();
                            let lastrow = currenttable.row(':last', { order: 'applied' }).data();
                            if (lastrow !== undefined) {
                                if ($("#" + $(`${lastrow}`)[0].id).val() === "") {
                                    return false;
                                }
                            }
                            
                            purchasegroupuseraddcounter += 1;
                            currenttable.row.add([ 
                                new Input("text", [], "user-name" + purchasegroupuseraddcounter, { required: true }).render(),
                                new CheckBoxInline([], {}, "purchase-group-approver" + purchasegroupuseraddcounter, 1, "").render(),
                                new CheckBoxInline([], {}, "purchase-group-leader" + purchasegroupuseraddcounter, 1, "").render(),
                                new Input("text", [], "purchase-group-approver-sequence" + purchasegroupuseraddcounter, { disabled: true }).render()
                            ]).draw(false).node();
                            
                            let current_assinged_users = currenttable.columns(".user").data().toArray();
                            
                            current_assinged_users[0].each((cell, index) => {
                                current_assinged_users[index] = $('#' + $(cell).attr("id")).val();
                                if ( $('#' + $(cell).attr("id")).val() === "" ) {
                                    current_assinged_users.splice(index, 1);
                                }
                            });
                            
                            users = users.filter(value => !current_assinged_users.includes(value));
                            
                            $('#user-name' + purchasegroupuseraddcounter).inputpicker({
                                data: users,
                                filterOpen: true,
                                autoOpen: true
                            });
                            
                            let interval = setInterval(function () {
                                if ( $('#inputpicker-wrapped-list').is(":visible") ) {
                                    $('#inputpicker-wrapped-list').addClass("user-inputpicker");
                                    $('.user-inputpicker:first').attr("style", `${$('.user-inputpicker:first').attr("style")};width: ${$('.inputpicker-div').css("width")} !important`);
                                }
                                if ( !$('#administration').hasClass("active") ) {
                                    clearInterval(interval);
                                }
                            }, 100);
                        }
                    },
                    {
                        text: "Remove",
                        className: "btn btn-raised btn-danger waves-effect waves-light",
                        action: function() {
                            console.log("Remove")
                        }
                    }
                ],
                initComplete: function() {
                    this.api().buttons().container().append(
                        new CheckBoxInline([], {}, "purchase-group-approval-optional", 1, "Sequential Approval").render()
                    );
                },
                drawCallback: function() {
                    if ( this.api().rows().count() ) {
                        $("#purchase-group-approval-optional").attr("disabled", true);
                    } else {
                        $("#purchase-group-approval-optional").removeAttr("disabled");
                    }
                }
            });
            
            $(document).on("click", '#purchase-group-approver' + purchasegroupuseraddcounter,function(event) {
                event.stopImmediatePropagation();
                if ( $("#purchase-group-approver" + purchasegroupuseraddcounter).siblings().children(".check").hasClass("is-checked") ) {
                    $("#purchase-group-approver" + purchasegroupuseraddcounter).siblings().children(".check").removeClass("is-checked");
                    $("#purchase-group-approver-sequence" + purchasegroupuseraddcounter).val("");
                    $("#purchase-group-approver-sequence" + purchasegroupuseraddcounter).attr("disabled", true);
                } else {
                    $("#purchase-group-approver" + purchasegroupuseraddcounter).siblings().children(".check").addClass("is-checked");
                    $("#purchase-group-approver-sequence" + purchasegroupuseraddcounter).removeAttr("disabled");
                }
            });

            $('#purchase-group-leader' + purchasegroupuseraddcounter).on("click", function() {
                if ( $("#purchase-group-leader" + purchasegroupuseraddcounter).siblings().children(".check").hasClass("is-checked") ) {
                    $("#purchase-group-leader" + purchasegroupuseraddcounter).siblings().children(".check").removeClass("is-checked");
                } else {
                    $("#purchase-group-leader" + purchasegroupuseraddcounter).siblings().children(".check").addClass("is-checked");
                }
            });
            
            $(document).on("click", "#purchase-group-approval-optional", (event) => {
                event.stopImmediatePropagation();
                if ( $("#purchase-group-approval-optional").siblings().children(".check").hasClass("is-checked") ) {
                    $("#purchase-group-approval-optional").siblings().children(".check").removeClass("is-checked");
                    purchasegroupuser.columns(".sequence").every(function() {
                        this.visible(false);
                    });
                } else {
                    $("#purchase-group-approval-optional").siblings().children(".check").addClass("is-checked");
                    purchasegroupuser.columns(".sequence").every(function() {
                        this.visible(true);
                    });
                }
            });
            
            $(document).on("click", "#commit", function() {
                let new_purchase_group_users = purchasegroupuser.rows().data().toArray();
                if ( $("#purchase-group-approval-optional").siblings().children(".check").hasClass("is-checked") ) {
                    new_purchase_group_users.each((row) => {
                        let index = row.length;
                        while ( index >= 0 ) {
                            if ( $('#' + $(row[ index ]).attr("id")).val() !== undefined && $('#' + $(row[ index ]).attr("id")).val() !== "null" ) {
                                //row[ index ] = { [ $(row [ index ]).attr("name").replace(/[0-9]/g, '').replace(/-/g, '_') ] : (() => {  })() };
                            }
                            index--;
                        }
                    });
                } else {
                    
                }
            });
        });
        
    }
    
    builder() {
        
        $(document).ready(() => {
            $(document).on("click", "#administration", async () => {
                let purchase_groups = await this.getPurchaseGroups(window.localStorage.getItem('current_user_company')).then((resolve) => {
                    return resolve;
                });
                this.tabCreator(purchase_groups);
                this.tabActive(purchase_groups);
                this.newPurchaseGroup();
            });
        });
        
    }
    
}

export default new PurchaseGroupController().builder();