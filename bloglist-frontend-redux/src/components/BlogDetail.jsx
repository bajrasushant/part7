import React from "react";
import { useDispatch } from "react-redux";
import { likeBlogs, removeBlogs } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";

const BlogDetail = ({ blog, signedInUser }) => {
  const dispatch = useDispatch();

  const updateBlog = async (updatedBlog) => {
    try {
      dispatch(likeBlogs(updatedBlog));
      dispatch(
        setNotification({
          message: `Blog ${updatedBlog.title} was successfully updated`,
          status: "success",
        }),
      );
    } catch (e) {
      dispatch(
        setNotification({ message: "Couldn't update blog", status: "error" }),
      );
    }
  };

  const deleteBlog = async (blogToDelete) => {
    try {
      dispatch(removeBlogs(blogToDelete.id));
      dispatch(
        setNotification({
          message: `${blogToDelete.title} successfully deleted`,
          status: "success",
        }),
      );
    } catch (error) {
      dispatch(
        setNotification({ message: "Couldn't delete blog", status: "error" }),
      );
    }
  };

  const incrementLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    updateBlog(updatedBlog);
  };

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog);
    }
  };

  console.log(blog);
  if (!blog) return null;
  return (
    <div className="blog-extra-details">
      <h2>{blog.title} {blog.author}</h2>
      <a className="blogUrl" href={`${blog.url}`}>
        {blog.url}
      </a>
      <div className="blogLikes">
        {blog.likes} likes
        <button className="like-button" onClick={incrementLike}>
          like
        </button>
      </div>
      <div className="blogUsername">added by {blog.user?.username}</div>
      {signedInUser.username === blog.user?.username && (
        <button className="delete-button" onClick={removeBlog}>
          remove
        </button>
      )}
    </div>

  );

};

export default BlogDetail;
