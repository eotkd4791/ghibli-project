import { FilmsQuery } from '../../generated/graphql';
import {
  AspectRatio,
  Box,
  Heading,
  Image,
  LinkBox,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface Props {
  film: FilmsQuery['films']['films'][0];
}

const FilmCard: React.FC<Props> = ({ film }) => {
  return (
    <LinkBox as="article" my={6}>
      <Box
        maxW="300px"
        w="full"
        rounded="md"
        px={{ base: 1, md: 3 }}
        pt={3}
        overflow="hidden"
      >
        <Box bg="gray.100" mt={-3} mx={-3} mb={2} pos="relative">
          <AspectRatio ratio={2 / 3}>
            <Image src={film.posterImg} />
          </AspectRatio>
        </Box>
        <Stack>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize="xl"
            fontFamily="body"
          >
            {film.title}
          </Heading>
          <Text fontSize="sm" color="gray.500" isTruncated>
            {`${film.release} ﹒ ${film.runningTime}분`}
          </Text>
          <Text isTruncated>{film.director.name}</Text>
        </Stack>
      </Box>
    </LinkBox>
  );
};

export default FilmCard;
