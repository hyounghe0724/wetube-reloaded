export const localsMiddleWare = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.sideName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  console.log(req.session);
  next();
};