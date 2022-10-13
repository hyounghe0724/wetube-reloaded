import { query } from "express";
import Video from "../models/video";

/*
console.log("start")
 Video.find({}, (error, videos) => {
    if(error){
        return res.render('server-error')
    }
    return res.render("home", { pageTitle: "Home", videos: []})

 });
 console.log("finish")
*/
export const home = async (req, res) => {
  try {
    //someting trying but find error then catch the error
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.render("Server-error", error);
  }
};
export const watch = async (req, res) => {
  const { id } = req.params; //const id = req.params.id
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params; //const id = req.params.id
  const video = await Video.findById(id); // return VIdeo model
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("edit", { pageTitle: `Editing: ${video.title} `, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params; //const id = req.params.id
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }); // return true or false

  if (!video) {
    console.log("post Edit");
    return res.render("404", { pageTitle: "Video not found" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  console.log(description);
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error["_message"],
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id); //same findOneAndElete({_id:id})
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"), //mongoDB regular expression
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
