const SUCCESS = 'Correctly tagged paragraph'

class Checker {
  constructor (text) {
    this.text = text
    this.tagStack = []
    this.tagNameStack = []
  }

  check () {
    return SUCCESS
  }
}

export default Checker
