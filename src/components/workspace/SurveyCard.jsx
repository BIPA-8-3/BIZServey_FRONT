import { useEffect, useRef, useState } from "react";
import style from "../../style/workspace/SurveyCard.module.css";
import { BiDotsHorizontalRounded } from "react-icons/bi";

export default function SurveyCard({
  survey,
  onOpenModal,
  handleRemoveBtnClick,
  setWorkspaceModalState,
  setWorkspaceModalNum,
  setChageModalSurveyId,
  setSelectedSurveyId,
}) {
  const { type, surveyId, title } = survey;
  const cotainerRef = useRef(null);
  const cotainerRef2 = useRef(null);

  const handleClickCard = (id) => {
    setSelectedSurveyId(id);
  };

  // 더보기 상태
  let [moreMenu, setMoreMenu] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [moreMenu]);

  const handleDocumentClick = (event) => {
    if (cotainerRef.current && !cotainerRef.current.contains(event.target) && moreMenu) {
      toggleMenu();
    }
  };

  const toggleMenu = () => {
    setMoreMenu(!moreMenu);
  };

  // open Workspace Modal
  const openWorkspaceModal = (num) => {
    toggleMenu();
    setChageModalSurveyId(surveyId);
    setWorkspaceModalNum(num);
    setWorkspaceModalState(true);
  };

  return (
    <div
      id={style.Container}
      ref={cotainerRef}
      onClick={(e) => {
        // e.stopPropagation();
        if (e.target.tagName !== "svg") {
          handleClickCard(surveyId);
        }
      }}
    >
      <div className={style.cardHeader}>
        {type === "NORMAL" ? "🗒️" : "📝"}
        <div className={style.menuContainer}>
          <div>
            <BiDotsHorizontalRounded
              className={style.optionBtn}
              ref={cotainerRef2}
              onClick={(e) => {
                // e.stopPropagation();
                toggleMenu();
              }}
            />
          </div>
          <span>
            {/* {moreMenu && ( */}
            <div className={`${style.menu} ${moreMenu ? style.visible : ""}`}>
              <ul>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                    onOpenModal(surveyId, title, 0);
                  }}
                >
                  공유
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                    onOpenModal(surveyId, title, 1);
                  }}
                >
                  공유 히스토리
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                    openWorkspaceModal(2);
                  }}
                >
                  이름 바꾸기
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                    handleRemoveBtnClick(surveyId);
                  }}
                >
                  삭제
                </li>
              </ul>
            </div>
          </span>
        </div>
      </div>
      <div className={style.cardBody}>{title}</div>
      <div className={style.cardFooter}>2023-12-05 16:14</div>
    </div>
  );
}
