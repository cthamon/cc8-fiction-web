import { createContext, useState } from 'react';

export const ActivityContext = createContext();

function ActivityContextProvider({ children }) {
    const [novelId, setNovelId] = useState(null);
    const [episodeId, setEpisodeId] = useState(null);

    return (
        <ActivityContext.Provider value={{ novelId, setNovelId, episodeId, setEpisodeId }}>
            {children}
        </ActivityContext.Provider>
    );
}

export default ActivityContextProvider;