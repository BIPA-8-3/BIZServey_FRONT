import React, { useState, useEffect, useRef } from 'react';
import style from '../../style/user/UserInfoEditForm.module.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import back from '../../assets/img/back.png';
import useFadeIn from '../../style/useFadeIn';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';

function UserInfoEditForm({userData,setEditState, setUserData}) {
  const [isNinknameCheck, setNinknameCheck] = useState(true);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [nicknameSuccess, setNicknameSuccess] = useState('');
  const [birthdate, setBirthdate] = useState('');
  let userdata = userData;

  useEffect(()=>{
    setNickname(userData.nickname);
    setBirthdate(userData.birthdate)
  },[])
 
  const nicknameInputRef = useRef(null);
  const navigate = useNavigate();

  const fadeIn = useFadeIn();
  const location = useLocation();


  const handleNicknameChange = (e) => {

    setNickname(e.target.value);
    setNicknameError('');
    setNicknameSuccess('')
    setNinknameCheck(false)
  }

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
  }

  const handleNicknameCheck = async () => {
      try {
        if(nickname != ""){
          if(nickname !== userData.nickname){
            const response = await Axios.post('/signup/check-nickname', {
              nickname: nickname
            });
            setNicknameSuccess(response.data)
            setNicknameError('');
            setNinknameCheck(true)
          }else{
            setNicknameError('');
            setNicknameSuccess('이전 닉네임과 동일합니다.');
            setNinknameCheck(true)
          }
      }
    }catch (error) {
      if (error.response.data.errorCode === 600) {
        setNicknameError(error.response.data.errorMessage)
        setNicknameSuccess('')
        setNinknameCheck(false)
      }
    }
  }
  
  // 로컬 스토리지에 엑세스 토큰 저장
  const saveAccessTokenToLocalStorage = (token) => {
    localStorage.setItem('accessToken', token);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isNinknameCheck) {
      try {
        const response = await Axios.patch(
          '/user/info',
          {
            id: userData.id,
            nickname: nickname,
            birthdate: birthdate,
          },
          {
            headers: {
              Authorization: localStorage.getItem('accessToken'),
            },
          }
        );
  
        if (response.status === 200) {
          const headers = response.headers;
          const authorization = headers['authorization'];
          saveAccessTokenToLocalStorage(authorization);
          const updatedUserData = {
            ...userData,
            nickname : nickname,
            birthdate : birthdate
          };
          alert("회원 정보가 수정되었습니다.")
          setUserData(updatedUserData)
          setEditState(false); // 여기서 editState를 업데이트합니다.
        }
  
        // alert(response.data)
      } catch (error) {
        // 에러 처리
      } finally {
        // 정리 코드
      }
    } else if (nickname === '' && nickname !== userData.nickname) {
      setNicknameError('필수 정보입니다.');
      nicknameInputRef.current.focus();
      return;
    } else if(!isNinknameCheck && nickname !== userData.nickname){
      setNicknameError('중복 확인을 해주세요');
      nicknameInputRef.current.focus();
      return;
    }
  };

  return (
    <div id={style.joinWrap} >
       <ul className={style.mypageUserInfo}>
            <li style={{display:'flex', justifyContent:'space-between'}}>
                <div>
                    <span style={{paddingLeft: '15px'}}>프로필 수정</span>
                </div>
                <div>
                    <button onClick={handleSubmit}>수정</button>
                </div>
            </li>
            <li style={{display:'block'}}>
              <form>
              <label htmlFor='email' className={style.infoLabel}>
                이메일
              </label>
              <div className={style.inputWrap}>
                <div className={style.inputDiv}>
                  <input
                    type='text'
                    className={style.input}
                    id='email'
                    name='email'
                    value={userData.email}
                    disabled
                  />
                </div>
              </div>
              <label htmlFor="name" className={style.infoLabel}>이름</label>
              <div className={style.inputWrap}>
                <div className={`${style.inputDiv} ${style.input100}`}>
                  <input
                        type="text"
                        className={style.input}
                        id="name"
                        value={userData.name}
                        disabled
                      />
                </div>
              </div>
              <label htmlFor="nickname" className={style.infoLabel}>닉네임<span className={style.labelSpan}>*</span></label>
              {nicknameSuccess && <span style={{color:'blue', fontSize:'12px', marginLeft:'5px'}}>{nicknameSuccess}</span>}
              {nicknameError && <span style={{color:'red', fontSize:'12px', marginLeft:'5px'}}>{nicknameError}</span>}
              <div className={style.inputWrap}>
                <div className={style.inputDiv}>
                  <input
                      type="text"
                      className={style.input}
                      id="nickname"
                      name='nickname'
                      value={nickname}
                      onChange={handleNicknameChange}
                      ref={nicknameInputRef}
                    />
                </div>
                
                <div className={style.inputBtn} onClick={handleNicknameCheck}>중복확인</div>
              </div>
            

              <label htmlFor="birthdate" className={style.infoLabel}>생년월일</label>
              <div className={style.inputWrap}>
                <div className={`${style.inputDiv} ${style.input100}`}>
                    <input type='date' 
                            id='birthdate' 
                            name='birthdate' 
                            className={style.input}
                            value={birthdate}
                            onChange={handleBirthdateChange}/>
                </div>
              </div>
              {/* <div style={{textAlign:'center'}}>
                <button style={{
                  width:'100px', 
                  padding:'14.5px 14px', 
                  backgroundColor:'#243579',
                  border:'1px',
                  borderRadius:'5px',
                  color:'#fff',
                  cursor:'pointer'
                }}
                onClick={handleSubmit}>
                  수정
                </button>
              </div> */}
              </form>
            </li>
        </ul>
       
      <img src={back} alt="카카오 로그인" className={style.back}/>
    </div>
  );
}

export default UserInfoEditForm;