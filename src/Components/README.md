# COMPONENTS

---

### [Breadcrumbs](./Breadcrumbs.jsx)

###### Return nav element with current path in it which are navigable.

**<span style="color: green;">RETURN :</span>** Custom styled breadcrum

---

### [Chart](./Chart.jsx)

###### Shows responsive chart with dummy data

**<span style="color: green;">RETURN :</span>** rechart

---

### [Control](./Control.jsx)

###### Contain methods & generalize form component

<strong>TextControl</strong> Generalize text input field with empty space at bottom to show helper text.

<span style="color: blue;">PROPS :</span>
<span style="color: blue;">name</span> <span style="color: brown;">: String</span> Name for the input field should be unique
<span style="color: blue;">value</span> <span style="color: brown;">: String</span>
<span style="color: blue;">onChange</span> <span style="color: brown;">: Method(e)</span>
variant <span style="color: brown;">: outlined | filled | standard </span>
label <span style="color: brown;">: String</span>
error <span styl  e="color: brown;">: String</span> \* other props to apply on TextField

<span style="color: green;">RETURN :</span> TextFiled

<strong>PasswordControl</strong> Password filled based on TextControl, for passwords with show/hide password btn

<span style="color: blue;">PROPS :</span>
<span style="color: blue;">name</span> <span style="color: brown;">: String</span> Name for the input field should be unique
<span style="color: blue;">value</span> <span style="color: brown;">: String</span>
<span style="color: blue;">onChange</span> <span style="color: brown;">: Method(e)</span>
variant <span style="color: brown;">: outlined | filled | standard </span>
label <span style="color: brown;">: String</span>
error <span style="color: brown;">: String</span> \* other props to apply on TextField

<span style="color: green;">RETURN :</span> TextFiled

<span style="color: red;">NOTE :</span>
Do not set type

<strong>CheckboxControl</strong> Manage checkbox

<span style="color: blue;">PROPS :</span>
<span style="color: blue;">name</span> <span style="color: brown;">: String</span> Name for the checkbox field should be unique
<span style="color: blue;">value</span> <span style="color: brown;">: String</span>
<span style="color: blue;">onChange</span> <span style="color: brown;">: Method(e)</span>
color <span style="color: brown;">: primary | secondary | default </span>
label <span style="color: brown;">: String</span> \* other props to apply on TextField

<span style="color: green;">RETURN :</span> label

<strong>useForm</strong> Method to manage given form filleds

<span style="color: blue;">PROPS :</span>
<span style="color: blue;">defaultValue</span> <span style="color: brown;">: Object</span> Defaults values of filleds
<span style="color: blue;">validateOnChange</span> <span style="color: brown;">: Boolean</span> Indicate to validate on input change
<span style="color: blue;">validateInput</span> <span style="color: brown;">: Method</span> Method to validate inputs

<span style="color: green;">RETURN :</span>

```js
{
  value, // Contains input values (object)
    setValue, // Update input values Method (Method(value))
    error, // Contains error (object)
    setError, // Update error (Method(error))
    handleInputChange, // Onvalue change Method (Method)
    resetForm; // Reset From Method (Method)
}
```

---

### [DocumentTitle](./DocumentTitle.jsx)

###### Upadate title bar on mount & unmount of component

**<span style="color: blue;">PROPS :</span>**
**<span style="color: blue;">title</span> <span style="color: brown;">: String</span>** title to show in title bar

**<span style="color: green;">RETURN :</span>** Component

---

### [ErrorBoundary](./ErrorBoundary.jsx)

---

### [Header](./Header.jsx)

###### Sticked on the top of screen to show beadcrum & elevated effect on scroll

**<span style="color: green;">RETURN :</span>** Header component

---

### [ProtectedRoutes](./ProtectedRoutes.jsx)

###### To authorize user from accessing control urls using local storage

**<span style="color: green;">RETURN :</span>** Route component