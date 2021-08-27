import { useRef, useEffect } from "react";

function DocumentTitle(title, prevailOnUnmount = false) {
  // set the default title to the passed title
  const defaultTitle = useRef(document.title);

  // hooks to set the title
  useEffect(() => (document.title = `CNCM | ${title}`), [title]);

  // In case the component is unmounted the title is same
  useEffect(() => {
    return !prevailOnUnmount && (document.title = defaultTitle.current);
  }, []);
}

export default DocumentTitle;
