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
class Modal {
    
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }
    
    render() {
        document.body.style.overflowY = "hidden";
        return (
            '<div id="' + this.id + '" class="modal" tabindex="-1" role="dialog" aria-hidden="false">' +
                '<div class="modal-dialog modal-dialog-centered" role="document">' +
                    '<div class="modal-content">' +
                        '<div class="modal-container">' +
                            '<form method="POST" id="purchase-request" enctype="application/x-www-form-urlencoded">' +
                                '<div class="modal-header">' +
                                    '<h5 class="modal-title">' + this.title + '</h5>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                    '<fieldset>' +
                                        '<legend>Test</legend>' +
                                        'This is the body area' +
                                    '</fieldset>' +
                                '</div>' +
                                '<div class="modal-footer">' +
                                    //buttons
                                    'This is where the buttons come' +
                                '</div>' +
                            '</form>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }
    
}

export default Modal;