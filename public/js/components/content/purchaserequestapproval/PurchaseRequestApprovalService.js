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
class PurchaseRequestApprovalService {
    
    rejectPurchaseRequest(purchase_request, user_id, remark, token) {
        
        return $.post({
            url: "purchaserequestreject",
            data: {
                purchase_request_id: purchase_request,
                user_id: user_id,
                remark: remark,
                _token: token
            }
        });
        
    }
    
    approvePurchaseRequest(purchase_request, user_id, petty_cash, token) {
        
        return $.post({
            url: "purchaserequestapprove",
            data: {
                purchase_request_id: purchase_request,
                user_id: user_id,
                petty_cash: petty_cash,
                _token: token
            }
        });
        
    }
    
}

export default PurchaseRequestApprovalService;