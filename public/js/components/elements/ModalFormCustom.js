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
import Form from './Form.js';
import FormEnd from './FormEnd.js';

class ModalFormCustom {
    
    constructor(id, title, form, form_element, button) {
        this.id = id;
        this.title = title;
        this.form = form;
        this.form_element = form_element;
        this.button = button;
    }
    
    render() {
        document.body.style.overflowY = "hidden";
        return (
            '<div id="' + this.id + '" class="modal">' +
                '<div class="modal-dialog modal-dialog-centered">' +
                    '<div class="modal-content">' +
                        '<div class="modal-container">' +
                            new Form(this.form).render() +
                                '<div class="modal-header">' +
                                    '<h5 class="modal-title">' + this.title + '</h5>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                    this.form_element +
                                '</div>' +
                                '<div class="modal-footer">' +
                                    this.button.map((value) => { return value; }).join('&nbsp;') +
                                '</div>' +
                            FormEnd +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }
}

export default ModalFormCustom;