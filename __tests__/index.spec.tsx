/* eslint-env jest */
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { BigNumberInput } from '../src/index'

const noop = () => ({})

const defaultProps = {
  placeholder: 'Value',
  value: '123',
  decimals: 2,
}

const renderBigNumberInput = props => render(<BigNumberInput {...defaultProps} {...props} />)

test('should work with minimal props', () => {
  const { asFragment } = renderBigNumberInput({ onChange: noop })
  expect(asFragment()).toMatchSnapshot()
})

test('should be initialized with value', () => {
  // given
  const expectedValue = '1.23'

  // when
  const { container } = renderBigNumberInput({ onChange: noop })
  const input: any = container.querySelector(`input`)

  // then
  expect(input.value).toBe(expectedValue)
})

test('should trigger the onChange callback with the proper value', async () => {
  // given
  const changeHandler = jest.fn()
  const expectedValue = '230'

  // when
  const { container } = renderBigNumberInput({ onChange: changeHandler })
  const input: any = container.querySelector(`input`)

  // then
  expect(input).not.toBe(null)
  fireEvent.change(input, { target: { value: '2.30' } })
  expect(changeHandler).toHaveBeenCalledTimes(1)
  expect(changeHandler).toHaveBeenCalledWith(expectedValue)
})

test('should change when value changes', async () => {
  const changeHandler = jest.fn()

  const firstChildOne = renderBigNumberInput({
    value: '123',
    onChange: changeHandler,
  }).container.firstChild
  expect(firstChildOne && firstChildOne['value']).toEqual('1.23')

  const firstChildTwo = renderBigNumberInput({
    value: '321',
    onChange: changeHandler,
  }).container.firstChild
  expect(firstChildTwo && firstChildTwo['value']).toEqual('3.21')
})

test('should allow entering an empty string', async () => {
  // given
  const changeHandler = jest.fn()

  // when
  const { container } = renderBigNumberInput({ onChange: changeHandler })
  const input: any = container.querySelector(`input`)

  // then
  expect(input).not.toBe(null)
  fireEvent.change(input, { target: { value: '' } })
  expect(changeHandler).toHaveBeenCalledTimes(1)
  expect(changeHandler).toHaveBeenCalledWith('')
})

test('should accept a min value', async () => {
  // given
  const changeHandler = jest.fn()
  const minValue = '100'
  const expectedValue = '1.23'

  // when
  const { container } = renderBigNumberInput({ min: minValue, onChange: changeHandler })
  const input: any = container.querySelector(`input`)

  // then
  expect(input).not.toBe(null)
  fireEvent.change(input, { target: { value: '0.5' } })
  expect(changeHandler).toHaveBeenCalledTimes(0)
  expect(input.value).toBe(expectedValue)
})

test('should accept a max value', async () => {
  // given
  const changeHandler = jest.fn()
  const maxValue = '200'
  const expectedValue = '1.23'

  // when
  const { container } = renderBigNumberInput({ max: maxValue, onChange: changeHandler })
  const input: any = container.querySelector(`input`)

  // then
  expect(input).not.toBe(null)
  fireEvent.change(input, { target: { value: '3.5' } })
  expect(changeHandler).toHaveBeenCalledTimes(0)
  expect(input.value).toBe(expectedValue)
})

test('should allow initialize with an empty string', async () => {
  const changeHandler = jest.fn()

  const firstChild = renderBigNumberInput({ value: null, onChange: changeHandler }).container
    .firstChild
  expect(firstChild && firstChild['value']).toEqual('')
  expect(changeHandler).toHaveBeenCalledTimes(0)
})
