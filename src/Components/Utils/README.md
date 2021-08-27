# Utils

###### Reusable Utility component.

---

### [Upload](./Upload.jsx)

###### To show dailog with list of all selected files and upload it to given service.

- ###### Limit no. of files can be uploaded at once.
- ###### Rename, deselect individual file.
- ###### Show specific icon to a file format.
- ###### Get warning on closing dialog without uploading.
- ###### Put file format restriction.

**<span style="color: blue;">PROPS :</span>**
**<span style="color: blue;">id </span> <span style="color: brown;">: String </span>** ID that trigger upload dialog
**<span style="color: blue;">uploadService </span> <span style="color: brown;">: Method </span>** API service on which file to be uploaded
**updateFileLst <span style="color: brown;">: Method(fileList) </span>** Method to update parent File List
**validFiles <span style="color: brown;">: { ext : imgObj } </span>** Object of valid files
**maxFile <span style="color: brown;">: Number </span>** max count of file to be uploaded

**<span style="color: green;">RETURN :</span>** Upload overlay component

**<span style="color: red;">NOTE :</span>**

- In order to **trigger upload**, label tag should be add to parent component with same htmlFor attribute same as **id**.
- **validFiles** should be an object `{extension:imageObj}` e.g. `{ ".pdf" : pdfImg, ".png" : pngImg }`

---

### [DataTable](./DataTable.jsx)

###### To show given data in tabular format, which are responsive and customizable.

- ###### Apply pagination.
- ###### Apply styles to row or specific cell.
- ###### Show / hide row Selection checkbox.
- ###### Show / hide index of row.
- ###### Add content in footer.

**<span style="color: blue;">PROPS :</span>**
**<span style="color: blue;">header</span> <span style="color: brown;">: Object </span>** Headers content
**<span style="color: blue;">rows</span> <span style="color: brown;">: { text, props }[ ] </span>** Row content
**checkbox <span style="color: brown;">: Boolean </span>** Show row selection checkbox
**selectedRows <span style="color: brown;">: [ ] </span>** List of selected files
**setSelectedRows <span style="color: brown;">: Method(row) </span>** Update list of selected files
**pagging <span style="color: brown;">: Number </span>** no. of rows on single page,
**showIndex <span style="color: brown;">: Boolean </span>** Show index cols
**footerComponent <span style="color: brown;">: String | HTML | Component </span>** Footer content

**<span style="color: green;">RETURN :</span>** Table component

**<span style="color: red;">NOTE :</span>**

- header should be,

```json
{
  row:{}, // props to be passed on row (optional)
  col:{}, // props to be applied on every cell (optional)
  data:{
    text: String | HTML | Component, // Content of cell
    props:{} // props on those cell
  }[],
}
```

- **checkbox** is true then, **selectedRows** & **setSelectedRows** should also be passed.
