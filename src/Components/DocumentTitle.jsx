import { useRef, useEffect } from "react";

export default function DocumentTitle(title, prevailOnUnmount = false) {
  // set the default title to the passed title
  const defaultTitle = useRef(document.title);

  // hooks to set the title
  useEffect(() => (document.title = `CNCM | ${title}`), [title]);

  // In case the component is unmounted the title is same
  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
      }
    },
    [prevailOnUnmount]
  );
}
