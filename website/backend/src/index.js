import AccountRoutes from "./routes/Account.Routes.js";
import AdminRoutes from "./routes/Admin.Routes.js";
import Config from "./config/Config.js";
import Database from "./db/Database.js";
import DataRoutes from "./routes/Data.Routes.js";
import Server from "./server/Server.js";

Config.load();
const { PORT, HOST, DB_URI, ALLOWED_ORIGIN } = process.env;


const accountRoutes = new AccountRoutes(ALLOWED_ORIGIN);
const adminRoutes = new AdminRoutes(ALLOWED_ORIGIN);
const dataRoutes = new DataRoutes(ALLOWED_ORIGIN);

const server = new Server(PORT, HOST, accountRoutes, adminRoutes, dataRoutes, ALLOWED_ORIGIN);
//const database = new Database(DB_URI);


server.start();
// await database.connect();