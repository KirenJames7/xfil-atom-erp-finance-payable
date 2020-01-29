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
class PurchaseOrderService {
    
    getPurchaseOrderStatuses() {
        
        return $.get({
            url: "purchaseorderstatuses"
        });
        
    }
    
    getDeliveryModes() {
        
        return $.get({
            url: "deliverymodes"
        });
        
    }
    
    getDeliveryTerms() {
        
        return $.get({
            url: "deliveryterms"
        });
        
    }
    
    getPaymentTerms() {
        
        return $.get({
            url: "paymentterms"
        });
        
    }
    
    getMethodsOfPayment() {
        
        return $.get({
            url: "methodsofpayment"
        });
        
    }
    
    getAuthorizedPurchaseQuoteLines(purchase_quote_id) {
        
        return $.get({
            url: `purchasequotelinesforpurchaseorders?purchase_quote_id=${ purchase_quote_id }`
        });
        
    }
    
    newPurchaseOrder(formData) {
        
        return $.post({
            url: "newpurchaseorder",
            data: formData
        });
        
    }
    
    getPurchaseOrderLines(purchase_order) {
        
        return $.get({
            url: `purchaseorderlines?purchase_order_id=${ purchase_order }`
        });
        
    }
    
}

export default PurchaseOrderService;