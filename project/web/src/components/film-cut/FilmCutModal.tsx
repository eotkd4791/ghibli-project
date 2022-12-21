import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useCutQuery } from '../../generated/graphql';
import FilmCutDetail from './FilmCutDetail';

interface Props {
  open: boolean;
  onClose: () => void;
  cutId: number;
}

const FilmCutModal: React.FC<Props> = ({ open, onClose, cutId }) => {
  const { loading, data } = useCutQuery({ variables: { cutId } });

  const modalSize = useBreakpointValue({ base: 'full', md: 'xl' });

  return (
    <Modal
      onClose={onClose}
      isOpen={open}
      isCentered
      size={modalSize}
      preserveScrollBarGap
    >
      <ModalOverlay />
      <ModalContent pt={2}>
        <ModalHeader>{data?.cut?.film?.title}</ModalHeader>
        <ModalCloseButton mt={3} />
        <ModalBody>
          {loading && (
            <Center py={4}>
              <Spinner />
            </Center>
          )}
          {!loading && !data && <Center>데이터를 불러오지 못했습니다.</Center>}
          {data && data.cut && (
            <FilmCutDetail cutId={data.cut.id} cutImg={data.cut.src} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default FilmCutModal;
