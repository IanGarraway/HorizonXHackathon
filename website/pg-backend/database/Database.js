import pg from "pg";
const { Client } = pg;

export default class Database {
  #host;
  #port;
  static #client;

  constructor(host, port) {
    this.#host = host;
    this.#port = port;
    Database.#client = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: this.#host,
      port: this.#port,
      database: process.env.DB_NAME,
    });
  }
  connect = async () => {
    try {
      await Database.#client.connect();
    } catch (error) {
      console.log(error.message);
    }
  };

  static getClient = () => {
    return Database.#client;
  };
}
