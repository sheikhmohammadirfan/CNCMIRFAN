import DocumentTitle from "../Components/DocumentTitle";
import PoamTable from "../Components/Poam/PoamTable";
import PoamUpload from "../Components/Poam/PoamUpload";
import useParams from "../Components/Utils/Hooks/useParams";
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min'

/* POA&M PAGE COMPONENT */
export default function Poam({ title }) {
  DocumentTitle(title);

  // subscribe to queryparam value: file change
  const { params, changeParams } = useParams("file");
  // Method to change file in POA&M
  const selectFile = (val, name) =>
    changeParams({ file: val, "page-name": name });

  return (
    <Route>
      <Switch>
        <Route exact path="/poam">
          {params.file ? (
            <PoamTable fileID={params.file} />
          ) : (
            <PoamUpload selectFile={selectFile} />
          )}
        </Route>
      </Switch>
    </Route>
  );
}
