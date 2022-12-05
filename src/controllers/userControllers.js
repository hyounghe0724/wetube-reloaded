import User from "../models/User";
import Video from "../models/video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { token } from "morgan";
import { readFile } from "fs";

const axios = require("axios");

export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  }

  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error["_message"],
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startKakaoLogin = (req, res) => {
  const baseUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&`;
  const REST_API_KEY = process.env.KA_REST_KEY; // .env
  const REDIRECT_URL = "https://jjobtube.herokuapp.com//users/kakao/finish";
  const finalUrl = `${baseUrl}client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URL}`;
  return res.redirect(finalUrl);
};
export const finishKakaoLogin = async (req, res) => {
  const baseUrl = `https://kauth.kakao.com/oauth/token`;
  const AUTHORIZE_CODE = req.query.code;
  const REST_API_KEY = process.env.KA_REST_KEY;
  const grant_type = "authorization_code";
  const redirect_uri = "https://jjobtube.herokuapp.com/users/kakao/finish";
  const scope = "nickname picture email";
  const finalUrl = `${baseUrl}`;
  const tokenRequest = await (
    await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `grant_type=authorization_code&client_id=${REST_API_KEY}&code=${AUTHORIZE_CODE}`,
    })
  ).json();
  const ACCESS_TOKEN = tokenRequest.access_token;
  if ("access_token" in tokenRequest) {
    const kakaoUserInfo = await (
      await fetch("https://kapi.kakao.com/v2/user/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      })
    ).json();
    const kakaoUserObj = kakaoUserInfo.kakao_account;
    if (kakaoUserObj.email === true && kakaoUserObj.is_email_valid === true) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: kakaoUserObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: kakaoUserObj.profile.thumbnail_image_url,
        name: kakaoUserObj.profile.nickname,
        username: kakaoUserObj.profile.nickname,
        email: kakaoUserObj.email,
        password: "",
        socialOnly: true,
        location: "",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.session.user["accessToken"] = ACCESS_TOKEN;
    const tokenRefresh = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      `grant_type=refresh_token&client_id=${REST_API_KEY}&refresh_token=${tokenRequest["refresh_token"]}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;

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
  const baseUrl = `https://github.com/login/oauth/access_token`;
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
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const expireFnc = async (req, res) => {
  const REST_API_KEY = process.env.KA_REST_KEY;
  const LOGOUT_REDIRECT_URI = "http://localhost:57621/users/logout";
  const AUTHORIZE_CODE = req.query.code;
  const OUT_KEY = process.env.KA_SECRET;
  let USER_REFRESH_TOKEN;

  const response = await axios.get(
    `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`
  );
  return res.redirect("/users/logout");
};
export const logout = async (req, res) => {
 
  req.flash("info", "Bye Bye");
  req.session.destroy();
  res.redirect("/");
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  function differInfo(infos) {
    //infos == user write new infomations
    for (let index in infos) {
      const sessionList = [
        req.session.user.name,
        req.session.user.email,
        req.session.user.username,
      ];
      if (sessionList.includes(infos[index])) {
        continue;
      } else {
        return infos[index];
      }
    }
  }

  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  // same const i = req.session.user.ud
  // const { name, email, username, location } = req.body;

  const newInputed = differInfo([name, email, username]);
  const exist = await User.exists({
    $or: [
      { name: newInputed },
      { email: newInputed },
      { username: newInputed },
    ],
  });
  if (exist) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: `${newInputed} is already existed`,
    });
  }
  const isHeroku = process.env.NODE_ENV == "production"
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (isHeroku ? file.location : file.path ): "/" + avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePassworod = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password");
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Chage Password" });
};
export const postChangePassworod = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Chage Password",
      errorMessage: "The current password is incorrect",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Chage Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  user.password = newPassword;
  await user.save();
  req.flash("info", "Password updated");
  return res.redirect("/users/logout");
};
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User Not Found" });
  }
  return res.render("users/profile", { pageTitle: user.name, user });
};
