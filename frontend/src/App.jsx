import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";

const App = () => {
   return (
      <div>
         <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/:mode" element={<AuthPage />} />
         </Routes>
      </div>
   );
};

export default App;
