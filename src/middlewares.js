export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Potube";
  console.log(req.session);

  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;

  next();
};
