/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class PageLoader {
    
    constructor() {
        
    }
    
    render() {
        return(
            '<div class="page-loader">' +
                '<div id="particles-background" class="vertical-centered-box"></div>' +
                '<div id="particles-foreground" class="vertical-centered-box"></div>' +
                '<div class="lds-css ng-scope">' +
                    '<div class="lds-eclipse" style="background-image:url(../../../images/app-logo/atom.svg), url(../../../images/app-logo/finance-ap-logo-icon.svg)">' +
                        '<div></div>' +
                    '</div>' +
                '</div>' +
                '<div class="atom-spinner">' +
                    '<div class="spinner-inner">' +
                        '<div class="spinner-line" style="border-left-color:#4abcff"></div>' +
                        '<div class="spinner-line" style="border-left-color:#4abcff"></div>' +
                        '<div class="spinner-line" style="border-left-color:#4abcff"></div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }
    
}

export default PageLoader;