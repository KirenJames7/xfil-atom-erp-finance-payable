/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Form {
    
    constructor(form) {
        this.form = form;
        this.form.form_enctype = this.form.form_enctype || "application/x-www-form-urlencoded";
    }
    
    render() {
        return(
            '<form method="' + this.form.form_method  + '" id="' + this.form.form_id + '" enctype="' + this.form.form_enctype + '">'
        );
    }
    
}

export default Form;