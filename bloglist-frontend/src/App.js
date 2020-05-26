import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={style}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [ message, setMessage] = useState(null)
  const [ style, setStyle] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes-a.likes) )
    )
  }, [])




  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const setNotification = (style, message) => {
    setStyle(style)
    setMessage(message)

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }



  const updateBlog = (id) => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog).then(returnedBlog => {
        // returnedBlog.user = user
        // console.log("RETURNED", returnedBlog)
        setNotification('message', `Updated '${blog.title}' `)
        setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog)
          .sort((a, b) => b.likes-a.likes))


      })
      .catch(error => {
        setNotification('error', `Error updatinhg likes '${blog.id}' '${error}' `)
      })
  }


  const deletingBlog = id => {
    blogService
      .deleteBlog(id)
      .then( () => {
        const deleted = blogs.filter(blog => blog.id === id)
        setNotification('message',  `Deleted '${deleted[0].title}' `)
        setBlogs(blogs.filter(blog => blog.id !== id))

      })
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('error',  'Wrong username or password')
      setTimeout(() => {
        setNotification('error',  null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')

      blogService.setToken(null)
      setUser(null)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setNotification('error',  'wrong credentials')
      setTimeout(() => {
        setNotification('error',  null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form  onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
          password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )


  const blogForm = () => (
    <Togglable buttonLabel='new blog'>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )


  const logoutForm = () => (
    <form name='logoutform' onSubmit={handleLogout}>
      <button id='logout-button' type="submit">logout</button>
    </form>
  )

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={message} style={style} />

      <h2>Login</h2>

      {user === null ?
        loginForm() :
        <div>
          <span>{user.name} logged in {logoutForm()}</span>
          {blogForm()}

          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deletingBlog={deletingBlog} user={user} />
          )}
        </div>
      }


    </div>
  )
}

export default App