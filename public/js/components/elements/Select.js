/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Select {
    
    constructor(classes, id, attr, options, index) {
        this.classes = classes;
        this.id = id;
        this.attr = attr;
        this.options = options;
        this.index = index;
    }
    
    render() {
        return(
            '<select ' +  (() => { if(this.classes.length){ return 'class="' + this.classes.join(' ') + '"'; } else { return ''; } })() + '" id="' + this.id + '"' + Object.keys(this.attr).map((key) => { return key + '="' + this.attr[key] + '"'; }).join(' ') + '>' +
                Object.keys(this.options).map((key) => { if (this.index) { return '<option value="' + key + '">' + this.options[key] + '</option>'; } else { return '<option value="' + this.options[key] + '">' + this.options[key] + '</option>'; } }).join('') +
            '</select>'
        );
    }
    
}

export default Select;