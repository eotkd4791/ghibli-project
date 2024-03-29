import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { useMemo } from 'react';
import { useApolloClient } from '@apollo/client';

const LoggedInNavbarItem = () => {
  const client = useApolloClient();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();

  const onLogoutClick = async () => {
    try {
      await logout();
      localStorage.removeItem('access_token');
      await client.resetStore();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Stack justify="flex-end" alignItems="center" direction="row" spacing={3}>
      <ColorModeSwitcher />

      <Menu>
        <MenuButton as={Button} rounded="full" variant="link" cusor="pointer">
          <Avatar size="sm" />
        </MenuButton>
        <MenuList>
          <MenuItem isDisabled={logoutLoading} onClick={onLogoutClick}>
            로그아웃
          </MenuItem>
        </MenuList>
      </Menu>
    </Stack>
  );
};

const Navbar: React.FC = () => {
  const accessToken = localStorage.getItem('access_token');

  const { data } = useMeQuery({ skip: !accessToken });

  const isLoggedIn = useMemo(() => {
    if (accessToken) {
      return data?.me?.id;
    }
    return false;
  }, [accessToken, data?.me?.id]);

  return (
    <Box
      zIndex={10}
      position="fixed"
      w="100%"
      bg={useColorModeValue('white', 'gray.800')}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      py={{ base: 2 }}
      px={{ base: 4 }}
    >
      <Flex
        maxW={960}
        color={useColorModeValue('gray.600', 'white')}
        minH="60px"
        align="center"
        m="auto"
      >
        <Flex flex={{ base: 1, md: 'auto' }}>
          <Link
            as={RouterLink}
            to="/"
            fontFamily="heading"
            fontWeight="bold"
            color={useColorModeValue('gray.800', 'white')}
          >
            GhibliBestCut
          </Link>
        </Flex>
        {isLoggedIn ? (
          <LoggedInNavbarItem />
        ) : (
          <Stack justify="flex-end" direction="row" spacing={6}>
            <ColorModeSwitcher />
            <Button
              fontSize="sm"
              fontWeight={400}
              variant="link"
              as={RouterLink}
              to="/login"
            >
              로그인
            </Button>
            <Button
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize="sm"
              fontWeight={600}
              colorScheme="teal"
              as={RouterLink}
              to="/signup"
            >
              시작하기
            </Button>
          </Stack>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
