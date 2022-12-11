import express from "express";
import morgan from "morgan";
import session from "express-session";
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
    resave: true,
    saveUninitialized: true,
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
