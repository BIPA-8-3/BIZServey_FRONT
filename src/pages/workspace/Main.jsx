import style from "../../style/workspace/Main.module.css";
import SurveyCard from "../../components/workspace/SurveyCard";
import DefaultCard from "../../components/workspace/DefaultCard";
import MoreMenu from "../../components/workspace/MoreMenu";
import { useEffect, useState, useMemo, useRef } from "react";
import ProfileContainer from "../../components/workspace/ProfileContainer";
import ShareModal from "../../components/workspace/ShareModal";
import Loader from "../../pages/loader/Loader";
import _ from "lodash";

import {
  getSurveyList,
  removeSurvey,
  getAdminList,
  getContactList,
  modifySurveyName,
  modifyWorkspace,
} from "./api.js";
import { WorkspaceModal } from "../../components/workspace/WorkspaceModal";
import { useWorkspaceContext } from "./WorkspaceContext";

export default function Main() {
  /////////////////////////////////////////////////////////////////
  /////////////////////////// State 설정 ///////////////////////////
  /////////////////////////////////////////////////////////////////

  const { workspaceList, setWorkspaceList, selectedWorkspaceId, setSelectedSurveyId } =
    useWorkspaceContext();

  // 관리자 목록 (캐싱)
  const [owner, setOwner] = useState({});
  const [adminList, setAdminList] = useState([]);
  const [adminWaitList, setAdminWaitList] = useState([]);

  // 연락처 목록
  let [contactList, setContactList] = useState([]);

  // 설문지 목록
  const [surveyList, setSurveyList] = useState([]);

  // 공유 모달
  let [shareModal, setShareModal] = useState(false);

  // 선택된 설문 목록
  let [selectedSurvey, setSelectedSurvey] = useState({
    surveyId: null,
    title: null,
    menuNum: null,
  });

  // 워크스페이스 이름 값에 대한 상태
  const [originWorkspaceName, setOriginWorkspaceName] = useState("");
  const [changeWorkspaceName, setChangeWorkspaceName] = useState("");

  // // 워크스페이스 모달
  const [workspaceModalState, setWorkspaceModalState] = useState(false);
  const [workspaceModalNum, setWorkspaceModalNum] = useState(1);

  // Loader 상태
  const [loader, setLoader] = useState(false);

  // 워크스페이스 이름 변경 이벤트
  useEffect(() => {
    setChangeWorkspaceName(originWorkspaceName);
  }, [originWorkspaceName]);

  // 설문지 이름변경
  const [changeModalSurveyId, setChageModalSurveyId] = useState(null);

  // 설문지 이름 변경 요청
  const handleChangeSurveyName = (title) => {
    modifySurveyName(changeModalSurveyId, title)
      .then((data) => {
        let copy = surveyList.map((survey) => {
          if (survey.surveyId === changeModalSurveyId) {
            survey.title = title;
          }
          return survey;
        });

        setSurveyList([...copy]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 워크스페이스 포커스 잃었을때 핸들러
  const handleChangeWorkspaceName = (event, changeName) => {
    event.preventDefault();
    if (event && originWorkspaceName === changeWorkspaceName) {
      return;
    }
    if (!event && originWorkspaceName === changeName) {
      return;
    }

    let newName = changeName ? changeName : changeWorkspaceName;

    modifyWorkspace(selectedWorkspaceId, newName)
      .then((data) => {
        let copy = workspaceList.map((workspace) => {
          if (workspace.id === selectedWorkspaceId) {
            workspace.workspaceName = newName;
          }
          return workspace;
        });
        setOriginWorkspaceName(newName);
        setWorkspaceList(copy);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //////////////////////////////////////////////////////////////////
  ///////////////////////// 초기 State 메소드 /////////////////////////
  //////////////////////////////////////////////////////////////////
  // 관리자 STATE 설정
  const getAdminState = () => {
    getAdminList(selectedWorkspaceId)
      .then((data) => {
        if (!data.owner) {
          setOwner({});
        } else {
          setOwner(data.owner);
        }
        if (!data.adminList) {
          setAdminList([]);
        } else {
          setAdminList([...data.adminList]);
        }

        if (!data.waitList) {
          setAdminWaitList([]);
        } else {
          setAdminWaitList([...data.waitList]);
        }
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response);
      });
  };

  // 연락처 State 설정
  const getContactState = () => {
    let listRequest = {
      workspaceId: selectedWorkspaceId,
      keyword: "",
    };

    console.log("들어옴");

    getContactList(listRequest)
      .then((data) => {
        setContactList(data);
        console.log("들어옴", data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response);
      });
  };

  // 설문지 State 설정
  const getSurveyState = () => {
    getSurveyList(selectedWorkspaceId)
      .then((data) => {
        if (data.length > 0) {
          setSurveyList([...data]);
        } else {
          setSurveyList([]);
        }
        let workspace = workspaceList.find((workspace) => workspace.id === selectedWorkspaceId);
        setOriginWorkspaceName(workspace.workspaceName);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /////////////////////////////////////////////////////////////
  ///////////////////////// useEffect /////////////////////////
  /////////////////////////////////////////////////////////////
  // 공유 모달 설정
  useEffect(() => {
    if (!selectedSurvey.surveyId) {
      setShareModal(false);
    } else {
      setShareModal(true);
    }
  }, [selectedSurvey.surveyId]);

  // 선택한 워크스페이스가 변경되면
  useMemo(() => {
    if (!selectedWorkspaceId) {
      return;
    }
    setSurveyList([]);
    getSurveyState();
    getAdminState();
    getContactState();
    setSelectedSurveyId(0);
  }, [selectedWorkspaceId]);

  ////////////////////////////////////////////////////////////
  /////////////////////// event method ///////////////////////
  ////////////////////////////////////////////////////////////
  const handleRemoveBtnClick = (surveyId) => {
    removeSurvey(surveyId)
      .then((data) => {
        setSurveyList(surveyList.filter((survey) => survey.surveyId !== surveyId));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 디바운싱된 handleChange 함수
  const debouncedHandleChange = _.debounce((event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  }, 100);

  // 워크스페이스 이름 엔터 이벤트
  const handleInputKeyDown = (event) => {
    debouncedHandleChange(event);
  };

  // open 공유 모달
  const openShareModal = (surveyId, title, menuNum) => {
    setSelectedSurvey({
      surveyId: surveyId,
      title: title,
      menuNum: menuNum,
    });
  };

  // close 공유 모달
  const closeShareModal = () => {
    setSelectedSurvey({
      surveyId: null,
      title: null,
      menuNum: null,
    });
  };

  const managedValues = {
    owner,
    setOwner,
    adminList,
    setAdminList,
    adminWaitList,
    setAdminWaitList,
    contactList,
    setContactList,
  };

  return (
    <div id={style.SectionBody}>
      {/* Loader */}
      {loader ? <Loader /> : null}
      {/* modal */}
      <ShareModal
        isOpen={shareModal}
        onClose={closeShareModal}
        survey={selectedSurvey}
        contactList={contactList}
        title={""}
      />

      {
        <WorkspaceModal
          isOpen={workspaceModalState}
          setWorkspaceModalState={setWorkspaceModalState}
          pageNum={workspaceModalNum}
          handleClickSubmitBtn={
            workspaceModalNum === 1 ? handleChangeWorkspaceName : handleChangeSurveyName
          }
        />
      }
      <div className={style.sectionWrap}>
        {/* section */}
        <div className={style.section}>
          {/* title */}
          <div className={style.inputWrap}>
            <input
              className={style.inputTitle}
              onBlur={(e) => handleChangeWorkspaceName(e)}
              onKeyDown={handleInputKeyDown}
              value={changeWorkspaceName}
              onChange={(e) => {
                e.preventDefault();
                setChangeWorkspaceName(e.target.value);
              }}
            />

            {/* group box */}
            <div className={style.groupBox}>
              {/* admin Box */}
              <ProfileContainer owner={owner} adminList={adminList} />
              <MoreMenu
                setWorkspaceModalState={setWorkspaceModalState}
                setWorkspaceModalNum={setWorkspaceModalNum}
                managedValues={managedValues}
              />
            </div>
          </div>
          {/* cardContainer */}
          <div className={style.cardContainer}>
            <DefaultCard />
            {surveyList.map((survey) => {
              return (
                <SurveyCard
                  key={survey.surveyId}
                  survey={survey}
                  onOpenModal={openShareModal}
                  onClose={closeShareModal}
                  handleRemoveBtnClick={handleRemoveBtnClick}
                  setWorkspaceModalState={setWorkspaceModalState}
                  setWorkspaceModalNum={setWorkspaceModalNum}
                  setChageModalSurveyId={setChageModalSurveyId}
                  setSelectedSurveyId={setSelectedSurveyId}
                  className={style.cardItem}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
