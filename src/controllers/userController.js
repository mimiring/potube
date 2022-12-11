import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  res.render("join", {
    tabTitle: "Create Account",
    seoDescription: "Potube에 가입하는 곳입니다",
    errorMessage: null,
    tempUser: [],
  });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const exists = await User.exists({ $or: [{ username }, { email }] });

  if (password !== password2) {
    return res.render("join", {
      tabTitle: "Join",
      seoDescription: "Potube에 가입하는 곳입니다",
      errorMessage: "Password confirmation does not match.",
      tempUser: [],
    });
  }

  if (exists) {
    return res.status(400).render("join", {
      tabTitle: "Join",
      seoDescription: "Potube에 가입하는 곳입니다",
      errorMessage: "This username/email is already taken.",
      tempUser: [],
    });
  }
  await User.create({ name, username, email, password, location });
  return res.redirect("/login");
};

export const edit = (req, res) => {
  res.send("Edit User");
};

export const remove = (req, res) => {
  res.send("Deltet User");
};

export const getLogin = (req, res) => {
  res.render("login", {
    tabTitle: "Login",
    pageTitle: "Login",
    seoDescription: "Potube에 로그인하는 곳입니다",
    errorMessage: null,
    tempUser: [],
  });
};

export const postLogin = async (req, res) => {
  // check if account exists
  const tabTitle = "Login";
  const pageTitle = "Login";
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).render("login", {
      tabTitle,
      pageTitle,
      seoDescription: "Potube에 가입하는 곳입니다",
      errorMessage: "An account with this username does not exists",
      tempUser: [],
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      tabTitle,
      pageTitle,
      seoDescription: "Potube에 가입하는 곳입니다",
      errorMessage: "Wrong Password.",
      tempUser: [],
    });
  }

  req.session.user = user;
  req.session.user.loggedIn = true;

  return res.render("login", {
    tabTitle,
    pageTitle,
    seoDescription: "Potube에 가입하는 곳입니다",
    errorMessage: null,
    tempUser: req.session.user,
  });
};

export const logout = (req, res) => {
  res.send("Logout");
};

export const see = (req, res) => {
  res.send("See Profile");
};
