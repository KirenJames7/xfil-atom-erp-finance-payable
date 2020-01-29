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
let grand_total, total_discount, total_nbt, total_olt, total_vat, total_svat;
grand_total = total_discount = total_nbt = total_olt = total_vat = total_svat = 0;

class ReportTemplate {
    
    constructor(_PO, companyInformation, vendorInformation, poLines, createdUser, authorizedUsers, authorizedDates, _Terms) {
        
        this._PO = _PO;
        this.companyLogo = companyInformation.company_logo;
        this.companyName = companyInformation.company_name;
        this.companyCity = companyInformation.city_name + " - " + companyInformation.city_post_code_zip_code;
        this._BReg = companyInformation.company_business_reg_no;
        this._VAT = companyInformation.company_vat;
        this._SVAT = companyInformation.company_svat;
        this._ISO = companyInformation.company_iso;
        this.vendorName = vendorInformation.vendor_name.toUpperCase();
        this.vendorPOBOX = vendorInformation.vendor_po_box;
        this.vendorAddressLine1 = vendorInformation.vendor_address_line_1;
        this.vendorAddressLine2 = vendorInformation.vendor_address_line_2;
        this.vendorCity = vendorInformation.vendor_city;
        this.vendorProvinceState = vendorInformation.vendor_province_state;
        this.vendorCountry = vendorInformation.vendor_country;
        this.vendorRef = vendorInformation.vendor_quote_reference_number;
        this.poLines = poLines;
        this.createdUser = createdUser;
        this.authorizedUsers = authorizedUsers;
        this.authorizedDates = authorizedDates;
        this._Terms = _Terms;
        
    }
    
