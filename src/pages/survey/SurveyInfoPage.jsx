import * as React from "react";
import { useEffect, useState } from "react";
import SurveyInfo from "../../components/survey/surveyInfo/infoTab/SurveyInfo";
import ButtonTab from "../../components/survey/surveyInfo/ButtonTab";
import ResultView from "../../components/survey/surveyInfo/resultTab/ResultView";
import Loader from "../loader/Loader";
import { createContext } from "react";
import { useWorkspaceContext } from "../workspace/WorkspaceContext";
import call from "../workspace/api";

export const SurveyContext = createContext();

export default function SurveyInfoPage() {
  const { selectedSurveyId } = useWorkspaceContext();
  const [page, setPage] = useState(0);
  const [element, setElement] = useState(<></>);
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState({
    surveyId: 0,
    title: "",
    content: "",
    surveyType: "",
    questions: [
      {
        questionId: 0,
        surveyQuestion: "",
        answerType: "",
        score: 0,
        step: 0,
        isRequired: false,
        answers: [],
      },
    ],
  });

  const contextValue = {
    survey,
    setSurvey,
  };

  useEffect(() => {
    console.log("여기 survey", survey);
  }, [survey]);

  useEffect(() => {
    handleGetSurvey();
  }, []);

  useEffect(() => {
    if (page) {
      setElement(<ResultView />);
    } else {
      setElement(<SurveyInfo />);
    }
  }, [page]);

  // useEffect(() => {
  //   if (page) {
  //     setElement(<ResultView />);
  //   } else {
  //     setElement(<SurveyInfo />);
  //   }
  // }, [page, survey]);

  const handleGetSurvey = async () => {
    if (!selectedSurveyId) {
      return;
    }
    setLoading(true); // 데이터 로딩 시작

    try {
      const response = await call(`/survey/${selectedSurveyId}`, "GET");
      setSurvey(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 데이터 로딩 완료
    }
  };

  const handleChangeTab = (e, num) => {
    e.preventDefault();
    setPage(num);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <SurveyContext.Provider value={contextValue}>
        <div style={{ paddingTop: "100px", paddingLeft: "254px" }}>
          <div style={{ width: "700px", margin: "0 auto" }}>
            <ButtonTab
              handleChangeTab={handleChangeTab}
              page={page}
              first={"설문지 폼"}
              second={"응답 결과"}
            ></ButtonTab>
          </div>

          <div>{element}</div>
        </div>
      </SurveyContext.Provider>
    </>
  );
}
