import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useEffect, useState } from "react";
import { useNotify } from "../hooks";
// import PropTypes from "prop-types";

const Blogs = ({ blog, editBlog, deleteBlog, signedInUser }) => {
  const [visible, setVisible] = useState(false);
  const [hideOrView, setHideOrView] = useState("view");
  const [blogObject, setBlogObject] = useState(blog);

  const notify = useNotify();
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
    editBlog.mutate(updatedBlog);
    setBlogObject(updatedBlog);
    notify({
      message: `Blog ${updatedBlog.title} was successfully updated`,
      status: "success",
    });
  };

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog.mutate(blog.id);
      notify({
        message: `Blog ${blog.title} successfully deleted`,
        status: "success",
      });
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

const Blog = ({ user }) => {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });

  const updateBlog = useMutation({
    mutationFn: blogService.edit,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (res) => {
      console.error(res.response.data.error);
      notify({ message: "Couldn't update blog", status: "error" });
    },
  });

  const deleteBlog = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },

    onError: (res) => {
      console.error(res.response.data.error);
      notify({ message: "Couldn't delete blog", status: "error" });
    },
  });

  if (result.isPending) {
    return <div>Fetching data..</div>;
  }

  const blogs = [...result.data].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      {blogs.map((blog) => (
        <Blogs
          key={blog.id}
          blog={blog}
          editBlog={updateBlog}
          deleteBlog={deleteBlog}
          signedInUser={user}
        />
      ))}
    </div>
  );
};

export default Blog;
