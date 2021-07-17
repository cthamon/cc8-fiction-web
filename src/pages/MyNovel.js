import Navbar from '../components/Navbar';
import { Flex, Box, Text, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Divider, Stack } from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';

function MyNovel() {
    const token = localStorageService.getToken();
    const history = useHistory();

    const [novel, setNovel] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [deleteObject, setDeleteObject] = useState([]);
    const cancelRef = useRef();

    const fetchNovel = async () => {
        const res = await axios.get('http://localhost:8000/novel/user', { headers: { 'Authorization': `Bearer ${token}` } });
        setNovel(res.data.novels);
    };

    useEffect(() => {
        fetchNovel();
    }, []);

    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <Box w='100%'>
                <Flex
                    mt='10px'
                    justify='space-between'
                    w='100%'
                >
                    <Box />
                    <Button
                        mb='20px'
                        color='white'
                        bg='primary.500'
                        onClick={() => history.push('/w')}
                        _hover={{ bg: 'primary.600' }}
                    >
                        + Create Novel
                    </Button>
                </Flex>
            </Box>
            <Flex
                p='20px'
                justify='space-between'
                align='center'
                w='100%'
                bg='primary.100'
            >
                <Text
                    fontSize='2xl'
                    fontWeight='semibold'
                    color='secondary.600'
                >
                    {novel.length >= 2 ? 'My Novels' : 'My Novel'}
                </Text>
                <Text
                    fontWeight='semibold'
                    color='secondary.600'
                >
                    {/* Sort by <TriangleDownIcon /> */}
                </Text>
            </Flex>
            {novel.map((item, i) => {
                return (
                    <Box
                        key={i}
                        w='100%'
                    >
                        <Flex
                            p='10px 20px'
                            justify='space-between'
                            align='center'
                        >
                            <Flex
                                align='center'
                                w='75%'
                            >
                                <Box
                                    backgroundImage={`url(${item.cover})`}
                                    backgroundSize='cover'
                                    backgroundPosition='center'
                                    rounded='xl'
                                    w='80px'
                                    h='112.5px'
                                    mr='30px'
                                    cursor='pointer'
                                    onClick={() => history.push({ pathname: '/ninfo', id: item.id })}
                                >
                                </Box>
                                <Stack cursor='pointer'>
                                    <Text fontWeight='semibold' onClick={() => history.push({ pathname: '/ninfo', id: item.id })}>{item.title}</Text>
                                    <Flex>
                                        <Box>
                                            <Text fontWeight='semibold' mr='20px'>Rating</Text>
                                            <Text>0</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight='semibold' mr='20px'>Read</Text>
                                            <Text>0</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight='semibold'>Comment</Text>
                                            <Text>0</Text>
                                        </Box>
                                    </Flex>
                                </Stack>
                            </Flex>
                            <Flex w='25%' justify='space-between'>
                                <Button
                                    w='87.19px'
                                    size='sm'
                                    color='white'
                                    bg='primary.500'
                                    onClick={() => history.push({ pathname: '/ninfo', id: item.id })}
                                    _hover={{ bg: 'primary.600' }}
                                >
                                    Detail
                                </Button>
                                <Button
                                    w='87.19px'
                                    size='sm'
                                    color='white'
                                    bg='yellow.500'
                                    onClick={() => history.push({ pathname: '/editn', id: item.id })}
                                    _hover={{ bg: 'yellow.600' }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    w='87.19px'
                                    size='sm'
                                    color='white'
                                    bg='red.600'
                                    onClick={() => { setIsOpen(true); setDeleteObject({ id: item.id }); }}
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
                                                Delete Novel
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
                                                            await axios.delete(`http://localhost:8000/novel/${deleteObject.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                                                            setIsOpen(false);
                                                            fetchNovel();
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
                            </Flex>

                        </Flex>
                        <Divider />
                    </Box>
                );
            })}
        </Flex >
    );
}

export default MyNovel;