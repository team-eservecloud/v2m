
## **v2m (View to Model)**
#### Introduction:
**v2m** library is designed to enable '**View to model**' (Two way binding) in react using an attribute **'v2m-model'** to eliminate clutter. This enables users to focus more on logic rather than worrying about binding the model to a view.

#### **Supported Inputs types:**
- text
- tel
- email
- number
- url
- search
- password
- checkbox
- radio
- color
- date
- datetime-local
- time
- week
- file
- month
- range
- select-one(Dropdown)


####  **Unsupported input types:**
- reset
- hidden
- button
- submit
- image

### Getting Started:
#### **Initialization**:
In order to start using v2m,

1. **Install** v2m module using npm.

    `npm i v2m`

2. To **include** the library 

    `import { v2m } from "v2m"`

3. To **initialize** 
   `componentDidMount() {
           v2m(this, ReactDom.findDOMNode(this))
   }`
   
4. How to use
     In order to enable two way binding, associate variable with attribute **v2m-model="{variable name here}"**

5. Example

    `import React, { Component } from 'react';
    import ReactDom from "react-dom";
    import { v2m } from "v2m"
    class Input2 extends Component {
        state = { 
            displyName: ''
        }
        componentDidMount() {
            v2m(this, ReactDom.findDOMNode(this))
        }
        render() { 
            return (<div className="container m10">
                <div className="input1">
                    Enter your name : 
                    <input type="text" className="input-group" v2m-model="displyName" />&nbsp;
                    You typed : <span>{this.state.displyName}</span>
                </div>
            </div>);
        }
    }
    export default CustomerInfo;`

#### Types of Variables:
##### **Single variable**:
` <input type="text" v2m-model="displayName"/>`
 
##### Objects:
`<input type="text" v2m-model="customerDetails.displayName"/>`
 
#####  **Array of objects**:
 `<input type="text"  v2m-model="customers[0].customerDetails.displayName">`