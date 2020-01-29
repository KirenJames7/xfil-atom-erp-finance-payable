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
import PurchaseQuoteService from './PurchaseQuoteService.js';
import NothingSlectedAlert from '../../utils/NothingSelectedAlert.js';
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

class PurchaseQuoteController {
        
    builder() {
        
        $(document).ready(() => {
            $(document).on("click", "#purchaseprocurement", () => {
                let selected_row = {};
                let swal_text = document.createElement("div");
                swal_text.className = "swal-text text-center";
                let line_items = {};
                
                function floatConvert(num) {
                    return typeof num === 'string' ? num.replace(/,/g, '') * 1 : typeof num === 'number' ? num : 0;
                }

                $('select.purchase-quote-status').on('change', function() {
                    console.log($(this).val())
                });
                
                $('#purchase-quote-lines').append($("<tfoot/>").attr("id", "purchase-quote-lines-footer"));
                let total_discount, total_vat, total_svat, total_nbt, total_olt, total;
                let purchaseprocurement_quote_lines = $('#purchase-quote-lines').DataTable({
                    paging: false,
                    info: false,
                    scrollY: 200,
                    scrollCollapse:true,
                    responsive: true,
                    processing: true,
                    columns: [
                        { title: "Item" },
                        { title: "Item Description", width: "35%", render: function(data, type, row) {
                                return type === 'display' && data.length > 56 ?
                                    data.substr( 0, 56 ) +'…' :
                                    data;
                            }
                        },
                        { title: "Product Description", width: "17%", visible: false },
                        { title: "UoM", width: "5%" },
                        { title: "Currency", width: "5%" },
                        { title: "Price", render: $.fn.dataTable.render.number(",", ".", 4), className: "price" },
                        { title: "Qty", render: $.fn.dataTable.render.number(",", ".", 4), className: "qty" },
                        { title: "Discount", className: "dis vas", render: $.fn.dataTable.render.number(",", ".", 4) },
                        { title: "NBT", className: "nbt vas", render: $.fn.dataTable.render.number(",", ".", 4) },
                        { title: "OLT", className: "olt vas", render: $.fn.dataTable.render.number(",", ".", 4) },
                        { title: "VAT", className: "vat vas", render: $.fn.dataTable.render.number(",", ".", 4)  },
                        { title: "SVAT", className: "svat vas", render: $.fn.dataTable.render.number(",", ".", 4) },
                        { title: "Line Total", className: "total", data: null, render: function(data, type, row) {
                                return $.fn.dataTable.render.number(",", ".", 4).display(((((row[5] * row[6]) - row[7]) + row[8] + row[9])+ row[10]));
                            }
                        }
                    ],
                    footerCallback: function(row, data, start, end, display) {
                        this.api().columns('.dis').every(function(){
                            total_discount = this.data().toArray().reduce((a,b) => a + b, 0);
                        });
                        
                        this.api().columns('.nbt').every(function(){
                            total_nbt = this.data().toArray().reduce((a,b) => a + b, 0);
                        });
                        
                        this.api().columns('.olt').every(function(){
                            total_olt = this.data().toArray().reduce((a,b) => a + b, 0);
                        });
                        
                        this.api().columns('.vat').every(function(){
                            total_vat = this.data().toArray().reduce((a,b) => a + b, 0);
                        });
                        
                        this.api().columns('.svat').every(function(){
                            total_svat = this.data().toArray().reduce((a,b) => a + b, 0);
                        });
                        
                        total = this.api().cells(null, '.total').render('display').reduce((a, b) => floatConvert(a) + floatConvert(b), 0);
                        
                        if (data.length) {
                            $('tfoot#purchase-quote-lines-footer').html(
                                '<tr>' +
                                    '<td class="totalling-tag text-right">SUB TOTAL</td>' +
                                    '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total + total_discount - (total_vat + total_nbt + total_olt)) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="totalling-tag text-right">TOTAL DISCOUNT</td>' +
                                    '<td class="totalling text-right">(' + $.fn.dataTable.render.number(",", ".", 4).display(total_discount) + ')</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="totalling-tag text-right">TOTAL BEFORE TAX</td>' +
                                    '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display((total - (total_nbt + total_olt)) - total_vat) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="totalling-tag text-right">TOTAL NBT</td>' +
                                    '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_nbt) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="totalling-tag text-right">TOTAL OLT</td>' +
                                    '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_olt) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="totalling-tag text-right">TOTAL VAT</td>' +
                                    '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_vat) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="totalling-tag text-right">TOTAL SVAT</td>' +
                                    '<td class="totalling text-right">' + $.fn.dataTable.render.number(",", ".", 4).display(total_svat) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="totalling-tag text-right"><strong>GRAND TOTAL</strong></td>' +
                                    '<td class="totalling text-right"><strong>' + $.fn.dataTable.render.number(",", ".", 4).display(total) + '</strong></td>' +
                                '</tr>'
                            );
                        }
                    }
                });
                
                purchaseprocurement_quote.on('click', 'tr', function(){
//                    if (!$(this).hasClass("selected")) {
//                        purchaseprocurement_quote.$('tr.selected').removeClass("selected");
//                        $(this).addClass("selected");
//                        selected_row.selected_purchase_quote = purchaseprocurement_quote.row(this).data();
//                        if (purchaseprocurement_quote_lines.rows().data()) {
//                            purchaseprocurement_quote_lines.clear();
//                        }
//                        //purchaseprocurement_quote_lines.rows.add(pqlinesdata).draw();
//                        purchaseprocurement_quote_lines.columns('.vas').every(function() {
//                            if (this.data().toArray().every(e => e === 0)) {
//                                this.visible(false);
//                            }
//                        });
//                    }
                });
            });
        });
        
    }
    
}

export default new PurchaseQuoteController().builder();