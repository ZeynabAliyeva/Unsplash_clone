import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuthMe } from "../../redux/slices/auth";
import { fetchPosts, removePost } from "../../redux/slices/post";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import searcicon from "../../assets/icons/search.png";
import axios from "../../axios";
import "./index.css";
import { NavLink } from "react-router-dom";

function HomeFeatures() {
  const [searchValue, setSearchValue] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const { posts } = useSelector((state) => state.posts);
  const userData = useSelector(selectIsAuthMe);
  const dispatch = useDispatch();
  const isPostsLoading = posts.status === "loading";
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

  return (
    <div className="imgBox">
      <div className="formBoxHome">
        <form className="headerForm">
          <img className="srcIcon" src={searcicon} alt="#" />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="srcInput"
            placeholder="Search by name"
          />
        </form>
      </div>
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
            [...posts?.items]
              .filter((item) => {
                return searchValue.toLowerCase().trim() === ""
                  ? item
                  : item.text.toLowerCase().trim().includes(searchValue);
              })
              .reverse()
              .map((item) => (
                <ImageListItem
                  key={item?._id}
                  className="image-list-item"
                  onMouseEnter={() => handleMouseEnter(item?._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    className="imgs"
                    src={`http://localhost:8080${item.imageUrl}?w=248&fit=crop&auto=format`}
                    srcSet={`http://localhost:8080${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.text}
                    loading="lazy"
                  />
                  {hoveredIndex === item?._id && (
                    <div className="image-overlay">
                      {String(item.text) ? (
                        <NavLink to={`/detail/${item?._id}`}>
                          {item?.text ? (
                            <p className="image-title">{item?.text}</p>
                          ) : null}
                        </NavLink>
                      ) : null}
                      {item.user?._id === userData?._id ? (
                        <button
                          onClick={() => handleRemovePost(item?._id)}
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
  );
}

export default HomeFeatures;
