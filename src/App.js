import './App.css';
import BizCard from "./components/common/BizCard";
import BizCard2 from "./components/common/BizCard2";
import {Reset} from 'styled-reset'
import Header from './components/common/Header';
import Footer from './components/common/Footer';

import SurveyPostContainer from './components/common/SurveyPostContainer';
import Login from './components/user/Login';
import Join from './components/user/Join';
import CommunityPost from './components/community/CommunityPost';
import Search from './components/common/Search';

import SurveyCard from './components/common/SurveyCard';
import { useRoutes } from 'react-router-dom';
import ThemeRoutes from './routes/Router';
import CreateVote from './components/community/CreateVote';
import VoteResult from './components/community/VoteResult';


const App = () => {
  const routing = useRoutes(ThemeRoutes);
  return (
    <>
      <Reset />
      <Header></Header>
       <VoteResult />
      <Footer></Footer>

    </>

  );
}
export default App;
