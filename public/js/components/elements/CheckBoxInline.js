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
class CheckBoxInline {
    
    constructor(classes, attr, id, value, text) {
        this.classes = classes;
        this.attr = attr;
        this.id = id;
        this.value = value;
        this.text = text;
    }
    
    render() {
        return (
            '<label class="checkbox-inline">' +
                '<input type="checkbox" '+ (() => { if(this.classes.length){ return 'class="' + this.classes.join(' ') + '"'; } else { return ''; } })() +' id="' + this.id + '" name="' + this.id + '" value="' + this.value + '" '+ Object.keys(this.attr).map((key) => { return key + '="' + this.attr[key] + '"'; }).join(' ') +'>' + this.text +
            '</label>'
        );
    }
}

export default CheckBoxInline;