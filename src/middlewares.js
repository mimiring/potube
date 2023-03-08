import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Potube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;

  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  }
  return res.status(400).send({ errorMessage: "로그인하십쇼" });
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  }

  return res.status(400).send({ errorMessage: "로그인 안한 사람만 가능" });
};

export const uploadFiles = multer({ dest: "uploads/" });
