import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import EditSurveyTitle from "../../components/survey/surveyForm/EditSurveyTitle";
import QuestionComp from "../../components/survey/surveyForm/QuestionComp";
import style from "../../style/survey/EditSurveyPage.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function EditSurveyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  let surveyId = location.state.surveyId || 0;

  useEffect(() => {
    console.log(surveyId);
    handleGetSurvey(surveyId);
  }, []);

  const [formData, setFormData] = useState({
    surveyId: 0,
    title: "설문지 제목",
    content: "설문지 내용",
    surveyType: "기본",
    questions: [],
  });

  const [questions, setQuestions] = useState([
    {
      questionId: 0,
      surveyQuestion: "",
      answerType: "",
      score: 0,
      step: 0,
      isRequired: false,
      answers: [],
    },
  ]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = [...questions];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  const handleGetSurvey = async (surveyId) => {
    try {
      const response = await axios.get("/survey/" + surveyId);
      setFormData(response.data);
      setQuestions(response.data.questions);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleUpdateSurvey = async (surveyId) => {
    const { createQuestion, updateQuestion } = questions.reduce(
      (acc, question, index) => {
        const { questionId, ...rest } = { ...question, step: index + 1 };

        if (questionId === 0) {
          acc.createQuestion.push(rest);
        } else {
          acc.updateQuestion.push({ ...question, step: index + 1 });
        }

        return acc;
      },
      { createQuestion: [], updateQuestion: [] }
    );

    const surveyData = {
      ...formData,
      questions: undefined, // questions 필드 없애기
      updateQuestions: updateQuestion,
      createQuestions: createQuestion,
    };

    await axios
      .patch("/survey/" + surveyId, surveyData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const changeQuestionTitle = (id, text) => {
    setQuestions((pre) => {
      const result = pre.map((question, index) =>
        index === id ? { ...question, surveyQuestion: text } : question
      );
      return result;
    });
  };

  const changeQuestionContent = (id, text) => {
    setQuestions((pre) => {
      const result = pre.map((question, index) =>
        index === id ? { ...question, content: text } : question
      );
      return result;
    });
  };

  const changeOption = (id, type) => {
    setQuestions((pre) => {
      const result = pre.map((question, index) =>
        index === id ? { ...question, answerType: type } : question
      );
      return result;
    });
  };

  const deleteQuestion = (id) => {
    setQuestions((pre) => {
      const result = pre
        .filter((question, index) => index !== id)
        .map((question, index) => ({ ...question }));
      return result;
    });
  };

  const addQuestion = () => {
    setQuestions((pre) => {
      return [
        ...pre,
        {
          questionId: 0,
          surveyQuestion: "",
          answerType: "",
          score: 0,
          step: 0,
          isRequired: false,
          answers: [],
        },
      ];
    });
  };

  const changeRequired = (id) => {
    setQuestions((pre) => {
      const result = pre.map((question, index) =>
        index === id
          ? { ...question, isRequired: !question.isRequired }
          : question
      );
      return result;
    });
  };

  const handleOption = (id, options) => {
    setQuestions((pre) => {
      const result = pre.map((question, index) =>
        index === id ? { ...question, answers: options } : question
      );
      return result;
    });
  };

  const changeSurveyTitle = (text) => {
    setFormData((pre) => ({ ...pre, title: text }));
  };

  const changeSurveyContent = (text) => {
    setFormData((pre) => ({ ...pre, content: text }));
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.wrapContent}>
          <EditSurveyTitle
            title={formData.title}
            content={formData.content}
            changeSurveyTitle={changeSurveyTitle}
            changeSurveyContent={changeSurveyContent}
          />

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="createQuestions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={style.questionList}
                >
                  {questions.map((questionData, index) => (
                    <Draggable
                      key={index}
                      draggableId={`question-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div className={style.question}>
                            <QuestionComp
                              key={index}
                              index={index}
                              questionInfo={questionData}
                              changeTitle={changeQuestionTitle}
                              changeContent={changeQuestionContent}
                              changeOption={changeOption}
                              deleteQuestion={deleteQuestion}
                              changeRequired={changeRequired}
                              handleOption={handleOption}
                              provided={provided}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <IconButton aria-label="delete" size="medium" onClick={addQuestion}>
            <FaPlus />
          </IconButton>

          <div className={style.wrapButton}>
            <Button variant="outlined" onClick={handleGoBack}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={() => handleUpdateSurvey(surveyId)}
            >
              완료
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
