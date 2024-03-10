import React, { useContext } from 'react';
import * as S from './MessageCardModal.style';
import { MessageCardHeader, PostIDContext, getFormattedDate } from './index';
import { PurpleButton } from '../Common/PurpleButton/PurpleButton';

export const MessageCardModal = () => {
  const { currentCardData: cardData, updateCurrentCardData } =
    useContext(PostIDContext);
  const handleModalButton = () => {
    updateCurrentCardData({ id: null });
  };
  const CreatedDateComponent = () => {
    const formattedDate = getFormattedDate(cardData.createdAt);
    return <S.CreatedDate>{formattedDate}</S.CreatedDate>;
  };
  const ClickModal = (e) => {
    e.stopPropagation();
  };
  return (
    <>
      {cardData.id && (
        <S.Wrapper onClick={ClickModal}>
          <MessageCardHeader
            cardData={cardData}
            Component={CreatedDateComponent}
            type="modal"
          ></MessageCardHeader>
          <S.TextWrapper>
            <S.Text
              $font={cardData.font}
              dangerouslySetInnerHTML={{ __html: cardData.content }}
            ></S.Text>
          </S.TextWrapper>
          <PurpleButton
            width={120}
            height={40}
            fix
            center
            onClick={handleModalButton}
          >
            확인
          </PurpleButton>
        </S.Wrapper>
      )}
    </>
  );
};