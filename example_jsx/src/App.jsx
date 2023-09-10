import { useEffect, useState, useRef } from 'react'
import './App.css'

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
  HighlightPopup,
} from "./thom-react-pdf-highlighter";
import { v4 as uuidv4 } from 'uuid';

import { testHighlights } from "./test-highlights";
import Sidebar from "./Sidebar";

const App = () => {
  const [url, setUrl] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [scale, setScale] = useState(1); // Default zoom level is 100%
  const [searchValue, setSearchValue] = useState("");
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatchCount, setTotalMatchCount] = useState(0);
  const [highlightingMode, setHighlightingMode] = useState(false);
  const [areaHighlightingMode, setAreaHighlightingMode] = useState(false);

  const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
  const options = ["Name", "CPR", "Date", "Address", "Phone Number", "Email", "Account Number", "Reference Number", "Invoice ID", "Transaction Code"];

  const areaHighlightingModeRef = useRef(areaHighlightingMode);

  useEffect(() => {
    areaHighlightingModeRef.current = areaHighlightingMode;
  }, [areaHighlightingMode]);

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;
    setUrl(initialUrl);
    setHighlights([...testHighlights[initialUrl]]);
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash, false);
    };
  }, []);

  const toggleDocument = () => {
    const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    setUrl(newUrl);
    setHighlights(testHighlights[newUrl] ? [...testHighlights[newUrl]] : []);
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  const generateUniqueId = () => {
    const date = new Date().valueOf();
    const uuid = uuidv4();
    return uuid + '-' + date;
  }

  const addHighlight = (highlight) => {
    console.log("Saving highlight", highlight);
    setHighlights((prevHighlights) => [...prevHighlights, highlight]);
  };

  const updateHighlight = (highlightId, position, content) => {
    console.log("Updating highlight", highlightId, position, content);
    setHighlights((prevHighlights) => {
      return prevHighlights.map((h) => {
        if (h.id === highlightId) {
          return {
            ...h,
            position: { ...h.position, ...position },
            content: { ...h.content, ...content },
          };
        }
        return h;
      });
    });
  };

  const handleDeleteHighlight = (highlightId) => {
    const updatedHighlights = highlights.filter(highlight => highlight.id !== highlightId);
    setHighlights(updatedHighlights);
  }

  const findNext = () => { };
  const findPrev = () => { };

  const parseIdFromHash = () => document.location.hash.slice("#highlight-".length);
  const resetHash = () => document.location.hash = "";

  let scrollViewerTo = (highlight) => { };

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      scrollViewerTo(highlight);
    }
  };

  const getHighlightById = (id) => {
    return highlights.find((highlight) => highlight.id === id);
  }

  return (
    <div className="app">
      <Sidebar
        highlights={highlights}
        toggleDocument={toggleDocument}
        resetHighlights={resetHighlights}
        scrollToHighlight={scrollToHighlightFromHash}
        scale={scale}
        setScale={(newScaleValue) => setScale(newScaleValue)}
        setSearchValue={(searchValue) => setSearchValue(searchValue)}
        currentMatch={currentMatch}
        totalMatchCount={totalMatchCount}
        findNext={findNext}
        findPrev={findPrev}
        highlightingMode={highlightingMode}
        setHighlightingMode={setHighlightingMode}
        areaHighlightingMode={areaHighlightingMode}
        setAreaHighlightingMode={setAreaHighlightingMode}
      />
      <div className='document__container'>
        <PdfLoader url={url} beforeLoad={<div>Loading...</div>}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              pdfScaleValue={scale.toString()}
              enableAreaSelection={(event) => {
                if (areaHighlightingModeRef.current) {
                  return areaHighlightingModeRef.current;
                }
              }}
              onSelectionFinished={(position, content, hideTipAndSelection, transformSelection) => {
                if (content.text && highlightingMode) {
                  return (
                    <Tip
                      onOpen={transformSelection}
                      onConfirm={(comment) => {
                        addHighlight({ content, position, comment, id: generateUniqueId() });
                        hideTipAndSelection();
                      }}
                      // For both radioOptions and valueOptions:
                      // 1. If nothing is provided, they are empty.
                      // 2. Use valueOptions={[]} to show the default options.
                      // 3. To display your custom list, set valueOptions={Your list here} ex. valueOptions={options}.
                      radioOptions={[]}
                      valueOptions={options}
                    />
                  );
                }
                if (content.image && areaHighlightingModeRef.current) {
                  return (
                    <Tip
                      onOpen={transformSelection}
                      onConfirm={(comment) => {
                        addHighlight({ content, position, comment, id: generateUniqueId() });
                        hideTipAndSelection();
                      }}
                      // radioOptions={[]}
                      valueOptions={options}
                    />
                  );
                }
              }}
              onScrollChange={(resetHash)}
              scrollRef={(scrollTo) => {
                scrollViewerTo = scrollTo;
                scrollToHighlightFromHash();
              }}
              findRefs={(findPrev, findNext) => {
                findPrev = findPrev;
                findNext = findNext;
              }}
              searchValue={searchValue}
              onSearch={(currentMatch, totalMatchCount) => {
                setCurrentMatch(currentMatch)
                setTotalMatchCount(totalMatchCount)
              }}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isTextHighlight = !Boolean(highlight.content && highlight.content.image);
                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    annotation={highlight.annotation}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      updateHighlight(
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
                    popupContent={<HighlightPopup highlight={highlight} onDelete={() => handleDeleteHighlight(highlight.id)} />}
                    onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                    onMouseOut={hideTip}
                    key={index}
                    children={component}
                  />
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader >
      </div>
    </div>
  )
}

export default App