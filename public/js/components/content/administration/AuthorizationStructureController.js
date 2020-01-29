/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import AuthorizationStructureService from './AuthorizationStructureService.js';
import Button from '../../elements/Button.js';
import Table from '../../elements/Table.js';
import CheckBoxInline from '../../elements/CheckBoxInline.js';
import Select from '../../elements/Select.js';
import SelectLabel from '../../elements/SelectLabel.js';
import Label from '../../elements/Label.js';
import Input from '../../elements/Input.js';
import Required from '../../elements/Required.js';
import NothingSlectedAlert from '../../utils/NothingSelectedAlert.js';
import ModalFormCustom from '../../elements/ModalFormCustom.js';

class AuthorizationStructureController {
    
    constructor() {
        
    }
    
    getAuthorizationStructures(company) {
        
        return new Promise(async (resolve) => {
            resolve(await new AuthorizationStructureService(company).getAuthorizationStructures());
        });
        
    }
    
    static isSequential(sequential, index, option, criteria, container, edit) {
                    
            container.append(
                new CheckBoxInline([], { disabled: true, [ `${ (function(){ if ( sequential ) { return "checked"; } else { return ""; } })() }` ]: (function(){ if ( sequential ) { return true; } else { return null; } })() }, "authorization-optional", 1, "Sequential Approval").render() +
                new SelectLabel("Criteria Option").render() + 
                new Select([ `${ (function(){ if ( edit ) { return "edit-"; } else { return ""; } })() }` + "authorization-criteria-option-" + index + "-" + option ], `${ (function(){ if ( edit ) { return "edit-"; } else { return ""; } })() }` + "authorization-criteria-option-" + index + "-" + option, { required: true }, { "": "Please Select", "<": "Less Than", ">": "Greater Than", "=": "Equal" }, 1).render()
            );

            $('select').SumoSelect();
            $('select.' + `${ (function(){ if ( edit ) { return 'edit-'; } else { return ''; } })() }` + 'authorization-criteria-option-' + index + '-' + option)[0].sumo.selectItem(criteria);
            $('select.' + `${ (function(){ if ( edit ) { return 'edit-'; } else { return ''; } })() }` + 'authorization-criteria-option-' + index + '-' + option)[0].sumo.disable();
        
    }
    
    static isSequentialColumns(sequential) {
        
        let columns = new Array(
            { title: "Record ID", visible: false },
            { title: "User ID", visible: false },
            { title: "User Name" },
            { title: "Sequence",  className: "text-center" }
        );
        
        if ( !sequential ) {
            
            columns[3]['visible'] = false;
            
        }
        
        return columns;
        
    }
    
    static isSequentialNewRow(sequential, currenttable, authorizationstructure_administration_addcounter = 0) {
        
        let lastrow = currenttable.row(':last', { order: 'applied' }).data();
        if (lastrow !== undefined) {
            if (!lastrow.every(element => $("#" + $(element).attr("id")).val() !== "")) {
                return false;
            }
        }
        
        let new_row = new Array(
            null,
            null,
            new Input("text", [], "user-name" + authorizationstructure_administration_addcounter, { required: true }).render(),
            new Input("text", [], "authorization-structure-sequence" + authorizationstructure_administration_addcounter, { required: true }).render()
        );

        if ( !sequential ) {
            
            new_row[3] = null;
            
        }
        
        authorizationstructure_administration_addcounter += 1;
        currenttable.row.add(new_row).order([ 1, "asc" ]).draw(false).node();
        
    }
    
    static tableEditor() {
        
        
        
    }
    