    generate() {
        
        let doc = new jsPDF();
        
        let totalPagesExp = "{total_pages_count_string}";
        let imageData = this.companyLogo;
        let _PO = this._PO;
        let companyName = this.companyName;
        let _BReg = this._BReg;
        let _ISO = this._ISO;
        let _VAT = this._VAT;
        let _SVAT = this._SVAT;
        let vendorName = this.vendorName;
        let vendorPOBOX = this.vendorPOBOX;
        let vendorAddressLine1 = this.vendorAddressLine1;
        let vendorAddressLine2 = this.vendorAddressLine2;
        let vendorCity = this.vendorCity;
        let vendorProvinceState = this.vendorProvinceState;
        let vendorCountry = this.vendorCountry;
        let vendorRef = this.vendorRef;
        let poLines = this.poLines;
        let createdUser = this.createdUser;
        let authorizedUsers = this.authorizedUsers;
        let authorizedDates = this.authorizedDates;
        let _Terms = this._Terms;
//        console.log(poLines)
//        poLines.each((line, index) => {
//            if ( line.product_description ) {
//                poLines.splice(index + 1, 0, { content: line.product_description, colSpan: 2 });
//            }
//        });
//        console.log(poLines)
        poLines.push({ content: 'People', colSpan: 8, styles: { halign: 'right', fillColor: [22, 160, 133] } });
        
        let quantity, unit_price, discount;
        /* PO LINES */
        doc.autoTable({
            theme: 'striped',
            tableWidth: 'auto',
            styles: { font: 'helvetica', cellWidth: 'wrap' },
            headStyles: { fillColor: 0, fontStyle: 'bold' },
            columnStyles: { item_attribute_description: { cellWidth:  34 }, item_code: { cellWidth: 23 }, 0: { halign: 'center', cellWidth: 7 }, item_unit_of_measure: { halign: 'center', cellWidth: 10 }, item_quantity: { halign: 'right', cellWidth: 22 }, item_unit_price: { halign: 'right', cellWidth: 30 }, item_line_discount: { halign: 'right', cellWidth: 20 }, 7: { halign: 'right', cellWidth: 30 }  },
            columns: [
                { header: "No" },//10
                { header: "Item", dataKey: "item_code" },//20
                { header: "Description", dataKey: "item_attribute_description" },//35
                { header: "UoM", dataKey: "item_unit_of_measure" },//10
                { header: "Qty", dataKey: "item_quantity" },//20
                { header: "Unit Price", dataKey: "item_unit_price" },//30
                { header: "Disc.", dataKey: "item_line_discount" },//20
                { header: "Line Total" }//30
            ],
            body: poLines,
            didDrawPage: function(data) {
                /* HEADER */
                doc.addImage(imageData, "PNG", 15, 10, 46, 19);
                doc.setFont('helvetica');
                /* COMPANY NAME */
                doc.setFontSize(14);
                doc.setFontType('bold');
                doc.text(70, 17, companyName.toUpperCase());
                /* DOCUMENT TYPE */
                doc.setFontSize(13);
                doc.setFontType('normal');
                doc.text(85, 23, "PURCHASE ORDER");
                /* DOCUMENT NUMBER */
                doc.setFontSize(12);
                doc.setFontType('bold');
                doc.text(160, 17, _PO);
                /* DOCUMENT VALIDITY */
                doc.setFontSize(13);
                doc.setFontType('bold');
                doc.text(97, 28, "ORIGINAL");
                doc.setTextColor(150);
                doc.text(165, 24, "APPROVED");
                /* COMPANY INFO OTHER */
                doc.setFontSize(9);
                doc.setFontType('normal');
                doc.setTextColor('#000000');
                if ( _BReg === "PV 3716" ) {
                    doc.text(15, 33, "VAT.......: " + _VAT);
                    doc.textEx("Business Reg....: " + _BReg, 107, 34, 'center', 'bottom');
                    doc.textEx("SVAT.......: " + _SVAT, 194, 30, 'right', 'top');
                } else {
                    doc.text(15, 33, "Business Reg....: " + _BReg);
                    doc.text(63, 33, "ISO.......: " + _ISO);
                    doc.text(110, 33, "VAT.......: " + _VAT);
                    doc.textEx("SVAT.......: " + _SVAT, 194, 30, 'right', 'top');
                }
                /* DOCUMENT HEADER END */
                doc.setLineWidth(0.5);
                doc.setDrawColor(0, 0, 0);
                doc.line(15, 35, 196, 35);
                /* VENDOR INFO */
                doc.setFontSize(10);
                doc.setFontType('bold');
                doc.text(15, 39, "Vendor....: " + vendorName);
                doc.setFontType('normal');
                doc.text(15, 44, vendorPOBOX + ", " + vendorAddressLine1 + (() => { if ( vendorAddressLine2 ) { return ", " + vendorAddressLine2 + ","; } else { return ","; } })());
                doc.text(15, 48, vendorCity + ",");
                doc.text(15, 52, vendorProvinceState + ",");
                doc.text(15, 56, vendorCountry + ".");
                doc.setFontType('bold');
                doc.text(15, 62, "Attention..: ");
                doc.setFontType('normal');
                /* INVOICE & DELIVERY INFO */
                doc.setFontType('bold');
                doc.text(105, 39, "Invoice To..: " + companyName.toUpperCase());
                doc.text(105, 51, "Deliver To..: ");
                doc.setFontType('normal'); //delivery site info
                /* VENDOR INFO & INVOICE & DELIVERY END */
                doc.setLineWidth(0.5);
                doc.line(15, 64, 196, 64);
                /* TERMS & CONDITIONS */
                doc.setFontSize(11);
                doc.setFontType('bold');
                doc.text(15, 68, "Terms & Conditions.");
                doc.setLineWidth(0);
                doc.line(15, 69, 53, 69);
                doc.setFontSize(10);
                doc.setFontType('normal');
                doc.text(15, 74, "PO Date...........: " + new Date().toISOString().split('T')[0]);
                doc.text(63, 74, "Terms of Payment..: " + _Terms.payment_term);
                doc.text(15, 78, "Delivery Mode..: " + _Terms.delivery_mode);
                doc.text(63, 78, "Terms of Delivery...: " + _Terms.delivery_term);
                doc.text(15, 82, "Delivery Date...: " + _Terms.delivery_date);
                doc.rect(130, 71, 66, 7);
                doc.setFontSize(12);
                doc.setFontType('bold');
                doc.textEx(_Terms.method_of_payment.toUpperCase(), 162.5, 72.5, 'center', 'top');
                doc.setFontSize(10);
                doc.setFontType('normal');
                doc.text(148, 81, "Method of Payment");                
                
                /* FOOTER */
                let str = "Page " + doc.internal.getNumberOfPages();
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " of " + totalPagesExp;
                }
                doc.setFontSize(7);
                // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                let pageSize = doc.internal.pageSize;
                let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                doc.line(15, pageHeight - 20, 196, pageHeight - 20);
                doc.text("PLEASE ENSURE THAT AN INVOICE IS ACCOMPANIED WITH EACH DELIVERY AND INDICATE THE PURCHASE ORDER NUMBER ON ALL INVOICES,\nPACKING LISTS AND ADVICE NOTES.", data.settings.margin.left, pageHeight - 17);
                doc.setFontSize(9);
                //inspired by https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
                doc.text("Created Date \ Time : " + new Date().toISOString().split('T')[0] + " " + new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }), data.settings.margin.left, pageHeight - 10);
                // inspired by https://stackoverflow.com/questions/28327510/align-text-right-using-jspdf/28433113
                doc.textEx("Created User : " + createdUser, ( pageWidth / 2 ), pageHeight - 9.5, 'center', 'bottom');
                doc.textEx(str, pageWidth + data.settings.margin.right + 5, pageHeight - 10, 'right', 'bottom');
            },
            didParseCell: (data) => {
                if ( data.column.index === 0 && data.cell.text[0] === "No" ) {
                    data.cell.styles.halign = 'center';
                }
                
                if ( data.column.dataKey === "item_unit_of_measure" && data.cell.text[0] === "UoM" ) {
                    data.cell.styles.halign = 'center';
                }
                
                if ( data.column.dataKey === "item_quantity" && data.cell.text[0] === "Qty" ) {
                    data.cell.styles.halign = 'center';
                }
                
                if ( data.column.dataKey === "item_quantity" && data.cell.text[0] !== "Qty" && data.row.index !== data.table.body.length -1 ) {
                    data.cell.text =  [ new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(data.cell.text[0])) ];
                }
                
