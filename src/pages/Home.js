import Navbar from '../components/Navbar';
import Banner from '../components/Banner/Banner';
import { Flex, Box, Text, Image, Button, Divider, Textarea, Select } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';
import { AuthContext } from '../contexts/AuthContextProvider';

function Home() {
    const history = useHistory();
    const token = localStorageService.getToken();
    const { novelId, setNovelId, setEpisodeId, cartItem, setCartItem, filter, search } = useContext(ActivityContext);
    const { user } = useContext(AuthContext);

    const [novels, setNovels] = useState([]);
    const [novel, setNovel] = useState([]);
    const [novelContent, setNovelContent] = useState([]);
    const [toggleNovel, setToggleNovel] = useState(false);
    const [followInfo, setFollowInfo] = useState([]);
    const [toggleReview, setToggleReview] = useState(false);
    const [rating, setRating] = useState([]);
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState([]);
    const [toggleEditReview, setToggleEditReview] = useState(false);
    const [purchased, setPurchased] = useState([]);

    const fetchNovel = async (id) => {
        const res = await axios.get(`http://localhost:8000/novel/${id}/`);
        setNovel(res.data.novel);
    };

    const fetchNovelContent = async (id) => {
        const res = await axios.get(`http://localhost:8000/novel/${id}/episode`);
        setNovelContent(res.data.episodes);
    };

    const getFollowNovelInfo = async () => {
        const res = await axios.get(`http://localhost:8000/user/follownovel/`, { headers: { 'Authorization': `Bearer ${token}` } });
        setFollowInfo(res.data.novelLists);
    };

    const followNovel = async (id) => {
        await axios.post(`http://localhost:8000/user/follownovel/${id}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
        getFollowNovelInfo();
    };

    const unFollowNovel = async (id) => {
        await axios.delete(`http://localhost:8000/user/unfollownovel/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        getFollowNovelInfo();
    };

    const fetchRating = async (id) => {
        const res = await axios.get(`http://localhost:8000/novel/rating/${id}`);
        setRating(res.data.novelRating);
    };

    const writeReview = async (id) => {
        if (toggleEditReview) {
            await axios.patch(`http://localhost:8000/novel/updaterating/${id}`, { score, comment }, { headers: { 'Authorization': `Bearer ${token}` } });
        } else {
            await axios.post(`http://localhost:8000/novel/rating/${id}`, { score, comment }, { headers: { 'Authorization': `Bearer ${token}` } });
        }
        setToggleReview(false);
        setScore(0);
        setComment('');
        fetchRating(id);
    };

    const deleteRating = async (id) => {
        await axios.delete(`http://localhost:8000/novel/rating/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        fetchRating(novelId);
    };

    const fetchPurchaseList = async () => {
        const res = await axios.get(`http://localhost:8000/order/purchaselist`, { headers: { 'Authorization': `Bearer ${token}` } });
        setPurchased(res.data.purchaseList.map(item => item.episodeId));
    };

    const isPurchased = (id) => {
        for (let ele of purchased) {
            if (ele === id) {
                return true;
            }
        };
        return false;
    };

    const dropdownScore = ([0, 1, 2, 3, 4, 5]);

    const averageRating = () => {
        let sum = 0;
        for (let ele of rating) {
            sum += +ele.score;
        }
        if (isNaN(sum / rating.length)) {
            return 'No Rating';
        }
        return Math.round(sum / rating.length * 100) / 100;
    };

    const isFollow = (id) => {
        for (let ele of followInfo) {
            if (ele.novelId === id) {
                return true;
            }
        };
        return false;
    };

    const isReview = (id) => {
        for (let ele of rating) {
            if (ele.userId === id) {
                return true;
            }
        };
    };

    const [readCounter, setReadCounter] = useState(0);
    const readCount = async (id) => {
        const readInfo = await axios.get(`http://localhost:8000/user/allread`);
        let counter = 0;
        for (let ele of readInfo.data.novelList) {
            if (id === ele.novelId) {
                counter += 1;
            }
        }
        setReadCounter(counter);
    };

    const [followCounter, setFollowCounter] = useState(0);
    const followCount = async (id) => {
        const followInfo = await axios.get(`http://localhost:8000/user/follownovelall`);
        let counter = 0;
        for (let ele of followInfo.data.follow) {
            if (id === ele.novelId) {
                counter += 1;
            }
        }
        setFollowCounter(counter);
    };

    const H3 = ({ children, ...rest }) => {
        return (
            <Text
                fontSize='xl'
                fontWeight='semibold'
                color='secondary.600'
                {...rest}
            >
                {children}
            </Text>
        );
    };

    useEffect(() => {
        const fetchAllNovel = async () => {
            const res = await axios.get('http://localhost:8000/novel');
            setNovels(res.data.novels);
        };
        fetchAllNovel();
        getFollowNovelInfo();
        fetchPurchaseList();
    }, []);

    useEffect(() => {
        if (filter !== '') {
            const fetchAllNovel = async () => {
                const res = await axios.get('http://localhost:8000/novel');
                return setNovels(res.data.novels.filter(item => item.novelType === filter));
            };
            fetchAllNovel();
        }
        if (filter === '') {
            const fetchAllNovel = async () => {
                const res = await axios.get('http://localhost:8000/novel');
                return setNovels(res.data.novels);
            };
            fetchAllNovel();
        }
    }, [filter]);

    useEffect(() => {
        if (search !== '') {
            const fetchAllNovel = async () => {
                const res = await axios.get('http://localhost:8000/novel');
                return setNovels(res.data.novels.filter(item => item.title.toLowerCase().includes(search.toLowerCase())));
            };
            fetchAllNovel();
        }
        if (search === '') {
            const fetchAllNovel = async () => {
                const res = await axios.get('http://localhost:8000/novel');
                return setNovels(res.data.novels);
            };
            fetchAllNovel();
        }
    }, [search]);

    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <Banner />
            <Box w='100%'>
                <Flex
                    mt='10px'
                    justify='flex-start'
                    w='100%'
                >
                    <H3>Novels</H3>
                </Flex>
                <Flex
                    justify='center'
                    wrap='wrap'
                >
                    {novels.map((item, i) => {
                        return (
                            <Box
                                key={i}
                            >
                                <Box
                                    w='160px'
                                    m='20px'
                                    onClick={() => {
                                        setToggleNovel(!toggleNovel);
                                        setNovelId(item.id);
                                        fetchNovel(item.id);
                                        fetchNovelContent(item.id);
                                        fetchRating(item.id);
                                        readCount(item.id);
                                        followCount(item.id);
                                    }}
                                    align='center'
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
                                    <Text color='secondary.600'>by {item.writer}</Text>
                                    <Text color='secondary.500'>{item.novelType}</Text>
                                </Box>
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
                                                                />
                                                                {' '}
                                                                <H3
                                                                    display='inline-block'
                                                                    cursor='pointer'
                                                                    color='primary.500'
                                                                    onClick={() => {
                                                                        if (user.id === item.userId) {
                                                                            history.push({ pathname: `/m` });
                                                                        } else {
                                                                            history.push({ pathname: `/profile`, userId: item.userId });
                                                                        }
                                                                    }}
                                                                >
                                                                    {item.writer}
                                                                </H3>
                                                                <Text m='10px 0' fontWeight='semibold' color='secondary.600'>{item.novelType}</Text>
                                                                <Text fontWeight='semibold' color='secondary.700'>Description</Text>
                                                                <Text m='0 0 10px 0'>{item.description}</Text>
                                                                <Flex m='0 0 20px 0'>
                                                                    <Box>
                                                                        <Text fontWeight='semibold' mr='40px'>Rating</Text>
                                                                        <Text>{averageRating()}</Text>
                                                                    </Box>
                                                                    <Box>
                                                                        <Text fontWeight='semibold' mr='40px'>Read</Text>
                                                                        <Text>{readCounter}</Text>
                                                                    </Box>
                                                                    <Box>
                                                                        <Text fontWeight='semibold' mr='20px'>Follow</Text>
                                                                        <Text>{followCounter}</Text>
                                                                    </Box>
                                                                </Flex>
                                                                {novelContent[0] &&
                                                                    !isPurchased(novelContent[0].id) &&
                                                                    <Button mr='5px' color='#fff' bg='yellow.500' _hover={{ bg: 'yellow.600' }} onClick={() => { if (cartItem.includes(novelContent[0].id)) { return; } else { setCartItem([...cartItem, novelContent[0].id]); } }}>
                                                                        Buy {novel[0].price ? 'novel for' : 'first episode for'} THB {novel[0].price ? novel[0].price : novelContent[0].price}
                                                                    </Button>
                                                                }
                                                                {novelContent[0] &&
                                                                    isPurchased(novelContent[0].id) &&
                                                                    <Button mr='5px' color='#fff' bg='primary.500' _hover={{ bg: 'primary.600' }} w='79.61px' onClick={() => { history.push('/read'); setEpisodeId(novelContent[0].id); }}>
                                                                        Read
                                                                    </Button>
                                                                }
                                                                {!isFollow(item.id) &&
                                                                    <Button mr='5px' color='#fff' bg='primary.500' _hover={{ bg: 'primary.600' }} w='79.61px' onClick={() => followNovel(item.id)}>
                                                                        Follow
                                                                    </Button>}
                                                                {isFollow(item.id) &&
                                                                    <Button color='#fff' bg='red.500' _hover={{ bg: 'red.600' }} w='79.61px' onClick={() => unFollowNovel(item.id)}>
                                                                        Unfollow
                                                                    </Button>}
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
                                                                    {!isPurchased(item.id) &&
                                                                        <Flex
                                                                            justify='space-between'
                                                                            m='0 20px'
                                                                            bg='#fff'
                                                                            color='secondary.700'
                                                                        >
                                                                            <Text fontWeight='semibold'>Episode {item.episodeNumber} : {item.episodeTitle}</Text>
                                                                            <Text fontWeight='semibold' cursor='pointer' color='yellow.500' _hover={{ color: 'yellow.600' }} onClick={() => { if (novel[0].price) { if (cartItem.includes(novelContent[0].id)) { return; } } if (cartItem.includes(item.id)) { return; } else { setCartItem([...cartItem, novel[0].price ? novelContent[0].id : item.id]); } }}>{novel[0].price ? 'Buy this book for THB ' + novel[0].price : 'Buy this episode for THB ' + item.price}</Text>
                                                                        </Flex>}
                                                                    {isPurchased(item.id) &&
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
                                                                        </Flex>}
                                                                </Box>
                                                            );
                                                        })}
                                                        <Divider m='20px 0' />
                                                        <Flex justify='space-between' align='center' m='0 20px'>
                                                            <Text
                                                                fontSize='xl'
                                                                fontWeight='semibold'
                                                                textAlign='center'
                                                                color='secondary.700'
                                                            >
                                                                Reviews
                                                            </Text>
                                                            {!isReview(user.id) &&
                                                                <Button
                                                                    color='#fff'
                                                                    bg='primary.500'
                                                                    _hover={{ bg: 'primary.600' }}
                                                                    onClick={() => setToggleReview(true)}
                                                                >
                                                                    Write a review
                                                                </Button>}
                                                            {isReview(user.id) &&
                                                                <Text
                                                                    fontWeight='semibold'
                                                                    color='gray.600'
                                                                >
                                                                    Already reviewed
                                                                </Text>
                                                            }
                                                        </Flex>
                                                        <Box>
                                                            {rating.map((item, i) => {
                                                                return (
                                                                    <Box key={i}>
                                                                        <Flex m='20px 40px' >
                                                                            <Image
                                                                                borderRadius='full'
                                                                                boxSize='48px'
                                                                                mr='10px'
                                                                                src={item.User.profileImg}
                                                                                alt="Profile Picture"
                                                                            />
                                                                            <Box
                                                                                bg='secondary.100'
                                                                                p='10px'
                                                                                rounded='xl'
                                                                                w='100%'
                                                                            >
                                                                                <Flex justify='space-between' align='center' >
                                                                                    <Text fontWeight='semibold' color='primary.500'>{item.User.username}</Text>
                                                                                    <Text fontWeight='semibold'>Rating: {item.score} / 5</Text>
                                                                                </Flex>
                                                                                <Text
                                                                                    fontWeight='semibold'
                                                                                    color='secondary.700'
                                                                                >
                                                                                    {item.comment}
                                                                                </Text>
                                                                                <Box
                                                                                    position='relative'
                                                                                    bottom='0px'
                                                                                >
                                                                                    {
                                                                                        (user.id === item.userId)
                                                                                        &&
                                                                                        <Box display='inline-block'>
                                                                                            <Text
                                                                                                fontSize='x-small'
                                                                                                fontWeight='bold'
                                                                                                color='yellow.500'
                                                                                                display='inline-block'
                                                                                                mr='5px'
                                                                                                cursor='pointer'
                                                                                                onClick={() => {
                                                                                                    setToggleEditReview(true);
                                                                                                    setToggleReview(!toggleReview);
                                                                                                    setComment(rating[rating.findIndex(rating => rating.userId === user.id)].comment);
                                                                                                    setScore(rating[rating.findIndex(rating => rating.userId === user.id)].score);
                                                                                                }}
                                                                                            >
                                                                                                Edit
                                                                                            </Text>
                                                                                            <Text
                                                                                                fontSize='x-small'
                                                                                                fontWeight='bold'
                                                                                                color='secondary.600'
                                                                                                display='inline-block'
                                                                                                mr='5px'
                                                                                                cursor='default'
                                                                                            >
                                                                                                |
                                                                                            </Text>
                                                                                            <Text
                                                                                                fontSize='x-small'
                                                                                                fontWeight='bold'
                                                                                                color='red.500'
                                                                                                display='inline-block'
                                                                                                mr='5px'
                                                                                                cursor='pointer'
                                                                                                onClick={() => { deleteRating(item.id); }}
                                                                                            >
                                                                                                Delete
                                                                                            </Text>
                                                                                        </Box>
                                                                                    }
                                                                                    <Text
                                                                                        fontSize='x-small'
                                                                                        color='secondary.700'
                                                                                    >
                                                                                        {item.updatedAt.split('T')[0] + ' at ' + item.updatedAt.split('T')[1].split('.')[0]}
                                                                                    </Text>
                                                                                </Box>
                                                                            </Box>
                                                                        </Flex>
                                                                    </Box>
                                                                );
                                                            })}
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                        {toggleReview &&
                                            <Box
                                                position='absolute'
                                                top='50%'
                                                left='50%'
                                                transform='translate(-50%, -50%)'
                                            >
                                                <Box
                                                    boxShadow='rgba(255, 255, 255, 0.1) 0px 0px 0px 9999px;'
                                                />
                                                <Box
                                                    position='sticky'
                                                    p='1px'
                                                    w='600px'
                                                    bg='#fff'
                                                    rounded='xl'
                                                    boxShadow='rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'
                                                >
                                                    <Box
                                                        position='absolute'
                                                        top='20px'
                                                        right='10px'
                                                        onClick={() => { setToggleReview(false); setToggleEditReview(false); }}>
                                                        <CloseIcon
                                                            color='secondary.600'
                                                            cursor='pointer'
                                                        />
                                                    </Box>
                                                    <Text
                                                        align='center'
                                                        fontWeight='semibold'
                                                        fontSize='xl'
                                                        color='primary.500'
                                                        m='20px 0'
                                                    >
                                                        {toggleEditReview ? 'Edit Review' : 'Review'}
                                                    </Text>
                                                    <form onSubmit={(e) => { e.preventDefault(); writeReview(novelId); }}>
                                                        <Text
                                                            color='secondary.600'
                                                            fontWeight='semibold'
                                                            m='0 25px 5px 25px'
                                                        >
                                                            Your Opinion
                                                        </Text>
                                                        <Flex justify='center' mb='10px'>
                                                            <Textarea
                                                                w='550px'
                                                                h='200px'
                                                                bg='secondary.100'
                                                                placeholder='What is your opinion about this fiction ?'
                                                                resize='none'
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                            />
                                                        </Flex>
                                                        <Flex justify='flex-start' align='center' m='0 0 50px 25px'>
                                                            <Text
                                                                color='secondary.600'
                                                                fontWeight='semibold'
                                                                mr='15px'
                                                            >
                                                                Rating this novel
                                                            </Text>
                                                            <Select
                                                                w='75px'
                                                                mr='5px'
                                                                bg='secondary.100'
                                                                border='none'
                                                                _focus={{ outline: 'none' }}
                                                                value={score}
                                                                onChange={(e) => setScore(e.target.value)}
                                                            >
                                                                {dropdownScore.map((item, i) => {
                                                                    return <option value={item} key={i}>{item}</option>;
                                                                })}
                                                            </Select>
                                                            <Text
                                                                color='secondary.600'
                                                                fontWeight='semibold'
                                                                fontSize='xl'
                                                            >
                                                                /5
                                                            </Text>
                                                        </Flex>
                                                        <Flex justify='center' align='center' m='0 25px 20px 25px'>
                                                            {!toggleEditReview &&
                                                                <Button
                                                                    w='100%'
                                                                    bg='primary.500'
                                                                    color='#fff'
                                                                    type='submit'
                                                                    _hover={{ bg: 'primary.600' }}
                                                                >
                                                                    Submit
                                                                </Button>}
                                                            {toggleEditReview &&
                                                                <Button
                                                                    w='100%'
                                                                    bg='primary.500'
                                                                    color='#fff'
                                                                    type='submit'
                                                                    _hover={{ bg: 'primary.600' }}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                        </Flex>
                                                    </form>
                                                </Box>
                                            </Box>
                                        }
                                    </Box>
                                }
                            </Box>
                        );
                    })}
                </Flex>
            </Box>
        </Flex>
    );
};

export default Home;