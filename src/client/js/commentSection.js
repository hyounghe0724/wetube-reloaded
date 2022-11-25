import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id; //why have 
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";;
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.className = "deleteBtn"
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2)
  videoComments.prepend(newComment);
}
// - 댓글 삭제하기 (삭제시 비디오나 유저 도큐먼트에서도 삭제 필요)

// 추가로 구현해볼 만한 기능들
// - 댓글 추가 및 삭제시 실시간으로 댓글 갯수 변경
// - 댓글 수정하기
// - 좋아요
// - 좋아요 취소
// - 해시태그 클릭시 비디오 찾기
const handleSubmit = async(event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text == "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (response.status == 201) {
    const {newCommentId} = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}