import React from 'react';
import "./style/Sidebar.css";

const Sidebar = ({
    highlights,
    toggleDocument,
    resetHighlights,
    scale,
    setScale,
    setSearchValue,
    currentMatch,
    totalMatchCount,
    findNext,
    findPrev,
    scrollToHighlight,
    highlightingMode,
    setHighlightingMode,
    areaHighlightingMode,
    setAreaHighlightingMode
}) => {
    const zoomOptions = [50, 75, 100, 125, 150];

    const handleScaleChange = (event) => {
        const newZoom = parseFloat(event.target.value);
        setScale(newZoom);
    };

    const updateHash = (highlight) => {
        document.location.hash = `highlight-${highlight.id}`;
    };

    const toggleHighlightingMode = () => {
        setHighlightingMode(!highlightingMode);
        setAreaHighlightingMode(highlightingMode);
    };

    const toggleAreaHighlightingMode = () => {
        setAreaHighlightingMode(!areaHighlightingMode);
        setHighlightingMode(areaHighlightingMode);
    };

    const toggleReadMode = () => {
        setAreaHighlightingMode(false);
        setHighlightingMode(false);
    };

    return (
        <div className="sidebar">
            <div className="description">
                <h2>react-pdf-highlighter APP_VERSION</h2>

                <hr />

                <p>
                    <a href="https://github.com/agentcooper/react-pdf-highlighter">
                        Open in Original GitHub
                    </a>
                </p>

                <p>
                    <a href="https://github.com/Thom719c/thom-react-pdf-highlighter">
                        Open in GitHub
                    </a>
                </p>

                <hr />

                <h3>Select mode</h3>
                <div className='optionGroup'>
                    <div className='item'>
                        <input
                            type="radio"
                            name="highlightMode"
                            id="readMode"
                            checked={!areaHighlightingMode && !highlightingMode}
                            onChange={toggleReadMode}
                            style={styles.inputRadio}
                        />
                        <label htmlFor="readMode" title="Read Mode" className={`highlightMode ${!areaHighlightingMode && !highlightingMode ? 'highlightModeActive' : ''}`}>
                            Read
                        </label>
                    </div>

                    <div className='item'>
                        <input
                            type="radio"
                            name="highlightMode"
                            id="textHighlightMode"
                            checked={highlightingMode}
                            onChange={toggleHighlightingMode}
                            style={styles.inputRadio}
                        />
                        <label htmlFor="textHighlightMode" title="Text Highlight Mode" className={`highlightMode ${highlightingMode ? 'highlightModeActive' : ''}`}>
                            Text highlight
                        </label>
                    </div>

                    <div className='item'>
                        <input
                            type="radio"
                            name="highlightMode"
                            id="areaHighlightMode"
                            checked={areaHighlightingMode}
                            onChange={toggleAreaHighlightingMode}
                            style={styles.inputRadio}
                        />
                        <label htmlFor="areaHighlightMode" title="Area Highlight Mode" className={`highlightMode ${areaHighlightingMode ? 'highlightModeActive' : ''}`}>
                            Area highlight
                        </label>
                    </div>
                </div>

                <h3>Set Scale</h3>
                <div className='scale_container'>
                    <select className='zoom' value={scale} onChange={handleScaleChange}>
                        {zoomOptions.map((scaleValue) => (
                            <option key={scaleValue} value={scaleValue / 100}>
                                {scaleValue}%
                            </option>
                        ))}
                    </select>
                </div>

                <h3>Search:</h3>
                <div className='search_match_container'>
                    <input type="text" onChange={(e) => setSearchValue(e.target.value)} />
                    <div className='search_button_container'>
                        <button className='search_prev_next' onClick={findPrev}>{"<"}</button>
                        <button className='search_match'>{`${currentMatch}/${totalMatchCount}`}</button>
                        <button className='search_prev_next' onClick={findNext}>{">"}</button>
                    </div>
                </div>
            </div>

            <hr />

            <ul className="sidebar__highlights">
                {highlights.map((highlight, index) => (
                    <li
                        key={index}
                        className="sidebar__highlight"
                        onClick={() => {
                            updateHash(highlight);
                            scrollToHighlight(highlight);
                        }}
                    >
                        <div>
                            <strong>{highlight.comment.text}</strong>
                            {highlight.content.text ? (
                                <blockquote style={{ marginTop: "0.5rem" }}>
                                    {`${highlight.content.text.slice(0, 90).trim()}…`}
                                </blockquote>
                            ) : null}
                            {highlight.content.image ? (
                                <div className="highlight__image">
                                    <img src={highlight.content.image} alt={"Screenshot"} />
                                </div>
                            ) : null}
                        </div>
                        <div className="highlight__location">
                            Page {highlight.position.pageNumber}
                        </div>
                    </li>
                ))}
            </ul>
            <div className='toggle-document-container'>
                <button className='toggle-document' onClick={toggleDocument}>Toggle PDF document</button>
            </div>
            {highlights.length > 0 ? (
                <div className='reset-highlights-container'>
                    <button className='reset-highlights' onClick={resetHighlights}>Reset highlights</button>
                </div>
            ) : null}
        </div>
    );
}

const styles = {
    inputRadio: {
        appearance: 'none',
    },
};

export default Sidebar;