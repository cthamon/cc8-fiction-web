import Navbar from '../components/Navbar';
import Banner from '../components/Banner/Banner';
import { Flex, Box, Text, Image, Button, Divider } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';

function Home() {
    const [novels, setNovels] = useState([]);
    const [novel, setNovel] = useState([]);
    const [novelContent, setNovelContent] = useState([]);
    const [comment, setComment] = useState([]);
    const [toggleShow, setToggleShow] = useState(false);

    useEffect(() => {
        const fetchAllNovel = async () => {
            const res = await axios.get('http://localhost:8000/novel');
            setNovels(res.data.novels);
        };
        fetchAllNovel();
    }, []);

    const fetchNovel = async (id) => {
        const res = await axios.get(`http://localhost:8000/novel/${id}/`);
        setNovel(res.data.novel);
    };

    const fetchNovelContent = async (id) => {
        const res = await axios.get(`http://localhost:8000/novel/${id}/episode`);
        setNovelContent(res.data.episodes);
    };

    const fetchComment = async (novelId) => {
        const res = await axios.get(`http://localhost:8000/novel/rating/${novelId}`);
        setComment(res.data.novelRating);
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
                                onClick={() => {
                                    fetchNovel(item.id);
                                    fetchNovelContent(item.id);
                                    fetchComment(item.id);
                                }}
                            >
                                <Box
                                    w='160px'
                                    m='20px'
                                    onClick={() => setToggleShow(!toggleShow)}
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
                                {toggleShow &&
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
                                            bg='white'
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
                                                onClick={() => setToggleShow(false)}>
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
                                                                />
                                                                {' '}
                                                                <H3
                                                                    display='inline-block'
                                                                >
                                                                    {item.writer}
                                                                </H3>
                                                                <Text m='10px 0' fontWeight='semibold' color='secondary.600'>{item.novelType}</Text>
                                                                <Text fontWeight='semibold' color='secondary.700'>Description</Text>
                                                                <Text m='0 0 10px 0'>{item.description}</Text>
                                                                <Flex m='0 0 20px 0'>
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
                                                                <Button mr='5px' color='#fff' bg='primary.500' _hover={{ bg: 'primary.600' }} w='79.61px'>
                                                                    Read
                                                                </Button>
                                                                <Button color='#fff' bg='primary.500' _hover={{ bg: 'primary.600' }} w='79.61px'>
                                                                    Follow
                                                                </Button>
                                                            </Box>
                                                        </Flex>
                                                        <Divider mb='20px' />
                                                        {novelContent.map((item, j) => {
                                                            return (
                                                                <Box key={j}>
                                                                    <Flex
                                                                        justify='space-between'
                                                                        cursor='pointer'
                                                                        m='0 20px'
                                                                        bg='#fff'
                                                                    >
                                                                        <Text fontWeight='semibold'>Episode.{item.episodeNumber} : {item.episodeTitle} </Text>
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
                        );
                    })}
                </Flex>
            </Box>
        </Flex>
    );
}

export default Home;