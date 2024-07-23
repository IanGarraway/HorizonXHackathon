import Stringify from "./Stringify.util";

export default class Filter {
  static byName(modelList, name) {
    let newList = [];
    modelList.forEach((model) => {
      if (model.name.toLowerCase().includes(name.toLowerCase())) {
        newList.push(model);
      }
    });
    return newList;
  }

  static byOrganisation(modelList, org) {
    let newList = [];
    modelList.forEach((model) => {
      if (
        Stringify.text(model.organizations)
          .toLowerCase()
          .includes(org.toLowerCase())
      ) {
        newList.push(model);
      }
    });
    return newList;
  }

  static filterModels(modelList, filters) {
    return modelList.filter((model) => {
      // Check for name filter
      const nameMatch = filters.name
        ? model.name.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      // Check for organization filter
      const orgMatch = filters.organisation
        ? Stringify.text(model.organizations)
            .toLowerCase()
            .includes(filters.organisation.toLowerCase())
        : true;
      // Model passes if it matches all filters
      return nameMatch && orgMatch;
    });
  }
}
