import { Box, Flex, Link, Stack, Text, Select, FormControl, FormLabel, FormHelperText, InputGroup, Input, InputRightElement, Button } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import axios from '../config/axios';
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';

function Login() {
    const { cartItem } = useContext(ActivityContext);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const [show, setShow] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const history = useHistory();

    const validateInput = () => {
        const newError = {};
        if (!email) newError.email = 'email is required';
        if (!password) newError.password = 'password is required';
        setError(newError);
    };

    console.log(cartItem);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            validateInput();
            const res = await axios.post('/user/login', { email, username, password });
            localStorageService.setToken(res.data.token);
            if (cartItem.length !== 0) {
                return history.push('/checkout');
            }
            history.push('/');
        } catch (err) {
            console.dir(err);
            setError(prev => ({ ...prev, login: err.response.data.message }));
        };
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
                <Box
                    m='0 auto'
                    p='40px'
                    minW='440px'
                    minH='338px'
                    backgroundColor='rgba(255,255,255,95%)'
                    boxShadow='0 2px 3px rgba(0,0,0,55%)'
                >
                    <form onSubmit={handleSubmit}>
                        <Stack>
                            <Select
                                size='none'
                                fontWeight='semibold'
                                w='30%'
                                onChange={() => setShow(!show)}
                            >
                                <option>Email</option>
                                <option>Username</option>
                            </Select>
                            {show && <Box>
                                <FormControl>
                                    <Input
                                        type='text'
                                        placeholder='Email'
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </FormControl>
                                {error.email && (
                                    <Text
                                        pl='17px'
                                        color='red'
                                    >
                                        {error.email}
                                    </Text>
                                )}
                            </Box>}
                            {!show && <Box>
                                <FormControl>
                                    <Input
                                        type='text'
                                        placeholder='Username'
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </FormControl>
                            </Box>}
                            <Box>
                                <FormControl>
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup size='md'>
                                        <Input
                                            pr='1rem'
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Password'
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                        <InputRightElement w='4.5rem'>
                                            <Button
                                                h='1.75rem'
                                                size='sm'
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                    {error.password && (
                                        <Text
                                            pl='17px'
                                            color='red'
                                        >
                                            {error.password}
                                        </Text>
                                    )}
                                    <FormHelperText textAlign="right">
                                        <Link>forgot password?</Link>
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                            <Box h='30px' />
                            <Button
                                rounded='md'
                                color='white'
                                bg='primary.500'
                                type='submit'
                                _hover={{ bg: 'primary.600' }}
                            >
                                Log in
                            </Button>
                            {error.login && (
                                <Text
                                    pl='17px'
                                    color='red'
                                    align='center'
                                >
                                    {error.login}
                                </Text>
                            )}
                            <Text
                                fontSize='sm'
                                align='center'
                            >
                                No account?{' '}
                                <Link
                                    color='blue.400'
                                    onClick={() => history.push('/register')}
                                >
                                    Sign up!
                                </Link>
                            </Text>
                        </Stack>
                    </form>
                </Box>
            </Flex>
        </Flex>
    );
}

export default Login;