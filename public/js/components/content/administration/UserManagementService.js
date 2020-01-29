/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class UserManagementService {
    
    constructor(company) {
        this.company = company;
    }
    
    getUserManagement() {
        return $.get({
            url: `adminusermanagement?company=${ this.company }`
        });
    }
    
}

export default UserManagementService;