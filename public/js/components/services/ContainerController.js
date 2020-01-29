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
import Home from '../content/home/Home.js';
import VendorDetails from '../content/vendordetails/VendorDetails.js';
import PurchaseProcurement from '../content/purchaseprocurement/PurchaseProcurement.js';
import PurchaseOrder from '../content/purchaseorder/PurchaseOrder.js';
import PurchaseRequestApproval from '../content/purchaserequestapproval/PurchaseRequestApproval.js';
import PurchaseQuoteAuthorization from '../content/purchasequoteauthorization/PurchaseQuoteAuthorization.js';
import Administration from '../content/administration/Administration.js';

class ContainerController {
    
    containerLoader(url, func) {
        
        this.url = url;
        this.func = func;
        const container = $('.container-fluid');
        const classes = {
            Home,
            VendorDetails,
            PurchaseProcurement,
            PurchaseOrder,
            PurchaseRequestApproval,
            PurchaseQuoteAuthorization,
            Administration
        };
        
        switch (this.url) {
            case this.url:
                if (container.children().length) {
                    container.children().remove();
                    if (this.url === "home") {
                        window.login = false;
                        container.html(new classes[this.func]().render());
                    } else {
                        container.html(classes[this.func]);
                    }
                    window.scrollTo(0,0);
                    setTimeout(function(){
                        $('.page-loader').toggle();
                        document.body.style.overflowY = "auto";
                    }, 1500);
                }
                break;
        }
        
    }
    
    render() {
        
        $(document).ready(function() {
            setTimeout(function(){
                $('body').bootstrapMaterialDesign({ autofill: false });
                $('.nav-item').on('click', function() {
                    $('.page-loader').toggle();
                    particleInit();
                    $('.active').removeClass('active');
                    $('#' + this.id).addClass('active');
                    new ContainerController().containerLoader(this.id, $(this).attr('func'));
                });
                MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                var observer = new MutationObserver(function(mutations){
                    if ($('.page-loader').is(':visible')) {
                        document.body.style.overflowY = "hidden";
                    }
                    for (var i = 0; i < mutations.length; ++i) {
                        for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
                            //fixing bug with datatable search
                            $('input[type="search"]').addClass("form-control");
                            //fixing a bug with datatables scrollY when on firefox
                            if (Browser.name === "firefox") {
                                $('div.dataTables_scrollBody').css('padding-right', "6px");
                            }

                            //remove the data table button styling
                            $('.dt-button').removeClass("dt-button");
                            $(mutations[i].addedNodes[j]).bootstrapMaterialDesign({ autofill: false });
                        }
                    }
                });
                observer.observe($(document).get(0), {
                    childList: true,
                    subtree: true
                });
            }, 1500);
        });
        
    }
    
}

export default ContainerController;