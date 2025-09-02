import { Button, ButtonGroup, Icon, Tooltip } from "@material-ui/core";
import drag from "../../../../assets/img/drag.png";
import PropTypes from "prop-types";

// Method to render default button trigger as children or return function with trigger parameter
const RenderChildren = ({
  children,
  fileList,
  trigger,
  removeAll,
  openDrag,
  hideDragNDrop,
}) =>
  children ? (
    children(trigger, removeAll, openDrag)
  ) : (
    <ButtonGroup size="small">
      {!hideDragNDrop && (
        <Tooltip arrow title="Drag n Drop">
          <Button onClick={openDrag} data-test="render-children-dragBtn">
            <img src={drag} alt="drag" />
          </Button>
        </Tooltip>
      )}

      <Button
        startIcon={<Icon>attach_file</Icon>}
        onClick={trigger}
        data-test="render-children-uploadBtn"
      >
        Attachment
      </Button>

      {fileList.length > 0 && (
        <Tooltip arrow title="Remove All Attachment">
          <Button onClick={removeAll} data-test="render-children-removeBtn">
            <Icon>delete_sweep</Icon>
          </Button>
        </Tooltip>
      )}
    </ButtonGroup>
  );
RenderChildren.propTypes = {
  fileList: PropTypes.array.isRequired,
};

export { RenderChildren };
