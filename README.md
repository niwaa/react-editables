# react-editables

React-editables is a react component that makes it easy to edit different types of content (Text, Numbers for now). 
Use-cases are collaborative apps where users may edit the content, in a controlled way.

## Installation

`npm install react-editables --save-dev`

## Usage

Import the components you want to use in your app:
```javascript
import { EditableText, EditableNumber } from 'react-editables'
```

### Editable text

```javascript
<EditableText value='some value here' placeholder='Write a description' />
```

### Editable numbers

```javascript
<EditableNumber value={777} onChange={(value) => console.log(value)} />
```


##  Common props

### Optional
* **value**: initial displayed value.
* **validate**: a validator function, returning a boolean.
* **placeholder**: a default text or number when there is not value.

### Hooks
* **onChange**: a callback function that will be called after user finish editing.


### To-do

* Expose customization (styles)
* EditableLink element
* EditableTags element
