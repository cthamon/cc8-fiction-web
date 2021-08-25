import Navbar from '../components/Navbar';
import { Box, Flex, Stack, Text, Textarea, FormControl, FormLabel, Input, Button, Image, AlertDialog, AlertDialogContent, AlertDialogBody } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useState, useEffect, useContext, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import axios from 'axios';
import localStorageService from '../services/localStorageService';

function EditProfile() {
    const token = localStorageService.getToken();
    const history = useHistory();

    const [userInfo, setUserInfo] = useState([]);
    const [displayImage, setDisplayImage] = useState('');
    const [input, setInput] = useState({
        currentPassword: '',
        description: '',
        address: '',
        phoneNumber: ''
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [promptPw, setPromptPw] = useState(false);
    const [error, setError] = useState({});
    const addressInput = useRef(null);
    const phoneInput = useRef(null);
    const descriptionInput = useRef(null);

    const fetchUser = async () => {
        const res = await axios.get('http://localhost:8000/user/me', { headers: { 'Authorization': `Bearer ${token}` } });
        setUserInfo(res.data.user);
        setDisplayImage(res.data.user.profileImg);
        setInput(prev => ({ ...prev, ['address']: res.data.user.address }));
        setInput(prev => ({ ...prev, ['phoneNumber']: res.data.user.phoneNumber }));
        setInput(prev => ({ ...prev, ['description']: res.data.user.description }));
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { description, address, phoneNumber } = input;
        try {
            await axios.patch('http://localhost:8000/user/edit', { currentPassword, description, address, phoneNumber }, { headers: { 'Authorization': `Bearer ${token}` } });
            setError({ currentPassword: '' });
            fetchUser();
        } catch (err) {
            setError({ currentPassword: err.response.data.message });
        }
    };

    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <Flex justify='space-between' align='center'>
                <FormControl
                    mt='20px'
                    mr='20px'
                    display='inline-block'
                    cursor='pointer'
                    borderRadius='full'
                    p='3px'
                >
                    <FormLabel>
                        <Image
                            borderRadius='full'
                            boxSize='135px'
                            src={displayImage}
                            alt="Profile Picture"
                        />
                        <EditIcon
                            position='relative'
                            top='-30px'
                            left='110px'
                            h='30px'
                            w='30px'
                            p='6px'
                            rounded='full'
                            _hover={{ bg: 'gray.100' }}
                            cursor='pointer'
                        />
                    </FormLabel>
                    <Input
                        display='none'
                        type='file'
                        onChange={async (e) => {
                            const formData = new FormData();
                            formData.append('image', e.target.files[0]);
                            await axios.patch('http://localhost:8000/user/updatepic', formData, { headers: { 'Authorization': `Bearer ${token}` } });
                            fetchUser();
                        }}
                    />
                </FormControl>
                <Box mt='20px'>
                    <Flex mb='10px' align='center'>
                        <Box>
                            <Text fontSize='xx-small' lineHeight='short' fontWeight='semibold'>USERNAME</Text>
                            <Text
                                fontSize='2xl'
                                fontWeight='semibold'
                                color='green.500'
                                w='500px'
                            >
                                {userInfo.username}
                            </Text>
                        </Box>
                    </Flex>
                    <Flex mb='10px' align='center'>
                        <Box>
                            <Text fontSize='xx-small' lineHeight='short' fontWeight='semibold'>EMAIL</Text>
                            <Text
                                fontSize='xl'
                                fontWeight='semibold'
                                color='secondary.600'
                                w='500px'
                            >
                                {userInfo.email}
                            </Text>
                        </Box>
                    </Flex>
                    <Flex mb='10px' align='center'>
                        <Box>
                            <Text fontSize='xx-small' lineHeight='short' fontWeight='semibold'>ADDRESS</Text>
                            <Textarea
                                ref={addressInput}
                                w='500px'
                                value={input.address}
                                p='10px'
                                border='none'
                                resize='none'
                                cursor='default'
                                zIndex='-1'
                                mr='20px'
                                bg='gray.100'
                                _focus={{ outline: 'none' }}
                                onChange={e => { setInput(prev => ({ ...prev, ['address']: e.target.value })); }}
                            />
                        </Box>
                        <EditIcon
                            cursor='pointer'
                            onClick={() => { addressInput.current.focus(); }}
                        />
                    </Flex>
                    <Flex mb='10px' align='center'>
                        <Box>
                            <Text fontSize='xx-small' lineHeight='short' fontWeight='semibold'>PHONENUMBER</Text>
                            <Input
                                ref={phoneInput}
                                w='500px'
                                value={input.phoneNumber}
                                p='10px'
                                border='none'
                                resize='none'
                                cursor='default'
                                zIndex='-1'
                                mr='20px'
                                bg='gray.100'
                                _focus={{ outline: 'none' }}
                                onChange={e => { setInput(prev => ({ ...prev, ['phoneNumber']: e.target.value })); }}
                            />
                        </Box>
                        <EditIcon
                            cursor='pointer'
                            onClick={() => { phoneInput.current.focus(); }}
                        />
                    </Flex>
                    <Flex mb='10px' align='center'>
                        <Box>
                            <Text fontSize='xx-small' lineHeight='short' fontWeight='semibold'>DESCRIPTION</Text>
                            <Input
                                ref={descriptionInput}
                                w='500px'
                                value={input.description}
                                p='10px'
                                border='none'
                                resize='none'
                                cursor='default'
                                zIndex='-1'
                                mr='20px'
                                bg='gray.100'
                                _focus={{ outline: 'none' }}
                                onChange={e => { setInput(prev => ({ ...prev, ['description']: e.target.value })); }}
                            />
                        </Box>
                        <EditIcon
                            cursor='pointer'
                            onClick={() => { descriptionInput.current.focus(); }}
                        />
                    </Flex>
                    <Text
                        mb='10px'
                        color='red.500'
                    >
                        {error.currentPassword}
                    </Text>
                    <Button
                        mr='10px'
                        rounded='md'
                        color='white'
                        bg='primary.500'
                        _hover={{ bg: 'primary.600' }}
                        onClick={() => { setPromptPw(true); }}
                    >
                        Update Profile
                    </Button>
                    <AlertDialog isOpen={promptPw}>
                        <AlertDialogContent p='10px'>
                            <AlertDialogBody>
                                <Text fontWeight='semibold'>Please enter your password</Text>
                                <Input type='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} mb='5px' />
                                <Button
                                    rounded='md'
                                    color='white'
                                    bg='green.500'
                                    mr='5px'
                                    _hover={{ bg: 'green.600' }}
                                    onClick={(e) => { handleSubmit(e); setPromptPw(false); setCurrentPassword(''); }}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    w='90.63px'
                                    rounded='md'
                                    color='white'
                                    bg='red.500'
                                    _hover={{ bg: 'red.600' }}
                                    onClick={() => setPromptPw(false)}
                                >
                                    Back
                                </Button>
                            </AlertDialogBody>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button
                        w='136.27px'
                        rounded='md'
                        color='white'
                        bg='red.500'
                        _hover={{ bg: 'red.600' }}
                        onClick={() => history.push('/')}
                    >
                        Back
                    </Button>
                </Box>
            </Flex>
        </Flex >
    );
}

export default EditProfile;