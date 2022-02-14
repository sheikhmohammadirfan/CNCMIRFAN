import { Avatar, Button, ButtonGroup, Icon, Tooltip } from "@material-ui/core";
import drag from "../../../../assets/img/drag.png";

// Method to render default button trigger as children or return function with trigger parameter
export const RenderChildren = ({
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
          <Button onClick={openDrag}>
            <img src={drag} alt="drag" />
          </Button>
        </Tooltip>
      )}

      <Button startIcon={<Icon>attach_file</Icon>} onClick={trigger}>
        Attachment
      </Button>

      {fileList.length > 0 && (
        <Tooltip arrow title="Remove All Attachment">
          <Button onClick={removeAll}>
            <Icon>delete_sweep</Icon>
          </Button>
        </Tooltip>
      )}
    </ButtonGroup>
  );
