import { Box, Flex, Stack, Textarea, FormControl, FormLabel, FormErrorMessage, Input, Button, Image } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import localStorageService from '../services/localStorageService';
import defaultProfile from '../components/profile.png';

function Register() {
    const history = useHistory();

    const [input, setInput] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        description: '',
        address: '',
        phoneNumber: ''
    });

    const [file, setFile] = useState(null);
    const [error, setError] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));

        if (name === 'email') {
            if (!value) {
                setError(prev => ({ ...prev, [name]: `${name[0].toUpperCase() + name.slice(1)} is required` }));
            } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
                setError(prev => ({ ...prev, [name]: 'Invalid email address' }));
            } else {
                setError(prev => ({ ...prev, [name]: false }));
            }
        }
        if (name === 'username') {
            if (!value) {
                setError(prev => ({ ...prev, [name]: `${name[0].toUpperCase() + name.slice(1)} is required` }));
            } else {
                setError(prev => ({ ...prev, [name]: false }));
            }
        }
        if (name === 'password') {
            if (!value) {
                setError(prev => ({ ...prev, [name]: `${name[0].toUpperCase() + name.slice(1)} is required` }));
            } else if (value.length < 8) {
                setError(prev => ({ ...prev, [name]: `password must be at least 8 characters` }));
            } else if (value.length >= 8) {
                setError(prev => ({ ...prev, [name]: false }));
            } else if (input.confirmPassword !== value) {
                setError(prev => ({ ...prev, confirmPassword: `Password did not match` }));
            } else if (input.confirmPassword === value) {
                setError(prev => ({ ...prev, confirmPassword: false }));
            } else {
                setError(prev => ({ ...prev, [name]: false }));
            }
        }
        if (name === 'confirmPassword') {
            if (input.password !== value) {
                setError(prev => ({ ...prev, [name]: `Password did not match` }));
            } else {
                setError(prev => ({ ...prev, [name]: false }));
            }
        }
        if (name === 'phoneNumber') {
            if (value.length < 10) {
                setError(prev => ({ ...prev, [name]: `Invalid phone number` }));
            } else if (value.length >= 10) {
                setError(prev => ({ ...prev, [name]: false }));
            } else {
                setError(prev => ({ ...prev, [name]: false }));
            }
        }
    };

    let profileImage;

    useEffect(() => {
        if (!file) {
            fetch(defaultProfile)
                .then(res => res.blob())
                .then(blob => {
                    setFile(new File([blob], "Profile Image", { type: "image/png" }));
                });
        }
    }, []);

    if (file) {
        profileImage = URL.createObjectURL(file);
    }

    const handleSubmit = (e) => {
        const { email, username, password, confirmPassword, description, address, phoneNumber } = input;
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        formData.append('description', description);
        formData.append('address', address);
        formData.append('phoneNumber', phoneNumber);
        formData.append('image', file);
        axios.post('http://localhost:8000/user/register', formData)
            .then(res => {
                localStorageService.setToken(res.data.token);
                history.push('/');
            })
            .catch(err => {
                if (err.response) {
                    setError({ server: err.response.data.message });
                } else {
                    setError({ front: err.message });
                }
            });
    };

    return (
        <Flex
            flexDir='column'
            height='100vh'
            width='100wh'
            justify='center'
            align='center'
        >
            <Flex
                flexDir='column'
                mb='2'
                justify='center'
                align='center'
            >
                <Flex
                    justify='center'
                    align='center'
                >
                    <Box
                        m='0 auto'
                        p='40px'
                        minW='440px'
                        minH='696px'
                        backgroundColor='rgba(255,255,255,95%)'
                        boxShadow='0px 0px 3px 1px rgba(0,0,0,55%)'
                    >
                        <form onSubmit={handleSubmit}>
                            <Stack>
                                <FormControl isRequired isInvalid={error.email}>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type='text'
                                        name='email'
                                        placeholder='Email'
                                        value={input.email}
                                        onChange={handleInputChange}
                                    />
                                    <FormErrorMessage>{error.email}</FormErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={error.username}>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        type='text'
                                        name='username'
                                        placeholder='Username'
                                        value={input.username}
                                        onChange={handleInputChange}
                                    />
                                    <FormErrorMessage>{error.username}</FormErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={error.password}>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type='password'
                                        name='password'
                                        placeholder='Password'
                                        value={input.password}
                                        onChange={handleInputChange}
                                    />
                                    <FormErrorMessage>{error.password}</FormErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={error.confirmPassword}>
                                    <FormLabel>Confirm password</FormLabel>
                                    <Input
                                        type='password'
                                        name='confirmPassword'
                                        placeholder='Confirm password'
                                        value={input.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                    <FormErrorMessage>{error.confirmPassword}</FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        name='description'
                                        placeholder='Describe yourself...'
                                        value={input.description}
                                        onChange={handleInputChange}
                                    />
                                </FormControl>
                                <FormControl isRequired isInvalid={error.address}>
                                    <FormLabel>Address</FormLabel>
                                    <Input
                                        type='text'
                                        name='address'
                                        placeholder='Address'
                                        value={input.address}
                                        onChange={handleInputChange}
                                    />
                                    <FormErrorMessage>{error.address}</FormErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={error.phoneNumber}>
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input
                                        type='text'
                                        name='phoneNumber'
                                        placeholder='0910125678'
                                        value={input.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                    <FormErrorMessage>{error.phoneNumber}</FormErrorMessage>
                                </FormControl>

                                <Box>
                                    <FormControl>
                                        <FormLabel>Profile Picture</FormLabel>
                                        <Flex
                                            justify='center'
                                            align='center'
                                            w='100%'
                                        >
                                            <FormLabel
                                                display='inline-block'
                                                cursor='pointer'
                                                borderRadius='full'
                                                bg='secondary.100'
                                                p='3px'
                                            >
                                                <Box
                                                    w='135px'
                                                    h='135px'
                                                    borderRadius='full'
                                                    bg='#fff'
                                                    _hover={{ bg: 'secondary.100' }}
                                                >
                                                    <Image
                                                        borderRadius='full'
                                                        boxSize='135px'
                                                        src={profileImage}
                                                        alt="Profile Picture"
                                                    />
                                                </Box>
                                            </FormLabel>
                                        </Flex>
                                        <Input
                                            display='none'
                                            type='file'
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                    </FormControl>
                                </Box>
                                <Button
                                    rounded='md'
                                    color='white'
                                    bg='primary.500'
                                    type='submit'
                                    _hover={{ bg: 'primary.600' }}
                                >
                                    Register
                                </Button>
                            </Stack>
                        </form>
                    </Box>
                </Flex>
            </Flex>
        </Flex >
    );
}

export default Register;