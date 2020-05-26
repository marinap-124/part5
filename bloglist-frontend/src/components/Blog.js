import React, { useState } from 'react'
import PropTypes from 'prop-types'


const Blog = ({ blog, updateBlog, deletingBlog, user }) => {
  const [hide, setHide] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div className='blogStyle' style={blogStyle}>
      {blog.title } &nbsp;
      {blog.author } &nbsp;
      <button value={hide} type="text" onClick={() => setHide((hide===true)?false:true)}>
        {hide === true?'hide':'view'}
      </button>
      <br/>
      {(hide===true)&&
        <span>
          {blog.url } <br/>
          <span id='likes'>{blog.likes }</span>

          <button id='likes-button'  type="text" onClick={() => updateBlog(blog.id)}>
            likes
          </button>
          <br/>

          {(blog.user && user && user.username===blog.user.username)&&
            <button onClick={() => {if (window.confirm(`Remove blog ${blog.title} by ${blog.author} `)) {deletingBlog(blog.id) }}}>
              remove
            </button>
          }
        </span>
      }
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired
}

export default Blog
