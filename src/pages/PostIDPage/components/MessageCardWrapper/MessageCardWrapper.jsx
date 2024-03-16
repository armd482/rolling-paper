import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as S from './MessageCardWrapper.style';
import { AddMessageCard } from '../AddMessageCard/AddMessageCard';
import {
  getMessageCardData,
  deleteMessageCardData,
  deleteRecipient,
} from 'API/API';
import loadingIcon from 'assets/icon/loading.svg';
import { MessageCard } from '../MessageCard/MessageCard';
import { Toast } from '../Toast/Toast';
import { PurpleButton } from 'components/PurpleButton/PurpleButton';
const PAGE_LOADING = 12;
const INITIAL_PAGE_LOADING = 11;

export const MessageCardWrapper = ({
  userData,
  messageCardData,
  updateMessageCardData,
  updateCurrentCardData,
  setDataError,
  pageRef,
  decreaseCardCount,
  updateCardCount,
}) => {
  const { userID } = useParams();
  const gridWrapperRef = useRef(null);
  const deleteCount = useRef(0);
  const throttlingID = useRef(null);
  const [toastStatus, setToastStatus] = useState({
    visible: false,
    update: false,
  });
  const [loading, setLoading] = useState({ type: 'initial', status: true });
  const navigate = useNavigate();

  const throttling = (func, time) => {
    if (throttlingID.current) return;
    throttlingID.current = setTimeout(() => {
      console.log('update');
      func();
      throttlingID.current = null;
    }, time);
  };

  const updateToastvisible = useCallback((value) => {
    setToastStatus((prev) => ({ ...prev, visible: value }));
  }, []);
  const handleToastUpdate = (value) => {
    setToastStatus((prev) => ({ ...prev, update: value }));
  };

  //현재 userID의 Recipient 데이터를 삭제하는 함수 -> 삭제 버튼을 눌렀을 때 동작.
  const deleteRecipientData = async () => {
    const { error } = await deleteRecipient(userID);
    if (error) {
      setDataError(error);
      return;
    }
    alert('삭제되었습니다');
    navigate('/list');
  };

  //처음 페이지가 렌더링될 때 메세지 카드 데이터를 불러오는 함수 -> 11개의 데이터만 가져옴
  const initialGetCardData = async (limit = null, offset = null) => {
    const { data, error } = await getMessageCardData(userID, limit, offset);
    if (!error) {
      updateMessageCardData([...data]);
    } else {
      if (error) {
        setDataError(error);
      }
    }
    setLoading({ type: 'default', status: false });
  };
  //첫 렌더링 이후 스크롤을 통해서 추가적으로 메세지 카드 데이터를 불러오는 함수 -> 메세지 카드가 추가적으로 생성된 경우, 성성된 데이터를 함께 가져오고, 메세지카드를 이전에 삭제했을 경우 삭제한 개수만큼 추가적으로 가져옴.
  const getCardData = async (limit = null, offset = null) => {
    const {
      data,
      count: newMessageCount,
      error,
    } = await getMessageCardData(userID, limit, offset);
    if (error) {
      setDataError(error);
      return;
    }
    if (newMessageCount > userData.messageCount) {
      const updateCount = newMessageCount - userData.messageCount;
      const { data: updateData, error: updateError } = await getMessageCardData(
        userID,
        updateCount,
        0,
      );
      if (updateError) {
        setDataError(updateError);
        return;
      }
      updateCardCount(newMessageCount);
      const restData = data.slice(updateCount);
      updateMessageCardData((prevCardData) => [
        ...updateData,
        ...prevCardData,
        ...restData,
      ]);
    } else {
      updateMessageCardData((prevCardData) => [...prevCardData, ...data]);
    }

    if (data.length === 0) {
      pageRef.current.scrollTop -= 100;
      setToastStatus({ visible: true, update: true });
    }
    setLoading(false);
    deleteCount.current = 0;
  };

  //메세지카드 삭제함수 -> messageCard 컴포넌트에 전달
  const deleteCardData = useCallback(async (cardID) => {
    const { error } = await deleteMessageCardData(cardID);
    if (error) {
      setDataError(error);
    } else {
      deleteCount.current = (deleteCount.current + 1) % 3;
      updateMessageCardData((prevCardData) =>
        prevCardData.filter((cardData) => cardData.id !== cardID),
      );
      decreaseCardCount();
    }
  }, []);
  //로딩 아이콘이 다 load된 후 데이터를 불러오는 함수
  const dataLoad = () => {
    if (loading) {
      if (loading.type === 'initial') {
        initialGetCardData(INITIAL_PAGE_LOADING, messageCardData.length);
      } else {
        getCardData(PAGE_LOADING + deleteCount.current, messageCardData.length);
      }
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = pageRef.current.scrollTop;
      const viewHeight = window.innerHeight;
      const scrollHeight = pageRef.current.scrollHeight;
      if (scrollHeight - (scrollTop + viewHeight) < 50) {
        throttling(
          () => setLoading((prev) => ({ ...prev, status: true })),
          300,
        );
      }
    };
    pageRef.current.addEventListener('scroll', handleScroll);
    return () => {
      pageRef.current.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <S.Wrpaper>
      <S.ButtonWrapper>
        <PurpleButton width={92} height={39} fix onClick={deleteRecipientData}>
          삭제하기
        </PurpleButton>
      </S.ButtonWrapper>
      <S.GridWrapper ref={gridWrapperRef}>
        {!(loading.type === 'initial' && loading.status) && <AddMessageCard />}
        {messageCardData.map((cardData, index) => (
          <MessageCard
            cardData={cardData}
            key={index}
            updateCurrentCardData={updateCurrentCardData}
            deleteCardData={deleteCardData}
          />
        ))}
      </S.GridWrapper>
      {loading.status && (
        <S.LoadingIcon
          src={loadingIcon}
          alt="loading"
          $loadingType={loading.type}
          onLoad={dataLoad}
        />
      )}
      <Toast
        type="load"
        toastStatus={toastStatus}
        updateToastvisible={updateToastvisible}
        handleToastUpdate={handleToastUpdate}
      ></Toast>
    </S.Wrpaper>
  );
};
