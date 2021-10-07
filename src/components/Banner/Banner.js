import { Box, Flex, Image, RadioGroup, Radio } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import './animation.css';

function Banner() {
    const bannerImages = [
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/5fd709d7900071001bcde581/601ac5cfC1eQpr9s.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/60af441f9a6708001b77f801/60b5f00ftydKIffV.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/6093624ba7a2db001bf2d430/60b5f02fGTELPuj7.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/books/5d3595723d461bfa13252172/5f61d81fCMH2okCd_source.jpeg',
        'https://s3.ap-southeast-1.amazonaws.com/media.fictionlog/ebooks/609e3e77c58864001b9e93d0/adpc15p7hh3q9h1a.jpeg'
    ];

    const [moveleft, setMoveLeft] = useState(0);
    const [moveright, setMoveRight] = useState(0);
    const [quickmoveleft, setQuickMoveLeft] = useState(0);
    const [quickmoveright, setQuickMoveRight] = useState(0);
    const [radioNumber, setRadioNumber] = useState(0);

    const imageNumber = (radioNumber, number, maxNumber) => {
        if (+radioNumber + +number >= +maxNumber) {
            return +radioNumber + +number - +maxNumber;
        } return +radioNumber + +number;
    };

    const ChevronLeftChecker = (radioNumber, maxNumber) => {
        if (+radioNumber - 1 < 0) {
            return setTimeout(() => setRadioNumber(maxNumber - 1), 400);
        } return setTimeout(() => setRadioNumber(+radioNumber - 1), 400);
    };

    const ChevronRightChecker = (radioNumber, maxNumber) => {
        if (+radioNumber + 1 >= +maxNumber) {
            return setTimeout(() => setRadioNumber(0), 400);
        } return setTimeout(() => setRadioNumber(+radioNumber + 1), 400);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (+radioNumber + 1 >= +bannerImages.length) {
                setTimeout(() => setRadioNumber(0), 400);
                setMoveLeft(1);
            } else {
                setTimeout(() => setRadioNumber(radioNumber + 1), 400);
                setMoveLeft(1);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [radioNumber]);

    const radioAnimation = (prev, next) => {
        if (next - prev === 1) {
            return setMoveLeft(1), setTimeout(() => setRadioNumber(next), 400);
        } else if (prev - next === 1) {
            return setMoveRight(1), setTimeout(() => setRadioNumber(next), 400);
        } else if (next - prev > 1) {
            return setQuickMoveLeft(1), setTimeout(() => setRadioNumber(next), 75);
        } else if (prev - next > 1) {
            return setQuickMoveRight(1), setTimeout(() => setRadioNumber(next), 75);
        }
    };

    return (
        <Box>
            <Flex
                w='100vw'
                pt='24px'
                justify='center'
                align='center'
                overflow='hidden'
            >
                <Flex
                    w='40px'
                    h='40px'
                    justify='center'
                    align='center'
                    position='absolute'
                    left='3'
                    rounded='full'
                    bg='rgba(255,255,255,0.8)'
                    cursor='pointer'
                    onClick={() => { ChevronLeftChecker(radioNumber, bannerImages.length); setMoveRight(1); }}
                    zIndex='1'
                    _hover={{ bg: 'rgba(225,225,225,0.8)' }}
                >
                    <ChevronLeftIcon />
                </Flex>
                <Box
                    className='banner'
                    moveleft={moveleft}
                    moveright={moveright}
                    quickmoveleft={quickmoveleft}
                    quickmoveright={quickmoveright}
                    minW={['380px', '380px', '682px', '682px']}
                    h={['174px', '174px', '312px', '312px']}
                    mr='20px'
                    userSelect='none'
                    position='relative'
                    onAnimationEnd={() => { setMoveLeft(0); setMoveRight(0); setQuickMoveLeft(0); setQuickMoveRight(0); }}
                >
                    <Image
                        rouded='xl'
                        src={bannerImages[imageNumber(radioNumber, 0, bannerImages.length)]}
                    />
                </Box>
                <Box
                    className='banner'
                    moveleft={moveleft}
                    moveright={moveright}
                    quickmoveleft={quickmoveleft}
                    quickmoveright={quickmoveright}
                    minW={['380px', '380px', '682px', '682px']}
                    h={['174px', '174px', '312px', '312px']}
                    userSelect='none'
                    position='relative'
                    onAnimationEnd={() => { setMoveLeft(0); setMoveRight(0); setQuickMoveLeft(0); setQuickMoveRight(0); }}
                >
                    <Image
                        rounded='xl'
                        src={bannerImages[imageNumber(radioNumber, 1, bannerImages.length)]}
                    />
                </Box>
                <Box
                    className='banner'
                    moveleft={moveleft}
                    moveright={moveright}
                    quickmoveleft={quickmoveleft}
                    quickmoveright={quickmoveright}
                    minW={['380px', '380px', '682px', '682px']}
                    h={['174px', '174px', '312px', '312px']}
                    m='0 20px'
                    userSelect='none'
                    position='relative'
                    onAnimationEnd={() => { setMoveLeft(0); setMoveRight(0); setQuickMoveLeft(0); setQuickMoveRight(0); }}
                >
                    <Image
                        rounded='xl'
                        src={bannerImages[imageNumber(radioNumber, 2, bannerImages.length)]}
                    />
                </Box>
                <Box
                    className='banner'
                    moveleft={moveleft}
                    moveright={moveright}
                    quickmoveleft={quickmoveleft}
                    quickmoveright={quickmoveright}
                    minW={['380px', '380px', '682px', '682px']}
                    h={['174px', '174px', '312px', '312px']}
                    userSelect='none'
                    position='relative'
                    onAnimationEnd={() => { setMoveLeft(0); setMoveRight(0); setQuickMoveLeft(0); setQuickMoveRight(0); }}
                >
                    <Image
                        rounded='xl'
                        src={bannerImages[imageNumber(radioNumber, 3, bannerImages.length)]}
                    />
                </Box>
                <Box
                    className='banner'
                    moveleft={moveleft}
                    moveright={moveright}
                    quickmoveleft={quickmoveleft}
                    quickmoveright={quickmoveright}
                    minW={['380px', '380px', '682px', '682px']}
                    h={['174px', '174px', '312px', '312px']}
                    ml='20px'
                    userSelect='none'
                    position='relative'
                    onAnimationEnd={() => { setMoveLeft(0); setMoveRight(0); setQuickMoveLeft(0); setQuickMoveRight(0); }}
                >
                    <Image
                        rounded='xl'
                        src={bannerImages[imageNumber(radioNumber, 4, bannerImages.length)]}
                    />
                </Box>
                <Flex
                    w='40px'
                    h='40px'
                    justify='center'
                    align='center'
                    position='absolute'
                    right='3'
                    rounded='full'
                    bg='rgba(255,255,255,0.8)'
                    cursor='pointer'
                    onClick={() => { ChevronRightChecker(radioNumber, bannerImages.length); setMoveLeft(1); }}
                    zIndex='1'
                    _hover={{ bg: 'rgba(225,225,225,0.8)' }}
                >
                    <ChevronRightIcon />
                </Flex>
            </Flex>
            <RadioGroup
                align='center'
                value={radioNumber}
            >
                {bannerImages.map((item, i) => {
                    return (
                        <Radio
                            key={i}
                            value={i}
                            size='sm'
                            m='10px 5px 0 0'
                            cursor='pointer'
                            colorScheme='green'
                            onClick={() => radioAnimation(radioNumber, i)}
                            _focus={{ shadow: 'none' }}
                        >
                        </Radio>
                    );
                })}
            </RadioGroup>
        </Box >
    );
};

export default Banner;