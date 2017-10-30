# react-editables

React-editables is a react component that makes it easy to edit different types of content (Text, Numbers for now). 
Use-cases are collaborative apps where users may edit the content, in a controlled way.

*NUMBER edition demo:*
![Alt text](https://i.imgur.com/sYnFago.gif "Gif showing number edition")

*TEXT edition demo:*
![Alt text](https://i.imgur.com/aIoJTpA.gif "Gif showing number edition")

## Installation

`npm install react-editables --save`

## Usage

Import the components you want to use in your app:
```javascript
import { EditableText, EditableNumber } from 'react-editables'
```

### EditableText

```javascript
<EditableText value='some value here' placeholder='Write a description' />
```

### EditableNumber

```javascript
<EditableNumber value={777} onChange={(value) => console.log(value)} />
```


##  Common props

### Optional
* **value**: initial displayed value.
* **validate**: a validator function, returning a boolean.
* **placeholder**: a default text or number when there is not value.


Validation function example:  Text length must be more than 30 char.

```javascript
  doValidation (value) {
    return (value.length > 30)
  }
```

```javascript
<EditableText validate={this.doValidation} />
```

### Hooks
* **onChange**: a callback function that will be called after user finish editing.

## Contributing

Submit a PR.

### Tests

Tests are written with Jest and Enzyme. Run them with:

``` npm test ```

## To-do

* Expose customization (styles)
* EditableLink element
* EditableTags element
* Add more tests
* Make it work on mobile iOS
* More content types :)
