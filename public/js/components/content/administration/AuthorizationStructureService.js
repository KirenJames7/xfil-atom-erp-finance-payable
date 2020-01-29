/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class AuthorizationStructureService {
    
    constructor(company) {
        this.company = company;
    }
    
    getAuthorizationStructures() {
        return $.get({
            url: `adminauthorizationstructures?company= ${ this.company }`
        });
    }
    
    insertAuthorizationStructure() {
        
    }
    
    modifyAuthorizationStructure() {
        
    }
    
}

export default AuthorizationStructureService;