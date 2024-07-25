import cors from "cors";
import express from "express";

export default class Server {
  #app;
  #port;
  #host;
  #server;
  #router;

  constructor(port, host, router) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#router = router;
  }

  getApp = () => {
    return this.#app;
  };

  start = () => {
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(
        `Server is running on ${this.#server.address().address}:${
          this.#server.address().port
        }`
      );
    });

    this.#app.use(express.json());
    this.#app.use(cors());

    this.#router.getRouter().forEach((router) => {
      this.#app.use(router.getRouterStartPoint(), router.getRouter());
    });
  };

  close = () => {
    this.#server?.close();
  };
}
