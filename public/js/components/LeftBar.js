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
import ListItem from './elements/ListItem.js';
import ListItemEnd from './elements/ListItemEnd.js';
import Link from './elements/Link.js';
import Container from './Container.js';
import Image from './elements/Image.js';
import MaterialIcon from './elements/MaterialIcon.js';

window.navbarHeight = '56px';
const styles = {
    marginTop: window.navbarHeight,
    height: 'calc( 100vh - ' + window.navbarHeight + ')',
    position : 'fixed'
};

class LeftBar {
    
    render() {
        
        $(document).ready( ()=> {
            $('div .bmd-layout-drawer').css( styles );
        });
        
        return (
            '<div class="bmd-layout-drawer bg-faded">' +
                '<div class="brand-image-container waves-effect">' +
                    new Image("../../images/app-logo/finance-ap-logo.svg", [ "brand-image" ], "Accounts Payable").render() +
                '</div>' +
                '<ul class="list-group">' +
                    window.features.features.map(
                        (feature) => {
                            return (
                                (feature.feature_id === 1 ? ListItem(['nav-item', 'active'], [feature.feature_path], { func: feature.feature_function }) : ListItem(['nav-item'], [feature.feature_path], { func: feature.feature_function })) +
                                    Link(['nav-link'], [], 'javascript:;', new MaterialIcon(feature.feature_icon).render() + "&nbsp;" + feature.feature_name) +
                                ListItemEnd()
                            );
                    }).join('') +
                '</ul>' +
            '</div>' +
            Container
        );

    }
    
}

export default LeftBar;