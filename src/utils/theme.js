import { extendTheme } from '@chakra-ui/react';

const colors = {
    primary: {
        100: '#E5FCF1',
        200: '#27EF96',
        300: '#10DE82',
        400: '#0EBE6F',
        500: '#0CA25F',
        600: '#0A864F',
        700: '#086F42',
        800: '#075C37',
        900: '#064C2E'
    },
    secondary: {
        100: '#EDF2F7',
        200: '#E2E8F0',
        300: '#CBD5E0',
        400: '#A0AEC0',
        500: '#718096',
        600: '#4A5568',
        700: '#2D3748',
        800: '#1A202C',
        900: '#171923',
    }
};

const customTheme = extendTheme({ colors });

export default customTheme;