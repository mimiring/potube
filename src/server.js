import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");
app.set("view engine", "ejs");

app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "message no one knows",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/potube" }),
  })
);

app.get("/add-one", (req, res, next) => {
  req.session.gogu += 1;
  return res.send(`${req.session.id}\n ${req.session.gogu}`);
});

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
