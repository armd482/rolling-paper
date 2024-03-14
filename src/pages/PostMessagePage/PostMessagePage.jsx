import React, { useState, useEffect } from 'react';
import * as S from './PostMessagePage.style.js';
import TextEditor from './components/TextEditor/TextEditor.jsx';
import { COLORS } from 'style/colorPalette';
import Header from 'components/Header/Header.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { PurpleButton } from 'components/PurpleButton/PurpleButton.jsx';
import sampleImg1 from 'assets/images-message/1.png';
import sampleImg2 from 'assets/images-message/2.jpg';
import sampleImg3 from 'assets/images-message/3.jpg';
import sampleImg4 from 'assets/images-message/4.jpg';
import sampleImg5 from 'assets/images-message/5.jpg';
import sampleImg6 from 'assets/images-message/6.jpg';
import sampleImg7 from 'assets/images-message/7.jpg';
import sampleImg8 from 'assets/images-message/8.jpg';
import sampleImg9 from 'assets/images-message/9.jpg';
import sampleImg10 from 'assets/images-message/10.jpg';
import { TextForm } from 'components/TextForm/TextForm.jsx';
import { getImgUrl, getProfileImages, postMessage } from 'API/API.js';
import Dropdown from './components/Dropdown/Dropdown.jsx';

