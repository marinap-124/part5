import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'

import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Marina',
    url: 'http://myblog.com',
    likes: 5
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  expect(component.container).toHaveTextContent(
    'Marina'
  )

  expect(component.container).not.toHaveTextContent(
    'http://myblog.com'
  )

  expect(component.container).not.toHaveTextContent(
    5
  )
})

test('clicking the button displays url and likes', async () => {
  const blog = {
    title: 'clicking the button displays url and likes',
    author: 'Marina',
    url: 'http://myblog.com',
    likes: 5
  }


  const component = render(
    <Blog blog={blog} />
  )

  //component.debug()

  const button = component.getByText('view')
  expect(button).toBeDefined()
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'http://myblog.com'
  )

  expect(component.container).toHaveTextContent(
    5
  )
})

test('clicking likes 2 times', async () => {
  const blog = {
    title: 'clicking likes 2 times',
    author: 'Marina',
    url: 'http://myblog.com',
    likes: 5
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} updateBlog={mockHandler} />
  )

  const buttonView = component.getByText('view')
  expect(buttonView).toBeDefined()
  fireEvent.click(buttonView)

  const buttonLikes = component.getByText('likes')
  expect(buttonLikes).toBeDefined()
  fireEvent.click(buttonLikes)
  fireEvent.click(buttonLikes)

  expect(mockHandler.mock.calls).toHaveLength(2)
})