import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Potube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const pulicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect(`/users/edit-profile`);
  }
};

export const uploadFiles = multer({ dest: "uploads/" });
