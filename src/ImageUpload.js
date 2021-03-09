import React, { useState } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "./firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setcaption] = useState("");
  const [image, setimage] = useState(null);
  const [progress, setprogress] = useState(0);
  const [isFileSelected, setisFileSelected] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setimage(e.target.files[0]);
    }
    setisFileSelected(true);
  };

  const handleUpload = () => {
    if (isFileSelected) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setprogress(progress);
        },
        (error) => {
          //error function ..
          console.log(error);
          alert(error.message);
        },
        () => {
          //   complete function
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              // post image inside db
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                username: username,
              });
              setprogress(0);
              setcaption("");
              setimage(null);
            });
        }
      );
    } else {
      alert("File is not selected");
    }
  };

  return (
    <div className="image__upload">
      <h1 className="createPostTitle">Create Post </h1>
      <progress className="imageupload__progress" value={progress} max="100" />

      <input
        className="createPost_Input"
        type="text"
        placeholder="Enter a caption"
        onChange={(event) => setcaption(event.target.value)}
        value={caption}
        required
      />
      <input
        className="post_image"
        type="file"
        required
        onChange={handleChange}
      />
      <Button
        className="post_button"
        type="submit"
        onClick={handleUpload}
        variant="contained"
        color="secondary"
      >
        Post
      </Button>
    </div>
  );
}

export default ImageUpload;
