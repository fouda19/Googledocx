import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import { Documents, Login, Signup, TextEditor } from './pages'
// import Alert from './components/Alert';
// import './assets/css/Layout.css';
import Example from './components/Navbar';
import Doclist from './components/DocumentsList';
import Example from "./components/Navbar";
import DocsCard from "./components/documentCard";

function App() {
  // const { status } = useSession();
  return (
    <div className="App">
      <Example />
      <Doclist/>
      <DocsCard id="1" fileName="Test File" date={new Date()} />
      {/* <Router>
        <Alert />
        <Routes>
          <Route path={'/'} element={<Login />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/signup'} element={<Signup />} />
          <Route
            path={'/texteditor'}
            element={<TextEditor />}
          />
          <Route
            path={'/texteditor'}
            element={<Documents />}
          />
        </Routes>
      </Router> */}
    </div>
  );
}

export default App;
