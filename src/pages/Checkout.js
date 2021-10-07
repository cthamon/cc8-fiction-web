import Navbar from '../components/Navbar';
import { Flex, Box, Input, FormControl, FormLabel, Button, Divider, Text } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../config/axios';
import localStorageService from '../services/localStorageService';
import { ActivityContext } from '../contexts/ActivityContextProvider';


function Checkout() {
    const history = useHistory();
    const token = localStorageService.getToken();
    const { cartItem, setCartItem } = useContext(ActivityContext);

    const [episode, setEpisode] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [couponDC, setCouponDC] = useState(false);
    const [couponError, setCouponError] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [address, setAddress] = useState('');

    useEffect(() => {
        const fetchAllEpisode = async (id) => {
            const res = await axios.get('/novel/episode');
            setEpisode(res.data.episodes);
        };
        fetchAllEpisode();
    }, []);

    const validateCode = (coupon) => {
        if (coupon === 'DCONLY9') {
            setDiscount(9);
            return setCouponDC(true);
        } else {
            return setCouponError(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post('/order/', { address, discount }, { headers: { 'Authorization': `Bearer ${token}` } });
        episode.filter(val => cartItem.includes(val.id)).forEach(async ele => {
            let amount;
            let episodeId = ele.id;
            let novelId = ele.novelId;
            if (ele.novelPrice !== 0) {
                amount = ele.novelPrice;
                await axios.post(`/order/buynovel/${novelId}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
            } else {
                amount = ele.price;
                await axios.post(`/order/buyepisode/${episodeId}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
            }
            await axios.post(`/order/item/${res.data.order.id}`, { amount, episodeId }, { headers: { 'Authorization': `Bearer ${token}` } });
        });
        setCartItem([]);
        history.push('/');
    };

    return (
        <Flex
            direction='column'
            align='center'
            maxW={{ xl: '1200px' }}
            m='0 auto'
        >
            <Navbar />
            <form onSubmit={handleSubmit}>
                <Flex justify='space-between' w='1080px'>
                    <Box w='60%' boxShadow='rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' m='20px 10px 20px 20px' p='20px'>
                        <Text fontSize='xl' fontWeight='semibold' mb='20px'>Order Summary</Text>
                        <Flex justify='space-between'>
                            <Box w='15%'>
                                {episode.filter(val => cartItem.includes(val.id)).map((item, i) =>
                                    <Box
                                        key={i}
                                        backgroundImage={`url(${item.novelCover})`}
                                        backgroundSize='cover'
                                        backgroundPosition='center'
                                        rounded='md'
                                        w='70px'
                                        h='100px'
                                        mb='5px'
                                    />
                                )}
                            </Box>
                            <Box w='85%'>
                                {episode.filter(val => cartItem.includes(val.id)).map((item, i) =>
                                    <Flex h='100px' mb='5px' justify='space-between' key={i}>
                                        <Box>
                                            <Flex justify='space-between' align='center' >
                                                <Text fontSize='sm' fontWeight='semibold' mr='10px'>{item.title}</Text>
                                                <DeleteIcon w='12px' color='red.500' cursor='pointer' _hover={{ color: 'red.600' }} onClick={() => setCartItem(cartItem.filter(val => val !== item.id))} />
                                            </Flex>
                                            <Text fontSize='sm' fontWeight='semibold'>{item.price === 0 ? ' (All episode)' : 'Episode ' + item.episodeNumber + ' : ' + item.episodeTitle}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight='bold'>THB {item.price === 0 ? item.novelPrice : item.price}</Text>
                                        </Box>
                                    </Flex>
                                )}
                            </Box>
                        </Flex>
                        <Divider m='20px 0' />
                        <Flex justify='space-between' align='center'>
                            <Text fontSize='sm' fontWeight='semibold' m='0 0 0 100px'>Subtotal</Text>
                            <Text fontSize='sm' fontWeight='bold' color='secondary.500'>{episode.filter(val => cartItem.includes(val.id)).reduce((acc, cv) => cv.price + cv.novelPrice + acc, 0)}</Text>
                        </Flex>
                        <Flex justify='space-between' align='center'>
                            <Text fontSize='sm' fontWeight='semibold' m='0 0 0 100px'>Discount</Text>
                            <Text fontSize='sm' fontWeight='bold' color='secondary.500'>{discount === 0 ? '-' : discount}</Text>
                        </Flex>
                        <Flex justify='space-between' align='center'>
                            <Text fontSize='large' fontWeight='semibold'>Total</Text>
                            <Text fontSize='xl' fontWeight='bold' color='green.500'>THB {episode.filter(val => cartItem.includes(val.id)).reduce((acc, cv) => cv.price + cv.novelPrice + acc, 0) - discount}</Text>
                        </Flex>
                        <Divider m='20px 0' />
                        <Button w='100%' color=' #fff' bg='primary.500' _hover={{ bg: 'primary.600' }} type='submit'>Place Order</Button>
                        <Text mt='10px' fontSize='sm' color='secondary.500' textAlign='center' cursor='pointer' _hover={{ color: 'secondary.600', textDecoration: 'underline' }} onClick={() => { setCartItem([]); history.push('/'); }}>Cancle Payment</Text>
                    </Box>
                    <Box w='40%' boxShadow='rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' m='20px 20px 20px 10px' p='20px'>
                        <FormControl mb='15px' isRequired>
                            <FormLabel>Billing Address</FormLabel>
                            <Input value={address} onChange={e => setAddress(e.target.value)} />
                        </FormControl>
                        <FormControl mb='15px'>
                            <FormLabel>Discount Code</FormLabel>
                            <Flex>
                                <Input w='50%' value={coupon} onChange={e => setCoupon(e.target.value)} />
                                <Button onClick={() => validateCode(coupon)}>Apply</Button>
                            </Flex>
                            {couponDC && <Text fontSize='sm' m='5px 0 0 10px'>{`You've receive discount for THB ${discount}`}</Text>}
                            {couponError && <Text fontSize='sm' m='5px 0 0 10px' color='red.500'>Invalid code</Text>}
                        </FormControl>
                    </Box>
                </Flex>
            </form>
        </Flex >
    );
}

export default Checkout;