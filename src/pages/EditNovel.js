import Navbar from '../components/Navbar';
import { Box, Flex, Stack, Text, Textarea, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';

function EditNovel() {
    const token = localStorageService.getToken();
    const history = useHistory();
    const { novelId, setNovelId, episodeId, setEpisodeId } = useContext(ActivityContext);

    const [input, setInput] = useState({
        title: '',
        description: '',
        novelType: '',
        price: '',
    });

    const [error, setError] = useState({});

    const [file, setFile] = useState(null);

    let coverImage;

    useEffect(() => {
        const fetchAllNovel = async () => {
            const res = await axios.get(`http://localhost:8000/novel/${novelId}`);
            setInput(prev => ({
                ...prev,
                title: res.data.novel[0].title,
                description: res.data.novel[0].description,
                novelType: res.data.novel[0].novelType,
                price: res.data.novel[0].price
            }));
            fetch(res.data.novel[0].cover)
                .then(res => res.blob())
                .then(blob => {
                    setFile(new File([blob], "Profile Image", { type: "image/png" }));
                });
        };
        fetchAllNovel();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        if (!input.price) {
            input.price = 0;
        }
        const { title, description, novelType, price } = input;
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('novelType', novelType);
        formData.append('price', price);
        formData.append('image', file);
        axios.patch(`http://localhost:8000/novel/edit/${novelId}`, formData, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(() => { history.push('/ninfo'); })
            .catch(err => {
                if (err.response) {
                    setError({ server: err.response.data.message });
                } else {
                    setError({ front: err.message });
                }
            });
    };

    if (file) {
        coverImage = URL.createObjectURL(file);
    }

    return (
        <Flex
            direction='column'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <Box
                m='20px 0'
            >
                <Text
                    fontSize='2xl'
                    fontWeight='semibold'
                    color='secondary.600'
                >
                    Create Novel
                </Text>
            </Box>
            <form onSubmit={handleSubmit}>
                <Flex
                    justify='space-between'
                >
                    <Box w='21%'>
                        <FormControl>
                            <FormLabel
                                w='100%'
                                h='350px'
                                display='inline-block'
                                cursor='pointer'
                                borderRadius='xl'
                                bg='secondary.100'
                                p='3px'
                            >
                                <Box
                                    backgroundImage={coverImage}
                                    backgroundSize='cover'
                                    backgroundPosition='center'
                                    rounded='xl'
                                    h='100%'
                                >
                                    {
                                        coverImage ? '' : ''
                                            ||
                                            <Flex
                                                justify='center'
                                                align='center'
                                                h='100%'
                                            >
                                                <Box align='center'>
                                                    <Text color='secondary.400' fontWeight='normal'>Click to upload</Text>
                                                    <Text color='secondary.400' fontWeight='normal'>Cover</Text>
                                                </Box>
                                            </Flex>
                                    }
                                </Box>
                            </FormLabel>
                            <Input
                                display='none'
                                type='file'
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </FormControl>
                    </Box>
                    <Stack
                        minW='78%'
                    >
                        <FormControl isRequired>
                            <FormLabel>Title</FormLabel>
                            <Input
                                type='text'
                                name='title'
                                placeholder="Novel's Title"
                                value={input.title}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <Flex>
                            <FormControl isRequired w='30%' mr='5px'>
                                <FormLabel>Novel's Type</FormLabel>
                                <Input
                                    type='text'
                                    name='novelType'
                                    placeholder="Novel's Type"
                                    value={input.novelType}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                            <FormControl w='15%'>
                                <FormLabel>Price</FormLabel>
                                <Input
                                    type='text'
                                    name='price'
                                    placeholder='Price (if any)'
                                    value={input.price}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </Flex>
                        <FormControl isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                minH='150px'
                                type='text'
                                name='description'
                                placeholder='Description / Introduction'
                                value={input.description}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Stack>
                </Flex>
                <Box align='center'>
                    <Button
                        rounded='md'
                        color='white'
                        bg='yellow.500'
                        type='submit'
                        w='126px'
                        mr='3px'
                        _hover={{ bg: 'yellow.600' }}
                    >
                        Edit Novel
                    </Button>
                    <Button
                        rounded='md'
                        color='white'
                        bg='red.600'
                        w='126px'
                        onClick={() => history.push('/ninfo')}
                        _hover={{ bg: 'red.700' }}
                    >
                        Back
                    </Button>
                </Box>
            </form>
        </Flex >
    );
}

export default EditNovel;