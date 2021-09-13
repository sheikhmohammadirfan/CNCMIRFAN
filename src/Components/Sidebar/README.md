# SideBar

###### Sidebar component to show navigation section, Logo btn and Pofile btn.

- ###### It is sticky on left side of screen and becomes fixed on xs screen overlaying the other content when expanded.
- ###### It have width toggler to expand / compress widh of sidebar.
- ###### It have reduced width on xs screen, only showing icons.
- ###### Logo btn & Profile btn is fixed on top and bottom respectively.
- ###### Navigation item cover remainging height with custom scrollbar and some have sub menu popup on them.

---

### [Sidebar](./Sidebar.jsx)

###### Main sidebar container that contains all sidebar items

**<span style="color: green;">RETURN :</span>** Sidebar component stick to left of screen, with width toggler

---

### [SidebarItem](./SidebarItem.jsx)

###### Generalize component, act as item of Sidebar and its submenu

**<span style="color: blue;">PROPS :</span>**
**sidebarOpen <span style="color: brown;">: Boolean </span>** Boolean value to save sidebar status
**xs <span style="color: brown;">: Boolean </span>** Boolean value to save window width
**text <span style="color: brown;">: String | HTML | Component </span>** text to show
**icon <span style="color: brown;">: String | HTML | Component </span>** icon to show
**subMenu <span style="color: brown;">: { text, icon, subMenu }[ ] </span>** Object of Submenu details
**\*** props to be applied on root Sidebar Item btn

**<span style="color: green;">RETURN :</span>** Sidebar component stick to left of screen, with width toggler

**<span style="color: red;">NOTE :</span>**
subMenu should be an array of Object `{text,icon,subMenu}[]`

---

### [ProfileBtn](./ProfileBtn.jsx)

###### Genrate profile btn as with user image and name and on popup show user settings and logout btn

**<span style="color: blue;">PROPS :</span>**
**<span style="color: blue;">sidebarStatus </span> <span style="color: brown;">: Boolean </span>** required to toggle visibility of arrow icon which signify sub menu.
**<span style="color: blue;">xs </span> <span style="color: brown;">: Boolean </span>** Boolean value to save window width.

**<span style="color: green;">RETURN :</span>** profile btn as Sidebar item
