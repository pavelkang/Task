import {InputGroup} from "@blueprintjs/core";

const WidgetAttachments= React.createClass({
  render() {
    return(
      <div>
        <label className="pt-file-upload">
          <input type="file" />
          <span className="pt-file-upload-input">Choose file...</span>
        </label>
      </div>
    )
  }
});
module.exports = WidgetAttachments;
