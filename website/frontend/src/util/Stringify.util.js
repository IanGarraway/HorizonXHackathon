
export default class Stringify{

    static text(list){
        let output = ''

        if (list) {
            output = list.join(`, `);
        }      
        
        return output;
    }
}