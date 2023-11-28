import { lazy } from "react";
import { Navigate } from "react-router-dom";


const FullLayout = lazy(() => import("../pages/Layout"));

/****** Pages *******/
const SurveyPostContainer = lazy(() => import("../components/common/SurveyPostContainer"));
const Login = lazy(() => import("../components/user/Login"));
const Join = lazy(() => import("../components/user/Join"));
const Plan = lazy(() => import("../components/common/Plan"))
const CommunityPost = lazy(() => import('../components/community/CommunityPost'))
const CommunityDetail = lazy(() => import('../components/community/PostDetail'))
const CreateSurvey = lazy(()=>import('../pages/survey/CreateSurveyPage'))
const ThemeRoutes = [
    {
        path : "/",
        element: <FullLayout />,
        children: [
            {path: "/", exact: true, element: <SurveyPostContainer />},
            {path: "/surveyPost", exact: true, element: <SurveyPostContainer />},
            {path: "/login", exact: true, element: <Login />},
            {path: "/join", exact: true, element: <Join />},
            {path: "/plan", exact: true, element: <Plan />},
            {path: "/community", exact: true, element: <CommunityPost />},
            {path: "/CommunityDetail", exact: true, element: <CommunityDetail />},
            {path: "/createSurvey", exact: true, element: <CreateSurvey />}

        ]
    }
];

export default ThemeRoutes;
