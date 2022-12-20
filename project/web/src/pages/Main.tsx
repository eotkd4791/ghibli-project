import { Heading } from '@chakra-ui/react';
import FilmList from '../components/film/FilmList';
import CommonLayout from '../components/CommonLayout';

const Main: React.FC = () => {
  return (
    <CommonLayout>
      <Heading size="lg">최고의 장면을 찾아보세요</Heading>
      <FilmList />
    </CommonLayout>
  );
};

export default Main;
