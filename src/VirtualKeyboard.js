import { MathJax } from "better-react-mathjax";
import React from "react";
import { Tooltip } from "react-tooltip";

const VirtualKeyboard = ({ formulaEditorRef }) => {
  const sym = "\\alpha";
  const tooltip = "alp";
  return (
    <div class="virtual-keyboard">
        <MathJax>
            <VirtualKey symbol={sym} tooltip={tooltip} reference={formulaEditorRef}/>
        </MathJax>
    </div>
  );
};

const VirtualKey = ({symbol,tooltip,reference}) => {
  const tooltipId = symbol.replace(" ","__").replace("\\","--");// Necessary replacement to have a valid (but still unique) id
  return (
    <div>
      <button data-tooltip-id={tooltipId} data-tooltip-content={tooltip} onClick={() => reference.current?.addSymbol(symbol)}>
            {`\\[${symbol} \\]`}
        </button>
        <Tooltip id={tooltipId} />
    </div>
  );
}

export default VirtualKeyboard;
