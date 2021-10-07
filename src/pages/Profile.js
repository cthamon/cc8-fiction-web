import Navbar from '../components/Navbar';
import { Flex, Box, Text, Button, Divider, Stack, Image } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import axios from "../config/axios";
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';

function Profile() {
    const token = localStorageService.getToken();
    const history = useHistory();
    const location = useLocation();
    const { setNovelId, setEpisodeId } = useContext(ActivityContext);

    const userId = location.userId;
    const [novel, setNovel] = useState([]);
    const [profile, setProfile] = useState([]);
    const [rating, setRating] = useState([]);
    const [read, setRead] = useState([]);

    const [toggleNovel, setToggleNovel] = useState(false);
    const [toggleIndex, setToggleIndex] = useState(0);
    const [novelContent, setNovelContent] = useState([]);

    const fetchNovel = async () => {
        const res = await axios.get(`/novel/user/${userId}`);
        setNovel(res.data.novels);
    };

    const fetchUser = async () => {
        const res = await axios.get(`/user/profile/${userId}`);
        setProfile(res.data.user);
    };

    const fetchRating = async () => {
        const res = await axios.get(`/novel/userrating/${userId}`);
        const operation = res.data.novelRating.map(item => item.reduce((acc, cv) => cv.score + acc, 0) / item.length);
        setRating(operation);
    };

    const readCount = async () => {
        const res = await axios.get(`/novel/user/${userId}`);
        const readInfo = await axios.get(`/user/allread`);
        const counter = res.data.novels.map(item => {
            let sum = 0;
            for (let ele of readInfo.data.novelList) {
                if (ele.novelId === item.id) {
                    sum += 1;
                }
            } return sum;
        });
        setRead(counter);
    };

    const fetchNovelContent = async (id) => {
        const res = await axios.get(`/novel/${id}/episode`);
        setNovelContent(res.data.episodes);
    };

    const [followList, setFollowList] = useState([]);

    const fetchFollowList = async () => {
        const res = await axios.get(`/user/follow/`, { headers: { 'Authorization': `Bearer ${token}` } });
        setFollowList(res.data.followLists);
    };

    const followUser = async () => {
        await axios.post(`/user/follow/${userId}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
        fetchFollowList();
    };

    const unFollowUser = async () => {
        await axios.delete(`/user/unfollow/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        fetchFollowList();
    };

    const isFollow = () => {
        for (let ele of followList) {
            if (ele.unFollowUserId === userId) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        fetchNovel();
        fetchUser();
        fetchRating();
        readCount();
        fetchFollowList();
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
                </Flex>
            </Box>
            <Flex
                m='20px'
                align='center'
            >
                <Box
                    backgroundImage={`url(${profile.profileImg})`}
                    backgroundSize='cover'
                    backgroundPosition='center'
                    rounded='xl'
                    h='225px'
                    w='225px'
                    m='20px'
                />
                <Box>
                    <Flex align='center' justify='space-between' w='500px'>
                        <Text
                            mt='5px'
                            fontSize='3xl'
                            fontWeight='semibold'
                            color='green.500'
                        >
                            {profile.username}
                        </Text>
                        {!isFollow() &&
                            <Button color='#fff' bg='primary.500' _hover={{ bg: 'primary.600' }} w='79.61px' onClick={() => followUser()}>
                                Follow
                            </Button>}
                        {isFollow() &&
                            <Button color='#fff' bg='red.500' _hover={{ bg: 'red.600' }} w='79.61px' onClick={() => unFollowUser()}>
                                Unfollow
                            </Button>}
                    </Flex>
                    <Text
                        mt='5px'
                        fontWeight='semibold'
                        color='secondary.700'
                    >
                        {profile.description}
                    </Text>
                </Box>
            </Flex>
            <Flex
                p='20px'
                justify='space-between'
                align='center'
                w='100%'
                bg='primary.100'
            >
                <Text
                    fontSize='2xl'
                    fontWeight='bold'
                    color='secondary.500'
                    display='inline-block'
                >
                    {novel.length >= 2 ? 'Novels' : 'Novel'} written by <Text
                        fontSize='2xl'
                        fontWeight='bold'
                        color='primary.500'
                        display='inline-block'
                    >
                        {novel.reduce((acc, cv) => cv.writer, ' ')}
                    </Text>
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
                                >
                                </Box>
                                <Stack cursor='pointer'>
                                    <Text fontWeight='semibold'>{item.title}</Text>
                                    <Button
                                        w='87.19px'
                                        size='sm'
                                        color='white'
                                        bg='primary.500'
                                        _hover={{ bg: 'primary.600' }}
                                        onClick={() => { setToggleNovel(true); setNovelId(item.id); fetchNovelContent(item.id); setToggleIndex(i); }}
                                    >
                                        Detail
                                    </Button>
                                </Stack>
                            </Flex>
                            <Flex>
                                <Box>
                                    <Text fontWeight='semibold' mr='40px'>Rating</Text>
                                    <Text>{isNaN(rating[i]) ? 'No Rating' : rating[i]}</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight='semibold' mr='20px'>Read</Text>
                                    <Text>{read[i]}</Text>
                                </Box>
                            </Flex>
                        </Flex>
                        <Divider />
                    </Box>
                );
            })}
            {toggleNovel &&
                <Box
                    position='fixed'
                    top='50%'
                    left='50%'
                    transform='translate(-50%, -50%)'
                    w='100vw'
                    h='100%'
                    bg='rgba(255,255,255,0.1)'
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
                            onClick={() => { setToggleNovel(false); }}>
                            <CloseIcon
                                color='secondary.600'
                                cursor='pointer'
                            />
                        </Box>
                        <Box>
                            <Flex justify='center'>
                                <Box
                                    backgroundImage={`url(${novel[toggleIndex].cover})`}
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
                                        {novel[toggleIndex].title}
                                    </Text>
                                    <Image
                                        display='inline-block'
                                        src={novel[toggleIndex].writerImg}
                                        alt='writer'
                                        w='30px'
                                    />
                                    {' '}
                                    <Text
                                        display='inline-block'
                                        fontSize='xl'
                                        fontWeight='semibold'
                                        color='primary.500'
                                    >
                                        {novel[toggleIndex].writer}
                                    </Text>
                                    <Text m='10px 0' fontWeight='semibold' color='secondary.600'>{novel[toggleIndex].novelType}</Text>
                                    <Text fontWeight='semibold' color='secondary.700'>Description</Text>
                                    <Text m='0 0 10px 0'>{novel[toggleIndex].description}</Text>
                                    <Flex m='0 0 20px 0'>
                                        <Box>
                                            <Text fontWeight='semibold' mr='40px'>Rating</Text>
                                            <Text>0</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight='semibold' mr='20px'>Read</Text>
                                            <Text>0</Text>
                                        </Box>
                                    </Flex>
                                    <Button mr='5px' color='#fff' bg='primary.500' _hover={{ bg: 'primary.600' }} w='79.61px' onClick={() => { history.push('/read'); setEpisodeId(novelContent[0].id); }}>
                                        Read
                                    </Button>
                                </Box>
                            </Flex>
                            <Divider mb='20px' />
                            <Flex justify='space-between' align='center' m='0 20px 10px 20px'>
                                <Text
                                    fontSize='xl'
                                    fontWeight='semibold'
                                    textAlign='center'
                                    color='secondary.700'
                                >
                                    Episodes
                                </Text>
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
                                            <Text fontWeight='semibold'>Episode {item.episodeNumber} : {item.episodeTitle} </Text>
                                            <Text>{item.updatedAt.split('T')[0]}</Text>
                                        </Flex>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            }
        </Flex >
    );
}

export default Profile;