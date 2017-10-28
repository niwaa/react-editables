import React from 'react'
import PropTypes from 'prop-types'
import EditorBase from './EditableBase'

const container = {
  display: 'block',
  position: 'relative',
  minHeight: '25px'
}

const inputStyle = {
    border: 0,
    padding: 0,
    outline: 'none',
    borderBottom: '2px solid #75bbd2',
    backgroundColor: '#f1fbff'
}

const inputNotValid = {
    borderBottom: '2px solid #ff0000',
    backgroundColor: '#ffebeb'
}

class InlineEditorNumber extends React.Component {
    constructor (props) {
        super(props)
        const MIN_INPUT_SIZE = this.props.placeholder ? this.props.placeholder.length : 20
    }

    componentDidUpdate(prevProps, prevState) {
      // This is to initialize input with correct size and cursor when editing.
      if (this.props.mode == 'EDIT' && prevProps.mode !== 'EDIT' ) {
        this._inputInit(this.input)
      }
    }

    // Credit : https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    formatNumber = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        /**
        // Another way of doing it with localization.
        if (value && typeof value.toLocaleString !== 'undefined') {
          return parseInt(value).toLocaleString()
        } else {
          return value
        }
        */
    }

    _inputInit = (elm) => {
      if (elm) {
        // set input size
        this.setInputSize(elm, this.props.value, this.MIN_INPUT_SIZE)

        // Set caret position
        // FF bug, need a timeout. The caret positionning only works with Safari right now on input type "number". Other browser will just focus the input.
        setTimeout(() => {
          this.props.setCaretPosition(elm, this.props.caretPosition)
        }, 100);
      }
    }

    _onChange = (event) => {
      let inputElm = event.target
      let value = inputElm.value
      if (value) {
        this.setInputSize(inputElm, value)
        this.props.passValidation(value)
      }
    }

    _stopEditing (event) {
      event.stopPropagation()
      let value = event.target.value
      this.props.stopEditing(value)
    }

    // ...
    setInputSize = (elm, textValue) => {
      const padding = 30
      let text = this.props.placeholder || this.props.defaultPlaceholder
      if (textValue && textValue.length > text.length) {
        text = textValue
      }
      let width = Math.round(padding + this.props.getWidthOfText(text, this.props.stateStyles.font.fontFamily, this.props.stateStyles.font.fontSize)) || 100
      elm.style.width = width + 'px'
    }

    renderModeView = () => {
      return (
        <span style={{...container, ...this.props.stateStyles.font}}
              onMouseEnter={() => this.props.mouseEnterView()}
              onMouseLeave={() => this.props.mouseLeaveView()}>
              <span>{this.formatNumber(this.props.value)}</span>
              {this.props.hasChanged &&
                <span style={this.props.stateStyles.has_changed_indicator.wrapper}>
                  <div style={this.props.stateStyles.has_changed_indicator.indicator} />
                </span>
              }
        </span>
      )
    }

    renderModeViewMouseOver = () => {
      let localFormat = this.formatNumber(this.props.value)
      // This is used get the clicked character position so the textInput can have the proper cursor caret position.
      let splittedString = localFormat.toString().split('').map((char, index) =>
        <span key={index} onClick={(event) => this.props.onCharacterClick(event, index)}>{char}</span>
      )

      return (
        <span style={{...container, ...this.props.stateStyles.font}}
              onClick={(event) => this.props.onCharacterClick(event, this.props.value.length)}
              onMouseLeave={() => this.props.mouseLeaveView()}>
          <span style={this.props.stateStyles.view_mouseover_state}>{splittedString}</span>
          <span style={this.props.stateStyles.state_button}>edit</span>
          {this.props.hasChanged &&
            <span style={this.props.stateStyles.has_changed_indicator.wrapper}>
              <div style={this.props.stateStyles.has_changed_indicator.indicator} />
            </span>
          }
        </span>
      )
    }

    renderModeEdit = () => {
      return (
        <span style={container}>
          <input type='number'
            ref={(input) => this.input = input}
            placeholder={this.props.placeholder}
            onBlur={(event) => this._stopEditing(event)}
            defaultValue={this.props.value}
            onChange={(event) => this._onChange(event)}
            style={{...this.props.stateStyles.font, ...inputStyle, ...(this.props.isValid ? '' : inputNotValid)}}
          />
          {this.props.isValid ? (
            <span onClick={(event) => event.stopPropagation()} style={this.props.stateStyles.state_button}>save</span>
          ) : (
            <span onClick={(event) => this.props.cancelEditing(event)} style={this.props.stateStyles.state_button_cancel}>cancel</span>
          )}
          {this.props.isValid}
        </span>
      )
    }

  render () {
    switch(this.props.mode) {
      case 'EMPTY':
          return this.props.renderModeEmpty(container)
          break;
      case 'MOUSEOVER_EMPTY':
          return this.props.renderModeEmptyMouseOver(container)
          break;
      case 'VIEW':
          return this.renderModeView()
          break;
      case 'MOUSEOVER_VIEW':
          return this.renderModeViewMouseOver()
          break;
      case 'EDIT':
          return this.renderModeEdit()
          break;
      case 'SAVING':
          return this.props.renderModeSaving(container)
          break;
    }
  }
}

export default EditorBase(InlineEditorNumber)
