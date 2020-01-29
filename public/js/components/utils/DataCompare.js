/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class DataCompare {
    
    constructor(first, second) {
        
        this.first = first;
        this.second = second;
    
    }
    
    compare() {
        
        return this.first.every((element) => this.second.includes(element)) && this.second.every((element) => this.first.includes(element));
        
    }
    
    getDifference() {
        
        return this.second.filter(element => !this.first.includes(element));
        
    }
    
}

export default DataCompare;