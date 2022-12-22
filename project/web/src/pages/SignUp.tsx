import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import CommonLayout from '../components/CommonLayout';
import SignUpForm from '../components/auth/SignUpForm';

const SignUp: React.FC = () => {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.800')}>
      <CommonLayout>
        <Flex align="center" justify="center">
          <SignUpForm />
        </Flex>
      </CommonLayout>
    </Box>
  );
};

export default SignUp;
