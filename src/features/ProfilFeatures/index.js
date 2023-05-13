import React, { useEffect, useState, useRef } from "react";
import profilImg from "../../assets/images/avatarUser.png";
import photosIcon from "../../assets/icons/photos.svg";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuthMe } from "../../redux/slices/auth";
import { fetchPosts, removePost } from "../../redux/slices/post";
import { Box, ImageList, ImageListItem, Modal } from "@mui/material";
import axios from "../../axios";
import { NavLink } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 620,
  bgcolor: "background.paper",
  border: "1px solid gray",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function ProfilFeatures() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const userData = useSelector(selectIsAuthMe);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const inputRefAvo = useRef(null);
  const isPostsLoading = posts.status === "loading";
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleMouseEnter = (id) => {
    setHoveredIndex(id);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(-1);
  };

  const handleRemovePost = async (postId) => {
    dispatch(removePost({ postId: postId }));
    const { data } = await axios.get("/posts");
    dispatch(fetchPosts(data));
  };

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  const handleChangeFileAvo = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setAvatarUrl(data.url);
    } catch (err) {
      console.warn(err);
      console.log("image is not send");
    }
  };

  const updateUserAvatarUrl = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
      const response = await axios.put(`/users/${userData._id}/avatarUrl`, {
        avatar: avatarUrl,
      });
      dispatch(fetchPosts(response));
      dispatch(fetchAuthMe(response));
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const myPosts = posts.items.filter(
    (post) => post?.user?._id === userData?._id
  );

  return (
    <div className="profilContainer">
      <div className="profileHeader">
        <div className="profilInfo">
          <div className="profilLeftBox">
            <img
              src={
                userData.avatar
                  ? `http://localhost:8080${userData.avatar}`
                  : profilImg
              }
              alt="#"
            />
          </div>
          <div className="profilRightBox">
            <h1 className="userAvoName">
              {userData.fullName}
              <button onClick={handleOpen} className="editPhotoBtn">
                Edit profile photo
              </button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <form onSubmit={updateUserAvatarUrl}>
                    <input
                      ref={inputRefAvo}
                      type="file"
                      onChange={handleChangeFileAvo}
                    />
                    <button class="commentBtn" type="submit">
                      Add foto
                    </button>
                  </form>
                </Box>
              </Modal>
            </h1>
            {userData?.bio ? <p>{userData?.bio}</p> : null}
          </div>
        </div>
        <div className="profilPhotosBox">
          <img src={photosIcon} alt="#" />
          <p>Photos: {myPosts.length}</p>
        </div>
        <hr />
        <Box sx={{ width: "90%", height: "100vh" }}>
          <ImageList
            variant="masonry"
            cols={4}
            gap={40}
            className="image-wrapper"
          >
            {isPostsLoading ? (
              <p>loading</p>
            ) : (
              myPosts.reverse().map((item) => (
                <ImageListItem
                  key={item._id}
                  className="image-list-item"
                  onMouseEnter={() => handleMouseEnter(item._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    className="imgs"
                    src={`http://localhost:8080${item.imageUrl}?w=248&fit=crop&auto=format`}
                    srcSet={`http://localhost:8080${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.text}
                    loading="lazy"
                  />
                  {hoveredIndex === item._id && (
                    <div className="image-overlay">
                      {String(item.text) ? (
                        <NavLink to={`/detail/${item._id}`}>
                          <p className="image-title">{item.text}</p>
                        </NavLink>
                      ) : null}
                      {item.user._id === userData._id ? (
                        <button
                          onClick={() => handleRemovePost(item._id)}
                          className="hoverDeleteBtn"
                        >
                          Delete
                        </button>
                      ) : (
                        <p>{item.user_id}</p>
                      )}
                    </div>
                  )}
                </ImageListItem>
              ))
            )}
          </ImageList>
        </Box>
      </div>
    </div>
  );
}

export default ProfilFeatures;
