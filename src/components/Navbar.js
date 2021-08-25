import { Flex, Text, Button, Image, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverFooter, PopoverArrow } from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';
import Logo from './Logo';
import { AuthContext } from '../contexts/AuthContextProvider';

function Navbar() {
    const token = localStorageService.getToken();
    const history = useHistory();

    const { user, setUser } = useContext(AuthContext);
    const novelTypes = ['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Horror', 'Romantic', 'Science Fiction', 'Sport'];

    const MenuButton = ({ children, ...rest }) => {
        return (
            <Flex display='block' align='center' h='30px' {...rest}>
                <Text
                    align='left'
                    fontSize='m'
                    color='secondary.600'
                    bg='white'
                    cursor='pointer'
                    _hover={{ color: 'primary.500' }}
                >
                    {children}
                </Text>
            </Flex>
        );
    };

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get('http://localhost:8000/user/me', { headers: { 'Authorization': `Bearer ${token}` } });
            setUser(res.data.user);
        };
        fetchUser();
    }, []);

    // 480,768,992 {["white", "white", "primary.500", "primary.500"]}

    return (
        <Flex
            justify='space-between'
            w='100%'
            p='1% 3%'
            borderBottom='1px'
            borderColor='secondary.200'
            bg='#fff'
        >
            <Flex
                align='center'
                m='0 3%'
            >
                <Logo
                    fontSize='3xl'
                    fontWeight='bold'
                    color='primary.500'
                    mr={8}
                    onClick={() => { history.push('/'); }}
                />
                <Popover
                    trigger={'hover'}
                    placement={'bottom-start'}
                >
                    <PopoverTrigger>
                        <Flex
                            h='100%'
                            w='100px'
                            m='0 auto'
                            justify='center'
                            align='center'
                            _hover={{ bg: 'secondary.300' }}
                        >
                            <Text
                                display='block'
                                fontWeight='semibold'
                                color='secondary.600'
                                cursor='pointer'
                            >
                                Types <TriangleDownIcon />
                            </Text>
                        </Flex>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                            {novelTypes.map((item, i) => {
                                return (
                                    <Button
                                        key={i}
                                        size='sm'
                                        rounded='md'
                                        color='secondary.600'
                                        bg='white'
                                        mr={2}
                                        // onClick={}
                                        _hover={{ color: 'primary.500' }}
                                    >
                                        {item}
                                    </Button>
                                );
                            })}
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                <Flex
                    h='100%'
                    w='100px'
                    m='0 auto'
                    justify='center'
                    align='center'
                    onClick={() => history.push('/search')}
                    _hover={{ bg: 'secondary.300' }}
                >
                    <Text
                        display='block'
                        fontWeight='semibold'
                        color='secondary.600'
                        cursor='pointer'
                    >
                        Search
                    </Text>
                </Flex>
            </Flex>
            <Flex align='center'>
                <Image
                    m='0 8px'
                    boxSize='16px'
                    src='https://image.flaticon.com/icons/png/128/879/879764.png'
                    alt='Cart'
                    cursor='pointer'
                />
                {token &&
                    <Popover
                        trigger={'hover'}
                        placement={'bottom-end'}
                    >
                        <PopoverTrigger>
                            <Flex
                                w='60px'
                                h='100%'
                                justify='center'
                                align='center'
                                _hover={{ bg: 'secondary.300' }}>
                                <Image
                                    borderRadius='full'
                                    boxSize='32px'
                                    src={user.profileImg}
                                    alt="Profile Picture"
                                />
                            </Flex>
                        </PopoverTrigger>
                        <PopoverContent w='250px'>
                            <PopoverArrow />
                            <PopoverHeader pt={4} pb={4} onClick={() => history.push('/editprofile')} cursor='pointer'>
                                <Text color='primary.500' fontSize='xl' fontWeight='bold'> {user.username}</Text>
                                <Text color='secondary.600' fontSize='sm'>{user.email}</Text>
                            </PopoverHeader>
                            <PopoverBody>
                                <MenuButton onClick={() => history.push('/m')}>My Novel</MenuButton>
                                <MenuButton onClick={() => history.push('/follow')}> Following</MenuButton>
                                <MenuButton onClick={() => history.push('/history')}>Read History</MenuButton>
                                <MenuButton>Order History</MenuButton>
                                <MenuButton onClick={() => history.push('/editprofile')}>Edit Profile</MenuButton>
                            </PopoverBody>
                            <PopoverFooter>
                                <MenuButton onClick={() => { localStorageService.clearToken(); history.go(0); }}>Sign out</MenuButton>
                            </PopoverFooter>
                        </PopoverContent>
                    </Popover>}
                {!token && <Button
                    size='sm'
                    rounded='md'
                    color='primary.500'
                    bg='white'
                    mr={2}
                    onClick={() => history.push('/login')}
                    _hover={{ bg: 'secondary.300' }}
                >
                    Sign in
                </Button>}
                {!token && <Button
                    size='sm'
                    rounded='md'
                    color='white'
                    bg='primary.500'
                    onClick={() => history.push('/register')}
                    _hover={{ bg: 'primary.600' }}
                >
                    Sign up
                </Button>}
            </Flex>
        </Flex >
    );
}

export default Navbar;