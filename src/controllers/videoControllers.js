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
export const home = async(req, res) => {
    try{ //someting trying but find error then catch the error
    const videos = await Video.find({})
    console.log(videos)
    return res.render("home", { pageTitle: "Home", videos});
    } catch(error) {
        return res.render("Server-error", error)
    }
    
}
export const watch = (req, res) => {
    const { id } = req.params; //const id = req.params.id
    return res.render("watch", {pageTitle: `Watching `});
}
export const getEdit = (req, res) => {
    const { id } = req.params; //const id = req.params.id
    return res.render("edit", {pageTitle:`Editing: `})
}
export const postEdit = (req, res) => {
    const { id } = req.params; //const id = req.params.id
    const { title } = req.params;
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload video"});
};

export const postUpload = async(req, res) => {   
    const { title, description, hashtags } = req.body;
    await Video.create({
        title,
        description,
        createdAt: Date.now(),
        hashtags: hashtags.split(",").map(word => `#${word}`),
        meta:{
            views: 0,
            rating: 0,
        },
    });
    return res.redirect("/");
}

