import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";

export default class Database{
    #uri;
    #sequelize;

    constructor(uri) {
        this.#uri = uri;
        
    }

    connect = async (attempt = 0) => {        
        try {
            this.#sequelize = new Sequelize(`postgres://${this.#uri}`);
            await this.#sequelize.authenticate();

            return console.log(`Database connection was successful`);
        } catch (error) {
            console.log("Database connection error", error);

            if (attempt < 10) setTimeout(() => this.connect(attempt + 1), 500)
            else console.log("Database unavailable");
        }
    }

    close = async () => {
        await this.#sequelize.close();
    }
}