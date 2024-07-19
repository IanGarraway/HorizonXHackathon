import { Router } from "express";
import DataController from "../controller/Data.controller.js";

export default class DataRoutes {
  #origin;
  #controller;
  #router;
  #routeStartPoint;

  constructor(
    origin = "http://localhost:5173",
    controller = new DataController(),
    routeStartPoint = "/"
  ) {
    this.#origin = origin;
    this.#controller = controller;
    this.#routeStartPoint = routeStartPoint;
    this.#router = Router();
    this.#initialiseRoutes();
  }

  #initialiseRoutes = () => {
    //CORS middleware
    // this.#router.use((req, res, next) => {
    //   res.header("Access-Control-Allow-Origin", this.#origin);
    //   res.header("Access-Control-Allow-Methods", "GET, POST");
    //   res.header(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
    //   );
    //   res.header("Access-Control-Allow-Credentials", "true");
    //   next();
    // });

    //Data Routes

    this.#router.get("/", [], this.#controller.getData);
  };

  getRouterStartPoint = () => {
    return this.#routeStartPoint;
  };
  getRouter = () => {
    return this.#router;
  };
}
