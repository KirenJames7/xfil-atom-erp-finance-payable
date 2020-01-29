/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Image {
    
    constructor(source, classes, alt) {
        this.source = source;
        this.classes = classes;
        this.alt = alt;
    }
    
    render() {
        return(
            '<img src="' + this.source + '" '+ (() => { if(this.classes.length){ return 'class="' + this.classes.join(' ') + '"'; } else { return ''; } })() +' alt="' + this.alt + '"/>'
        );
    }
    
}

export default Image;