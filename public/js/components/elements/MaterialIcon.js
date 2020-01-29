/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class MaterialIcon {
    
    constructor(icon) {
        
        this.icon = icon;
        
    }
    
    render() {
        
        return (
            '<i class="material-icons">' +
                this.icon +
            '</i>'
        );
        
    }
    
}

export default MaterialIcon;