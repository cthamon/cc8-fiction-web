import Navbar from '../components/Navbar';
import { Box, Flex, Stack, Text, Textarea, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import axios from "../config/axios";
import localStorageService from '../services/localStorageService';

function CreateNovel() {
    const token = localStorageService.getToken();
    const history = useHistory();

    const [input, setInput] = useState({
        title: '',
        description: '',
        novelType: '',
        price: '',
    });
    const [error, setError] = useState({});

    const [file, setFile] = useState(null);

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
        axios.post('/novel/create', formData, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(() => { history.push('/m'); history.go(0); })
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

    let coverImage;
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
                    display={['block', 'block', 'flex', 'flex']}
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
                                    w={['246px', '246px', 'auto', 'auto']}
                                    h='100%'
                                >
                                    {
                                        coverImage ? '' : ''
                                            ||
                                            <Flex
                                                justify={['flex-start', 'flex-start', 'center', 'center']}
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
                                <FormLabel display='inline-block'>Price *
                                    <Text display='inline-block' position='absolute' w='300%' pl='5px' fontSize='x-small'>(If Novel is priced, each Episode can't be priced)</Text>
                                    {/* <Box display='inline-block' w='300%' h='150%' position='absolute' p='0 0 -100px -50px' m='0 0 -100px -40px'><Text pl='50px' color='#fff' _hover={{ color: 'black' }}>(If Novel is priced, each Episode can't be priced)</Text></Box> */}
                                </FormLabel>
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
                        bg='primary.500'
                        type='submit'
                        w='126px'
                        mr='3px'
                        _hover={{ bg: 'primary.600' }}
                    >
                        Create Novel
                    </Button>
                    <Button
                        rounded='md'
                        color='white'
                        bg='red.600'
                        w='126px'
                        onClick={() => { history.push('/m'); }}
                        _hover={{ bg: 'red.700' }}
                    >
                        Back
                    </Button>
                </Box>
            </form >
        </Flex >
    );
}

export default CreateNovel;