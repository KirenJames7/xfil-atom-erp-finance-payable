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
import Home from './content/home/Home.js';
import ContainerController from './services/ContainerController.js'


window.drawerWidth = '275px';
const styles = {
    marginLeft : window.drawerWidth,
    marginTop : "56px"
};

class Container {
    
    render() {
        $(document).ready( ()=> {
            new ContainerController().render();
            setTimeout(function(){
                $('div .container-fluid').css( styles );
            }, 2000);
        });
        return (
            '<main class="bmd-layout-content">' +
                '<div class="container-fluid">' +
                    new Home().render() +
                '</div>' +
            '</main>'
        );
    }
    
}

export default new Container().render();