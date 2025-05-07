import { useEffect } from 'react';
import { bettorNames } from '../db/names';

export default function SetNames() {
    useEffect(() => {
        localStorage.setItem('bettorsName', JSON.stringify(bettorNames));
        console.log('Names setted');
    });

    return <div> done!</div>;
}
