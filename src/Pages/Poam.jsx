import DocumentTitle from "../Components/DocumentTitle";
import PoamTable from "../Components/Poam/PoamTable";
import PoamUpload from "../Components/Poam/PoamUpload";
import useParams from "../Components/Utils/Hooks/useParams";

/* POA&M PAGE COMPONENT */
export default function Poam({ title }) {
  DocumentTitle(title);

  // subscribe to queryparam value: file change
  const { params, changeParams } = useParams("file");
  // Method to change file in POA&M
  const selectFile = (val, name) =>
    changeParams({ file: val, "page-name": name });

  return params.file ? (
    <PoamTable fileID={params.file} />
  ) : (
    <PoamUpload selectFile={selectFile} />
  );
}
