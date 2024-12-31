Fetching Data

Options: APIs, ORMs, SQL, etc.

APIs:

- are intermediary layer between your application code and db
- are used with 3rd part services
  - if you are fetching data from the client, you want to have an API layer that runs on the server to avoid exposing your database secrets to the client

In Next.js, you can create API endpoints using Route Handlers

- Route Handlers are defined in a route.js|ts file inside the app directory:
  export async function GET(request: Request) {}

  - can be nested anywhere inside app but there cannot be a route.js file at the same route segment level as page.js

Database queries: ORMs, SQL

- when creating your API endpoints, you need to write logic to interact with your database
- If you are using React Server Components (fetching data on the server), you can skip the API layer, and query your database directly without risking exposing your database secrets to the client

- you should not query your database directly when fetching data on the client as this would expose your database secrets

By default Next.js uses React Server Components:

1. supports promises, providing a simpler solution for asynchronous tasks like data fetching (you can use async/await w/o useEffect or useState)
2. Server components execute on the server, so you can keep expensive data fetches and logic on the server
3. Server Components execute on the server, you can query the database directly without an additional API layer
