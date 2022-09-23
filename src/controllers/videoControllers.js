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
    return res.render("home", { pageTitle: "Home", videos});
    } catch(error) {
        return res.render("Server-error", error)
    }
    
}
export const watch = async(req, res) => {
    const { id } = req.params; //const id = req.params.id
    const video = await Video.findById(id);
    console.log(video)
    return res.render("watch", {pageTitle: video.title, video});
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
    console.log(description)
    try{
    await Video.create({
        title,
        description,
        hashtags: hashtags.split(",").map((word) => `#${word}`),
    }); 
    return res.redirect("/");
    } catch(error){
        console.log(error)
        return res.render("upload", {
         pageTitle: "Upload Video", 
         errorMessage: error["_message"]
    });
    } 
}

