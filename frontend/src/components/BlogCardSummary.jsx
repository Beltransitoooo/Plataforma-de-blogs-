import React from 'react';

export default function BlogCardSummary({ post, nombreAutor, onClick }) {
  return (
    <div className="blog-card-summary" onClick={onClick}>
      <h2 className="blog-title-summary">{post.titulo}</h2>
      <span className="author-info">
        Por: <strong className="author-name">{nombreAutor}</strong>
      </span>
    </div>
  );
}