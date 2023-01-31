import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const postJoin = async (req, res) => {
  try {
    const { name, username, email, password, password2, location } = req.body;
    const exists = await User.exists({ $or: [{ username }, { email }] });

    if (password !== password2) {
      return res.status(400).send({
        errorMessage: "Password confirmation does not match.",
      });
    }

    if (exists) {
      return res.status(400).send({
        errorMessage: "This username/email is already taken.",
      });
    }
    await User.create({
      name,
      username,
      email,
      password,
      location,
      githubLoginOnly: false,
    });

    return res.send({ ok: true });
  } catch (error) {
    return res.status(400).send({ errorMessage: "unexpected error" });
  }
};

export const putEditProfile = async (req, res) => {
  const newUserInfo = req.body;
  const email = newUserInfo.email;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({
      errorMessage: "An account with this email does not exists",
    });
  }

  res.send({ ok: true, user: newUserInfo });
};

export const putEditPassword = async (req, res) => {
  const id = req.session.user._id;
  const { currentPassword, newPassword, newPassword2 } = req.body.passwords;
  const isBlankPassword =
    currentPassword.length === 0 ||
    newPassword.length === 0 ||
    newPassword2.length === 0;

  if (isBlankPassword) {
    return res.status(400).send({
      errorMessage: "Please enter your password.",
    });
  }

  const user = await User.findById(id);
  const isCorrectCurrentPassword = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCorrectCurrentPassword) {
    return res.status(400).send({
      errorMessage: "Check your current password.",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).send({
      errorMessage: "Password confirmation does not match.",
    });
  }

  user.password = newPassword;
  await user.save();
  return res.send({ ok: true });
};

export const remove = (req, res) => {
  res.send("Deltet User");
};

export const postLogin = async (req, res) => {
  // check if account exists
  const { email, password } = req.body;
  const user = await User.findOne({ email, githubLoginOnly: false });

  if (!user) {
    return res.status(400).send({
      errorMessage: "An account with this email does not exists",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).send({
      errorMessage: "Wrong Password.",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.send({ ok: true, user });
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
  const isDestoried = req.session.destroy();

  if (!isDestoried) {
    return res.status(400).send({
      errorMessage: "Something Wrong.",
    });
  }
  return res.send({ ok: true });
};

export const see = (req, res) => {
  res.send("See Profile");
};
