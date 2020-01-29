/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class ParticleBackground {
    
    constructor() {
        
    }
    
    render() {
        return(
            '<div id="particles-background" class="vertical-centered-box"></div>' +
            '<div id="particles-foreground" class="vertical-centered-box"></div>'
        );
    }
    
}

export default new ParticleBackground().render();