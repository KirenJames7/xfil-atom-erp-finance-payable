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
class PurchaseRequestService {
    
    getPurchaseRequestStatuses() {
        
        return $.get({
            url: "purchaserequeststatuses"
        });
        
    }
    
    newPurchaseRequest(formData) {
        
        return $.post({
            url: "newpurchaserequest",
            data: formData
        });
        
    }
    
    editPurchaseRequest(purchaserequest, existing, changes) {
        
        return $.post({
            url: "editpurchaserequest",
            data: {
                purchaserequest: purchaserequest,
                exising: existing,
                changes: changes,
                _token: $('meta[name="csrf-token"]').attr("content")
            }
        });
        
    }
    
    sendPurchaseRequestForApproval(purchaserequest) {
        
        return $.post({
            url: "sendpurchaserequestforapproval",
            data: {
                purchaserequest: purchaserequest,
                _token: $('meta[name="csrf-token"]').attr("content")
            }
        });
        
    }
    
    deletePurchaseRequest(purchaserequest) {
        
        return $.post({
            url: "deletepurchaserequest",
            data: {
                purchaserequest: purchaserequest,
                _token: $('meta[name="csrf-token"]').attr("content")
            }
        });
        
    }
    
    cancelPurchaseRequest(purchaserequest, userid, remark) {
        
        return $.post({
            url: "cancelpurchaserequest",
            data: {
                purchaserequest: purchaserequest,
                userid: userid,
                remark: remark,
                _token: $('meta[name="csrf-token"]').attr("content")
            }
        });
        
    }
    
}

export default PurchaseRequestService;