import Navbar from '../components/Navbar';
import { Flex, Box, Text, Image, Button, Divider, Textarea } from '@chakra-ui/react';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import axios from "../config/axios";
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';
import { AuthContext } from '../contexts/AuthContextProvider';

function Read() {
    const token = localStorageService.getToken();
    const history = useHistory();
    const { novelId, episodeId, setEpisodeId } = useContext(ActivityContext);
    const { user } = useContext(AuthContext);

    if (!episodeId) {
        history.push('/');
    }

    const [novelContent, setNovelContent] = useState([]);

    const [episode, setEpisode] = useState([]);
    const [paragraph, setParagraph] = useState([]);
    const [comment, setComment] = useState([]);
    const [comments, setComments] = useState([]);
    const [toggleEditBox, setToggleEditBox] = useState(false);
    const [commentEdit, setCommentEdit] = useState([]);

    const fetchNovelContent = async () => {
        const res = await axios.get(`/novel/${novelId}/episode`);
        setNovelContent(res.data.episodes);
    };

    const fetchEpisode = async (episodeId) => {
        const res = await axios.get(`/novel/paragraph/${episodeId}`);
        setEpisode(res.data);
        setParagraph(res.data.paragraph);
    };

    let episodeTitle = '';
    if (novelContent.length !== 0) {
        const episodeIndex = novelContent.findIndex(item => item.id === episode.episodeId);
        if (episodeIndex === novelContent.length - 1) {
            episodeTitle = '';
        } else if (episodeIndex !== -1) {
            episodeTitle = novelContent.[episodeIndex + 1].episodeTitle;
        }
    }

    const fetchComment = async (episodeId) => {
        await axios.get(`/novel/comment/${episodeId}`)
            .then(res => setComments(res.data.userComment));
    };

    const submitComment = async () => {
        await axios.post(`/novel/comment/${episodeId}`, { comment }, { headers: { 'Authorization': `Bearer ${token}` } });
        setComment('');
        fetchComment(episodeId);
    };

    const editComment = async (id) => {
        await axios.patch(`/novel/updatecomment/${id}`, { comment: commentEdit }, { headers: { 'Authorization': `Bearer ${token}` } });
        setComment('');
        fetchComment(episodeId);
        setToggleEditBox(!toggleEditBox);
    };

    const deleteComment = async (id) => {
        await axios.delete(`/novel/comment/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        fetchComment(episodeId);
    };

    const readRecord = async (episodeId) => {
        await axios.post(`/user/read/${episodeId}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
    };

    useEffect(() => {
        fetchEpisode(episodeId);
        fetchNovelContent();
        fetchComment(episodeId);
        readRecord(episodeId);
    }, []);

    return (
        <Box
            bg='gray.100'
            w='100vw'
            minH='100vh'
        >
            <Flex
                direction='column'
                maxW='1200px'
                m='0 auto'
                bg='#fff'
            >
                <Navbar />
                <Box>
                    <Flex m={['10px 0', '10px 0', '30px 0', '50px 0']} justify='center'>
                        <Text
                            fontSize='2xl'
                            fontWeight='semibold'
                        >
                            Episode {episode.episodeNumber} : {episode.episodeTitle}
                        </Text>
                    </Flex>
                    {paragraph.map((item, i) => {
                        return (
                            <Box key={i} m='0 90px'>
                                <Text fontSize={['sm', 'sm', 'lg', 'lg']} m='10px 0' textAlign='left' fontWeight='light' style={{ textIndent: '50px' }}>{item.paragraph}</Text>
                            </Box>
                        );
                    })}
                    <Flex m='20px 0' justify='center'>
                        <Divider m='0 90px' />
                    </Flex>
                    <Box m='20px 140px' >
                        {episodeTitle && <Text fontWeight='semibold' color='secondary.600'>Next Episode</Text>}
                        <Flex justify='space-between' align='center'>
                            <Text fontWeight='semibold' fontSize='xl' color='secondary.700' >{episodeTitle}</Text>
                            <Box>
                                {episode.episodeNumber !== 1 && <Button
                                    color='#fff'
                                    bg='red.500'
                                    mr='5px'
                                    _hover={{ bg: 'red.600' }}
                                    onClick={() => {
                                        const episodeIndex = novelContent.findIndex(item => item.id === episode.episodeId);
                                        fetchEpisode(novelContent[episodeIndex - 1].id);
                                        setEpisodeId(novelContent[episodeIndex - 1].id);
                                        fetchComment(novelContent[episodeIndex - 1].id);
                                        readRecord(novelContent[episodeIndex - 1].id);
                                    }}
                                >
                                    <ArrowBackIcon mr='5px' /> Previous Episode
                                </Button>}
                                {episodeTitle && <Button
                                    color='#fff'
                                    bg='primary.500'
                                    _hover={{ bg: 'primary.600' }}
                                    onClick={() => {
                                        const episodeIndex = novelContent.findIndex(item => item.id === episode.episodeId);
                                        fetchEpisode(novelContent[episodeIndex + 1].id);
                                        setEpisodeId(novelContent[episodeIndex + 1].id);
                                        fetchComment(novelContent[episodeIndex + 1].id);
                                        readRecord(novelContent[episodeIndex + 1].id);
                                    }}
                                >
                                    Continue Reading <ArrowForwardIcon ml='5px' />
                                </Button>}
                            </Box>
                        </Flex>
                    </Box>
                </Box>
            </Flex>
            <Box
                maxW={{ xl: '1200px' }}
                m='20px auto 0 auto'
                bg='#fff'
            >
                <Box p='20px'>
                    <Text
                        fontSize='xl'
                        fontWeight='semibold'
                        textAlign='center'
                        color='secondary.700'
                    >
                        Comment
                    </Text>
                    <Flex mt='20px'>
                        <form onSubmit={(e) => { e.preventDefault(); submitComment(); }}>
                            <Flex m='0 100px' w='80%'>
                                <Textarea
                                    w={['300px', '300px', '500px', '900px']}
                                    minH='30px'
                                    overflow='hidden'
                                    placeholder='Write a comment...'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <Button
                                    type='submit'
                                    color='#fff'
                                    bg='primary.500'
                                    _hover={{ bg: 'primary.600' }}
                                >
                                    Comment
                                </Button>
                            </Flex>
                        </form>
                    </Flex>
                    <Flex m='20px 0' justify='center'>
                        <Divider m='0 90px' />
                    </Flex>
                    {comments.map((item, i) => {
                        return (
                            <Box key={i}>
                                <Flex m='20px 120px 0 120px' >
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
                                        <Text fontWeight='semibold' color='primary.500'>{item.User.username}</Text>
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
                                                        onClick={async () => {
                                                            setCommentEdit(comments[comments.findIndex(comment => item.id === comment.id)].comment);
                                                            setToggleEditBox(!toggleEditBox);
                                                        }}
                                                    >
                                                        Edit
                                                    </Text>
                                                    {toggleEditBox &&
                                                        <form onSubmit={(e) => { e.preventDefault(); editComment(item.id); }}
                                                            onKeyDown={(e) => {
                                                                if (e.keyCode === 27) {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    setToggleEditBox(!toggleEditBox);
                                                                }
                                                            }}>
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
                                                                    w='900px'
                                                                    bg='secondary.100'
                                                                    rounded='xl'
                                                                    boxShadow='rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'
                                                                >
                                                                    <Textarea
                                                                        type='text'
                                                                        border='none'
                                                                        minH='300px'
                                                                        _focus={{ outline: 'none' }}
                                                                        value={commentEdit}
                                                                        onChange={(e) => setCommentEdit(e.target.value)}
                                                                        autoFocus
                                                                        onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                                                                    />
                                                                    <Text
                                                                        fontWeight='bold'
                                                                        color='yellow.500'
                                                                        display='inline-block'
                                                                        ml='10px'
                                                                        mr='5px'
                                                                        cursor='pointer'
                                                                        onClick={() => editComment(item.id)}
                                                                    >
                                                                        Edit
                                                                    </Text>
                                                                    <Text
                                                                        fontWeight='bold'
                                                                        color='red.500'
                                                                        display='inline-block'
                                                                        mr='5px'
                                                                        cursor='pointer'
                                                                        onClick={() => {
                                                                            setComment('');
                                                                            setToggleEditBox(!toggleEditBox);
                                                                        }}
                                                                    >
                                                                        Cancle
                                                                    </Text>
                                                                </Box>
                                                            </Box>
                                                        </form>
                                                    }
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
                                                        onClick={() => deleteComment(item.id)}
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
        </Box >
    );
}

export default Read;