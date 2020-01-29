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
import FinanceLobbyAPIURLService from '../apis/FinanceLobbyAPIURLService.js';
import InventoryManagementAPIURLService from '../apis/InventoryManagementAPIURLService.js';

class PurchaseQuoteService {
    
    getVendors(company) {
        
        return $.get({
            url: "vendors?company=" + company
        });
        
    }
    
    async getItems(company) {
        
        return $.get({
            url: await new InventoryManagementAPIURLService().getInventoryManagementAPIURL().then((response) => { return response.url; }) + "/api/v1/itemdetails?company=" + company
        });
        
    }
    
    async getItemUOMs(company, item) {
        
        return $.get({
            url: await new InventoryManagementAPIURLService().getInventoryManagementAPIURL().then((response) => { return response.url; }) + "/api/v1/itemuom?company=" + company + "&item=" + item
        });
        
    }
    
    async getCurrencies() {
        
        return $.get({
            url: await new FinanceLobbyAPIURLService().getFinanceLobbyAPIURL().then((response) => { return response.url; }) + "/api/v1/currencies"
        });
        
    }
    
    async getFixedAssetAttributes(company, category) {
        
        return $.get({
            url: await new InventoryManagementAPIURLService().getInventoryManagementAPIURL().then((response) => { return response.url; }) + "/api/v1/fixedassetattributes?company=" + company + "&category=" + category
        });
        
    }
    
    getPurcaseQuoteStatuses() {
        
        return $.get({
            url: "purchasequotestatuses"
        });
        
    }
    
    getPurchaseRequestQuotes(purchase_request) {
        
        return $.get({
            url: "purchasequotes?purchase_request=" + purchase_request
        });
        
    }
    
    getPurchaseRequestQuoteLines(purchase_quote) {
        
        return $.get({
            url: "purchasequotelines?purchase_quote=" + purchase_quote
        });
        
    }
    
    newPurchaseQuote(formData) {
        
        return $.post({
            url: "newpurchasequote",
            data: formData
        });
        
    }
    
    extendPurchaseQuote(data) {
        
        return $.post({
            url: "extendpurchasequote",
            data: data
        });
        
    }
    
    sendPurchaseQuotesForAuthorization(data) {
        
        return $.post({
            url: "sendpurchasequotesforauthorization",
            data: data
        });
        
    }
    
}

export default PurchaseQuoteService;