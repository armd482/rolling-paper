import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as S from './PostIDPage.style';
import { MessageCardWrapper } from './components/MessageCardWrapper/MessageCardWrapper';
import { Scrollbar } from './components/Scrollbar/Scrollbar';
import { MessageCardModal } from './components/MessageCardModal/MessageCardModal';
import { Toast } from './components/Toast/Toast';
import Header from 'components/Header/Header';
import SubHeader from './components/SubHeader/SubHeader';
import { PostIDContext } from 'context/PostIDContext';
import { setScrollBarHeightPosition } from 'assets/utils/setScrollBarHeightPosition';
import { getRecipientData } from 'API/API';
import arrow_up from 'assets/icon/arrow_up.svg';
import ErrorPage from 'pages/ErrorPage/ErrorPage';

export default function PostIDPage() {
  const { userID } = useParams();
  const pageRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const [dataError, setDataError] = useState(null);
  const [toastStatus, setToastStatus] = useState({
    visible: false,
    update: false,
  });
  const [messageCardData, setMessageCardData] = useState([]);
  const [currentCardData, setCurrentCardData] = useState({ id: null });
  const [userData, setUserData] = useState({
    name: null,
    backgroundColor: '#ffffff',
    backgroundImageURL: null,
    recentMessages: [],
    messageCount: 0,
    reactionCount: 0,
    topReactions: [],
  });
  const handleToastUpdate = (value) => {
    setToastStatus((prev) => ({ ...prev, update: value }));
  };
  //currentCardData 변경 함수 -> MessageCardModal 컴포넌트에 어떤 내용을 담을 지 결정하는 함수
  const updateCurrentCardData = useCallback((cardData) => {
    setCurrentCardData(cardData);
  }, []);

  //toastVisible 변경 함수 -> Toast 컴포넌트 렌더링 결정하는 함수
  const updateToastvisible = useCallback((value) => {
    value;
  }, []);

  // currentCardData의 값을 null로 변경하는 함수 -> Modal 컴포넌트를 사라지게 하는 함수
  const focusOutModal = (e) => {
    e.stopPropagation();
    setCurrentCardData({ id: null });
  };

  //api 함수를 통해서 userData(Recipient)를 얻는 함수
  const getUserData = async (userID) => {
    const {
      name,
      backgroundColor,
      backgroundImageURL,
      messageCount,
      recentMessages,
      reactionCount,
      topReactions,
      error,
    } = await getRecipientData(userID);

    if (error) {
      setDataError(error);
      return;
    }
    const url = [
      recentMessages?.[0]?.profileImageURL,
      recentMessages?.[1]?.profileImageURL,
      recentMessages?.[2]?.profileImageURL,
    ];

    setUserData({
      name,
      backgroundColor,
      backgroundImageURL,
      messageCount,
      reactionCount,
      topReactions,
      url,
    });
  };

  //스크롤이벤트 발생했을 때 스크롤바 상태(스크롤바 크기 및 위치)를 업데이트 하는 함수
  const updateScrollbarPosition = () => {
    setScrollBarHeightPosition(pageRef, scrollWrapperRef);
  };
  //사용자의 전체 메세지 카드 개수를 감소시키는 함수 -> 삭제버튼을 통해서 메세지가 삭제되었을 때 사용
  const decreaseCardCount = () => {
    setUserData((prevUser) => ({
      ...prevUser,
      messageCount: prevUser.messageCount - 1,
    }));
  };
  //사용자의 전체 메세지 카드 개수를 변화시키는 함수 -> 메세지가 새로 추가되었을 경우(메세지를 스크롤을 통해 로드될 때) 사용
  const updateCardCount = (value) => {
    setUserData((prevUser) => ({
      ...prevUser,
      messageCount: value,
    }));
  };
  //메세지카드 업데이트 함수 -> 메세지 스크롤 로딩되었을 때 사용
  const updateMessageCardData = (value) => {
    setMessageCardData(value);
  };

  //페이지를 최상단으로 이동시키기 위한 애니메이션 함수
  const updateScrollTop = () => {
    const position = pageRef.current.scrollTop;
    if (position) {
      window.requestAnimationFrame(() => {
        pageRef.current.scrollTop = position * 0.8;
        updateScrollTop();
      });
    }
  };
  //스크롤을 최상단으로 이동시키는 함수 -> 스크롤 최상단 이동 버튼을 눌렀을 때 사용
  const scrollToTop = () => {
    updateScrollTop();
  };
  //get UserData 초기 로딩
  useEffect(() => {
    getUserData(userID);
  }, []);

  //메세지 카드 데이터가 변경되었을 때, 전체 페이지 크기가 변경되므로, 스크롤바 업데이트 필요
  useEffect(() => {
    setScrollBarHeightPosition(pageRef, scrollWrapperRef);
  }, [messageCardData]);

  //페이지 크기를 변경시켰을 때마다 스크롤바 업데이트 필요
  useEffect(() => {
    const handleResize = () => {
      setScrollBarHeightPosition(pageRef, scrollWrapperRef);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <PostIDContext.Provider
      value={{
        currentCardData,
        updateCurrentCardData,
      }}
    >
      {dataError ? (
        <ErrorPage error={dataError.response.status}></ErrorPage>
      ) : (
        <S.PageWrapper ref={pageRef} onScroll={updateScrollbarPosition}>
          <Header page="postID" />
          <SubHeader
            value={{
              userData,
              userID,
              setToastStatus,
            }}
          />
          <Toast
            type="url"
            toastStatus={toastStatus}
            updateToastvisible={updateToastvisible}
            handleToastUpdate={handleToastUpdate}
          ></Toast>

          <S.MessageWrapper
            $color={userData.backgroundColor}
            $url={userData.backgroundImageURL}
          >
            <MessageCardWrapper
              userData={userData}
              messageCardData={messageCardData}
              updateMessageCardData={updateMessageCardData}
              updateCurrentCardData={updateCurrentCardData}
              setDataError={setDataError}
              pageRef={pageRef}
              decreaseCardCount={decreaseCardCount}
              updateCardCount={updateCardCount}
            ></MessageCardWrapper>
          </S.MessageWrapper>
          <Scrollbar
            pageRef={pageRef}
            scrollWrapperRef={scrollWrapperRef}
          ></Scrollbar>
          <S.ModalBackground
            $currentCardData={currentCardData.id}
            onClick={focusOutModal}
          >
            <MessageCardModal />
          </S.ModalBackground>
          <S.UpperImageIcon
            src={arrow_up}
            alt="arrow"
            width={35}
            height={35}
            onClick={scrollToTop}
          ></S.UpperImageIcon>
        </S.PageWrapper>
      )}
    </PostIDContext.Provider>
  );
}
