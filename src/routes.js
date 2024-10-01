import { useRoutes } from "react-router-dom";
// import SideBar from "./components/SideBar/SideBar";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Tester from "./pages/Tester/Tester";
import { AuthProvider } from '../src/pages/Login/AuthContext'
import ProtectedRoute from '../src/pages/Login/ProtectedRoute';
import SignUp from "./pages/SignUp/SignUp";
import Monitor from "./pages/Monitor/Monitor";
import Jira from "./pages/Jira/Jira";
import Chat_temporary from "./pages/Home/Chat_temporary";
import Chat_permanent from "./pages/Home/Chat_permanent";
// import TranscriptionApp from "./pages/Transcription/TranscriptionApp";


const Router = () => {

    const routes = useRoutes([
      {
        path: "",
        // element:<SideBar/>,
        children: [
          {
            path: "",
            element: <Landing />,
          },
          {
            path: "tester",
            element: <Tester />,
          },

          // {
          //     path:'home',
          //     element:<ProtectedRoute element={Home} />
          // },
          {
            path: "home",
            element: <Home />,
          },
          {
            path: "monitor",
            element: <Monitor />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "landing",
            element: <Landing />,
          },
          {
            path: "jira",
            element: <Jira />,
          },

          {
            path: "SignUp",
            element: <SignUp />,
          },
          // {
          //   path: "TranscriptionApp",
          //   element: <TranscriptionApp />,
          // },
          {
            path: "chat_temporary",
            element: <Chat_temporary />,
          },
          {
            path: "chat_permanent",
            element: <Chat_permanent />,
          },
        ],
      },
    ]);
    return routes;
}
// export default Router;

export default function AppRouter() {
    return (
      <AuthProvider>
        <Router />
      </AuthProvider>
    );
  }