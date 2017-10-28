// setup file
import { configure, shallow, mount, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import EditableNumber from '../src/EditableNumber'

configure({ adapter: new Adapter() })


test('EditableNumber render correct assigned value on load', () => {
  const wrapper = mount(
    <EditableNumber value={33} />
  )
  expect(wrapper.contains(<span>33</span>)).toEqual(true)
})
