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
class Button {
    
    constructor(classes, id, text) {
        this.classes = classes;
        this.id = id;
        this.text = text;
    }
    
    render() {
        return (
            '<button type="button" class="btn waves-effect waves-light ' + this.classes.map((value) => { return value; }).join(' ') + '" id="' + this.id + '">' + this.text + '</button>'
        );
    }
    
}

export default Button;