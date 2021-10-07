import Navbar from '../components/Navbar';
import { Flex, Box, Text, Image, Button, Divider } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import axios from '../config/axios';
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';
import { AuthContext } from '../contexts/AuthContextProvider';

function Follow() {
    const history = useHistory();
    const { setNovelId, setEpisodeId } = useContext(ActivityContext);
    const { user } = useContext(AuthContext);

    const [followlist, setFollowlist] = useState([]);
    const [novellist, setNovellist] = useState([]);

    const [toggleNovel, setToggleNovel] = useState(false);
    const [novel, setNovel] = useState([]);
    const [novelContent, setNovelContent] = useState([]);

    const token = localStorageService.getToken();

    const fetchFollowing = async () => {
        const res = await axios.get('/user/follow', { headers: { 'Authorization': `Bearer ${token}` } });
        setFollowlist(res.data.followLists);
    };

    const fetchFollowNovel = async () => {
        const res = await axios.get('/user/follownovel', { headers: { 'Authorization': `Bearer ${token}` } });
        setNovellist(res.data.novelLists);
    };

    const fetchNovel = async (id) => {
        const res = await axios.get(`/novel/${id}/`);
        setNovel(res.data.novel);
    };

    const fetchNovelContent = async (id) => {
        const res = await axios.get(`/novel/${id}/episode`);
        setNovelContent(res.data.episodes);
    };

    const unFollowNovel = async (id) => {
        await axios.delete(`/user/unfollownovel/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
    };

    useEffect(() => {
        fetchFollowing();
        fetchFollowNovel();
    }, []);

    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <Box w='100%' mt='20px' align='left'>
                <Text
                    ml='70px'
                    fontSize='2xl'
                    fontWeight='semibold'
                    color='secondary.600'
                >
                    Following
                </Text>
            </Box>
            <Box
                m='20px 0'
                w='100%'
                h='300px'
                overflowY='hidden'
                overflowX='auto'
                css={{
                    '&: :-webkit-scrollbar': {
                        height: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        width: '6px',
                        margin: '13px 0 0 0'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'gray',
                        borderRadius: '24px',
                    },
                }}
            >
                <Text
                    ml='70px'
                    fontSize='xl'
                    fontWeight='semibold'
                    color='secondary.600'
                >
                    Writer Lists
                </Text>
                <Flex m='0 70px'>
                    {followlist.map((item, i) => {
                        return (
                            <Box key={i}>
                                <Box
                                    w='160px'
                                    m='20px'
                                    align='center'
                                    onClick={() => history.push({ pathname: '/profile', userId: item.unFollowUserId })}
                                >
                                    <Box
                                        backgroundImage={`url(${item.profileImg})`}
                                        backgroundSize='cover'
                                        backgroundPosition='center'
                                        h='160px'
                                        w='160px'
                                        cursor='pointer'
                                    />
                                    <Text
                                        mt='5px'
                                        fontSize='xl'
                                        fontWeight='semibold'
                                        color='green.500'
                                        cursor='pointer'
                                    >
                                        {item.username}
                                    </Text>
                                </Box>
                            </Box>
                        );
                    })}
                </Flex>
            </Box>
            <Divider />
            <Box
                m='20px 0'
                w='100%'
                h='370px'
                overflowY='hidden'
                overflowX='auto'
                css={{
                    '&: :-webkit-scrollbar': {
                        height: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        width: '6px',
                        margin: '13px 0 0 0'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'gray',
                        borderRadius: '24px',
                    },
                }}
            >
                <Text
                    position='sticky'
                    ml='70px'
                    fontSize='xl'
                    fontWeight='semibold'
                    color='secondary.600'
                >
                    Novel Lists
                </Text>
                <Flex m='0 70px'>
                    {novellist.map((item, i) => {
                        return (
                            <Box key={i}>
                                <Box
                                    w='160px'
                                    m='20px'
                                    align='center'
                                    onClick={() => {
                                        setToggleNovel(!toggleNovel);
                                        setNovelId(item.novelId);
                                        fetchNovel(item.novelId);
                                        fetchNovelContent(item.novelId);
                                    }}
                                >
                                    <Box
                                        backgroundImage={`url(${item.cover})`}
                                        backgroundSize='cover'
                                        backgroundPosition='center'
                                        rounded='xl'
                                        h='225px'
                                    />
                                    <Text
                                        mt='5px'
                                        fontWeight='semibold'
                                        color='secondary.700'
                                    >
                                        {item.title}
                                    </Text>
                                </Box>
                            </Box>
                        );
                    })}
                </Flex>
                {toggleNovel &&
                    <Box
                        position='fixed'
                        top='50%'
                        left='50%'
                        transform='translate(-50%, -50%)'
                        w='100vw'
                        h='100%'
                        bg='rgba(255,255,255,0.5)'
                        zIndex='2'
                    >
                        <Box
                            position='absolute'
                            top='50%'
                            left='50%'
                            transform='translate(-50%, -50%)'
                            overflow='scroll'
                            w='900px'
                            maxH='750px'
                            bg='#fff'
                            boxShadow='rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'
                            css={{
                                '&: :-webkit-scrollbar': {
                                    width: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    width: '6px',
                                    margin: '13px 0 0 0'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: 'gray',
                                    borderRadius: '24px',
                                },
                            }}
                        >
                            <Box
                                position='absolute'
                                top='20px'
                                right='10px'
                                onClick={() => { setToggleNovel(false); setNovelId(null); }}>
                                <CloseIcon
                                    color='secondary.600'
                                    cursor='pointer'
                                />
                            </Box>
                            {novel.map((item, i) => {
                                return (
                                    <Box key={i}>
                                        <Flex justify='center'>
                                            <Box
                                                backgroundImage={`url(${item.cover})`}
                                                backgroundSize='cover'
                                                backgroundPosition='center'
                                                rounded='xl'
                                                w='250px'
                                                h='360px'
                                                m='20px'
                                            >
                                            </Box>
                                            <Box w='600px' m='20px'>
                                                <Text
                                                    fontSize='2xl'
                                                    fontWeight='semibold'
                                                    color='secondary.700'
                                                    m='0 0 10px 0'
                                                >
                                                    {item.title}
                                                </Text>
                                                <Image
                                                    display='inline-block'
                                                    src={item.writerImg}
                                                    alt='writer'
                                                    w='30px'
                                                    h='30px'
                                                    rounded='full'
                                                    cursor='pointer'
                                                    onClick={() => {
                                                        if (user.id === item.userId) {
                                                            history.push({ pathname: `/m` });
                                                        } else {
                                                            history.push({ pathname: `/profile`, userId: item.userId });
                                                        }
                                                    }}
                                                />
                                                {' '}
                                                <Text
                                                    display='inline-block'
                                                    cursor='pointer'
                                                    color='primary.500'
                                                    fontSize='xl'
                                                    fontWeight='semibold'
                                                    onClick={() => {
                                                        if (user.id === item.userId) {
                                                            history.push({ pathname: `/m` });
                                                        } else {
                                                            history.push({ pathname: `/profile`, userId: item.userId });
                                                        }
                                                    }}
                                                >
                                                    {item.writer}
                                                </Text>
                                                <Text m='10px 0' fontWeight='semibold' color='secondary.600'>{item.novelType}</Text>
                                                <Text fontWeight='semibold' color='secondary.700'>Description</Text>
                                                <Text m='0 0 10px 0'>{item.description}</Text>
                                                {!(novelContent.length === 0) &&
                                                    <Button mr='5px' color='#fff' bg='primary.500' _hover={{ bg: 'primary.600' }} w='79.61px' onClick={() => { history.push('/read'); setEpisodeId(novelContent[0].id); }}>
                                                        Read
                                                    </Button>
                                                }
                                                <Button color='#fff' bg='red.500' _hover={{ bg: 'red.600' }} w='79.61px' onClick={() => { unFollowNovel(item.id); setToggleNovel(false); history.go(0); }}>
                                                    Unfollow
                                                </Button>
                                            </Box>
                                        </Flex>
                                        {!(novelContent.length === 0) && <Divider mb='20px' />}
                                        <Flex justify='space-between' align='center' m='0 20px 10px 20px'>
                                            {!(novelContent.length === 0) &&
                                                <Text
                                                    fontSize='xl'
                                                    fontWeight='semibold'
                                                    textAlign='center'
                                                    color='secondary.700'
                                                >
                                                    Episodes
                                                </Text>
                                            }
                                        </Flex>
                                        {novelContent.map((item, j) => {
                                            return (
                                                <Box key={j}>
                                                    <Flex
                                                        justify='space-between'
                                                        cursor='pointer'
                                                        m='0 20px'
                                                        bg='#fff'
                                                        onClick={() => { history.push('/read'); setEpisodeId(item.id); }}
                                                        color='secondary.700'
                                                        _hover={{ color: 'secondary.500' }}
                                                    >
                                                        <Text fontWeight='semibold' >Episode {item.episodeNumber} : {item.episodeTitle} </Text>
                                                        <Text>{item.updatedAt.split('T')[0]}</Text>
                                                    </Flex>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                }
            </Box>
        </Flex>
    );
}

export default Follow;;