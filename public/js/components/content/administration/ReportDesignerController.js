/* 
 * Copyright (C) 2019 kirenj
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
class ReportDesignerController {
    
    tabActive() {
        
        $('#administration-tabs').on('tabsactivate', function(event, ui) {
            switch ( $(ui.newPanel).attr("id") ) {
                case "reportdesigner": {
                    $(ui.newPanel).html(
                        '<div id="report-designer">' +
                        '</div>'
                    );
                    
                    if ( $('#report-designer').is(':visible') ) {
                        $('#report-designer').reportBro({
                            menuSidebar: false
                        });
                        $('#reportdesigner').css("height", "800px");
                        $('.rbroMenuPanel').css("top", "60px");
                    }
                };
                break;
            }
        });
        
    }
    
    builder() {
        
        $(document).ready(() => {
            $(document).on("click", "#administration", async () => {
//                let purchase_groups = await this.getPurchaseGroups(window.localStorage.getItem('current_user_company')).then((resolve) => {
//                    return resolve;
//                });
                this.tabActive();
            });
        });
        
    }
    
}

export default new ReportDesignerController().builder();