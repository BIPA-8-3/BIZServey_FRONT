import QuestionComp from "../../components/survey/surveyForm/QuestionComp";
import * as React from "react";
import {useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa6";
import IconButton from "@mui/material/IconButton";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function CreateSurveyPage(){


    const [formData, setFormData] = useState({
        title: '',
        content: '',
        surveyType: '기본',
        questions: [

        ]
    });

    const [questions, setQuestions] = useState([{
        surveyQuestion: '',
        answerType : '',
        score:0,
        step: 1,
        isRequired : false,
        answers : []
    }]);

    const changeQuestionTitle = (id, text) => {
        setQuestions(pre => {
            const result=  pre.map((question,index) =>
                question.step === id ? {...question, surveyQuestion : text, step : index + 1} : question)
            return result;
        })
    }

    const changeQuestionContent = (id, text) => {
        setQuestions(pre => {
            const result = pre.map((question,index) =>
                question.step === id ? {...question, content : text, step : index + 1} : question)
            return result;
        })
    }

    const changeOption = (id, type) => {
        setQuestions(pre => {
            const result = pre.map((question, index) =>
                question.step === id ? {...question, answerType : type, step: index + 1} : question)
            return result;
        })
    }

    const deleteQuestion = (id) => {
        setQuestions(pre => {
            const result = pre.filter(question => question.step !== id)
                .map((question, index) => ({...question, step: index + 1}))
            return result;
        })
    }

    const addQuestion = () => {
        setQuestions(pre =>{
                const lastId = pre.length > 0 ? pre[pre.length-1].step : 0;
                return [...pre, {
                    surveyQuestion: '',
                    answerType : '',
                    score:0,
                    step: lastId + 1,
                    isRequired : false,
                    answers : [

                    ]
                }]
            }
        )
    }

    const changeRequired = (id) => {
        setQuestions(pre=>{
            const result = pre.map((question,index) =>
                question.step === id ? {...question, isRequired: !question.isRequired, step : index + 1} : question)
            return result;
        })
    }

    const handleOption = (id, options) => {
        setQuestions(pre => {
            const result = pre.map((question, index)=>
                question.step === id? {...question, answers : options} : question
            )
            return result;
        })
    }

    const changeSurveyTitle = (text) => {
        setFormData(pre => ({...pre, title: text}))
    }

    const changeSurveyContent = (text) => {
        setFormData(pre=>({...pre, content: text}))
    }



    return(

        <>


         <div style={{width: '900px', paddingTop: '40px', paddingBottom: '40px',
             boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}>

             <div style={{ width: '700px', margin: '0 auto'}}>

                 <div style={{width: '700px', borderRadius:'10px', minHeight:'150px',border: '1px solid #D6D6D6', paddingTop:'30px',
                     borderTop: '10px solid #243579', margin: '0 auto',
                     boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'}}>


                     <div style={{margin: '0 auto', width:'600px'}}>
                         <TextField
                             id="standard-basic"
                             variant="standard"
                             placeholder={'설문지 제목'}
                             sx={{width: 600}}
                             value={formData.title}
                             onChange={(e)=>changeSurveyTitle(e.target.value)}
                             inputProps={{style: {fontSize: '25px',fontWeight:'bold', padding: '15px 0 0 0'}}}
                         />
                     </div>

                     <div style={{margin: '0 auto', width:'600px'}}>
                         <TextField
                             id="standard-basic"
                             placeholder={'설문지 설명'}
                             inputProps={{style: {fontSize: '14px', padding: '15px 0 0 0', marginTop:'10px'}}}
                             sx={{width: 600}}
                             value={formData.content}
                             onChange={(e)=>changeSurveyContent(e.target.value)}
                             variant="standard" />
                     </div>

                 </div>


                 <div style={{width: '700px', margin: '0 auto'}}>
                     {questions.map((questionData) => (

                         <div style={{margin: '25px 0 25px 0'}}>
                             <QuestionComp
                                 key={questionData.step}
                                 index={questionData.step}
                                 questionInfo ={questionData}
                                 changeTitle ={changeQuestionTitle}
                                 changeContent ={changeQuestionContent}
                                 changeOption ={changeOption}
                                 deleteQuestion ={deleteQuestion}
                                 changeRequired ={changeRequired}
                                 handleOption ={handleOption}
                             />
                         </div>

                         )
                     )}
                 </div>


                 <IconButton aria-label="delete" size="medium" onClick={addQuestion}>
                     <FaPlus />
                 </IconButton>


              <div style={{textAlign: 'right'}}>
                  <Button variant="outlined" >
                      취소
                  </Button>
                  <Button variant="contained" >
                      완료
                  </Button>

              </div>



             </div>


         </div>





        </>





    );
}