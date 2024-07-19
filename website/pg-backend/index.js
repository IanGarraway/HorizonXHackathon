import Config from "./config/Config.js";
import Database from "./database/Database.js";
import DataRoutes from "./routes/Data.route.js";
import Router from "./routes/Router.js";
import Server from "./server/Server.js";

Config.load();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

const database = new Database(DB_HOST, DB_PORT);

const router = new Router();
const dataRouter = new DataRoutes();
router.addRouter(dataRouter);

const server = new Server(PORT, HOST, router);

server.start();
// database.connect();
