import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Icon,
} from "@material-ui/core";
import React from "react";

/* Custom accordion component with some default porperty */
export default function CustomAccordion({
  name,
  expandIcon = <Icon>arrow_drop_down</Icon>,
  summary,
  summaryProps,
  details,
  detailProps,
  ...rest
}) {
  return (
    <Accordion {...rest}>
      <AccordionSummary
        expandIcon={expandIcon}
        aria-controls={`${name}.replaceAll(" ", "-")-content`}
        id={`${name}.replaceAll(" ", "-")-header`}
        {...summaryProps}
      >
        {summary}
      </AccordionSummary>

      <Divider style={{ marginBottom: "6px" }} />

      <AccordionDetails {...detailProps}>{details}</AccordionDetails>
    </Accordion>
  );
}
