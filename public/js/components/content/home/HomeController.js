/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class HomeController {
    
    home() {
        $(document).ready(() => {
            setTimeout(function(){
                $('.page-loader').toggle();
                document.body.style.overflowY = "auto";
            }, 2000);
        });
    }
    
    builder() {
        setTimeout(function() {
            if ( window.login ) {
                new HomeController().home();
            } else {
                
            }
        }, 500);
    }
    
}

export default HomeController;