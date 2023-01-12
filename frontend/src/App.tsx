import React, { useEffect } from 'react';
import Login from "./components/Login";
import { authWarmup } from './dataAccess/utils'
// Import browser router
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  isRouteErrorResponse,
  useRouteError,
  redirect,
} from "react-router-dom";

function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    console.log(error);
    return (
      <div>
        <h1>Oops!</h1>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
        <p>{JSON.stringify(error)}</p>
      </div>
    );
  } else {
    return <div>Oops</div>;
  }
}

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" loader={
      async () => {
        return redirect("/index.html");
      }
    } />,
    <Route path="/index.html" element={<Login />} errorElement={<ErrorBoundary />}>
      <Route path="login" element={<Login />} errorElement={<ErrorBoundary />} />
    </Route>
  ])
);

function App() {

  useEffect(() => {
    // Warmup request.
    authWarmup();
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div >
  );
}

export default App;
