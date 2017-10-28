import { configure, shallow, mount, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import EditableText from '../src/EditableText'

configure({ adapter: new Adapter() })

test('EditableText render correct value', () => {
  const wrapper = mount(
    <EditableText value='test' />
  )
  expect(wrapper.contains(<span>test</span>)).toEqual(true)
})

test('EditableText change value after edition', (done) => {
  const wrapper = mount(
    <EditableText value='test' />
  )

  expect(wrapper.state('hasChanged')).toEqual(false)
  wrapper.find('span').first().simulate('mouseEnter')
  wrapper.find('span').first().simulate('click')

  const input = wrapper.find('textarea')
  input.instance().value = 'sometext'

  wrapper.find('textarea').simulate('blur')

  setTimeout(() => {
    expect(wrapper.state('hasChanged')).toEqual(true)
    expect(wrapper.state('mode')).toEqual('VIEW')
    expect(wrapper.containsAllMatchingElements([<span>sometext</span>])).toEqual(true)
    done()
  }, 600)
})
