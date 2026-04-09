    // src/utils/getDeviceIcon.js
    import { 
    Tv,
    Smartphone,
    Laptop,
    Package,
    Refrigerator,
    WashingMachine,
    AirVent,
    Droplet
    } from 'lucide-react';

    export const getDeviceIcon = (device) => {
    const searchText = ((device.name || '') + ' ' + (device.model || '') + ' ' + (device.manufacturer || '')).toLowerCase();
    
    if (searchText.includes('macbook') || searchText.includes('laptop') || searchText.includes('notebook')) {
        return Laptop;
    }
    if (searchText.includes('iphone') || searchText.includes('phone') || searchText.includes('smartphone') || searchText.includes('mobile')) {
        return Smartphone;
    }
    if (searchText.includes('tv') || searchText.includes('television')) {
        return Tv;
    }
    if (searchText.includes('refrigerator') || searchText.includes('fridge')) {
        return Refrigerator;
    }
    if (searchText.includes('washing') || searchText.includes('washer')) {
        return WashingMachine;
    }
    if (searchText.includes('air') || searchText.includes('ac')) {
        return AirVent;
    }
    if (searchText.includes('water') || searchText.includes('purifier')) {
        return Droplet;
    }
    return Package;
    };