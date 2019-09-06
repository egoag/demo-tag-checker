const SUCCESS = 'Correctly tagged paragraph'
const TAG_MAX_LENGTH = 1
const TAG_NAME_OPENING = '<'
const TAG_NAME_CLOSING = '>'
const TAG_NAME_CLOSING_PREFIX = '/'
const TAG_NAME_VALID_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const TAG_MISSING = '#'
const getError = (_expected, _unexpected) => {
  const expected = _expected === TAG_MISSING ? _expected : `<${_expected}>`
  const unexpected = _unexpected === TAG_MISSING ? _unexpected : `<${_unexpected}>`
  const message = `Expected ${expected} found ${unexpected}`
  return new Error(message)
}

class Stack extends Array {
  last () {
    return this.length > 0 ? this.slice(-1)[0] : null
  }

  clear () {
    this.length = 0
  }

  str () {
    return this.join('')
  }

  isEmpty () {
    return this.length === 0
  }
}

class Checker {
  constructor (text, maxLength = TAG_MAX_LENGTH) {
    this.text = text
    this.maxLength = maxLength
    this.tagStack = new Stack()
    this.tagNameStack = new Stack()
  }

  static isClosingTag (tag) {
    return tag.startsWith(TAG_NAME_CLOSING_PREFIX)
  }

  static getClosingTag (tag) {
    return TAG_NAME_CLOSING_PREFIX + tag
  }

  isValidTagName (tag) {
    let name = tag || this.tagNameStack.str()
    // drop "/" if exists
    name = name.startsWith(TAG_NAME_CLOSING_PREFIX) ? name.slice(1) : name
    const length = name.length

    const isCaseValid = name.split('').reduce((preVal, curVal) => preVal && TAG_NAME_VALID_LETTERS.includes(curVal), true)
    const isLengthValid = length <= this.maxLength

    return isCaseValid && isLengthValid
  }

  check () {
    let isParsingTagName = false
    for (let index = 0; index < this.text.length; index++) {
      const letter = this.text[index]
      switch (letter) {
        case TAG_NAME_OPENING: {
          // has already been parsing
          if (isParsingTagName) {
            // then ignore letters in name statck
            this.tagNameStack.clear()
          }

          // always set as is parsing
          isParsingTagName = true
          break
        }
        case TAG_NAME_CLOSING: {
          if (isParsingTagName) {
            const newTag = this.tagNameStack.str()
            if (newTag && this.isValidTagName(newTag)) {
              this.tagNameStack.clear()
              if (Checker.isClosingTag(newTag)) {
              // match closing tag with last one in stack
                const previousTag = this.tagStack.last()

                if (!previousTag) {
                  throw getError(TAG_MISSING, newTag)
                }

                // get expected tag
                const expectedTag = Checker.getClosingTag(previousTag)
                if (expectedTag !== newTag) {
                  throw getError(expectedTag, newTag)
                }

                // no errors, then pop tag
                this.tagStack.pop()
              } else {
                // only push opening tag
                this.tagStack.push(newTag)
              }
            }
          }

          // always set is not parsing
          isParsingTagName = false
          break
        }
        default: {
          if (isParsingTagName) {
            // take in the letter
            this.tagNameStack.push(letter)

            // check tag name stack is valid
            if (!this.isValidTagName()) {
              // not a tag name, clear name stack and set is not parsinig
              this.tagNameStack.clear()
              isParsingTagName = false
            }
          }
        }
      }
    }

    if (this.tagStack.length > 0) {
      // unmatched tags
      const last = this.tagStack.last()
      throw getError(Checker.getClosingTag(last), TAG_MISSING)
    }

    return SUCCESS
  }
}

export default Checker
