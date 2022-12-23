import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  SignUpMutationVariables,
  useSignUpMutation,
} from '../../generated/graphql';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const SignUpRealForm: React.FC = () => {
  const [signUp, { loading }] = useSignUpMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpMutationVariables>();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = (data: SignUpMutationVariables) => {
    const { signUpInput } = data;
    return signUp({ variables: { signUpInput } })
      .then((res) => {
        if (res.data?.signUp) {
          toast({ title: '회원가입을 환영합니다!', status: 'success' });
          navigate('/');
        } else {
          toast({
            title: '회원가입 도중 문제가 발생했습니다.',
            status: 'error',
          });
        }
      })
      .catch((err) => {
        toast({ title: '이메일 또는 아이디가 중복됩니다.', status: 'error' });
        return err;
      });
  };

  return (
    <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormControl isInvalid={!!errors.signUpInput?.email}>
        <FormLabel>이메일</FormLabel>
        <Input
          type="email"
          placeholder="example@email.com"
          {...register('signUpInput.email', {
            required: '이메일을 입력해주세요.',
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: '이메일의 형식이 올바르지 않습니다.',
            },
          })}
        />
        <FormErrorMessage>
          {errors.signUpInput?.email && errors.signUpInput.email.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.signUpInput?.username}>
        <FormLabel>아이디</FormLabel>
        <Input
          type="text"
          placeholder="example"
          {...register('signUpInput.username', {
            required: '아이디를 입력해주세요.',
          })}
        />
        <FormErrorMessage>
          {errors.signUpInput?.username && errors.signUpInput.username.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.signUpInput?.password}>
        <FormLabel>암호</FormLabel>
        <Input
          type="password"
          placeholder="8자 이상의 영문, 숫자, 특문"
          {...register('signUpInput.password', {
            required: '암호를 입력해주세요.',
            min: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
            pattern: {
              value:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
              message:
                '암호는 문자,숫자,특수 문자를 퐇마한 8자 이상이어야 합니다.',
            },
          })}
        />
        <FormErrorMessage>
          {errors.signUpInput?.password && errors.signUpInput.password.message}
        </FormErrorMessage>
      </FormControl>

      <Divider />
      <Button colorScheme="teal" type="submit" isLoading={loading}>
        계정 생성
      </Button>
    </Stack>
  );
};

const SignUpForm: React.FC = () => {
  return (
    <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
      <Stack align="center">
        <Heading fontSize="4xl">계정 생성</Heading>
        <Text fontSize="lg" color="gray.600">
          가입을 환영합니다!
        </Text>
      </Stack>

      <Box
        rounded="lg"
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow="lg"
        minW="lg"
        p={8}
      >
        <SignUpRealForm />
      </Box>
    </Stack>
  );
};

export default SignUpForm;
