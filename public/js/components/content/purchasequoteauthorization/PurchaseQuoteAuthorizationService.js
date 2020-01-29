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
class PurchaseQuoteAuthorizationService {
    
    getPurchaseQuotePurchaseQuoteLines(purchase_quote) {
        
        return $.get({
            url: "purchaserequestpurchasequotepurchasequotelineauthorization?purchase_quote=" + purchase_quote
        });
        
    }
    
    authorizePurchaseQuote(formData) {
        
        return $.post({
            url: "purchasequoteauthorize",
            data: formData
        });
        
    }
    
    rejectPurchaseQuote(formData) {
        
        return $.post({
            url: "purchasequotereject",
            data: formData
        });
        
    }
    
}

export default PurchaseQuoteAuthorizationService;