    static tableCreator(criteria, sequential, index, table_criteria, selected_row) {
                
        table_criteria.each(function(option) {
            $('#authorization-structure-' + index + '-' + option[1]).DataTable({
                paging: false,
                info: false,
                data: option[3],
                searching: false,
                ordering: false,
                responsive: true,
                processing: true,
                columns: AuthorizationStructureController.isSequentialColumns(sequential),
                dom: "Bfrtip",
                buttons: [
                    {
                        text: "Edit",
                        className: "btn btn-raised btn-info waves-effect waves-light",
                        action: function() {
                            $.blockUI({
                                message: new ModalFormCustom('edit-authorization-structure-modal', 'Edit Authorization Structure', { form_method: "POST", form_id: "edit-authorization-structure", form_enctype: "application/x-www-form-urlencoded" },
                                [
                                    '<div class="row">' +
                                        '<div class="col-md-12">' +
                                            '<div class="form-group">' +
                                                new Label("authorization-structure-name", [], [], "Authorization Structure Name" + Required).render() +
                                                new Input("text", [], "authorization-structure-name", { required: true }).render() +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="row">' +
                                        '<div class="col-md-12">' +
                                            '<div class="form-group">' +
                                                new Label("authorization-structure-criteria", [], [], "Authorization Structure Criteria" + Required).render() +
                                                new Input("text", [], "authorization-structure-criteria", { required: true }).render() +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="row">' +
                                        '<div class="col-md-12">' +
                                                new Table("authorization-structure-user-administration", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                        '</div>' +
                                    '</div>'
                                ],
                                [
                                    new Button([ "btn-raised", "btn-danger" ], "discard", "Discard").render(),
                                    new Button([ "btn-raised", "btn-success" ], "commit", "Commit").render()
                                ]).render()
                            });

                            $('#authorization-structure-name').val($('#' + this.table().node().id).parents(".ui-accordion-content").siblings("h3.ui-accordion-header").text().replace("Authorization Optional", "")).attr("disabled", true);
                            $('#authorization-structure-criteria').val($('#auth-criteria-' + index).text()).attr("disabled", true);

                            let authorizationstructure_administration = $('#authorization-structure-user-administration').DataTable({
                                paging: false,
                                info: false,
                                data: this.table().data().toArray(),
                                searching: false,
                                ordering: false,
                                responsive: true,
                                processing: true,
                                columns: AuthorizationStructureController.isSequentialColumns(sequential),
                                dom: "Bfrtip",
                                buttons: [
                                    {
                                        text: "Add",
                                        className: "btn btn-raised btn-primary waves-effect waves-light",
                                        action: function() {
                                            AuthorizationStructureController.isSequentialNewRow(sequential, this.table());
                                        }
                                    },
                                    {
                                        text: "Delete",
                                        className: "btn btn-raised btn-danger waves-effect waves-light",
                                        action: function() {
                                            if (selected_row.authorizationstructure_administration) {
                                                console.log("deleted")
                                            } else {
                                                new NothingSlectedAlert().render();
                                            }
                                        }
                                    }
                                ],
                                initComplete: function() {
                                    AuthorizationStructureController.isSequential(sequential, index, option[1], option[2], this.api().buttons().container(), true);
                                }
                            });
                            authorizationstructure_administration.on("click", "tr", function() {
                                if (!$(this).hasClass("selected")) {
                                    authorizationstructure_administration.$("tr.selected").removeClass("selected");
                                    $(this).addClass("selected");
                                    selected_row.authorizationstructure_administration = authorizationstructure_administration.row(this).data();
                                }
                            });
                        }
                    }
                ],
                initComplete: function() {
                    AuthorizationStructureController.isSequential(sequential, index, option[1], option[2], this.api().buttons().container(), false);
                }
            });
        });
        
    }
    
    tabActive (authorization_structures) {
        
        let selected_row = {};
        
        $('#administration-tabs').on('tabsactivate', function(event, ui) {
            switch ( $(ui.newPanel).attr("id") ) {
                case "authorizationstructure": {
                    $(ui.newPanel).html(
                        '<div class="tab-btn-container">' +
                            new Button([ "btn-raised", "btn-primary" ], "new-" + $(ui.newPanel).attr("id"), "New").render() +
                        '</div>' +
                        '<div class="row">' +
                            authorization_structures.authorizationstructure.map(function(structure) {
                                return (
                                    '<div class="col-md-6">' +
                                        '<div id="structure-' + structure[0] + '">' +
                                            '<h3>' + structure[1] + '</h3>' +
                                            '<div>' +
                                                '<div class="row">' +
                                                    '<div class="col-md-12">' +
                                                        'Authorization Criteria: <div id="auth-criteria-' + structure[0] + '" style="display:inline">' + new Intl.NumberFormat( "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format(Number(structure[3])) + '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                                    structure[4].map(function(option) {
                                                        return (
                                                            '<div class="row">' +
                                                                '<div class="col-md-12">' +
                                                                    new Table("authorization-structure-" + structure[0] + "-" + option[1], [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                                                '</div>' +
                                                            '</div>'
                                                        );
                                                    }).join('') +
                                            '</div>' +
                                        '</div>' +
                                    '</div>'
                                );
                            }).join('') +
                        '</div>'
                    );
                    authorization_structures.authorizationstructure.each(function(data) {
                        $('div#structure-' + data[0]).accordion({ collapsible: true, active: false, heightStyle: "content" });
                        
                        AuthorizationStructureController.tableCreator(Number(data[3]), data[2], data[0], data[4], selected_row);
                    });
                };
                break;
            }
        });
        
    }
    
    newAuthorizationStructure() {
        
        $(document).on("click", "#new-authorizationstructure", function() {
            $.blockUI({
                message: new ModalFormCustom("new-authorization-structure-modal", "New Authorization Structure", { form_method: "POST", form_id: "authorization-structure", form_enctype: "application/x-www-form-urlencoded" },
                [
                    '<div class="row">' +
                        '<div class="col-md-12">' +
                            '<div class="form-group">' +
                                new Label("authorization-structure-name", [], [], "Authorization Structure Name" + Required).render() +
                                new Input("text", [], "authorization-structure-name", { required: true }).render() +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-md-4">' +
                            '<div class="form-group">' +
                                new Label("authorization-criteria", [], [], "Authorization Criteria" + Required).render() +
                                new Input("text", [], "authorization-criteria", { required: true }).render() +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-md-12">' +
                                new Table("authorization-structure-personnel-administration", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                        '</div>' +
                    '</div>'
                ],
                [
                    new Button([ "btn-raised", "btn-danger" ], "discard", "Discard").render(),
                    new Button([ "btn-raised", "btn-success" ], "commit", "Commit").render()
                ]).render()
            });

            let authorizationstructurepersonneladdcounter = 0;
            let authorizationstructurepersonnel = $("#authorization-structure-personnel-administration").DataTable({
                paging: false,
                info: false,
                searching: false,
                scrollY: 225,
                scrollCollapse:true,
                responsive: true,
                processing: true,
                columns: [
                    { title: "Authorizer" },
                    { title: "Sequence" }
                ],
                dom: "Bfrtip",
                buttons: [
                    {
                        text: "Add",
                        className: "btn btn-raised btn-info waves-effect waves-light",
                        action: function() {
                            let currenttable = this.table();
                            let lastrow = currenttable.row(':last', { order: 'applied' }).data();
                            if (lastrow !== undefined) {
                                if ($("#" + $(`${lastrow}`)[0].id).val() === "") {
                                    return false;
                                }
                            }

                            authorizationstructurepersonneladdcounter += 1;
                            currenttable.row.add([ 
                                new Input("text", [], "user-name" + authorizationstructurepersonneladdcounter, { required: true }).render(),
                                new Input("text", [], "authorization-structure-personel-sequence" + authorizationstructurepersonneladdcounter, { required: true }).render()
                            ]).draw(false).node();
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
                    let currenttable = $(this).closest(".row");
                    this.api().buttons().container().append(
                        new CheckBoxInline([], {}, "authorization-optional", 1, "Sequential Approval").render() +
                        new SelectLabel("Criteria Option").render() + 
                        new Select([ "authorization-criteria-option" ], "authorization-criteria-option", { required: true }, { "": "Please Select", "<": "Less Than", ">": "Greater Than", "=": "Equal" }, 1).render()
                    );
                    $('select').SumoSelect();
                    $('select.authorization-criteria-option').change(function() {
                        if ($(this).val() === "<" || $(this).val() === ">") {
                            if ($('#authorization-structure-personnel-administration-option')) {
                                $('#authorization-structure-personnel-administration-option').closest(".row").remove();
                            }
                            currenttable.after(
                                '<div class="row">' +
                                    '<div class="col-md-12">' +
                                        new Table("authorization-structure-personnel-administration-option", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                    '</div>' +
                                '</div>'
                            );

                            let authorizationstructurepersonneloptionaddcounter = 0;
                            let authorizationstructurepersonneladministrationoption = $('#authorization-structure-personnel-administration-option').DataTable({
                                paging: false,
                                info: false,
                                searching: false,
                                scrollY: 225,
                                scrollCollapse:true,
                                responsive: true,
                                processing: true,
                                columns: [
                                    { title: "Authorizer" },
                                    { title: "Sequence" }
                                ],
                                dom: "Bfrtip",
                                buttons: [
                                    {
                                        text: "Add",
                                        className: "btn btn-raised btn-info waves-effect waves-light",
                                        action: function() {
                                            let currenttable = this.table();
                                            let lastrow = currenttable.row(':last', { order: 'applied' }).data();
                                            if (lastrow !== undefined) {
                                                if ($("#" + $(`${lastrow}`)[0].id).val() === "") {
                                                    return false;
                                                }
                                            }

                                            authorizationstructurepersonneloptionaddcounter += 1;
                                            currenttable.row.add([ 
                                                new Input("text", [], "user-name" + authorizationstructurepersonneloptionaddcounter, { required: true }).render(),
                                                new Input("text", [], "authorization-structure-personel-sequence" + authorizationstructurepersonneloptionaddcounter, { required: true }).render()
                                            ]).draw(false).node();
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
                                        new CheckBoxInline([], {}, "authorization-optional-option", 1, "Sequential Approval").render() +
                                        new SelectLabel("Option").render() + 
                                        new Select([ "authorization-criteria-option-option" ], "authorization-criteria-option-option", { required: true }, { "": "Please Select", "<": "Less Than", ">": "Greater Than", "=": "Equal" }, 1).render()
                                    );
                                    $('select').SumoSelect();
                                    //check ajax and update table sturctures
                                }
                            });
                        } else {
                            if ($('#authorization-structure-personnel-administration-option')) {
                                $('#authorization-structure-personnel-administration-option').closest(".row").remove();
                            }
                        }
                    });
                }
            });
        });
        
    }
    
    builder() {
        
        $(document).ready(() => {
            $(document).on("click", "#administration", async () => {
                let authorization_structures = await this.getAuthorizationStructures(window.localStorage.getItem('current_user_company')).then((resolve) => {
                    return resolve;
                });
                this.tabActive(authorization_structures);
                this.newAuthorizationStructure();
            });
        });
        
    }
    
}

export default new AuthorizationStructureController().builder();