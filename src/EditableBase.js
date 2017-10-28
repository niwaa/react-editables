import React from 'react'
import PropTypes from 'prop-types'

const DEFAULT_PLACEHOLDER = 'Write something'

const STATE_STYLES = {
  empty_state: {
    color: '#8f8f8f',
    fontStyle: 'italic',
    borderBottom: `1px dotted #75bbd2`,
    borderLeft: '2px solid transparent'
  },
  empty_mouseover_state: {
    color: '#8f8f8f',
    fontStyle: 'italic',
    borderBottom: `1px dotted #75bbd2`,
    borderLeft: '2px solid #75bbd2'
  },
  view_mouseover_state: {
    borderBottom: '1px dotted #75bbd2',
    borderRight: '2px solid #75bbd2'
  },
  saving_state: {
    color: '#6a6a6a'
  },
  state_button: {
    color: '#75bbd2',
    marginLeft: 10,
    cursor: 'pointer'
  },
  state_button_cancel: {
    color: '#cc504d',
    marginLeft: 10,
    cursor: 'pointer'
  },
  font: {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '1.1em'
  },
  has_changed_indicator: {
    wrapper: {
      right: 0,
      position: 'absolute',
      height: '100%'
    },
    // indicator: {
    //   backgroundColor: '#75bbd2',
    //   borderRadius: '50%',
    //   alignSelf: 'center',
    //   width: '5px',
    //   height: '5px'
    // },
    indicator: {
      backgroundColor: '#75bbd2',
      width: '3px',
      height: '80%',
      animation: 'indicator 0.5s'
    }
  }
}


var EditorBase = (WrappedComponent) => {
  return class EditorBase extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        value: this.props.value,
        mode: this.props.value ? 'VIEW' : 'EMPTY',
        hasChanged: false,
        caretPosition: 0,
        isValid: true
      }
    }

    static propTypes = {
      validate: PropTypes.func,
      defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      onChange: PropTypes.func,
      placeholder: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    }

    mouseEnterEmptyMode = () => {
      this.setState({mode: 'MOUSEOVER_EMPTY'})
    }

    mouseLeaveEmptyMode = () => {
      this.setState({mode: 'EMPTY'})
    }

    mouseEnterView = () => {
      this.setState({mode: 'MOUSEOVER_VIEW'})
    }

    mouseLeaveView = () => {
      this.setState({mode: 'VIEW'})
    }

    startEditing = () => {
      this.setState({mode: 'EDIT'})
    }

    stopEditing = (value) => {
      if (!value) {
        this.setState({mode: 'EMPTY', value: null})
      } else if (value !== this.state.value) {
        if (this.passValidation(value)) {
            this.saveValue(value)
        }
      } else {
        this.setState({mode: 'VIEW'})
      }
    }

    cancelEditing = (event) => {
      event.stopPropagation()
      this.setState({
        mode: (this.state.value) ? 'VIEW' : 'EMPTY',
        isValid: true
      })
    }

    passValidation = (value) => {
      if (this.props.validate) {
         if (typeof this.props.validate !== 'function') {
           console.error('Prop "validate" must be a function return a boolean.')
           return true
         }

         if (this.props.validate(value)) {
            this.setState({isValid: true})
            return true
         } else {
            this.setState({isValid: false})
            return false
         }
      } else {
        return true
      }
    }

    saveValue = (value) => {
      this.setState({mode: 'SAVING', value: value})

      // onChange callback
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(value)
      }

      // simulate delay. refactor later
      setTimeout(() => {
        this.doneSaving()
      }, 500)
    }

    doneSaving = () => {
      this.setState({mode: 'VIEW', hasChanged: true})
    }

    onCharacterClick = (event, position) => {
      event.stopPropagation()
      this.setState({
        mode: 'EDIT',
        caretPosition: position
      })
    }

    /**  Set caret position for an input or text area element
    * Credit : http://snipplr.com/view/5144/getset-cursor-in-html-textarea/
    */
    setCaretPosition = (el, caretPos) => {
      if (el !== null) {
        if (el.createTextRange) {
          var range = el.createTextRange()
          range.move('character', caretPos)
          range.select()
          return true
        } else {
          // (el.selectionStart === 0 added for Firefox bug)
          if (el.selectionStart || el.selectionStart === 0) {
            el.focus()
            el.setSelectionRange(caretPos, caretPos)
            return true
          } else { // fail city, fortunately this never happens (as far as I've tested) :)
            el.focus()
            return false
          }
        }
      }
    }

    renderModeEmpty = (container) => {
      return (
        <span
          onMouseEnter={() => this.mouseEnterEmptyMode()}
          style={{...container, ...STATE_STYLES.font}}>
          <span style={STATE_STYLES.empty_state}>{this.props.placeholder}</span>
          {this.state.hasChanged &&
            <span style={STATE_STYLES.has_changed_indicator.wrapper}>
              <div style={STATE_STYLES.has_changed_indicator.indicator} />
            </span>
          }
        </span>
      )
    }

    renderModeEmptyMouseOver = (container) => {
      return (
        <span style={{...container, ...STATE_STYLES.font}}
              onClick={() => this.startEditing()}
              onMouseLeave={() => this.mouseLeaveEmptyMode()}>
              <span style={STATE_STYLES.empty_mouseover_state}>{this.props.placeholder}</span>
              <span style={STATE_STYLES.state_button}>edit</span>
              {this.props.hasChanged &&
                <span style={STATE_STYLES.has_changed_indicator.wrapper}>
                  <div style={STATE_STYLES.has_changed_indicator.indicator} />
                </span>
              }
        </span>
      )
    }

    renderModeSaving = (container) => {
      return (
        <span style={{...container, ...STATE_STYLES.font}}>
          <span style={STATE_STYLES.saving_state}>{this.state.value}</span>
          <span style={STATE_STYLES.state_button}>saving...</span>
        </span>
      )
    }

    render () {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          startEditing={this.startEditing}
          stopEditing={this.stopEditing}
          cancelEditing={this.cancelEditing}
          setCaretPosition={this.setCaretPosition}
          mouseEnterView={this.mouseEnterView}
          mouseLeaveView={this.mouseLeaveView}
          mouseEnterEmptyMode={this.mouseEnterEmptyMode}
          mouseLeaveEmptyMode={this.mouseLeaveEmptyMode}
          onCharacterClick={this.onCharacterClick}
          getWidthOfText={getWidthOfText}
          defaultPlaceholder={DEFAULT_PLACEHOLDER}
          placeholder={this.props.placeholder || DEFAULT_PLACEHOLDER}
          stateStyles={STATE_STYLES}
          renderModeEmpty={this.renderModeEmpty}
          renderModeEmptyMouseOver={this.renderModeEmptyMouseOver}
          renderModeSaving={this.renderModeSaving}
          passValidation={this.passValidation}
        />
      )
    }
  }
}

function getWidthOfText (txt, fontname, fontsize) {
  if (getWidthOfText.e === undefined) {
    getWidthOfText.e = document.createElement('span')
    getWidthOfText.e.style.visibility = 'hidden'
    document.body.appendChild(getWidthOfText.e)
  }
  getWidthOfText.e.style.fontSize = fontsize
  getWidthOfText.e.style.fontFamily = fontname
  getWidthOfText.e.innerText = txt
  return getWidthOfText.e.offsetWidth
}

export default EditorBase
