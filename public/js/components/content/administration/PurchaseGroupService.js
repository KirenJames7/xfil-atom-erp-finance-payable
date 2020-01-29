/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class PurchaseGroupService {
     
    getPurchaseGroups(company) {
        
        return $.get({
            url: `adminpurchasegroups?company=${ company }`
        });
        
    }
    
    getUnAssignedPurchaseGroupUsers(purchase_group, company) {
        
        return $.get({
            url: `unassingedpurchasegroupusers?purchase_group=${ purchase_group }&company=${ company }`
        });
        
    }
    
}

export default PurchaseGroupService;