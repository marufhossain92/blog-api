const express = require("express");
const cors = require("cors");
const { MemoryDb } = require("./memory-db");

const app = express();
app.use(cors());
app.use(express.json());
const port = 3007;

app.get("/api/v1.0/blogs", (req, res) => {
  const blogs = MemoryDb.getInstance().findAll({
    collectionName: "Blogs",
  });

  for (const blog of blogs) {
    blog.comments = MemoryDb.getInstance().findByAttribute({
      attributeName: "blogId",
      attributeValue: blog.id,
      collectionName: "Comments",
    });
  }

  return res.status(200).json({
    status: 200,
    message: "Blogs retrieved successfully.",
    data: {
      blogs: blogs,
    },
  });
});

app.get("/api/v1.0/blogs/:blogId", (req, res) => {
  const blogId = parseInt(req.params.blogId);

  if (isNaN(blogId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid blog ID provided.",
    });
  }

  const blog = MemoryDb.getInstance().findById({
    id: blogId,
    collectionName: "Blogs",
  });

  if (!blog) {
    return res.status(404).json({
      status: 404,
      message: "Requested blog was not found.",
    });
  }

  blog.comments = MemoryDb.getInstance().findByAttribute({
    attributeName: "blogId",
    attributeValue: blog.id,
    collectionName: "Comments",
  });

  return res.status(200).json({
    status: 200,
    message: "Blog data retrieved successfully.",
    data: {
      blog: blog,
    },
  });
});

app.post("/api/v1.0/blogs", (req, res) => {
  const userId = parseInt(req.body.userId);

  if (isNaN(userId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid user ID provided.",
    });
  }

  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";

  if (title === "") {
    return res.status(400).json({
      status: 400,
      message: "Title must be provided.",
    });
  }

  const body = typeof req.body.body === "string" ? req.body.body.trim() : "";

  if (body === "") {
    return res.status(400).json({
      status: 400,
      message: "Body must be provided.",
    });
  }

  const blog = MemoryDb.getInstance().create({
    element: { userId, title, body },
    collectionName: "Blogs",
  });

  return res.status(200).json({
    status: 200,
    message: "Blog posted successfully.",
    data: {
      blog: blog,
    },
  });
});

app.put("/api/v1.0/blogs/:blogId", (req, res) => {
  const blogId = parseInt(req.params.blogId);

  if (isNaN(blogId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid blog ID provided.",
    });
  }

  const userId = parseInt(req.body.userId);

  if (isNaN(userId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid user ID provided.",
    });
  }

  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";

  if (title === "") {
    return res.status(400).json({
      status: 400,
      message: "Title must be provided.",
    });
  }

  const body = typeof req.body.body === "string" ? req.body.body.trim() : "";

  if (body === "") {
    return res.status(400).json({
      status: 400,
      message: "Body must be provided.",
    });
  }

  const { previousElement, updatedElement } = MemoryDb.getInstance().update({
    id: blogId,
    updatedElement: { userId, title, body },
    collectionName: "Blogs",
  });

  if (!updatedElement) {
    return res.status(404).json({
      status: 404,
      message: "Requested blog was not found to be updated.",
    });
  }

  return res.status(200).json({
    status: 200,
    message: "Blog updated successfully.",
    data: {
      previousBlog: previousElement,
      blog: updatedElement,
    },
  });
});

app.delete("/api/v1.0/blogs/:blogId", (req, res) => {
  const blogId = parseInt(req.params.blogId);

  if (isNaN(blogId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid blog ID provided.",
    });
  }

  const blog = MemoryDb.getInstance().delete({
    id: blogId,
    collectionName: "Blogs",
  });

  if (!blog) {
    return res.status(404).json({
      status: 404,
      message: "Requested blog was not found to be deleted.",
    });
  }

  return res.status(200).json({
    status: 200,
    message: "Blog deleted successfully.",
    data: {
      blog: blog,
    },
  });
});

app.get("/api/v1.0/comments", (req, res) => {
  const comments = MemoryDb.getInstance().findAll({
    collectionName: "Comments",
  });

  return res.status(200).json({
    status: 200,
    message: "Comments retrieved successfully.",
    data: {
      comments: comments,
    },
  });
});

app.get("/api/v1.0/comments/:commentId", (req, res) => {
  const commentId = parseInt(req.params.commentId);

  if (isNaN(commentId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid comment ID provided.",
    });
  }

  const comment = MemoryDb.getInstance().findById({
    id: commentId,
    collectionName: "Comments",
  });

  if (!comment) {
    return res.status(404).json({
      status: 404,
      message: "Requested comment was not found.",
    });
  }

  return res.status(200).json({
    status: 200,
    message: "Comment retrieved successfully.",
    data: {
      comment: comment,
    },
  });
});

app.post("/api/v1.0/comments", (req, res) => {
  const blogId = parseInt(req.body.blogId);

  if (isNaN(blogId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid blog ID provided.",
    });
  }

  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

  if (name === "") {
    return res.status(400).json({
      status: 400,
      message: "Name must be provided.",
    });
  }

  const email = typeof req.body.email === "string" ? req.body.email.trim() : "";

  if (email === "") {
    return res.status(400).json({
      status: 400,
      message: "Email must be provided.",
    });
  }

  const body = typeof req.body.body === "string" ? req.body.body.trim() : "";

  if (body === "") {
    return res.status(400).json({
      status: 400,
      message: "Body must be provided.",
    });
  }

  const comment = MemoryDb.getInstance().create({
    element: { blogId, name, email, body },
    collectionName: "Comments",
  });

  return res.status(200).json({
    status: 200,
    message: "Comment posted successfully.",
    data: {
      comment: comment,
    },
  });
});

app.put("/api/v1.0/comments/:commentId", (req, res) => {
  const commentId = parseInt(req.params.commentId);

  if (isNaN(commentId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid comment ID provided.",
    });
  }

  const blogId = parseInt(req.body.blogId);

  if (isNaN(blogId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid blog ID provided.",
    });
  }

  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

  if (name === "") {
    return res.status(400).json({
      status: 400,
      message: "Name must be provided.",
    });
  }

  const email = typeof req.body.email === "string" ? req.body.email.trim() : "";

  if (email === "") {
    return res.status(400).json({
      status: 400,
      message: "Email must be provided.",
    });
  }

  const body = typeof req.body.body === "string" ? req.body.body.trim() : "";

  if (body === "") {
    return res.status(400).json({
      status: 400,
      message: "Body must be provided.",
    });
  }

  const comment = MemoryDb.getInstance().update({
    id: commentId,
    updatedElement: { blogId, name, email, body },
    collectionName: "Comments",
  });

  return res.status(200).json({
    status: 200,
    message: "Comment updated successfully.",
    data: {
      comment: comment,
    },
  });
});

app.delete("/api/v1.0/comments/:commentId", (req, res) => {
  const commentId = parseInt(req.params.commentId);

  if (isNaN(commentId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid comment ID provided.",
    });
  }

  const comment = MemoryDb.getInstance().delete({
    id: commentId,
    collectionName: "Comments",
  });

  if (!comment) {
    return res.status(404).json({
      status: 404,
      message: "Requested comment was not found to be deleted.",
    });
  }

  return res.status(200).json({
    status: 200,
    message: "Comment deleted successfully.",
    data: {
      comment: comment,
    },
  });
});

MemoryDb.loadDataAsync().then(() => {
  app.listen(port, () => {
    console.log(`Blogs API is listening on port ${port}`);
  });
});
