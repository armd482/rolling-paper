/* eslint-disable no-console */
import React, { useState } from 'react';
import * as S from './PaperListPage.style';
import useRequest from './useRequest';
import { Link } from 'react-router-dom';
import PaperCard from '../../components/PaperCard';
import ArrowButton from '../../components/ArrowButton';
import PaperListSkeleton from '../../components/Skeleton/PaperListSkeleton';

const PaperListPage = () => {
  const { data: recentPaper, isLoading: isLoadingRecent } = useRequest({
    options: {
      url: 'recipients/',
      method: 'get',
    },
  });

  const { data: popularPaper, isLoading: isLoadingPopular } = useRequest({
    options: {
      url: 'recipients/',
      method: 'get',
      params: {
        sort: 'like',
      },
    },
  });

  return (
    <>
      <S.Container>
        <PaperSection
          title="인기 롤링 페이퍼 🔥"
          papers={popularPaper}
          isLoading={isLoadingPopular}
        />
        <PaperSection
          title="최근에 만든 롤링 페이퍼 ⭐️"
          papers={recentPaper}
          isLoading={isLoadingRecent}
        />
      </S.Container>
      <S.ButtonContainer>
        <Link to="/post">
          <S.StyledButton size="lg">나도 만들어보기</S.StyledButton>
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
