import { query } from "express";
import { async } from "regenerator-runtime";
import User from "../models/User";
import Comment from "../models/Comment";
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
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.render("Server-error", error);
  }
};
export const watch = async (req, res) => {
  const { id } = req.params; //const id = req.params.id
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: video.title, video});
};
export const getEdit = async (req, res) => {
  const { id } = req.params; //const id = req.params.id
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id); // return VIdeo model
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", {
    pageTitle: `Editing: ${video.title} `,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params; //const id = req.params.id
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.exists({ _id: id }); // return true or false

  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Change saved");
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  let { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  video[0].location = video[0].location.replace(/\\/g, "/")
  thumb[0].location = thumb[0].location.replace(/\\/g, "/")
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].location,
      thumbUrl: thumb[0].location,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();
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
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(req.session.user._id)) {
    return res.status(403).redirect("/");
  }
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
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async(req, res) => {
  const {
    session: { user },
    body: { text },
    params: {id},
  } = req
  if (user == undefined) {
    req.flash("error", "You must login for write comment");
    return res.sendStatus(403)
  } else {
    const video = await Video.findById(id).populate("comments");
  
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  })
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({newCommentId: comment._id});
  }
  // const video = await Video.findById(id).populate("comments");
  
  // if (!video) {
  //   return res.sendStatus(404);
  // }
  // const comment = await Comment.create({
  //   text,
  //   owner: user._id,
  //   video: id,
  // })
  // video.comments.push(comment._id);
  // video.save();
  // return res.status(201).json({newCommentId: comment._id});
}

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const {user} = req.session
  const ownerComment = await Comment.findById(commentId);
  if (user._id == ownerComment._id) {
    const commentDelete = await Comment.findByIdAndDelete(commentId)
    return res.sendStatus(201)
  }
  else {
    return res.sendStatus(404)
  }
}