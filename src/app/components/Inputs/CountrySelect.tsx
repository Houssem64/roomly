"use client";

import Select from "react-select";

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    region: string;
    value: string;
};

interface CountrySelectProps {
    value?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void;
}
const tunisiaRegions = [
    { region: "Ariana", latitude: 36.8663, longitude: 10.1644 },
    { region: "Beja", latitude: 36.7295, longitude: 9.1895 },
    { region: "Ben Arous", latitude: 36.7477, longitude: 10.229 },
    { region: "Bizerte", latitude: 37.2744, longitude: 9.8736 },
    { region: "Gabes", latitude: 33.8886, longitude: 10.0982 },
    { region: "Gafsa", latitude: 34.425, longitude: 8.7842 },
    { region: "Jendouba", latitude: 36.5013, longitude: 8.7809 },
    { region: "Kairouan", latitude: 35.6804, longitude: 10.0982 },
    { region: "Kasserine", latitude: 35.1676, longitude: 8.8365 },
    { region: "Kebili", latitude: 33.7068, longitude: 8.9692 },
    { region: "Kef", latitude: 36.1746, longitude: 8.7042 },
    { region: "Mahdia", latitude: 35.5016, longitude: 11.0622 },
    { region: "Manouba", latitude: 36.8121, longitude: 10.0761 },
    { region: "Medenine", latitude: 33.3542, longitude: 10.512 },
    { region: "Monastir", latitude: 35.6892, longitude: 10.9027 },
    { region: "Nabeul", latitude: 36.4561, longitude: 10.7376 },
    { region: "Sfax", latitude: 34.7489, longitude: 10.7613 },
    { region: "Sidi Bouzid", latitude: 35.0342, longitude: 9.4855 },
    { region: "Siliana", latitude: 36.0907, longitude: 9.3692 },
    { region: "Sousse", latitude: 35.8288, longitude: 10.6407 },
    { region: "Tataouine", latitude: 32.9265, longitude: 10.4515 },
    { region: "Tozeur", latitude: 33.9193, longitude: 8.1339 },
    { region: "Tunis", latitude: 36.8065, longitude: 10.1815 },
    { region: "Zaghouan", latitude: 36.3999, longitude: 10.1479 }
];

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {

    /*    useEffect(() => {
           fetch('https://countriesnow.space/api/v0.1/countries/states', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                   country: 'Tunisia'
               }),
           })
               .then(response => response.json())
               .then(data => {
                   const modifiedStates = data.data.states.map((state: State) => ({
                       ...state,
                       name: state.name.replace(' Governorate', '')
                   }));
                   setStates(modifiedStates);
                   console.log(data);
               })
               .catch(error => console.error(error));
       }, []); */



    /* const options = states.map(state => ({ label: state.name, value: state.state_code })); */
    /*   const options = tunisiaRegions.map(region => ({ label: region.region }));
  
   */


    const options = tunisiaRegions.map(region => ({
        label: region.region,
        value: region.region,
        latlng: [region.latitude, region.longitude],
        region: region.region,
        flag: '' // You may want to add a flag URL here
    }));

    return (
        <div>
            <Select
                placeholder="Select Location"
                isClearable
                options={options}
                value={value}
                onChange={(value) => onChange(value as CountrySelectValue)}
            />
        </div>
    );
}

export default CountrySelect;
