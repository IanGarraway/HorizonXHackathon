
export default class Find{

    static indexByName(dataSet, item) {

        for(let i = 0; i < dataSet.length; i++){
            if (dataSet[i].name == item) {
                return i;
            }
        }
        return -1;
        
    }
}