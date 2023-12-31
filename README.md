This is a little improved copy of [react-pdf-highlighter](https://www.npmjs.com/package/react-pdf-highlighter) version 6.1.0.

This version includes the ability to zoom/scale, search and customize the content in the tip with your own list, allowing you to replace the default emojis. However, you can still choose to use the default emojis if you prefer.

[thom-react-pdf-highlighter](https://github.com/Thom719c/thom-react-pdf-highlighter)

## Getting Started in your own project

1. Install the package using npm:

```bash
npm install thom-react-pdf-highlighter
```

Import the component into your React application, example:
```bash
import {
    PdfLoader,
    PdfHighlighter,
    Tip,
    Highlight,
    Popup,
    HighlightPopup,
    AreaHighlight,
} from 'thom-react-pdf-highlighter';
```

# Some of the documentation/readme from react-pdf-highlighter below

## react-pdf-highlighter

`react-pdf-highlighter` is a [React](https://reactjs.org/) library that provides annotation experience for PDF documents on web. It is built on top of PDF.js by Mozilla. Text and rectangular highlights are supported. Highlight
data format is independent of the viewport, making it suitable for saving on the
server.

### Example

To run the example app locally:

```
npm install
npm start
```

Create React App example is available in `./create-react-app-example`. Make sure to run `npm install` there as well.

### Installation

`npm install react-pdf-highlighter`

See `./example/src/App.tsx` for React component API example.

### Prior art

[`react-pdf`](https://github.com/wojtekmaj/react-pdf) and
[`react-pdfjs`](https://github.com/erikras/react-pdfjs) only provide React
wrappers for PDF.js and do not have built-in annotation functionality.

[`pdfjs-annotate`](https://github.com/instructure/pdf-annotate.js/) does not
provide text highlights out of the box.

PDF.js provides only viewer:

> [PDF.js is mainly written for reading PDF files, not editing them. Because of that we don't yet support adding any kind of annotations. We do however support rendering a number of annotation types for viewing.](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#is-it-possible-to-add-annotations-to-a-pdf)

See also:

- https://github.com/mozilla/pdf.js
- https://github.com/wojtekmaj/react-pdf
- https://github.com/erikras/react-pdfjs
- https://github.com/instructure/pdf-annotate.js/
- https://blogs.dropbox.com/tech/2016/11/annotations-on-document-previews/

### FAQ

##### Can I get a new PDF with the highlights embedded into the document?

Take a look at https://pdf-lib.js.org.

##### Wasn't this named react-pdf-annotator at some point?

Yes, but people from https://www.pdfannotator.com/ asked me to rename, since [they have a trademark for PDF Annotator](https://www.pdfannotator.com/en/help/infodisclaimer).

##### I'm trying the demo with my PDF and it is not loading!

Please check the [CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) on your url. It is required for the cross-domain request.
