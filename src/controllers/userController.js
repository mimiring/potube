export const getJoin = (req, res) => {
  res.render("join", {
    tabTitle: "Create Account",
    seoDescription: "Potube에 가입하는 곳입니다",
    errorMessage: null,
    tempUser: [],
  });
};

export const postJoin = (req, res) => {
  console.log(req.body);
  res.end();
};

export const edit = (req, res) => {
  res.send("Edit User");
};

export const remove = (req, res) => {
  res.send("Deltet User");
};

export const login = (req, res) => {
  res.send("Login");
};

export const logout = (req, res) => {
  res.send("Logout");
};

export const see = (req, res) => {
  res.send("See Profile");
};
