import Video from "../models/Video";

const tempUser = {
  username: "Posi",
  loggedIn: false,
};

/*
export const home = (req, res) => {
  console.log("i Start");

  Video.find({}, (error, videos) => {
    if (error) {
      return res.render("server-error");
    }

    console.log(videos);
    return res.render("home", {
      tabTitle: "Home",
      seoDescription: "Potube의 홈입니다.",
      videos,
      tempUser,
    });
  });

  console.log("i finish");
};
*/

export const home = async (req, res) => {
  Video.find({}, (error, videos) => {
    return res.render("home", {
      tabTitle: "Home",
      seoDescription: "Potube의 홈입니다.",
      videos,
      tempUser,
    });
  });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", {
      tabTitle: "Error",
      pageTitle: "404 Not Found",
      seoDescription: "404 Not Found",
      video,
      tempUser,
    });
  }

  return res.render("watch", {
    tabTitle: "Watch Video",
    pageTitle: `Watching ${video.title}`,
    seoDescription: "Potube에서 비디오를 보는 곳입니다",
    video,
    tempUser,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", {
      tabTitle: "Error",
      pageTitle: "404 Not Found",
      seoDescription: "404 Not Found",
      video,
      tempUser,
    });
  }

  return res.render("edit", {
    tabTitle: "Watch Video",
    pageTitle: `Edit : ${video.title}`,
    seoDescription: "Potube에서 비디오를 보는 곳입니다",
    video,
    tempUser,
  });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  [id - 1].title = title;

  return res.redirect(`//${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", {
    tabTitle: "Upload Video",
    pageTitle: "Upload",
    seoDescription: "Potube에서 비디오를 올리는 곳입니다",
    tempUser,
    errorMessage: null,
  });
};

export const postUpload = async (req, res) => {
  // here we will add a to the  array.
  const { title, description, hashTags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashTags: hashTags.split(",").map((hashTag) => `#${hashTag}`),
    });
  } catch (error) {
    console.log(error);

    return res.render("upload", {
      tabTitle: "Upload Video",
      pageTitle: "Upload",
      seoDescription: "Potube에서 비디오를 올리는 곳입니다",
      tempUser,
      errorMessage: error._message,
    });
  }

  return res.redirect("/");
};

export const search = (req, res) => {
  res.send("Search Video");
};

export const deleteVideo = (req, res) => {
  res.send("Delete Video");
};
