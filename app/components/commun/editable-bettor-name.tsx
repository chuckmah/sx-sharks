import { useState, type FC } from 'react';
import { useLocalStorageBettor } from './bettor.name.hook';

// // Captures 0x + 4 characters, then the last 4 characters.
// const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
// const truncateEthAddress = (address: string) => {
//     const match = address.match(truncateRegex);
//     if (!match) return address;
//     return `${match[1]}…${match[2]}`;
// };

export const EditableBettorName: FC<{ bettorId: string }> = ({ bettorId }) => {
    const [abettorName, setBettorNameWithLocalStorage] =
        useLocalStorageBettor(bettorId);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');

    const handleLabelClick = () => {
        setIsEditing(true);
        setName(abettorName.nickname);
        setIcon(abettorName.icon ? abettorName.icon : '');
    };

    const handleClear = () => {
        setIsEditing(false);
        setName(abettorName.nickname);
        setIcon(abettorName.icon ? abettorName.icon : '');
    };

    const handleSave = () => {
        setIsEditing(false);
        setBettorNameWithLocalStorage({ nickname: name, icon: icon });
    };

    return (
        <div className="my-4 ">
            {isEditing ? (
                <div className="join">
                    <input
                        type="text"
                        className="input join-item  input-bordered  input-sm"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select
                        className="join-item select select-bordered select-sm"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                    >
                        <option value=""></option>
                        <option>🐋</option>
                        <option>🦈</option>
                        <option>👶</option>
                        <option>🦑</option>
                        <option>🐬</option>
                        <option>🐉</option>
                        <option>💻</option>
                    </select>
                    <button
                        className="btn join-item btn-sm "
                        onClick={handleSave}
                    >
                        💾
                    </button>
                    <button
                        className="btn join-item btn-sm "
                        onClick={handleClear}
                    >
                        ✖
                    </button>
                </div>
            ) : (
                <h1 className=" text-xl font-bold">
                    <label
                        tabIndex={0}
                        className="cursor-pointer"
                        onClick={handleLabelClick}
                    >
                        {abettorName.icon && <span> {abettorName.icon}</span>}
                        <span>{abettorName.nickname}</span> ✎
                    </label>
                </h1>
            )}
        </div>
    );
};
