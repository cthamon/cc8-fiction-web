import Navbar from '../components/Navbar';
import { Box, Flex, Stack, Text, Button, Divider, Spacer, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';

function Episode() {
    const token = localStorageService.getToken();
    const history = useHistory();
    const location = useLocation();
    const { id } = location;

    if (!id) {
        history.push('/m');
    }

    const [novel, setNovel] = useState([]);
    const [episode, setEpisode] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [deleteObject, setDeleteObject] = useState([]);
    const cancelRef = useRef();

    const fetchAllNovel = async () => {
        const res = await axios.get(`http://localhost:8000/novel/${id}`);
        setNovel(res.data.novel);
    };

    const fetchEpisode = async () => {
        const res = await axios.get(`http://localhost:8000/novel/${id}/episode`);
        setEpisode(res.data.episodes);
    };

    useEffect(() => {
        fetchAllNovel();
        fetchEpisode();
    }, []);

    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            {novel.map((item, i) => {
                return (
                    <Box
                        m='20px 0'
                        w='100%'
                        key={i}
                    >
                        <Flex
                            justify='space-between'
                            mb='20px'
                        >
                            <Box w='20%'>
                                <Box
                                    backgroundImage={item.cover}
                                    backgroundSize='cover'
                                    backgroundPosition='center'
                                    rounded='xl'
                                    w='85%'
                                    h='300px'
                                />
                            </Box>
                            <Stack w='80%'>
                                <Box>
                                    <Text fontWeight='bold' fontSize='2xl'>{item.title}</Text>
                                </Box>
                                <Flex>
                                    <Box mr='50px'>
                                        <Text fontWeight='bold' fontSize='lg'>Type</Text>
                                        <Text>{item.novelType}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontWeight='bold' fontSize='lg'>Price</Text>
                                        <Text>{item.price}</Text>
                                    </Box>
                                </Flex>
                                <Box>
                                    <Text fontWeight='bold' fontSize='lg'>Description</Text>
                                    <Text w='80%'>{item.description}</Text>
                                </Box>
                                <Spacer />
                                <Box align='right'>
                                    <Button
                                        w='15%'
                                        mr='5px'
                                        color='white'
                                        bg='yellow.500'
                                        onClick={() => history.push({ pathname: '/editep', id: item.id })}
                                        _hover={{ bg: 'yellow.600' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        w='15%'
                                        color='white'
                                        bg='red.600'
                                        onClick={() => history.push('/m')}
                                        _hover={{ bg: 'red.700' }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                            </Stack>
                        </Flex>
                        <Divider />
                        <Button
                            mt='20px'
                            w='11.7%'
                            color='white'
                            bg='primary.500'
                            onClick={() => history.push({ pathname: '/ep', id })}
                            _hover={{ bg: 'primary.600' }}
                        >
                            + New Episode
                        </Button>
                        <Box m='20px 0'>
                            {episode.map((item, i) => {
                                return (
                                    <Flex key={i} mb='20px' justify='space-between' align='center'>
                                        <Box cursor='pointer'>
                                            <Text fontWeight='semibold' color='secondary.700'>Episode {item.episodeNumber} : {item.episodeTitle}</Text>
                                            <Text mr='5px' color='secondary.500'>{item.updatedAt.split('T')[0]}</Text>
                                        </Box>
                                        <Box>
                                            <Button
                                                w='78.84px'
                                                mr='5px'
                                                color='white'
                                                bg='yellow.500'
                                                onClick={() => history.push({ pathname: '/editep', id, episodeId: item.id })}
                                                _hover={{ bg: 'yellow.600' }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                w='78.84px'
                                                color='white'
                                                bg='red.600'
                                                onClick={() => { setIsOpen(true); setDeleteObject({ episodeId: item.id, episodeNumber: item.episodeNumber }); }}
                                                _hover={{ bg: 'red.700' }}
                                            >
                                                Delete
                                            </Button>
                                            <AlertDialog
                                                isOpen={isOpen}
                                                leastDestructiveRef={cancelRef}
                                            >
                                                <AlertDialogOverlay>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                                            Delete Episode {deleteObject.episodeNumber}
                                                        </AlertDialogHeader>
                                                        <AlertDialogBody>
                                                            Are you sure? You can't undo this action afterwards.
                                                        </AlertDialogBody>
                                                        <AlertDialogFooter>
                                                            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                bg='red.600'
                                                                color='white'
                                                                ml={3}
                                                                onClick={
                                                                    async () => {
                                                                        await axios.delete(`http://localhost:8000/novel/content/${deleteObject.episodeId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                                                                        setIsOpen(false);
                                                                        fetchEpisode();
                                                                    }
                                                                }
                                                                _hover={{ bg: 'red.700' }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialogOverlay>
                                            </AlertDialog>
                                        </Box>
                                    </Flex>
                                );
                            })}
                        </Box>
                    </Box>
                );
            })}
        </Flex>
    );
}

export default Episode;;;