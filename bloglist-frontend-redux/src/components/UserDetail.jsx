import React from "react";

const UserDetail = ({ user }) => {
  if (!user) return null;
  return (
    <>
      <h1>{user.name}</h1>
      <h2>added blogs </h2>
      <ul>
        {user.blogs && user.blogs.length > 0 ? (
          user.blogs.map((blog) => {
            return <li key={blog.id}>{blog.title}</li>;
          })
        ) : (
          <div>None</div>
        )}
      </ul>
    </>
  );
};

export default UserDetail;
