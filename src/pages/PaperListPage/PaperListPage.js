/* eslint-disable no-console */
import React, { useState } from 'react';
import * as S from './PaperListPage.style';
import { Link } from 'react-router-dom';
import PaperCard from './components/PaperCard/PaperCard';
import ArrowButton from './components/ArrowButton/ArrowButton';
import PaperListSkeleton from './components/Skeleton/PaperListSkeleton';
import Header from 'components/Header/Header';
import { PurpleButton } from 'components/PurpleButton/PurpleButton';
import getRecipientData from 'API/API';
import ErrorPage from 'pages/ErrorPage/ErrorPage';

const PaperListPage = () => {
  const {
    getPopularPaperData,
    isLoadingPopular,
    getRecentPaperData,
    isLoadingRecent,
    error,
  } = getRecipientData();

  if (error) return <ErrorPage />;

  return (
    <>
      <Header page="main" />
      <S.Container>
        <PaperSection
          title="인기 롤링 페이퍼 🔥"
          papers={getPopularPaperData}
          isLoading={isLoadingPopular}
        />
        <PaperSection
          title="최근에 만든 롤링 페이퍼 ⭐️"
          papers={getRecentPaperData}
          isLoading={isLoadingRecent}
        />
      </S.Container>
      <S.ButtonContainer>
        <Link to="/post">
          <PurpleButton width={280} height={50}>
            나도 만들어보기
          </PurpleButton>
        </Link>
      </S.ButtonContainer>
    </>
  );
};

export default PaperListPage;

function PaperSection({ title, papers, isLoading }) {
  return (
    <S.Section>
      <S.Title>{title}</S.Title>
      <S.CardContainer>
        <CardList papers={papers} isLoading={isLoading} />
      </S.CardContainer>
    </S.Section>
  );
}

function CardList({ papers, isLoading }) {
  const [slideIndex, setSlideIndex] = useState(0);

  const slideLeft = () => {
    if (slideIndex <= 0) return;
    setSlideIndex((prev) => prev - 1);
  };
  const slideRight = () => {
    if (slideIndex - 1 >= papers?.results?.length - 4) return;
    setSlideIndex((prev) => prev + 1);
  };

  if (isLoading) return <PaperListSkeleton />;

  return (
    <>
      {papers?.results?.map((paper) => (
        <Link key={paper?.id} to={`/post/${paper?.id}`}>
          <PaperCard data={paper} slideIndex={slideIndex} />
        </Link>
      ))}
      {slideIndex > 0 && (
        <S.ArrowButtonContainer $left>
          <ArrowButton type="button" left onClick={slideLeft} />
        </S.ArrowButtonContainer>
      )}
      {slideIndex < papers?.results?.length - 4 && (
        <S.ArrowButtonContainer $right>
          <ArrowButton type="button" right onClick={slideRight} />
        </S.ArrowButtonContainer>
      )}
    </>
  );
}
