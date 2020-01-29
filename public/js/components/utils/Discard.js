/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Discard {
    
    constructor(deleting_object) {
        
        this.deleting_object = deleting_object;
        
    }
    
    render() {
        
        $(document).on('click', '#discard', function() {
            $.unblockUI();
            $('form')[0].reset();
            document.body.style.overflowY = "auto";
            
            if ( Array().isArray(this.deleting_object) ) {
                
                this.this.deleting_object.each(function(obj) {
                    delete obj;
                });
                
            } else {
            
                delete this.deleting_object;
                
            }
        });
        
    }
    
}

export default Discard;