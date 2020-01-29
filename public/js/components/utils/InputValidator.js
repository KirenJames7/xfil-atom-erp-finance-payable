/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class InputValidator {
    
    constructor(conditions, elements) {
        this.conditions = conditions;
        this.elements = elements;
    }
    
    validator() {
        let results = [];
        
        $.each(this.conditions, (key, condition) => {
            if ( !condition ) {
                
            }
        })
    }
    
}

export default InputValidator;