import { useEffect, useState } from 'react';

interface State {
    name: string;
    state_code: string;
}

const useStates = () => {
    const [states, setStates] = useState<State[]>([]);

    useEffect(() => {
        fetch('https://countriesnow.space/api/v0.1/countries/states')
            .then(response => response.json())
            .then(data => {
                const modifiedStates = data.data.states.map((state: State) => ({
                    ...state,
                    name: state.name.replace(' Governorate', '')
                }));
                setStates(modifiedStates);
            })
            .catch(error => console.error(error));
    }, []);

    return { states };
}

export default useStates;