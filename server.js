const app = require("./app/app");
const http = require("http");

const port = (process.env.PORT || "3000");
const server = http.createServer(app);

app.set("port", port);
server.listen(port);
