import User from "../models/User.model.js";
import AdminService from "../services/Admin.Service.js";


export default class AdminController{
    #adminService

    constructor(adminService = new AdminService()) {
        this.#adminService = adminService;
    }
   

    
}