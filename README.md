# integration-test
The project is dedicated to showcase how to implement component-based integration tests.

We’ll build a simple to-do list application for demonstration.

Frontend will have 4 version
* Angular 2
* Vue 3
* Reactjs
* Svelte

While the backend is still in backlog, we use the json-server library to help proxy our API on local so that new/updated/deleted todos will indeed be persisted within the db.json file.n


# Start the server
1. We install it by running:
`npm install -g json-server`

2. To start the json server, go to folder backend and run:
`json-server --watch db.json`

# Start the frontend application
To run the application, go to the corresonding frontend folder and run command
`npm install --force`

* Angular: Go to frontend/todo-app-angular
`yarn start`

* Vue: Go to frontend/todo-app-vue
`yarn dev`

* React: Go to frontend/todo-app-react
`yarn start`

* Svelte: Go to frontend/todo-app-svelte
`yarn start`

# Integration Tests
Integration tests have the format *\*.int.spec.ts*.
For example: In frontend/todo-app-angular, run
```
npm test int.spec.ts
```

