/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import UserManagementService from './UserManagementService.js';
import Table from '../../elements/Table.js';
import CheckBoxInline from '../../elements/CheckBoxInline.js';
import Input from '../../elements/Input.js';
import NothingSlectedAlert from '../../utils/NothingSelectedAlert.js';

class UserManagementController {
    
    getUserManagement(company) {
        
        return new Promise(async (resolve) => {
            resolve(await new UserManagementService(company).getUserManagement());
        });
        
    }
    
    static addUser(currenttable, usermanagement_administration_addcounter = 0) {
        
        let lastrow = currenttable.row(':last', { order: 'applied' }).data();
        if (lastrow !== undefined) {
            if (!lastrow.every(element => $("#" + $(element).attr("id")).val() !== "")) {
                return false;
            }
        }

        usermanagement_administration_addcounter += 1;
        currenttable.row.add([ 
            null,
            new Input("text", [], "user-name" + usermanagement_administration_addcounter, { required: true }).render(),
            new CheckBoxInline([], {}, "system-admin" + usermanagement_administration_addcounter, 1, "").render(),
            new CheckBoxInline([], {}, "procurement-global" + usermanagement_administration_addcounter, 1, "").render(),
            new CheckBoxInline([], {}, "purchase-order-global" + usermanagement_administration_addcounter, 1, "").render()
        ]).order([ 1, "asc" ]).draw(false).node();
        
    }
    
    static deleteUser(selected_row) {
        
        if (selected_row.selected_user) {
            console.log("deleted");
        } else {
            new NothingSlectedAlert().render();
        }
        
    }
    
    static rowSelect(usermanagementadministration, selected_row) {
        
        return usermanagementadministration.on("click", "tr", function() {
            if (!$(this).hasClass("selected")) {
                usermanagementadministration.$("tr.selected").removeClass("selected");
                $(this).addClass("selected");
                selected_row.selected_user = usermanagementadministration.row(this).data();
            }
        });
        
    }
    
    static tableColumns() {
        
        return new Array(
            { title: "#" , visible: false },
            { title: "User Name" },
            { title: "System Administrator", className: "system-admin text-center", render: function(data, type, row) {
                    if (data === 1) {
                        return new CheckBoxInline([], { checked: true, disabled: true }, "system-admin", "", "").render();
                    } else {
                        return new CheckBoxInline([], { disabled: true }, "system-admin", "", "").render();
                    }
                }
            },
            { title: "Purchase Procurement Global User", className: "procurement-global text-center", render: function(data, type, row) {
                    if (data === 1) {
                        return new CheckBoxInline([], { checked: true, disabled: true }, "procurement-global", "", "").render();
                    } else {
                        return new CheckBoxInline([], { disabled: true }, "procurement-global", "", "").render();
                    }
                }
            },
            { title: "Purchase Order Global User", className: "po-global text-center", render: function(data, type, row) {
                    if (data === 1) {
                        return new CheckBoxInline([], { checked: true, disabled: true }, "po-global", "", "").render();
                    } else {
                        return new CheckBoxInline([], { disabled: true }, "po-global", "", "").render();
                    }
                }
            }
        );
        
    }
    
    static tableButtons(selected_row) {
        
        return new Array(
            {
                text: "Add",
                className: "btn btn-raised btn-primary waves-effect waves-light",
                action: function () {
                    UserManagementController.addUser(this.table());
                }
            },
            {
                text: "Delete",
                className: "btn btn-raised btn-danger waves-effect waves-light",
                action: function() {
                    UserManagementController.deleteUser(selected_row);
                }
            }
        );
        
    }
    
    static tableCreator(user_management, selected_row) {
        
        return $('#user-management-administration').DataTable({
            paging: false,
            info: false,
            data: user_management.usermanagement,
            searching: false,
            ordering: false,
            responsive: true,
            processing: true,
            columns: UserManagementController.tableColumns(),
            dom: "Bfrtip",
            buttons: UserManagementController.tableButtons(selected_row)
        });
        
    }
    
    tabActive(user_management) {
        
        let selected_row = {};
        
        $('#administration-tabs').on('tabsactivate', function(event, ui) {
            
            switch ( $(ui.newPanel).attr("id") ) {
                
                case "usermanagement" : {
                        
                    delete selected_row.selected_user;
                    $(ui.newPanel).html(
                        '<div class="row">' +
                            '<div class="col-md-12">' +
                                  new Table("user-management-administration", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +      
                            '</div>' +
                        '</div>'
                    );

                    let usermanagement_administration = UserManagementController.tableCreator(user_management, selected_row);
                    UserManagementController.rowSelect(usermanagement_administration, selected_row);
                
                };
                break;

            }
            
        });
        
    }
    
    builder() {
        
        $(document).ready(() => {
            $(document).on("click", "#administration", async () => {
                let user_management = await this.getUserManagement(window.localStorage.getItem('current_user_company')).then((resolve) => {
                    return resolve;
                });
                this.tabActive(user_management);
            });
        });
        
    }
    
}

export default new UserManagementController().builder();