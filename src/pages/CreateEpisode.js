import Navbar from '../components/Navbar';
import { Box, Flex, Text, Textarea, Input, Button } from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';

function CreateEpisode() {
    const token = localStorageService.getToken();
    const history = useHistory();
    const { novelId } = useContext(ActivityContext);

    const [novel, setNovel] = useState([]);
    const [episode, setEpisode] = useState([]);
    const [error, setError] = useState([]);

    const [episodeTitle, setEpisodeTitle] = useState([]);
    const [price, setPrice] = useState(0);
    const [content, setContent] = useState('');
    const episodeNumber = episode.length + 1;

    useEffect(() => {
        const fetchNovel = async () => {
            const res = await axios.get(`http://localhost:8000/novel/${novelId}`);
            if (res.data.novel[0].price === 0) {
                setNovel(true);
            } else {
                setNovel(false);
            }
        };
        const fetchEpisode = async () => {
            const res = await axios.get(`http://localhost:8000/novel/${novelId}/episode`);
            setEpisode(res.data.episodes);
        };
        fetchNovel();
        fetchEpisode();
    }, []);

    let paragraph = content.split(/\r?\n/);

    const handleSubmit = (e) => {
        axios.post(`http://localhost:8000/novel/createcontent/${novelId}`, { episodeNumber, episodeTitle, price, paragraph }, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => {
                history.push('/ninfo');
            })
            .catch(err => {
                if (err.response) {
                    setError({ server: err.response.data.message });
                } else {
                    setError({ front: err.message });
                }
            });
    };

    if (error) {
        console.log(error);
    }

    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <Flex
                mt='20px'
                p='20px'
                w='100%'
                bg='primary.100'
                justify='space-between'
                align='center'
            >
                <Flex
                    w='80%'
                >
                    <Text
                        w='21%'
                        fontSize='2xl'
                        fontWeight='semibold'
                        color='secondary.600'
                    >
                        {`Episode ${episodeNumber} :`}
                    </Text>
                    <Input
                        p='0'
                        m='0 5px 0 0'
                        type='text'
                        placeholder="Episode's name"
                        fontSize='2xl'
                        border='none'
                        rounded='none'
                        color='secondary.600'
                        borderBottom='0.5px solid #A0AEC0'
                        value={episodeTitle}
                        onChange={(e) => setEpisodeTitle(e.target.value)}
                        _focus={{ outline: 'none' }}
                    />
                    {novel &&
                        < Input
                            w='8%'
                            p='0'
                            m='0'
                            type='text'
                            placeholder="Price"
                            border='none'
                            rounded='none'
                            color='secondary.600'
                            borderBottom='0.5px solid #A0AEC0'
                            textAlign='center'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            _focus={{ outline: 'none' }}
                        />
                    }
                </Flex>
                <Box>
                    <Button
                        color='white'
                        bg='primary.500'
                        _hover={{ bg: 'primary.600' }}
                        onClick={() => handleSubmit()}
                        mr='5px'
                    >
                        Save
                    </Button>
                    <Button
                        color='white'
                        bg='red.600'
                        _hover={{ bg: 'red.700' }}
                        onClick={() => history.push('/ninfo')}
                    >
                        Back
                    </Button>
                </Box>
            </Flex>
            <Textarea
                p='0 20px'
                m='20px 0'
                type='text'
                placeholder="Episode's content"
                fontSize='2xl'
                border='none'
                rounded='none'
                color='secondary.600'
                minH='70vh'
                resize='none'
                textAlign='justify'
                borderBottom='0.5px solid #A0AEC0'
                value={content}
                _focus={{ outline: 'none' }}
                onChange={(e) => setContent(e.target.value)}
            />
        </Flex>
    );
}

export default CreateEpisode;