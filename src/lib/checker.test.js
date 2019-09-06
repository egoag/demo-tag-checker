import Cheker from './checker'

const TEXT1 = 'The following text<C><B>is centred and in boldface</B></C>'
const TEXT2 = '<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> <<d>sentence'
const TEXT3 = '<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>'
const TEXT4 = '<B>This should be in boldface, but there is an extra closing tag</B></C>'
const TEXT5 = '<B><C>This should be centred and in boldface, but there is a missing closing tag</C>'
const EXPECTED1 = 'Correctly tagged paragraph'
const EXPECTED2 = 'Correctly tagged paragraph'
const EXPECTED3 = 'Expected </C> found </B>'
const EXPECTED4 = 'Expected # found </C>'
const EXPECTED5 = 'Expected </B> found #'

it('not crash', () => {
  const checker = new Cheker('')
  checker.check()
})

it('text 1', () => {
  const checker = new Cheker(TEXT1)
  expect(checker.check()).toBe(EXPECTED1)
})

it('text 2', () => {
  const checker = new Cheker(TEXT2)
  expect(checker.check()).toBe(EXPECTED2)
})

it('text 3', () => {
  expect(() => {
    const checker = new Cheker(TEXT3)
    checker.check()
  }).toThrowError(EXPECTED3)
})

it('text 4', () => {
  expect(() => {
    const checker = new Cheker(TEXT4)
    checker.check()
  }).toThrowError(EXPECTED4)
})

it('text 5', () => {
  expect(() => {
    const checker = new Cheker(TEXT5)
    checker.check()
  }).toThrowError(EXPECTED5)
})
