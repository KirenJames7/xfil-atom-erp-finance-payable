/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import PurchaseQuoteAuthorizationController from './PurchaseQuoteAuthorizationController.js';
import Table from '../../elements/Table.js';

class PurchaseQuoteAuthorization {
    
    constructor() {
        
    }
    
    render() {
        
        return(
            '<div class="row">' +
                '<div class="col-12">' +
                    '<div class="card">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title text-center"> Authorize Purchase Quote </h5>' +
                            new Table("purchase-quote-authorization", [ "table", "table-striped", "table-bordered", "table-hover" ]).render() +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

    }
    
}

export default new PurchaseQuoteAuthorization().render();