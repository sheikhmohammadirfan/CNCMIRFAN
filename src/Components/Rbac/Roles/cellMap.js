import { Icon } from "@mui/material"
import colorShader from "../../Utils/ColorShader"

const PermissionCell = ({ flag }) => {
  return (
    <Icon
      style={{
        color: flag ? colorShader('008000', 0.5) : colorShader('ff0000', 0.5)
      }}
    >
      {flag ? 'check_circle' : 'cancel'}
    </Icon>
  )
}

const columnCellMap = {
  permission: PermissionCell
}

export default columnCellMap