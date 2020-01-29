/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class SelectLabel {
    
    constructor(text) {
        this.text = text;
    }
    
    render() {
        return(
            '<label class="select-label">' + this.text + ' : &nbsp;</label>'
        );
    }
    
}

export default SelectLabel;