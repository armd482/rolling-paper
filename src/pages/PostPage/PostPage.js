import React, { useState } from 'react';
import * as S from './PostPage.style.js';
import Button from '../../components/MainButton';
import SelectedImg from '../../assets/icon/background-selected.png'

const PostPage = () => {
  const [clickedIndex, setClickedIndex] = useState(1)
  const [backgroundValue, setBackgroundValue] = useState('컬러')
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');

  //배경화면 컬러인지 이미지인지 배열로 저장
  const ColorOrImage = [
    {
      id: 1,
      value: '컬러',
    },
    {
      id: 2,
      value: '이미지',
    }
  ]

  //배경화면 색깔, 배열로 저장
  const Background = [
    {
      id: 1,
      color: 'orange',
    },
    {
      id: 2,
      color: 'purple',
    },
    {
      id: 3,
      color: 'blue',
    },
    {
      id: 4,
      color: 'green',
    }
  ]

  //클릭한 인덱스 몇번째인지 저장
  const handleClickedIndex = (id) => {
    setClickedIndex(id);
  }

  //컬러인지 이미지인지 클릭한 값 저장
  const handleBackgroundValue = (value) => {
    setBackgroundValue(value);
  }
  
  //포커스 아웃 했을때 공백만 있으면 에러 스테이트 활성화
  const handleBlur = () => {
    if (!value.trim()) {
      return setError(true);
    }
    return setError(false);
  }

  //생성하기 버튼을 눌렀을때 => 아직 구현안함
  const handleMovetoListClick = () => {
    alert("미완성입니다!")
  }

  return (
  <S.PostPage>
    <S.PostPageForm>
      <S.ToInputWrapper>
        <S.PostPageH1>
          To.
        </S.PostPageH1>
        <S.ToInput 
          type="text"
          placeholder="받는 사람 이름을 입력해 주세요" 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          onBlur={handleBlur}
          hasError={error}
        />
        <S.ErrorMessage hasError={error}>값을 입력해 주세요.</S.ErrorMessage>
      </S.ToInputWrapper>
      <S.BackgroundSelectWrapper>
        <S.PostPageH1>
          배경화면을 선택해 주세요.
        </S.PostPageH1>
        <S.PostPageH2>
          컬러를 선택하거나, 이미지를 선택할 수 있습니다.
        </S.PostPageH2>
        <S.ButtonContainer>
        {ColorOrImage.map(({value, id}) => (
            <S.ColorImageButton
                key={id}
                onClick={() => handleBackgroundValue(value)}
                selectedValue={backgroundValue}
                value={value}
              >
                {value}
              </S.ColorImageButton>
            ))}
        </S.ButtonContainer>
        <S.ColorSelectorDiv>
          {Background.map(({color, id}) => (
            <S.SelectBox 
            key={id} 
            selectedValue={backgroundValue} 
            selectedIndex={color}
            onClick={() =>handleClickedIndex(id)}
            >
              <S.SelectedImg value={id} index={clickedIndex} src={SelectedImg} alt="체크 완료" />
            </S.SelectBox>
          ))}
        </S.ColorSelectorDiv>
      </S.BackgroundSelectWrapper>
      <Button disabled={!value} size="full" onClick={handleMovetoListClick}>
        생성하기
      </Button>
      </S.PostPageForm>
  </S.PostPage>
  );
};

export default PostPage;
