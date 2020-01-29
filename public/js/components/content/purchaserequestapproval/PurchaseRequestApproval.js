/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import PurchaseRequestApprovalController from './PurchaseRequestApprovalController.js';
import Table from '../../elements/Table.js';

class PurchaseRequestApproval {
    
    render() {
        
        return(
            '<div class="row">' +
                '<div class="col-12">' +
                    '<div class="card">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title text-center"> Approve Purchase Request </h5>' +
                            new Table("purchase-request-approval", [ "table", "table-striped", "table-bordered", "table-hover" ]).render() +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

    }
    
}

export default new PurchaseRequestApproval().render();