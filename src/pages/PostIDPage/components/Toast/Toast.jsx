import React, { useRef } from 'react';
import * as S from './Toast.style';
import close from '../../../../assets/icon/close.svg';
import completed from '../../../../assets/icon/completed.svg';
import warning from '../../../../assets/icon/warning.svg';

export const Toast = ({
  type,
  toastVisible,
  updateToastvisible,
  toastUpdate,
}) => {
  const wrapperRef = useRef(null);
  const timerRef = useRef(null);
  const deleteTimerRef = useRef(null);
  //toast x버튼을 눌렀을 때 실행하는 함수 -> 0ms부터 50ms까지 투명도 감소 및 종류에 따른 위치 업데이트 후 타이머 제거
  const handleClickCloseButton = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    let time = 0;
    const toastTimer = setInterval(() => {
      if (time === 0) {
        deleteTimerRef.current = toastTimer;
      }
      if (
        time === 50 ||
        !wrapperRef.current ||
        wrapperRef.current.style.opacity === 0
      ) {
        clearInterval(toastTimer);
        deleteTimerRef.current = null;
        updateToastvisible(false);
      }
      if (type === 'load') {
        wrapperRef.current.style.top = `${
          parseFloat(wrapperRef.current.style.top) - 1
        }px`;
      }
      if (type === 'url') {
        wrapperRef.current.style.bottom = `${
          parseFloat(wrapperRef.current.style.bottom) - 1
        }px`;
      }
      wrapperRef.current.style.opacity =
        parseFloat(wrapperRef.current.style.opacity) - 0.016;
      time += 1;
    }, 10);
  };
  //toast가 생성(애니메이션)되는 부분 -> 0ms 부터 500ms까지 투명도가 증가하고 종류에 따라서 위치를 이동시킨 후, 4500ms부터 5000ms까지 투명도가 감소하고 위치를 이동시킨 후 타이머를 삭제하는 코드
  if (toastVisible && toastUpdate.current) {
    let time = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (deleteTimerRef.current) {
      clearInterval(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    toastUpdate.current = false;
    const toastTimer = setInterval(() => {
      if (time === 0) {
        timerRef.current = toastTimer;
        wrapperRef.current.style.opacity = 0;
        if (type === 'load') {
          wrapperRef.current.style.top = '50px';
        }
        if (type === 'url') {
          wrapperRef.current.style.bottom = '50px';
        }
      }
      if (time < 50) {
        wrapperRef.current.style.opacity =
          parseFloat(wrapperRef.current.style.opacity) + 0.016;
        if (type === 'load') {
          wrapperRef.current.style.top = `${
            parseFloat(wrapperRef.current.style.top) + 1
          }px`;
        }
        if (type === 'url') {
          wrapperRef.current.style.bottom = `${
            parseFloat(wrapperRef.current.style.bottom) + 1
          }px`;
        }
      }
      if (time > 450 && time <= 500) {
        wrapperRef.current.style.opacity =
          parseFloat(wrapperRef.current.style.opacity) - 0.016;
        if (type === 'load') {
          wrapperRef.current.style.top = `${
            parseFloat(wrapperRef.current.style.top) - 1
          }px`;
        }
        if (type === 'url') {
          wrapperRef.current.style.bottom = `${
            parseFloat(wrapperRef.current.style.bottom) - 1
          }px`;
        }
      }
      if (time === 500 || !wrapperRef.current) {
        clearInterval(toastTimer);
        toastUpdate.current = true;
        timerRef.current = null;
        updateToastvisible(false);
      }
      time += 1;
    }, 10);
  }
  const content = {
    load: { src: warning, text: '더 이상 불러올 데이터가 없습니다.' },
    url: { src: completed, text: 'URL이 복사 되었습니다.' },
  };

  return (
    <>
      {toastVisible && (
        <S.ToastWrapper $type={type} ref={wrapperRef}>
          <S.FlexWrapper>
            <S.ToastIcon
              src={content[type].src}
              alt="warning"
              width={24}
              height={24}
            ></S.ToastIcon>
            <S.ToastText>{content[type].text}</S.ToastText>
          </S.FlexWrapper>
          <S.ToastIcon
            src={close}
            alt="close"
            width={24}
            height={24}
            onClick={handleClickCloseButton}
            $close
          ></S.ToastIcon>
        </S.ToastWrapper>
      )}
    </>
  );
};