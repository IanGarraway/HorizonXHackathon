

export default class Filter{

    static byName(modelList, name) {
        let newList = [];
        modelList.forEach(model => {
            if (model.name.toLowerCase().includes(name.toLowerCase())) {
                newList.push(model);
            }
        });
        return newList;
        
    }

    static byOrganisation(modelList, org) {
        let newList = [];
        modelList.forEach(model => {
            if (model.organization.toLowerCase().includes(org.toLowerCase())) {
                newList.push(model);
            }
        });
        return newList;
    }
}