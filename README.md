# Issue Tracker

Build a full stack JavaScript app that is functionally similar to this: https://issue-tracker.freecodecamp.rocks/. Working on this project will involve you writing your code using one of the following methods:

Complete the necessary routes in `/routes/api.js`
Create all of the functional tests in `tests/2_functional-tests.js`
Copy the `sample.env` file to `.env` and set the variables appropriately
To run the tests automatically, add `NODE_ENV=test` in your `.env` file
To run the tests in the console, use the command npm run test
Write the following tests in `tests/2_functional-tests.js`:

Create an issue with every field: POST request to `/api/issues/{project}`
Create an issue with only required fields: POST request to `/api/issues/{project}`
Create an issue with missing required fields: POST request to `/api/issues/{project}`
View issues on a project: GET request to `/api/issues/{project}`
View issues on a project with one filter: GET request to `/api/issues/{project}`
View issues on a project with multiple filters: GET request to `/api/issues/{project}`
Update one field on an issue: PUT request to `/api/issues/{project}`
Update multiple fields on an issue: PUT request to `/api/issues/{project}`
Update an issue with missing \_id: PUT request to `/api/issues/{project}`
Update an issue with no fields to update: PUT request to `/api/issues/{project}`
Update an issue with an invalid \_id: PUT request to `/api/issues/{project}`
Delete an issue: DELETE request to `/api/issues/{project}`
Delete an issue with an invalid \_id: DELETE request to `/api/issues/{project}`
Delete an issue with missing \_id: DELETE request to `/api/issues/{project}`

This is the boilerplate for the Issue Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker
