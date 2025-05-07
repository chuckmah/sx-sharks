import { Link, useNavigate } from '@remix-run/react';
import { useEffect, useState, type FC, type PropsWithChildren } from 'react';

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
    const navigate = useNavigate();
    const [bettorNames, setBettorsNames] = useState([] as any[]);
    const [searchTerm, setSearchTerm] = useState('');
    const goTo = () => {
        navigate(`/bettors/${searchTerm}`);
        setSearchTerm('');
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            goTo();
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        setBettorsNames(
            Object.entries(window.$ssbettorNames).map(([key, value]) => ({
                address: key,
                name: value.nickname,
            }))
        );
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="text-center ">
                <div className="mx-auto pt-4 text-2xl font-medium md:pt-8 md:text-4xl">
                    <Link to="/">🦈 SX Sharks 🦈</Link>
                </div>

                <input
                    type="search"
                    placeholder="Enter shark address"
                    list="shark-address"
                    className="input input-bordered  input-sm mt-4 w-full max-w-md  "
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                />
                <datalist id="shark-address">
                    {bettorNames.map((bettor) => (
                        <option key={bettor.address} value={bettor.address}>
                            {bettor.name}
                        </option>
                    ))}
                </datalist>
            </header>
            <main className="container mx-auto mt-8 flex-grow px-2">
                {children}
            </main>
            <footer>
                <aside className="footer footer-center bg-base-300 p-4 text-sm md:text-base">
                    <p>
                        <a
                            href="https://discord.com/invite/sxnetwork"
                            className="link-hover link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @chuckmah on SX discord
                        </a>
                    </p>
                </aside>
            </footer>
        </div>
    );
};
