/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class NothingSelectedAlert {
    
    render() {
        
        swal({
            title: "Nothing Selected!",
            text: "Please select a record to proceed.",
            icon: "info",
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: {
                confirm: {
                    text: "OK"
                }
            }
        });
    
    }
    
}

export default NothingSelectedAlert;