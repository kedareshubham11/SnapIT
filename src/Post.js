import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import { db } from "./firebase";

function Post({ user, username, caption, imageUrl, postId }) {
  const [comments, setcomments] = useState([]);
  const [comment, setcomment] = useState("");
  useEffect(() => {
    let unsubscibe;
    if (postId) {
      unsubscibe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setcomments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscibe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setcomment("");
  };

  return (
    <div className="post">
      {/* header -. avatar -. username */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="user"
          src="https://i.pinimg.com/originals/32/73/05/327305f8ae2d590605146e9b3b0d59f0.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageUrl} alt="post" />

      {/* caption */}
      <h4 className="post__text">
        <strong>{username}: </strong>
        {caption}
      </h4>

      <div class="post__comments">
        {comments.map((comment) => (
          <p>
            <strong> {comment.username} </strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add  acomment"
            value={comment}
            onChange={(event) => setcomment(event.target.value)}
          />

          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