export const PostMessagePage = () => {
  const [isName, setIsName] = useState(false);
  const [selectedRelationOption, setSelectedRelationOption] = useState('지인'); //관계
  const [selectedFontOption, setSelectedFontOption] = useState('Noto Sans'); // 폰트
  const [profileImg, setProfileImg] = useState(sampleImg1); //프로필 사진
  const [editorTextContent, setEditorTextContent] = useState(''); //메세지
  const [passValue, setPassValue] = useState(true); //값 확인
  const [name, setName] = useState(''); //이름
  const { userID } = useParams();
  const [samplePicture, setSamplePicture] = useState([
    { src: sampleImg1 },
    { src: sampleImg2 },
    { src: sampleImg3 },
    { src: sampleImg4 },
    { src: sampleImg5 },
    { src: sampleImg6 },
    { src: sampleImg7 },
    { src: sampleImg8 },
    { src: sampleImg9 },
    { src: sampleImg10 },
  ]); // 이미지 URL 배열 상태
  const navigate = useNavigate();
  const [isBlur, setIsBlur] = useState(true);

  const teamId = '4-11';

  const dropdownRelationOptions = [
    { value: '가족', label: '가족' },
    { value: '지인', label: '지인' },
    { value: '동료', label: '동료' },
    { value: '친구', label: '친구' },
  ];

  const dropdownFontOptions = [
    { value: 'Noto Sans', label: 'Noto Sans' },
    { value: 'Pretendard', label: 'Pretendard' },
    { value: '나눔명조', label: '나눔명조' },
    { value: '나눔손글씨 손편지체', label: '나눔손글씨 손편지체' },
  ];

  const handleNameError = (e) => {
    const value = e.target.value;
    setName(value);
  };

  const handleBlur = (e) => {
    const value = e.target.value;
    value.trim() === '' ? setIsName(true) : setIsName(false);
  };

  const handleSetProfileImg = (src) => {
    setProfileImg(src);
  };

  //이미지그루를 이용한 이미지파일 url 형성api
  const handleImportProfileImg = async (src) => {
    try {
      const file = src.target.files[0]; //파일 선택 처음 꺼
      const imageUrl = await getImgUrl(file);
      if (imageUrl.error) {
        navigate('/error', {
          state: imageUrl.error.response.status,
        });
      } else {
        setProfileImg(imageUrl);
      }
    } catch (error) {
      return navigate('/error');
    }
  };

  const handleSelectRelation = (relation) => {
    setSelectedRelationOption(relation);
  };

  const handleSelectFont = (font) => {
    setSelectedFontOption(font);
  };

  const handleSendData = async () => {
    try {
      const data = {
        team: teamId,
        recipientId: userID,
        sender: name,
        profileImageURL: profileImg,
        relationship: selectedRelationOption,
        content: editorTextContent,
        font: selectedFontOption,
      };
      const isOk = await postMessage(data);
      if (isOk.error) {
        navigate('/error', {
          state: isOk.error.response.status,
        });
      } else {
        isOk && navigate(`/post/${userID}`);
      }
    } catch (error) {
      return navigate('/error');
    }
  };

  useEffect(() => {
    if (name.trim() !== '' && editorTextContent.trim() !== '') {
      setPassValue(true);
    } else {
      setPassValue(false);
    }
  }, [name, editorTextContent]);

  useEffect(() => {
    const loadingImageUrls = async () => {
      try {
        const imageUrls = await getProfileImages();
        if (imageUrls.error) {
          navigate('/error', {
            state: imageUrls.error.response.status,
          });
        } else {
          setSamplePicture(imageUrls.map((url) => ({ src: url })));
          setProfileImg(imageUrls[0]); // 첫 번째 이미지를 초기값으로 설정
          setIsBlur(false); // 이미지 로딩 완료
        }
      } catch (error) {
        return navigate('/error');
      }
    };

    loadingImageUrls();
  }, []);

  return (
    <>
      <S.NavController>
        <Header
          page="postMeesge"
          style={{
            borderColor: isName ? `${COLORS.ERROR}` : `${COLORS.GRAY_300}`,
          }}
        />
      </S.NavController>
      <S.PostWrapper>
        <S.PostMessageContainer>
          <TextForm
            type="card"
            onChange={handleNameError}
            vailed={isName}
            onBlur={handleBlur}
            onFocus={() => setIsName(false)}
          ></TextForm>

          <S.PostMessageContent>
            <S.PostMessageContentHeader>
              프로필 이미지
            </S.PostMessageContentHeader>

            <S.SelectPictureContain>
              <S.SelectedPicture src={profileImg} alt="선택된 프로필 이미지" />

              <S.SelectPictureListContain>
                <S.SubContain>
                  <S.SelectPictureListInfo>
                    프로필 이미지를 선택해주세요!
                  </S.SelectPictureListInfo>

                  <S.InputLabel
                    htmlFor="fileInput" //라벨을 이용한 커스텀 버튼
                  >
                    이미지 추가하기
                  </S.InputLabel>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImportProfileImg}
                    style={{ display: 'none' }}
                  />
                </S.SubContain>

                <S.SelectPictureList>
                  {samplePicture.map((samplePicture, index) => (
                    <S.SelectPictures
                      key={index}
                      src={samplePicture.src}
                      alt={`샘플 이미지 no${index + 1}`}
                      width={`56px`}
                      height={`56px`}
                      onClick={() => handleSetProfileImg(samplePicture.src)}
                      style={{
                        filter: !isBlur ? 'blur(0)' : 'blur(3px)',
                      }}
                    ></S.SelectPictures>
                  ))}
                </S.SelectPictureList>
              </S.SelectPictureListContain>
            </S.SelectPictureContain>
          </S.PostMessageContent>

          <S.PostMessageContent>
            <S.PostMessageContentHeader>
              상대와의 관계
            </S.PostMessageContentHeader>
            <Dropdown
              options={dropdownRelationOptions}
              onSelect={handleSelectRelation}
              defult="지인"
            />
          </S.PostMessageContent>

          <S.PostMessageContent>
            <S.PostMessageContentHeader>
              내용을 입력해 주세요
            </S.PostMessageContentHeader>
            <TextEditor
              value={editorTextContent}
              onChange={(content) => setEditorTextContent(content)}
              fontFamily={selectedFontOption}
            />
          </S.PostMessageContent>

          <S.PostMessageContent>
            <S.PostMessageContentHeader>폰트 선택</S.PostMessageContentHeader>

            <Dropdown
              options={dropdownFontOptions}
              onSelect={handleSelectFont}
              defult="Noto Sans"
            />
          </S.PostMessageContent>
        </S.PostMessageContainer>
        <S.SubmitButtonWrapper>
          <PurpleButton
            width={720}
            height={56}
            disable={!passValue}
            onClick={() => handleSendData()}
          >
            생성하기
          </PurpleButton>
        </S.SubmitButtonWrapper>
      </S.PostWrapper>
    </>
  );
};

export default PostMessagePage;
