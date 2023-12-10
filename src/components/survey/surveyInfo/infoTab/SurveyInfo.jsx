import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { useState, useEffect } from "react";
import style from "../../../../style/survey/SurveyInfo.module.css";
import QuestionInfo from "./QuestionInfo";
import SurveyTitle from "../SurveyTitle";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SurveyContext } from "../../../../pages/survey/SurveyInfoPage";
import { call } from "../../../../pages/survey/Login";

export default function SurveyInfo() {
  const { survey } = useContext(SurveyContext);
  const navigate = useNavigate();

  const { surveyId, title, content, surveyType, questions } = survey;

  const handleDeleteSurvey = () => {
    const response = window.confirm("설문지를 삭제하시겠습니까?");
    if (response) {
      call("/survey/" + surveyId, "DELETE").then((data) => {
        console.log(data);
        alert(data);
        navigate("/workspace");
      });
    }
  };

  return (
    <>
      <div className={style.container}>
        {/* 버튼들  */}

        <div className={style.wrapButton}>
          <div></div>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="text" onClick={handleDeleteSurvey}>
              삭제
            </Button>
            <Button variant="contained">업로드</Button>
            <Link to={"/editSurvey"} state={{ surveyId: surveyId }}>
              <Button variant="outlined">수정</Button>
            </Link>
          </Stack>
        </div>

        {/* 설문지 제목  */}
        <SurveyTitle title={title} content={content} />

        <div>
          {questions.map((question, index) => (
            <QuestionInfo key={index} info={question} />
          ))}
        </div>
      </div>
    </>
  );
}
