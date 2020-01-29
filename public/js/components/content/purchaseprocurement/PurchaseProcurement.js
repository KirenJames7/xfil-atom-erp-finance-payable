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
import PurchaseRequestController from './PurchaseRequestController.js';
import Label from '../../elements/Label.js';
import Input from '../../elements/Input.js';
import InputHelp from '../../elements/InputHelp.js';
import TextArea from '../../elements/TextArea.js';
import Required from '../../elements/Required.js';
import Button from '../../elements/Button.js';
import CheckBox from '../../elements/CheckBox.js';
import CheckBoxInline from '../../elements/CheckBoxInline.js';
import Table from '../../elements/Table.js';
import ModalForm from '../../elements/ModalForm.js';
import ModalFormCustom from '../../elements/ModalFormCustom.js';
import SelectLabel from '../../elements/SelectLabel.js';
import Select from '../../elements/Select.js';
import BadgeLink from '../../elements/BadgeLink.js';

class PurchaseProcurement {
    
    render() {
        $(document).ready(function() {
            $(document).on("click", "#purchaseprocurement", function(){           
                

//                purchaseprocurement_request.on('click', 'tr', function() {
//                    if (!$(this).hasClass("selected")) {
//                        purchaseprocurement_request.$('tr.selected').removeClass("selected");
//                        $(this).addClass("selected");
//                        selectedrow.purchase_resquest = purchaseprocurement_request.row(this).data();
//                        if (purchaseprocurement_quote.rows().count()) {
//                            delete selectedrow.purchase_quote;
//                            purchaseprocurement_quote.clear();
//                            purchaseprocurement_quote_lines.clear().draw();
//                        } else {
//                            purchaseprocurement_quote.rows.add(purchasequotedata).draw();
//                            //purchaseprocurement_quote.draw();
//                        }
//
//                    }
//                });

                

                $(document).on('click', '#discard', function() {
                    $.unblockUI();
                    $('form')[0].reset();
                    document.body.style.overflowY = "auto";
                    //purchaseprocurement_quote.rows.add(pqlinesdata).draw();
                });
            });
        });
        return (
            
            '<div class="row">' +
                '<div class="col-md-11">' +
                    '<div class="row">' +
                        '<div class="col-12">' +
                            '<div class="card">' +
                                '<div class="card-body">' +
                                    '<h5 class="card-title text-center"> Purchase Requests </h5>' +
                                    new Table("purchase-request", ["table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-12">' +
                            '<div class="card">' +
                                '<div class="card-body">' +
                                    '<h5 class="card-title text-center"> Purchase Quotes</h5>' +
                                    new Table("purchase-quote", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-12">' +
                            '<div class="card">' +
                                '<div class="card-body">' +
                                    '<h5 class="card-title text-center"> Purchase Quote Lines</h5>' +
                                    new Table("purchase-quote-lines", [ "table", "table-bordered", "table-striped", "table-hover" ]).render() +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="col-md-1 informer">' +
                    '<div class="row">' +
                        '<div class="col">' +
                            '<div class="card">' +
                                '<div class="card-body text-center">' +
                                    new BadgeLink([ "badge-pill", "badge-info" ], [], 5).render() + "PR <br />EVALUATION" +
                                    new BadgeLink([ "badge-pill", "badge-info" ], [], 5).render() + "PROCUMENTING<br />READY" +
                                    new BadgeLink([ "badge-pill", "badge-info" ], [], 5).render() + "EVALUATION" +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }
}

export default new PurchaseProcurement().render();