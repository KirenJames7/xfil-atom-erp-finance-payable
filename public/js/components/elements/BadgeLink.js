/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class BadgeLink {
    
    constructor(classes, id, text) {
        this.classes = classes;
        this.id = id;
        this.text = text;     
    }
    
    render() {
        return(
            '<h3><a href="javascript:;" class="badge ' + this.classes.map((value) => { return value; }).join(' ') + '"' + this.id.map((value) => { return ' id="' + value + '"'; }) + '>' + this.text +'</h3>'
        );
    }
    
}

export default BadgeLink;