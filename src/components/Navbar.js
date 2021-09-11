import { Flex, Box, Text, Button, Image, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverFooter, PopoverArrow, Divider, Input } from '@chakra-ui/react';
import { TriangleDownIcon, DeleteIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import axios from "axios";
import localStorageService from '../services/localStorageService';
import Logo from './Logo';
import { AuthContext } from '../contexts/AuthContextProvider';
import { ActivityContext } from '../contexts/ActivityContextProvider';

function Navbar() {
    const token = localStorageService.getToken();
    const history = useHistory();

    const { cartItem, setCartItem, setFilter, setSearch } = useContext(ActivityContext);
    const { user, setUser } = useContext(AuthContext);

    const [novelTypes, setNovelTypes] = useState([]);
    const [episode, setEpisode] = useState([]);
    const [toggleSearchBox, setToggleSearchBox] = useState(false);
    const [searchValue, setSearchValue] = useState('');

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
        const fetchNovelTypes = async () => {
            const res = await axios.get('http://localhost:8000/novel/novelTypes');
            setNovelTypes([...new Set(res.data.novelTypes)]);
        };
        const fetchAllEpisode = async (id) => {
            const res = await axios.get('http://localhost:8000/novel/episode');
            setEpisode(res.data.episodes);
        };

        fetchUser();
        fetchNovelTypes();
        fetchAllEpisode();
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
                                        onClick={() => setFilter(item)}
                                        _hover={{ color: 'primary.500' }}
                                    >
                                        {item}
                                    </Button>
                                );
                            })}
                            <Button
                                size='sm'
                                rounded='md'
                                color='secondary.600'
                                bg='white'
                                mr={2}
                                onClick={() => setFilter('')}
                                _hover={{ color: 'primary.500' }}
                            >
                                <CloseIcon w='10px' />
                            </Button>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                <Flex
                    h='100%'
                    m='0 auto'
                    justify='center'
                    align='center'
                    _hover={{ bg: 'secondary.300' }}
                >
                    {!toggleSearchBox &&
                        <Text
                            w='100px'
                            textAlign='center'
                            display='block'
                            fontWeight='semibold'
                            color='secondary.600'
                            cursor='pointer'
                            onClick={() => setToggleSearchBox(!toggleSearchBox)}
                        >
                            Search
                        </Text>}
                </Flex>
                {toggleSearchBox &&
                    <form onSubmit={(e) => { e.preventDefault(); setSearch(searchValue); setSearchValue(''); }}>
                        <Input

                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                        />
                        <CloseIcon w='10px' position='absolute' m='0 5px' cursor='pointer' onClick={() => { setToggleSearchBox(!toggleSearchBox); setSearch(''); }} />
                    </form>
                }
            </Flex>
            <Flex align='center'>
                <Popover
                    trigger={'hover'}
                    placement={'bottom'}
                >
                    <PopoverTrigger>
                        <Image
                            m='0 8px'
                            boxSize='16px'
                            src='https://image.flaticon.com/icons/png/128/879/879764.png'
                            alt='Cart'
                            cursor='pointer'
                        />
                    </PopoverTrigger>
                    {cartItem.length === 0 ? '' :
                        <Box
                            position='relative'
                            right='13px'
                            bottom='8px'
                            mr='-12.5px'
                            w='12.5px'
                            h='12.5px'
                            bg='primary.500'
                            align='center'
                            rounded='full'
                            color='#fff'
                            fontSize='xx-small'
                        >
                            {cartItem.length}
                        </Box>}
                    {cartItem.length === 0 ? '' :
                        <PopoverContent mt='10px'>
                            <PopoverArrow />
                            <PopoverBody>
                                {episode.filter(val => cartItem.includes(val.id)).map((item, i) =>
                                    <Box key={i} m='10px'>
                                        <Flex justify='space-between'>
                                            <Text fontSize='sm' fontWeight='semibold' w='75%'>{item.price === 0 ? item.title + ' (All episode)' : item.episodeTitle}</Text>
                                            <Flex align='flex-end' flexDirection='column'>
                                                <Text fontSize='sm' fontWeight='semibold'>THB {item.price === 0 ? item.novelPrice : item.price}</Text>
                                                <DeleteIcon w='12px' color='red.500' cursor='pointer' onClick={() => setCartItem(cartItem.filter(val => val !== item.id))} />
                                            </Flex>
                                        </Flex>
                                        <Text fontSize='sm'>{item.price === 0 ? '' : item.title}</Text>
                                        <Divider mt='10px' />
                                    </Box>
                                )}
                                <Flex justify='space-between' m='10px'>
                                    <Text fontWeight='semibold'>Total</Text>
                                    <Text fontWeight='semibold' color='primary.500'>
                                        THB {episode.filter(val => cartItem.includes(val.id)).reduce((acc, cv) => cv.price + cv.novelPrice + acc, 0)}
                                    </Text>
                                </Flex>
                                <Button w='100%' color='#fff' bg='primary.500' _hover={{ bg: 'primary.600' }} onClick={() => { if (cartItem.length !== 0) { if (!token) { history.push('/login'); } else if (token) { history.push('/checkout'); } } }}> Checkout </Button>
                            </PopoverBody>
                        </PopoverContent>}
                </Popover>
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
                                <MenuButton onClick={() => history.push('/follow')}>Following</MenuButton>
                                <MenuButton onClick={() => history.push('/history')}>Read History</MenuButton>
                                <MenuButton onClick={() => history.push('/orderhistory')}>Order History</MenuButton>
                                <MenuButton onClick={() => history.push('/editprofile')}>Edit Profile</MenuButton>
                            </PopoverBody>
                            <PopoverFooter>
                                <MenuButton onClick={() => { localStorageService.clearToken(); setCartItem([]); history.push('/'); }}>Sign out</MenuButton>
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