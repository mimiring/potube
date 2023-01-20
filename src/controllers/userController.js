import User from "../models/User";
import fetch from "node-fetch";
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

export const getEdit = (req, res) => {
  res.render("editProfile", {
    tabTitle: "Edit Profile",
    seoDescription: "User Profile을 수정하는 곳입니다",
    errorMessage: null,
    tempUser: [],
  });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;

  await User.findByIdAndUpdate(_id, {
    name,
    email,
    username,
    location,
  });

  return res.redirect("/");
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
  const user = await User.findOne({ email, githubLoginOnly: false });

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

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObject = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObject) {
      return res.redirect("/login");
    }

    const existingUser = await User.findOne({ email: emailObject.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;

      return res.redirect("/");
    } else {
      // create an account
      const user = await User.create({
        name: userData.name,
        githubLoginOnly: true,
        username: userData.login,
        email: userData.email,
        password: "",
        avatarUrl: userData.avatar_url,
        location: userData.location,
      });

      req.session.loggedIn = true;
      req.session.user = user;

      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();

  return res.redirect("/");
};

export const see = (req, res) => {
  res.send("See Profile");
};
