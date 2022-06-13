import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Icon,
} from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
import { PropType_Component } from "./Utils";

/* Custom accordion component with some default porperty */
function CustomAccordion({
  name,
  expandIcon = <Icon>arrow_drop_down</Icon>,
  summary,
  summaryProps,
  details,
  detailProps,
  ...rest
}) {
  return (
    <Accordion {...rest} data-test="accordion-container">
      <AccordionSummary
        expandIcon={expandIcon}
        aria-controls={`${name.replaceAll(" ", "-")}-content`}
        id={`${name.replaceAll(" ", "-")}-header`}
        {...summaryProps}
        data-test="accordion-summary"
      >
        {summary}
      </AccordionSummary>

      <Divider style={{ marginBottom: "6px" }} />

      <AccordionDetails {...detailProps} data-test="accordion-details">
        {details}
      </AccordionDetails>
    </Accordion>
  );
}
CustomAccordion.propTypes = {
  name: PropTypes.string.isRequired,
  expandIcon: PropType_Component,
  summary: PropType_Component.isRequired,
  summaryProps: PropTypes.object,
  details: PropType_Component.isRequired,
  detailProps: PropTypes.object,
};

export default CustomAccordion;
