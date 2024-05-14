import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Documents, Login, Signup, TextEditor } from "./pages";
// import Alert from './components/Alert';
// import './assets/css/Layout.css';
import Navbar from "./components/Navbar";
// import Doclist from './components/DocumentsList';
// import Login from "./pages/Login";
// import DocsCard from "./components/documentCard";
// import Signup from "./pages/Signup";
import { QueryClientProvider, QueryClient } from "react-query";
// import { useState } from "react";

function App() {
  // const { status } = useSession();
  const queryClient = new QueryClient();
  // const [sharedProp, setSharedProp] = useState(null);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {/* <Navbar/> */}
        {/* <Login/> */}
        {/* <Signup/> */}

        <Router>
          <Navbar />
          {/* <Alert /> */}
          <Routes>
            <Route path={"/"} element={<Login />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/signup"} element={<Signup />} />
            <Route path={"/texteditor/:documentId"} element={<TextEditor />} />
            <Route path={"/documents"} element={<Documents />} />
          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
