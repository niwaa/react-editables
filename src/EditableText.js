import React from 'react'
import EditorBase from './EditableBase'

const lineHeight = '1.1em'

const textareaStyle = {
  border: 0,
  padding: 0,
  margin: 0,
  paddingTop: 1,
  outline: 'none',
  borderBottom: '2px solid #75bbd2',
  backgroundColor: '#f1fbff',
  maxWidth: '100%',
  overflow: 'hidden',
  resize: 'none',
  verticalAlign: 'top', // Prevent textarea space at the bottom https://stackoverflow.com/questions/7144843/extra-space-under-textarea-differs-along-browsers,
  textRendering: 'geometricPrecision',
  lineHeight: lineHeight,
  marginTop: '-1px'
}

const inputNotValid = {
    borderBottom: '2px solid #ff0000',
    backgroundColor: '#ffebeb'
}

const container = {
  display: 'block',
  minHeight: '30px', // this prevent height change when transitionning from read to edit mode.
  lineHeight: lineHeight,
  position: 'relative'
}

class InlineEditorText extends React.Component {
  constructor (props) {
    super(props)
    const MIN_INPUT_SIZE = this.props.placeholder ? this.props.placeholder.length : 20
  }

  componentDidUpdate(prevProps, prevState) {
    // This is to initialize input with correct size and cursor when editing.
    if (this.props.mode == 'EDIT' && prevProps.mode !== 'EDIT' ) {
      this._textareaInit(this.textarea)
    }
  }

  sanitizeValue (value) {
    let v = value
    // Remove spaces before and after the string
    v = v.trim()
    // Remove multiple whitespaces
    v = v.replace(/\s\s+/g, ' ')
    // Remove linebreak. https://stackoverflow.com/questions/10805125/how-to-remove-all-line-breaks-from-a-string
    v = v.replace(/(\r\n|\n|\r)/gm, '')
    return v
  }

  // See: https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
  setTextareaSize (elm, textValue, minSize = 1) {
    // Set textarea width
    const padding = 20
    let text = this.props.placeholder || this.props.defaultPlaceholder
    if (textValue && textValue.length > text.length) {
      text = textValue
    }
    let width = Math.round(padding + this.props.getWidthOfText(text, this.props.stateStyles.font.fontFamily, this.props.stateStyles.font.fontSize)) || 100
    elm.style.width = width + 'px'

    // Set textarea height
    elm.style.height = 'auto' // this necessary to trigger the scrollHeight recalculation.
    elm.style.height = elm.scrollHeight + 'px'
  }

  _stopEditing (event) {
    let value = this.sanitizeValue(event.target.value)
    this.props.stopEditing(value)
  }

  _onChange (e) {
    let elm = e.target
    let value = elm.value
    if (value) {
      this.setTextareaSize(elm, value)
      this.props.passValidation(value)
    }
  }

  _textareaInit (elm) {
    if (elm && this.props.isValid) {
      this.setTextareaSize(elm, this.props.value)
      this.props.setCaretPosition(elm, this.props.caretPosition)
    }
  }

  renderModeView = () => {
    return (
      <span
        style={{...container, ...this.props.stateStyles.font}}
        onMouseEnter={() => this.props.mouseEnterView()}
        onMouseLeave={() => this.props.mouseLeaveView()}>
        <span>{this.props.value}</span>
        {this.props.hasChanged &&
          <span style={this.props.stateStyles.has_changed_indicator.wrapper}>
            <div style={this.props.stateStyles.has_changed_indicator.indicator} />
          </span>
        }
      </span>
    )
  }

  renderModeViewMouseOver = () => {
    // This is used get the clicked character position so the textInput can have the proper cursor caret position.
    let splittedString = this.props.value.split('').map((char, index) =>
      <span key={index} onClick={(event) => this.props.onCharacterClick(event, index)}>{char}</span>
    )
    return (
      <span
        onClick={(event) => this.props.onCharacterClick(event, this.props.value.length)}
        onMouseLeave={() => this.props.mouseLeaveView()}
        style={{...container, ...this.props.stateStyles.font}}>
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
        <textarea
          ref={(input) => {this.textarea = input}}
          rows='1'
          placeholder={this.props.placeholder}
          style={{...textareaStyle, ...this.props.stateStyles.font, ...(this.props.isValid ? '' : inputNotValid)}}
          onBlur={(event) => this._stopEditing(event)}
          onChange={(event) => this._onChange(event)}
          defaultValue={this.props.value}
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

export default EditorBase(InlineEditorText)
