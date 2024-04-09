import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import blogService from "../services/blogs";
import { setNotification } from "../reducers/notificationReducer";
// import PropTypes from "prop-types";

const Blogs = ({ blog, editBlog, deleteBlog, signedInUser }) => {
  const [visible, setVisible] = useState(false);
  const [hideOrView, setHideOrView] = useState("view");
  const [blogObject, setBlogObject] = useState(blog);

  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
    setHideOrView(hideOrView === "view" ? "hide" : "view");
  };

  const incrementLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    editBlog(updatedBlog);
    setBlogObject(updatedBlog);
  };

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog);
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className="blog_list" style={blogStyle}>
      <div className="blog">
        <div className="title-and-author">
          {blog.title} {blog.author}
        </div>
        <button onClick={toggleVisibility}>{hideOrView}</button>
        <div className="blog-extra-details" style={showWhenVisible}>
          <a className="blogUrl" href={`${blog.url}`}>
            {blog.url}
          </a>
          <div className="blogLikes">
            likes {blogObject.likes}
            <button className="like-button" onClick={incrementLike}>
              like
            </button>
          </div>
          <div className="blogUsername">{blog.user.username}</div>
          {signedInUser.username === blog.user.username && (
            <button className="delete-button" onClick={removeBlog}>
              remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Blog = ({ signedInUser }) => {
  const updateBlog = async (updatedBlog) => {
    try {
      await blogService.edit(updatedBlog);
      setBlogs(
        blogs
          .map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
          .sort((a, b) => b.likes - a.likes),
      );
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
      await blogService.deleteBlog(blogToDelete.id);
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
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
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  return (
    <div>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blogs
            key={blog.id}
            blog={blog}
            signedInUser={signedInUser}
            editBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        ))}
    </div>
  );
};

// Blog.propTypes = {
//   blog: PropTypes.object.isRequired,
//   signedInUser: PropTypes.object.isRequired,
//   editBlog: PropTypes.func.isRequired,
//   deleteBlog: PropTypes.func.isRequired,
// };

export default Blog;
