import { Box, List, Typography } from "@material-ui/core";
import { useEffect } from "react";
import ReactDOM from "react-dom";

// Method to render List as filelist container or return function with list of rendered options
export const RenderListContainer = ({ container, containerRef, listItems }) => {
  // check if container reference is passed, then mount list in referenced component
  useEffect(() => {
    if (containerRef) {
      ReactDOM.render(listItems, containerRef.current);
      return () => ReactDOM.unmountComponentAtNode(containerRef.current);
    }
  }, [containerRef, listItems]);

  // If container ref is passed, then return null
  if (containerRef) return null;

  return container
    ? container(listItems)
    : listItems.length > 0 && (
        <List component={Box} maxWidth={300} overflow="hidden">
          <Typography>Attachment List</Typography>
          {listItems}
        </List>
      );
};
