import { createContext, useState } from 'react';

export const ActivityContext = createContext();

function ActivityContextProvider({ children }) {
    const [novelId, setNovelId] = useState(null);
    const [episodeId, setEpisodeId] = useState(null);
    const [cartItem, setCartItem] = useState([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');

    return (
        <ActivityContext.Provider value={{ novelId, setNovelId, episodeId, setEpisodeId, cartItem, setCartItem, filter, setFilter, search, setSearch }}>
            {children}
        </ActivityContext.Provider>
    );
}

export default ActivityContextProvider;