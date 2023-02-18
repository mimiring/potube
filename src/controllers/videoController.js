import User from "../models/User";
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
  }).sort({ createdAt: "desc" });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const owner = await User.findById(video.owner);

  if (!video || !owner) {
    return res.status(404).render("404", {
      tabTitle: "Error",
      pageTitle: "404 Not Found",
      seoDescription: "404 Not Found",
      video,
      tempUser,
      errorMessage: "404 Not Found",
    });
  }

  return res.render("watch", {
    tabTitle: "Watch Video",
    pageTitle: `Watching ${video.title}`,
    seoDescription: "Potube에서 비디오를 보는 곳입니다",
    video,
    owner,
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

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashTags } = req.body;

  const isExistsVideo = await Video.exists({ _id: id });
  if (!isExistsVideo) {
    return res.render("404", {
      tabTitle: "Error",
      pageTitle: "Video Not Found",
      seoDescription: "404 Not Found",
      tempUser,
    });
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashTags: Video.formatHashTags(hashTags),
  });

  return res.redirect(`/videos/${id}`);
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
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, hashTags } = req.body;

  try {
    await Video.create({
      title,
      description,
      fileUrl,
      owner: _id,
      hashTags: Video.formatHashTags(hashTags),
    });

    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      tabTitle: "Error",
      pageTitle: "Video Not Found",
      seoDescription: "404 Not Found",
      tempUser,
      errorMessage: error._message,
    });
  }
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let searchedVideos = [];

  if (keyword) {
    searchedVideos = await Video.find({
      title: { $regex: new RegExp(keyword, "i") },
    });
  }

  return res.render("search", {
    tabTitle: "Search",
    seoDescription: "Potube에서 비디오를 찾는 곳입니다",
    tempUser,
    errorMessage: null,
    searchedVideos,
  });
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);

  return res.redirect("/");
};
