import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Potube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;

  next();
};

export const uploadFiles = multer({ dest: "uploads/" });
