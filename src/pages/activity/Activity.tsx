import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ActivityCard from '../../components/activity/ActivityCard';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import { GetRoleAuthorization } from '../../functions/authFunctions';
import { clubQueries } from '../../queries/club';
import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import P from '../../styles/assets/P';
import { media } from '../../styles/theme';

const ActivityGrid = styled.div`
  width: 70%;
  max-width: 1500px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 360px);
  justify-content: center;
  gap: 0 50px;
  margin: 50px 0 0;

  &,
  * {
    box-sizing: border-box;
  }

  ${media.tablet} {
    width: calc(100% - 48px);
    grid-template-columns: repeat(2, minmax(0, 360px));
    gap: 24px;
  }

  ${media.mobile} {
    width: calc(100% - 32px);
    grid-template-columns: minmax(0, 360px);
    gap: 20px;
  }
`;

const ActivityGridItem = styled.div`
  min-width: 0;
  margin-bottom: 50px;

  ${media.tablet} {
    margin-bottom: 0;
  }
`;

const ActivityFooter = styled(FlexDiv)`
  width: 70%;

  ${media.tablet} {
    width: calc(100% - 48px);
  }

  ${media.mobile} {
    width: calc(100% - 32px);
  }
`;

const Activity = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data } = useQuery(clubQueries.activityList({ page, size: 6 }));
  const detail = data?.data;
  const { isAuthorizedOverSecretary } = GetRoleAuthorization();

  const moveCreate = () => navigate('/activity/create');

  return (
    <>
      {!data ? (
        <FlexDiv width="100%" height="100vh">
          <Loading />
        </FlexDiv>
      ) : (
        <FlexDiv width="100%" $justifycontent="space-around" direction="column">
          {/* <FlexDiv width="70%" $maxWidth="1500px" $justifycontent="center" $margin="50px 0 0 0">
                    {detail?.slice(0, 3)?.map(({ thumbnail, title, dateCreated, writerName, id }) => (
                        <FlexDiv $margin="50px 25px">
                            <ActivityCard
                                imgSrc={thumbnail?.url}
                                title={title}
                                dateCreated={dateCreated}
                                writerName={writerName}
                                id={id}
                            />
                        </FlexDiv>
                    ))}
                    {detail?.slice(0, 3).length === 2 ? (
                        <Div width="360px" height="360px" $margin="50px 25px" />
                    ) : detail?.slice(0, 3).length === 1 ? (
                        <>
                            <Div width="360px" height="360px" $margin="50px 25px" />

                            <Div width="360px" height="360px" $margin="50px 25px" />
                        </>
                    ) : (
                        ""
                    )}
                </FlexDiv>

                <FlexDiv width="70%" $maxWidth="1500px" $justifycontent="center" $margin="50px 0 0 0">
                    {detail?.slice(3, 6)?.map(({ thumbnail, title, dateCreated, writerName, id }) => (
                        <FlexDiv $margin="0 25px 50px 25px">
                            <ActivityCard
                                imgSrc={thumbnail?.url}
                                title={title}
                                dateCreated={dateCreated}
                                writerName={writerName}
                                id={id}
                            />
                        </FlexDiv>
                    ))}
                    {detail?.slice(3, 6).length === 2 ? (
                        <Div width="360px" height="360px" $margin="0 25px 50px 25px" />
                    ) : detail?.slice(3, 6).length === 1 ? (
                        <>
                            <Div width="360px" height="360px" $margin="0 25px 50px 25px" />

                            <Div width="360px" height="360px" $margin="0 25px 50px 25px" />
                        </>
                    ) : (
                        ""
                    )}
                </FlexDiv> */}

          <ActivityGrid>
            {detail?.map(({ thumbnail, title, dateCreated, writerName, id }) => (
              <ActivityGridItem key={id}>
                <ActivityCard
                  imgSrc={thumbnail?.url}
                  title={title}
                  dateCreated={dateCreated}
                  writerName={writerName}
                  id={id}
                />
              </ActivityGridItem>
            ))}
          </ActivityGrid>
          <ActivityFooter $margin="0 0 50px 0">
            <Pagination
              currentPage={page}
              totalPage={data.pageInfo.totalPages}
              onPageChange={setPage}
            />
          </ActivityFooter>
          {isAuthorizedOverSecretary && (
            <ActivityFooter $margin="50px 0" $justifycontent="end">
              <Button
                display="flex"
                $backgroundColor="bgColor"
                $padding="12px 15px"
                $borderRadius={30}
                $HBackgroundColor="bgColorHo"
                onClick={() => moveCreate()}
              >
                <Div width="12px" $margin="0 10px 0 0">
                  <Img src="/images/plus_white.svg" />
                </Div>
                <Div $pointer>
                  <P color="wh" fontSize="sm">
                    게시글 등록
                  </P>
                </Div>
              </Button>
            </ActivityFooter>
          )}
        </FlexDiv>
      )}
    </>
  );
};

export default Activity;
