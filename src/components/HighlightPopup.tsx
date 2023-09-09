import React, { Component } from "react";
import "../style/HighlightPopup.css";

interface Highlight {
  id: string;
  comment: {
    text: string;
    selectedValueForRadio?: string;
    selectedValueForSelect?: string;
  };
}

interface HighlightPopupProps {
  highlight: Highlight;
  onDelete?: (id: string) => void;
}

export class HighlightPopup extends Component<HighlightPopupProps> {
  render() {
    const { highlight, onDelete } = this.props;

    return (
      <div className="HighlightPopup">
        <div className="HighlightPopup__text">
          {highlight.comment.selectedValueForRadio}{" "}
          {highlight.comment.selectedValueForSelect} {highlight.comment.text}
        </div>
        {onDelete && (
          <button className="HighlightPopup__delete" onClick={() => onDelete(highlight.id)}>
            Delete Highlight
          </button>
        )}
      </div>
    );
  }
}

export default HighlightPopup;