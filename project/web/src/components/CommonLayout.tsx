import { BackgroundProps, Box, Flex } from '@chakra-ui/react';

interface Props {
  bg?: BackgroundProps['bg'];
}

const CommonLayout: React.FC<React.PropsWithChildren<Props>> = ({
  bg,
  children,
}) => {
  return (
    <div>
      <Flex maxW="960px" justify="center">
        네비게이션 바 자리 입니다.
      </Flex>
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
