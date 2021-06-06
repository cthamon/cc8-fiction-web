import { Flex, Text, Button, Image, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverFooter, PopoverArrow } from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';
import Logo from './Logo';

function Navbar() {
    const token = localStorageService.getToken();
    const history = useHistory();

    const [user, setUser] = useState([]);
    const novelTypes = ['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Horror', 'Romantic', 'Science Fiction', 'Sport'];

    const MenuButton = ({ children, ...rest }) => {
        return (
            <Flex display='block' align='center' h='30px' {...rest}>
                <Text
                    align='left'
                    fontSize='m'
                    color='gray.600'
                    bg='white'
                    cursor='pointer'
                    _hover={{ color: 'green.500' }}
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
            borderColor='gray.200'
        >
            <Flex
                align='center'
                m='0 3%'
            >
                <Logo
                    fontSize='3xl'
                    fontWeight='bold'
                    color='green.500'
                    mr={8}
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
                            _hover={{ bg: 'gray.300' }}
                        >
                            <Text
                                display='block'
                                fontWeight='semibold'
                                color='gray.600'
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
                                        color='gray.600'
                                        bg='white'
                                        mr={2}
                                        // onClick={}
                                        _hover={{ color: 'green.500' }}
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
                    _hover={{ bg: 'gray.300' }}
                >
                    <Text
                        display='block'
                        fontWeight='semibold'
                        color='gray.600'
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
                                _hover={{ bg: 'gray.300' }}>
                                <Image
                                    borderRadius="full"
                                    boxSize="32px"
                                    src={user.profileImg}
                                    alt="Profile Picture"
                                />
                            </Flex>
                        </PopoverTrigger>
                        <PopoverContent w='250px'>
                            <PopoverArrow />
                            <PopoverHeader pt={4} pb={4}>
                                <Text color='green.500' fontSize='xl' fontWeight='bold'>{user.username}</Text>
                                <Text color='gray.600' fontSize='sm'>{user.email}</Text>
                            </PopoverHeader>
                            <PopoverBody>
                                <MenuButton>My Novel</MenuButton>
                                <MenuButton>Shelf</MenuButton>
                                <MenuButton>Read History</MenuButton>
                                <MenuButton>Order History</MenuButton>
                                <MenuButton>Edit Profile</MenuButton>
                            </PopoverBody>
                            <PopoverFooter>
                                <MenuButton onClick={() => { localStorageService.clearToken(); history.go(0); }}>Sign out</MenuButton>
                            </PopoverFooter>
                        </PopoverContent>
                    </Popover>}
                {!token && <Button
                    size='sm'
                    rounded='md'
                    color='green.500'
                    bg='white'
                    mr={2}
                    onClick={() => history.push('/login')}
                    _hover={{ bg: 'gray.300' }}
                >
                    Sign in
                </Button>}
                {!token && <Button
                    size='sm'
                    rounded='md'
                    color='white'
                    bg='green.500'
                    _hover={{ bg: 'green.600' }}
                >
                    Sign up
                </Button>}
            </Flex>
        </Flex >
    );
}

export default Navbar;