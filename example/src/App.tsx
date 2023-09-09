import React, { Component } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
  HighlightPopup,
} from "./react-pdf-highlighter";

import type { IHighlight, NewHighlight } from "./react-pdf-highlighter";

import { testHighlights as _testHighlights } from "./test-highlights";
import { Spinner } from "./Spinner";
import { Sidebar } from "./Sidebar";

import "./style/App.css";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight>;
  zoom: number;
  searchValue: string;
  currentMatch: number;
  totalMatchCount: number;
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

class App extends Component<{}, State> {
  state = {
    url: initialUrl,
    highlights: testHighlights[initialUrl]
    ? [...testHighlights[initialUrl]]
    : [],
    zoom: 1,
    searchValue: "",
    currentMatch: 0,
    totalMatchCount: 0,
  };

  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  toggleDocument = () => {
    const newUrl =
      this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
  };

  findNext = () => {};

  findPrev = () => {};

  scrollViewerTo = (highlight: any) => { };

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  addHighlight(highlight: NewHighlight) {
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights],
    });
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
            id,
            position: { ...originalPosition, ...position },
            content: { ...originalContent, ...content },
            ...rest,
          }
          : h;
      }),
    });
  }

  handleDeleteHighlight = (highlightId: string) => {
    // Use the `setState` function to update the state based on the previous state.
    this.setState((prevState) => ({
      // Update the `highlights` array by filtering out the highlight with the specified ID.
      // Only highlights with IDs different from `highlightId` will be included in the new array.
      highlights: prevState.highlights.filter((highlight) => highlight.id !== highlightId),
    }));
  };

  handleZoomChange = (event: any) => {
    const newZoom = parseFloat(event.target.value);
    this.setState({ zoom: newZoom });
  };

  render() {
    const { url, highlights, zoom, searchValue, currentMatch, totalMatchCount } = this.state;
    const options = ["Name", "CPR", "Date", "Address", "Phone Number", "Email", "Account Number", "Reference Number", "Invoice ID", "Transaction Code"];

    return (
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          highlights={highlights}
          resetHighlights={this.resetHighlights}
          toggleDocument={this.toggleDocument}
          setSearchValue={(searchValue) => this.setState({ searchValue })}
          currentMatch={currentMatch}
          totalMatchCount={totalMatchCount}
          findNext={this.findNext}
          findPrev={this.findPrev}
        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative",
          }}
        >
          <select value={zoom} onChange={this.handleZoomChange}>
            <option key={1} value="0.5">50%</option>
            <option key={2} value="0.75">75%</option>
            <option key={3} value="1">100%</option>
            <option key={4} value="1.25">125%</option>
            <option key={5} value="1.5">150%</option>
          </select>
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                pdfScaleValue={zoom.toString()}
                scrollRef={(scrollTo) => {
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                findRefs={(findPrev, findNext) => {
                  this.findPrev = findPrev;
                  this.findNext = findNext;
                }}
                searchValue={searchValue}
                onSearch={(currentMatch, totalMatchCount) => {
                  this.setState({ currentMatch, totalMatchCount });
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      this.addHighlight({ content, position, comment });
                      hideTipAndSelection();
                    }}
                    // For both radioOptions and valueOptions:
                    // 1. If nothing is provided, they are empty.
                    // 2. Use valueOptions={[]} to show the default options.
                    // 3. To display your custom list, set valueOptions={Your list here} ex. valueOptions={options}.
                    radioOptions={[]}
                    valueOptions={options}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      // popupContent={<HighlightPopup highlight={highlight} />}
                      popupContent={<HighlightPopup highlight={highlight} onDelete={() => this.handleDeleteHighlight(highlight.id)} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    );
  }
}

export default App;
