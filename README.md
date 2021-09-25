# CNCM Falcon

_Cloud Native Compliance Maven (CNCM) is a platform that automates the compliance processes of organisations and provide secure cloud services. We operate using P2P model with a agile based Software Development Lifecycle (SDLC) methodology._

- **Technology stack :**

  - Frontend: react/redux, Material UI
  - Backend: python/django
  - Database: MongoDB

- **Status :**
  Currently in the early development phase
- **Live Working Model :** [check out](https://cncm-falcon.herokuapp.com/)

- We follow CI/CD approach.

## Dependencies

- react: ^17.0.2
- material-ui: ^4.12.2
- react-router-dom: ^5.2.0

For detailed dependencies check out [this](https://github.com/cncm-inc/compliance-frontend/blob/master/package.json)

## Installation

- Clone / Download project:

  ```
  git clone https://github.com/cncm-inc/compliance-frontend.git

  ```

- Install all dependencies in your local machine:

  ```
  npm install

  ```

- Run the project:

  ```
  npm start / npm run start

  ```

## Functionality Preview

### Login / SignUp

![login_signup](https://user-images.githubusercontent.com/48097586/134775059-dceb226a-3de2-4c5e-bdef-553bf721db04.gif)

The above image depicts the login/signup screen for falcon.

- It uses an SVG background and SVG logos which contains the main login/signup component
- The left part of main component is reserved for Company name and some welcome message
- The login signup components slide is done with the help of CSS transition property
- Edge cases like unregistered user trying to login are handled successfully
- The textfield shown is made completely reusable
- We also have a forgot password screen poping up which is also done using CSS styling.
  > **Note: Whole project uses makestyles library of MUI. Please read more about it [here](https://towardsdev.com/use-your-makestyles-7d347f9a3e96)**
- Different auth options are provided besides custom login by using third party APIs such as aws, gcp, etc.

### Homepage

![home](https://user-images.githubusercontent.com/48097586/134775081-9800e592-d321-4406-a2cd-a43993931f67.gif)

The Homepage or rather all the pages have **fixed sidebar drawer and header** i.e. only the content between them is rendered differently for different routes.

1. **SideBar Component :**
   - It basically is a list rendered on screen with some list containing sublist(childern) within it which is revealed when hovered over it.
   - The top of the sidebar contains the company logo whereas the bottom contains user profile options i.e. settings and logout options.
   - It shrinks when the upper right side arrow is clicked and vice versa, it is done with the help of `states`
   - When shrinked only logo is displayed and rest all is hidden.
2. **Header :**

   - It's content are made `flex` for ease of positioning.
   - It has a custom `Breadcrumb` set up which basically shows the heirarchy of routes user is currently visiting. Read more about it [here](https://mui.com/components/breadcrumbs/)
   - It also has a notification Icon which displays user notification for important updates.

3. **Main Content :**
   - Home screen displays the user analytics along with some user activity.
   - It displays the dashboard for our product services to the user.

### Verify Compliance

![verify](https://user-images.githubusercontent.com/48097586/134775091-beffa71e-3da9-4e70-afa9-031d1f07af7c.gif)

This contains list of all the documents user has uploaded (max 10 files per user) with the help of MUI library called `Table` which has many predefined tools for better functionalities. You can find more about it [here](https://mui.com/components/tables/).

- We have choose file option on top which allows only prefered file format as input.
- After selecting files there occurs a pop up which how many files where selected (i.e. preview) and one can also select/deselect files there and click on upload.
- This triggers an API call and adds files to the user's database and then it is displayed to the user via `Table` of Material UI.
- The `Table` allows us to manipulate data (i.e. sort, selecting) in various form and it's easy to implement.
- On selecting files we have a option to delete them which activates only when one or more files are selected.
- We also have `Verify` button which parses selected documents and extracts data for verification of compliance.
