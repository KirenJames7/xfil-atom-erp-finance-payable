/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import VendorDetailsController from './VendorDetailsController.js';
import Table from '../../elements/Table.js';

class VendorDetails {
    
    render() {
        
        return(
            '<div class="row">' +
                '<div class="col-12">' +
                    '<div class="card">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title text-center"> Vendor Details </h5>' +
                            new Table('vendor-details', ['table', 'table-bordered', 'table-striped', 'table-hover']).render() +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

    }

}

export default new VendorDetails().render();