const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  const favorite = blogs.find((blog) => blog.likes === maxLikes);

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCounts = _.countBy(blogs, 'author');
  const authorWithMostBlogs = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author]);

  return {
    author: authorWithMostBlogs,
    blogs: authorCounts[authorWithMostBlogs],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const authorLikesMap = {};

  blogs.forEach((blog) => {
    if (authorLikesMap[blog.author]) {
      authorLikesMap[blog.author] += blog.likes;
    } else {
      authorLikesMap[blog.author] = blog.likes;
    }
  });

  let mostLikedAuthor = null;
  let mostLikesCount = 0;

  for (const author in authorLikesMap) {
    if (authorLikesMap[author] > mostLikesCount) {
      mostLikedAuthor = author;
      mostLikesCount = authorLikesMap[author];
    }
  }

  return {
    author: mostLikedAuthor,
    likes: mostLikesCount,
  };
};


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
