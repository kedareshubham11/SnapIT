import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import Profile from "./Profile";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles, Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import Avatar from "@material-ui/core/Avatar";
import AddIcon from "@material-ui/icons/Add";
import HomeIcon from "@material-ui/icons/Home";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    "&:hover": {
      backgroundColor: "#F50057",
      color: "#FFFF",
    },
  },
  avatar: {
    display: "flex",
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

function App() {
  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [openCreatePost, setopenCreatePost] = useState(false);
  const [openProfile, setopenProfile] = useState(false);

  // useeffect runs piece of code based on a specific condition

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //every time a new post is added, this code fires..🔥
        setposts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    // if any change happen in login or logout it will execute
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log("🔥🔥", authUser);
        setUser(authUser);
      } else {
        //user has logged out..
        setUser(null);
      }
    });
  }, [user, Username]);

  const signUp = (event) => {
    event.preventDefault();
    console.log("🚀🚀🚀", Username);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: Username,
        });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setopen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="insta logo"
            />
          </center>
          <form className="app__signup">
            <Input
              placeholder="Username"
              type="text"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              SIGN UP
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="insta logo"
            />
          </center>
          <form className="app__signup">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              SIGN IN
            </Button>
          </form>
        </div>
      </Modal>

      {/* Create Post modal */}
      <Modal open={openCreatePost} onClose={() => setopenCreatePost(false)}>
        <div style={modalStyle} className={classes.paper}>
          {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h3> Sorry you need to login to upload post</h3>
          )}
        </div>
      </Modal>

      {/* EDIT Profile */}
      <Modal open={openProfile} onClose={() => setopenProfile(false)}>
        <div style={modalStyle} className={classes.paper}>
          {user?.displayName ? (
            <Profile username={user.displayName} />
          ) : (
            <Profile username="" />
          )}
        </div>
      </Modal>
      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="insta logo"
        />

        {user ? (
          <div className="app__afterLoginContainer">
            <Button className={classes.button}>
              <HomeIcon />
            </Button>

            <Button
              onClick={() => setopenCreatePost(true)}
              className={classes.button}
            >
              <AddIcon fontSize="large" />
            </Button>
            <Button onClick={() => setopenProfile(true)}>
              <Avatar
                className="profile"
                alt="kedareshubham"
                src="https://pbs.twimg.com/profile_images/1057850240236105728/hp3IKSk8.jpg"
              />
            </Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <span className="button__signin">
              <Button
                className={classes.button}
                onClick={() => setOpenSignIn(true)}
                variant="outlined"
                color="secondary"
              >
                SIGN IN
              </Button>
            </span>
            <Button
              onClick={() => setopen(true)}
              variant="outlined"
              color="secondary"
              className={classes.button}
            >
              SIGN UP
            </Button>
          </div>
        )}
      </div>
      {/* Posts */}
      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            imageUrl={post.imageUrl}
            caption={post.caption}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
