import React, { Component } from "react";

import "../style/Tip.css";

interface State {
  compact: boolean;
  text: string;
  selectedValueForRadio: string;
  selectedValueForSelect: string;
}

interface Props {
  onConfirm: (comment: { text: string; selectedValueForRadio: string; selectedValueForSelect: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
  radioOptions?: string[];
  valueOptions?: string[];
}

export class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    selectedValueForRadio: "",
    selectedValueForSelect: "",
  };

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  optionsValues = (options: any) => {
    if (options === undefined) {
      // Case 1: valueOptions prop not set, show nothing
      return undefined;
    }

    if (options.length === 0) {
      // Case 2: valueOptions prop is an empty list, show default options
      return ["💩", "😱", "😍", "🔥", "😳", "⚠️"];
    }

    // Case 3: valueOptions prop is set with a list, show that list
    return options;
  }

  render() {
    const { onConfirm, onOpen, radioOptions, valueOptions } = this.props;
    const { compact, text, selectedValueForRadio, selectedValueForSelect } = this.state;

    let radioOptionsList: string[] = this.optionsValues(radioOptions);
    let options: string[] = this.optionsValues(valueOptions);

    return (
      <div className="Tip">
        {compact ? (
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          >
            Add highlight
          </div>
        ) : (
          <form
            className="Tip__card"
            onSubmit={(event) => {
              event.preventDefault();
              onConfirm({ text, selectedValueForRadio, selectedValueForSelect });
            }}
          >
            <div>
              <textarea
                placeholder="Your comment"
                autoFocus
                value={text}
                onChange={(event) =>
                  this.setState({ text: event.target.value })
                }
                ref={(node) => {
                  if (node) {
                    node.focus();
                  }
                }}
              />
              <div>
                {radioOptionsList?.map((option) => (
                  <label key={option} className="Tip__labelOptions">
                    <input
                      checked={selectedValueForRadio === option}
                      type="radio"
                      name="value"
                      value={option}
                      onChange={(event) =>
                        this.setState({ selectedValueForRadio: event.target.value })
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
              <div>
                {options === undefined ? null : (
                  <select
                    className="Tip__select"
                    value={selectedValueForSelect}
                    onChange={(event) =>
                      this.setState({ selectedValueForSelect: event.target.value })
                    }
                  >
                    <option key="choose" value="">
                      Choose...
                    </option>
                    {options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div>
              <input type="submit" value="Save" />
            </div>
          </form>
        )}
      </div>
    );
  }
}

export default Tip;
