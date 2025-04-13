import React, { useRef, forwardRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';

const editorTestVal = `<h1><span style="font-family: 'book antiqua', palatino, serif;">Human Resource Security Policy</span></h1>
<p><span style="font-size: 10pt; font-family: arial, helvetica, sans-serif;">This is the initial content of the <em>editor</em></span></p>
<details class="mce-accordion">
<summary>Hello</summary>
<p>This is accordion body</p>
</details>
<p><s><span style="text-decoration: underline;"><em>Underline plus italic plus strikethrough</em></span></s></p>
<p style="text-align: center;">Centered</p>
<ol style="list-style-type: upper-alpha;">
<li style="text-align: left;">Number a</li>
<li style="text-align: left;">Number b</li>
</ol>
<ul style="list-style-type: circle;">
<li style="text-align: left;">Unordered list item</li>
</ul>
<p style="text-align: left;"><a href="https://www.tiny.cloud/docs/tinymce/latest/" target="_blank" rel="noopener">Link to TinyMCE Docs</a></p>
<table style="border-collapse: collapse; width: 99.9715%; height: 66.6px;" border="1"><colgroup><col style="width: 16.6904%;"><col style="width: 16.6904%;"><col style="width: 16.6904%;"><col style="width: 16.6904%;"><col style="width: 16.6904%;"><col style="width: 16.6904%;"></colgroup>
<tbody>
<tr style="height: 30.6px;">
<td>Col 1</td>
<td>Col 2</td>
<td>Col 3</td>
<td>Col 4</td>
<td>Col 5</td>
<td>Col 6</td>
</tr>
<tr style="height: 36px;">
<td>Val 1</td>
<td>Val 2</td>
<td>Val 3</td>
<td>Val 4</td>
<td>Val 5</td>
<td>Val 6</td>
</tr>
</tbody>
</table>
<p style="text-align: left;">Some special characters:-</p>
<ul>
<li style="text-align: left;">$ &cent; &copy; 円 &eacute; &micro; &spades; &Omega;</li>
</ul>
<p>Code preview</p>
<pre class="language-python"><code># Double click to edit
import os
os.remove('C:WindowsSystem32')</code></pre>
<p style="text-align: left;">Some Emojis</p>
<ul>
<li style="text-align: left;">🙃🙂😋😍🤑</li>
</ul>
<p style="text-align: left;"><span style="color: #e03e2d;">Some colored text</span></p>
<p style="text-align: left;"><span style="background-color: #000000; color: #ced4d9;">Some highlighted text</span></p>
<p style="text-align: left;"><img src="https://www.google.com/logos/google.jpg" alt="My alt text" width="354" height="116"></p>
<p style="text-align: left;">Will have to see how to upload images from local machine.</p>
<p style="text-align: left;">&nbsp;</p>`

const TinyMceEditor = forwardRef((props, ref) => {

  return (
    <>
      <Editor
        apiKey='your_api_key'
        onInit={(_evt, editor) => ref.current = editor}
        initialValue={editorTestVal}
        init={{
          selector: 'textarea#open-source-plugins',
          plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
          editimage_cors_hosts: ['picsum.photos'],
          menubar: 'file edit view insert format tools table help',
          toolbar: "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
          autosave_ask_before_unload: true,
          autosave_interval: '30s',
          autosave_prefix: '{path}{query}-{id}-',
          autosave_restore_when_empty: false,
          autosave_retention: '2m',
          image_advtab: true,
          link_list: [
            { title: 'My page 1', value: 'https://www.tiny.cloud' },
            { title: 'My page 2', value: 'http://www.moxiecode.com' }
          ],
          image_list: [
            { title: 'My page 1', value: 'https://www.tiny.cloud' },
            { title: 'My page 2', value: 'http://www.moxiecode.com' }
          ],
          image_class_list: [
            { title: 'None', value: '' },
            { title: 'Some class', value: 'class-name' }
          ],
          importcss_append: true,
          file_picker_types: 'file image media',
          file_picker_callback: (callback, value, meta) => {
            console.log(meta)
            /* Provide file and text for the link dialog */
            if (meta.filetype === 'file') {
              callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
            }

            /* Provide image and alt text for the image dialog */
            if (meta.filetype === 'image') {
              callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
            }

            /* Provide alternative source and posted for the media dialog */
            if (meta.filetype === 'media') {
              callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
            }
          },
          height: '100%',
          image_caption: true,
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
          noneditable_class: 'mceNonEditable',
          toolbar_mode: 'sliding',
          contextmenu: 'link image table',
          skin: 'oxide',
          content_css: 'default',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
        }}
      />
    </>
  )
})

export default TinyMceEditor