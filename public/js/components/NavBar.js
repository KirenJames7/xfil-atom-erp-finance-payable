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
import LeftBar from './LeftBar.js';
import Link from './elements/Link.js';
import Image from './elements/Image.js';
import MaterialIcon from './elements/MaterialIcon.js';
import SignOutController from './content/login/SignOutController.js';

class NavBar {
    
    render() {
        
        return (
            '<header class="bmd-layout-header">' +
                '<div class="navbar fixed-top navbar-dark bg-dark">' +
                    Link([ "navbar-brand" ], [], "javascript:;", new Image(JSON.parse(window.localStorage.getItem('current_user_company_information')).company_app_logo, [ "company-image" ], JSON.parse(window.localStorage.getItem('current_user_company_information')).company_name).render() + "XFIL | Accounts Payables") +
                '</div>' +
                '<div class="navbar-button-container">' +
                    '<div class="navbar-user-info waves-effect waves-light">' +
                        Link([ "user-info" ], [], "javascript:;", "") +
                        '<div class="user-image-container">' +
                            new Image("../../images/img_avatar.png", [ "user-image" ], "User").render() +
                        '</div>' +
                    '</div>' +
                    '<div class="navbar-sign-out waves-effect waves-light">' +
                        Link([ "sign-out" ], [], "javascript:;", new MaterialIcon("power_settings_new").render() + "&nbsp;Sign Out") +
                    '</div>' +
                '</div>' +
            '</header>' +
            new LeftBar().render()
        );

    }
    
}

export default NavBar;