import React, { useEffect, useState, useRef } from 'react';
import * as S from './SubHeader.style';
import AllEmoji from 'assets/icon/arrow_down.svg';
import ALLEmojiUp from 'assets/icon/arrow_top.png';
import AddEmoji from 'assets/icon/add-24.svg';
import Share from 'assets/icon/share-24.svg';
import { getEmojiData, postEmoji } from 'API/API';
import PaperListEmojiBadge from 'components/Badge/EmojiBadge/PaperListEmojiBadge';
import EmojiModal from '../subHeaderModal/showImgModal/EmojiModal';
import EmojiPicker from 'emoji-picker-react';
import KakaoModal from '../subHeaderModal/SubHeaderKaKao/KakaoModal';
import PaperListFromBadge from 'components/Badge/FromBadge/PaperListFromBadge';

const SubHeader = ({ value }) => {
  const [emojiData, setEmojiData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [kakaoOpen, setKakaoOpen] = useState(false);
  const [resultPostEmoji, setResultPostEmoji] = useState(null);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  const getAllEmojiData = async (userID) => {
    const { results, error } = await getEmojiData(userID);
    if (error) {
      return;
    }
    setEmojiData(results);
  };

  const handleEmojiSelect = (emoji) => {
    const result = postEmojitoServer(value.userID, emoji);
    setResultPostEmoji(result);
    setPickerOpen(false);
    getAllEmojiData(value.userID);
  };

  const postEmojitoServer = async (userID, emoji) => {
    const { result, error } = await postEmoji(userID, emoji.emoji);
    if (error) {
      return;
    }
    return result;
  };

  const showEmojiPicker = () => {
    setPickerOpen(!pickerOpen);
  };

  const showKakao = () => {
    setKakaoOpen(!kakaoOpen);
  };

  const clickShowModalButton = () => {
    setModalOpen((prev) => !prev);
  };

  useEffect(() => {
    getAllEmojiData(value.userID);

    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [resultPostEmoji, value]);

  return (
    <S.SubHeader>
      <S.HeaderContent>
        <S.UserName>To.{value.userData.name}</S.UserName>
        <S.UserInfo>
          <S.PaperCnt>
            <S.ProfileCnt>
              <PaperListFromBadge
                imgUrls={value.userData.url}
                count={value.userData.messageCount}
              />
            </S.ProfileCnt>
            <S.CntText>
              <S.Strong>{value.userData.messageCount}</S.Strong> 개의 카드가
              도착했어요!
            </S.CntText>
          </S.PaperCnt>
          <S.Border />
          <S.HeaderService>
            <S.EmojiCnt>
              <S.Emoji>
                {emojiData.length != 0 &&
                  emojiData
                    .slice(0, 3)
                    .map((reaction) => (
                      <PaperListEmojiBadge
                        key={reaction.id}
                        emoji={reaction.emoji}
                        count={reaction.count}
                      />
                    ))}
              </S.Emoji>
              <S.AllEmojiButton ref={buttonRef} onClick={clickShowModalButton}>
                <S.EmojiImage src={modalOpen ? ALLEmojiUp : AllEmoji} />
              </S.AllEmojiButton>
              {modalOpen && (
                <EmojiModal
                  setModalOpen={setModalOpen}
                  value={emojiData}
                  buttonRef={buttonRef}
                />
              )}
            </S.EmojiCnt>
            <S.Service>
              <S.AddEmojiButton onClick={showEmojiPicker}>
                <S.EmojiImage src={AddEmoji} />
                <S.AddEmojiText>추가</S.AddEmojiText>
              </S.AddEmojiButton>
              {pickerOpen && (
                <S.EmojiWapper ref={pickerRef}>
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    style={{
                      zIndex: '999',
                      width: window.innerWidth <= 890 ? '250px' : '30vw',
                    }}
                  />
                </S.EmojiWapper>
              )}
              <S.ButtonBorder />
              <S.ShareButton onClick={showKakao}>
                <S.EmojiImage src={Share} />
              </S.ShareButton>
              {kakaoOpen && (
                <KakaoModal
                  setKakaoOpen={setKakaoOpen}
                  setToastStatus={value.setToastStatus}
                  value={{
                    userId: value.userID,
                    userName: value.userData.name,
                  }}
                  toastUpdate={value.toastUpdate}
                />
              )}
            </S.Service>
          </S.HeaderService>
        </S.UserInfo>
      </S.HeaderContent>
    </S.SubHeader>
  );
};

export default SubHeader;
