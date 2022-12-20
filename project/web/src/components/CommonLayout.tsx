import { BackgroundProps, Box } from '@chakra-ui/react';
import Navbar from './nav/Navbar';

interface Props {
  bg?: BackgroundProps['bg'];
}

const CommonLayout: React.FC<React.PropsWithChildren<Props>> = ({
  bg,
  children,
}) => {
  return (
    <div>
      <Navbar />
      <Box
        px={{ base: 4 }}
        pt={24}
        mx="auto"
        maxW="960px"
        minH="100vh"
        w="100%"
        bg={bg}
      >
        {children}
      </Box>
    </div>
  );
};

export default CommonLayout;
