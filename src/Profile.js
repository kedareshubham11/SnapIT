import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, Button, Input } from "@material-ui/core";
import firebase from "firebase";
import { auth, storage, db } from "./firebase";

import "./Profile.css";

const useStyles = makeStyles((theme) => ({
  button: {
    "&:hover": {
      backgroundColor: "#F50057",
      color: "#FFFF",
    },
  },
  button2: {
    marginTop: "20px",
    color: "white",
    backgroundColor: "#F50057",
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  input: {
    marginTop: "5px",
  },
}));

function Profile({ username }) {
  const classes = useStyles();
  const [progress, setprogress] = useState(0);
  const [image, setimage] = useState(null);
  const [isFileSelected, setisFileSelected] = useState(false);
  const [displayName, setdisplayName] = useState(username);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setimage(e.target.files[0]);
    }
    setisFileSelected(true);
  };

  const updateProfile = () => {
    if (isFileSelected) {
      const uploadTask = storage.ref(`profile/${image.name}`).put(image);
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
            .ref("profile")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              // post image inside db
              db.collection("profile").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                displayName: displayName,
                profileUrl: url,
              });
              setprogress(0);
              setdisplayName(displayName);
              setimage(url);
            });
        }
      );
    } else {
      alert("File is not selected");
    }
  };
  return (
    <div className="profileModal">
      <label>
        <input id="file" type="file" onChange={handleChange} />
        <Avatar
          className={`profile_avatar ${classes.large} `}
          alt="kedareshubham"
          // src={"https://pbs.twimg.com/profile_images/1057850240236105728/hp3IKSk8.jpg"}
          src={"https://image.flaticon.com/icons/svg/599/599305.svg"}
        />
      </label>
      <Input
        className={classes.input}
        type="text"
        inputProps={{ min: 0, style: { textAlign: "center" } }}
        value={displayName}
        placeholder="Display Name"
        onChange={(e) => setdisplayName(e.target.value)}
      ></Input>

      <progress className="imageupload__progress" value={progress} max="100" />
      <Button
        className={classes.button}
        variant="outlined"
        color="secondary"
        onClick={updateProfile}
      >
        Update Profile
      </Button>
      <Button className={classes.button2} onClick={() => auth.signOut()}>
        Logout
      </Button>
    </div>
  );
}

export default Profile;
