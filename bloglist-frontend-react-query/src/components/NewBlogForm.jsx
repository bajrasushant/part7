import { useState } from "react";
import blogService from "../services/blogs";
import { useNotify } from "../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewBlogForms = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog.mutate({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const handleTitleChange = ({ target }) => setTitle(target.value);

  const handleAuthorChange = ({ target }) => setAuthor(target.value);

  const handleUrlChange = ({ target }) => setUrl(target.value);

  return (
    <div>
      <form className="formDiv" onSubmit={addBlog}>
        <h2>create new</h2>
        <div>
          title:
          <input
            id="title"
            type="text"
            name="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            name="Author"
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            name="URL"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button id="submit-new-blog" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

const NewBlogForm = () => {
  // const notify = useNotify();
  // const queryClient = useQueryClient();
  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false);

  // try {
  //   const blog = await blogService.create(blogObject);
  //   blogService.getAll().then((blogs) => setBlogs(blogs));
  //   notify({
  //     message: `a new blog ${blog.title} by ${blog.author} added`,
  //     status: "success",
  //   });
  // } catch (error) {
  //   notify({ message: "Something went wrong", status: "error" });
  // } finally {
  //   setNewBlogFormVisible(false);
  // }

  const notify = useNotify();

  const queryClient = useQueryClient();
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      // queryClient.invalidateQueries(["blogs"]);
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
      notify({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        status: "success",
      });
    },
    onError: (res) => {
      const error = res.response.data.error;
      notify({ message: error, status: "error" });
    },
    onSettled: () => {
      setNewBlogFormVisible(false);
    },
  });

  const hideWhenVisible = { display: newBlogFormVisible ? "none" : "" };
  const showWhenVisible = { display: newBlogFormVisible ? "" : "none" };
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setNewBlogFormVisible(true)}>new form</button>
      </div>
      <div style={showWhenVisible}>
        <NewBlogForms createBlog={newBlogMutation} />
        <button onClick={() => setNewBlogFormVisible(false)}>cancel</button>
      </div>
    </div>
  );
};

export default NewBlogForm;