                if ( data.column.dataKey === "item_unit_price" && data.cell.text[0] === "Unit Price" ) {
                    data.cell.styles.halign = 'center';
                }
                
                if ( data.column.dataKey === "item_unit_price" && data.cell.text[0] !== "Unit Price"  && data.row.index !== data.table.body.length -1 ) {
                    data.cell.text =  [ new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(data.cell.text[0])) ];
                }
                
                if ( data.column.dataKey === "item_line_discount" && data.cell.text[0] === "Disc." ) {
                    data.cell.styles.halign = 'center';
                }
                
                if ( data.column.dataKey === "item_line_discount" && data.cell.text[0] !== "Disc." && data.row.index !== data.table.body.length -1 ) {
                    data.cell.text =  [ new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(data.cell.text[0])) ];
                }
                
                if ( data.column.index === 7 && data.cell.text[0] === "Line Total" ) {
                    data.cell.styles.halign = 'center';
                }
                
                if ( data.column.index === 0 && data.cell.text[0] === "" && data.row.index !== data.table.body.length -1 ) {
                    let no = data.row.index + 1;
                    data.cell.text = no.toString();
                }
                
                if ( data.column.dataKey === "item_quantity" && !Number.isNaN(Number(data.cell.text[0].replace(',', '')))  && data.row.index !== data.table.body.length -1 ) {
                    quantity = Number(data.cell.text[0].replace(',', ''));
                }
                
                if ( data.column.dataKey === "item_unit_price" && !Number.isNaN(Number(data.cell.text[0].replace(',', ''))) && data.row.index !== data.table.body.length -1 ) {
                    unit_price = Number(data.cell.text[0].replace(',', ''));
                }
                
                if ( data.column.dataKey === "item_line_discount" && !Number.isNaN(Number(data.cell.text[0].replace(',', ''))) && data.row.index !== data.table.body.length -1 ) {
                    discount = Number(data.cell.text[0].replace(',', ''));
                    total_discount += discount;
                }
                
                if ( data.column.index === 7 && data.cell.text[0] === "" && data.row.index !== data.table.body.length -1 ) {
                    let line_total = (((quantity * unit_price) - discount) + Number(poLines[data.row.index].item_line_vat) + Number(poLines[data.row.index].item_line_nbt + Number(poLines[data.row.index].item_line_olt)));
                    grand_total += line_total;
                    data.cell.text = [ new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(line_total) ];
                }
                
                if ( data.row.index === data.table.body.length - 1 && data.column.index === 0 ) {
                    data.row.cells[0].colSpan = 5;
                    data.row.cells[0].styles.halign = 'left';
                    data.row.cells[0].styles.fillColor = 255;
                    data.row.cells[0].styles.cellPadding = { right: 0 };
                    data.row.cells[0].styles.textColor = 0;
                    
                    delete data.row.cells.item_attribute_description;
                    delete data.row.cells.item_code;
                    delete data.row.cells.item_line_discount;
                    delete data.row.cells.item_quantity;
                    delete data.row.cells.item_unit_of_measure;
                    delete data.row.cells.item_unit_price;
                    
                    data.row.cells[0].text = poLines[0].currency + " " + numbertoWords(grand_total).replace(/\b\S/g, t => t.toUpperCase()) + " Only.\n\n" +
                        "This Purchase Order is digitally authorized.\n\n" +
                        "Authorized By     |     Authorized Date\n" +
                        authorizedUsers.split(",").map((element, index) => { let dates = authorizedDates.split(","); return element + "     |     " + dates[ index ]; }).join("\n");
                        /* TABLE END */
                }
                
                if ( data.row.index === data.table.body.length - 1 && data.column.index === 5 ) {
                    data.row.cells[5].colSpan = 2;
                    data.row.cells[5].styles.halign = 'left';
                    data.row.cells[5].styles.fillColor = 255;
                    data.row.cells[5].styles.cellPadding = { right: 0 };
                    data.row.cells[5].styles.textColor = 0;
                    
                    delete data.row.cells.item_attribute_description;
                    delete data.row.cells.item_code;
                    delete data.row.cells.item_line_discount;
                    delete data.row.cells.item_quantity;
                    delete data.row.cells.item_unit_of_measure;
                    delete data.row.cells.item_unit_price;
                    
                    data.row.cells[5].text = "SUB TOTAL.................:  \n" +
                        "TOTAL DISCOUNT.....: \n" +
                        "TOTAL BEFORE TAX.: \n" +
                        "TOTAL NBT.................: \n" +
                        "TOTAL OLT.................: \n" +
                        "TOTAL VAT.................: \n" +
                        "TOTAL SVAT...............: \n" +
                        "GRAND TOTAL " + "[ " + poLines[0].currency + " ]";
                        /* TABLE END */
                }
                
                if ( data.row.index === data.table.body.length - 1 && data.column.index === 7 ) {
                    data.row.cells[7].styles.halign = 'right';
                    data.row.cells[7].styles.fillColor = 255;
                    data.row.cells[7].styles.cellPadding = { right: 0 };
                    data.row.cells[7].styles.textColor = 0;
                    
                    data.row.cells[7].text = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(grand_total - ( poLines.reduce((total, line) => Number(line.item_line_vat || 0) + total, 0) + poLines.reduce((total, line) => Number(line.item_line_olt || 0) + total, 0) + poLines.reduce((total, line) => Number(line.item_line_nbt || 0) + total, 0) ) + poLines.reduce((total, line) => Number(line.item_line_discount || 0) + total, 0)) + "\n" +
                        "(" + new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(poLines.reduce((total, line) => Number(line.item_line_discount || 0) + total, 0)) + ")" + "\n" +
                        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(grand_total - ( poLines.reduce((total, line) => Number(line.item_line_vat || 0) + total, 0) + poLines.reduce((total, line) => Number(line.item_line_olt || 0) + total, 0) + poLines.reduce((total, line) => Number(line.item_line_nbt || 0) + total, 0) )) + "\n" +
                        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(poLines.reduce((total, line) => Number(line.item_line_nbt || 0) + total, 0)) + "\n" +
                        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(poLines.reduce((total, line) => Number(line.item_line_olt || 0) + total, 0)) + "\n" +
                        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(poLines.reduce((total, line) => Number(line.item_line_vat || 0) + total, 0)) + "\n" +
                        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(poLines.reduce((total, line) => Number(line.item_line_svat || 0) + total, 0)) + "\n" +
                        new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(grand_total);
                        /* TABLE END */
                }
            },
            didDrawCell: (data) => {
                if ( data.row.index === data.table.body.length - 1 && data.column.index === 7 ) {
                    doc.setLineWidth(0.5);
                    doc.setDrawColor(0, 0, 0);
                    data.doc.line(data.row.x, data.row.y, data.row.x + data.row.cells[0].width + data.row.cells[5].width +data.row.cells[7].width, data.row.y);
                    doc.setLineWidth(0);
                    data.doc.line(data.row.x + data.row.cells[0].width + data.row.cells[5].width, data.table.height + 85 - 6, data.row.x + data.row.cells[0].width + data.row.cells[5].width +data.row.cells[7].width, data.table.height + 85 - 6);
                    data.doc.line(data.row.x + data.row.cells[0].width + data.row.cells[5].width, data.table.height + 85 - 2, data.row.x + data.row.cells[0].width + data.row.cells[5].width +data.row.cells[7].width, data.table.height + 85 - 2);
                    data.doc.line(data.row.x + data.row.cells[0].width + data.row.cells[5].width, data.table.height + 85 - 1, data.row.x + data.row.cells[0].width + data.row.cells[5].width +data.row.cells[7].width, data.table.height + 85 - 1);
                    data.doc.setLineWidth(0.5);
                    data.doc.line(data.row.x, data.table.height + 85 + 2, data.row.x + data.row.cells[0].width + data.row.cells[5].width +data.row.cells[7].width, data.table.height + 85 + 2);
                }
            },
            margin: { top: 85, left: 16, right: 15, bottom: 20 }
        });
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        
        /* OUTPUT FILE IN NEW TAB */
        let file = new Blob([doc.output('arraybuffer')], {type: 'application/pdf'});
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        grand_total = total_discount = total_nbt = total_olt = total_vat = total_svat = 0;
        
    }
    
}

export default ReportTemplate;