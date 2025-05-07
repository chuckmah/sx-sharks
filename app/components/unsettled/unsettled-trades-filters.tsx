import { Form, useSearchParams } from '@remix-run/react';
import { useState, type FC } from 'react';

export const UnsettledTradesFilters: FC<{ sportList: string[] }> = ({
    sportList,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const minSize = searchParams.get('min') || undefined;
    const sports = searchParams.getAll('sport') || [];
    const betTime = searchParams.get('betTime') || undefined;
    const hasFilters: boolean = !!(minSize || sports.length > 0 || betTime);
    const [isOpen, setIsOpen] = useState(hasFilters);

    const handleReset = () => {
        setIsOpen(false);
        setSearchParams();
    };

    return (
        <div
            className={`collapse collapse-arrow  bg-base-200 ${
                isOpen ? 'collapse-open' : 'collapse-close'
            }`}
        >
            <div
                tabIndex={0}
                className="collapse-title cursor-pointer font-medium"
                onClick={() => setIsOpen(!isOpen)}
            >
                Filters
            </div>
            <div className="collapse-content ">
                <Form method="get">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:md:grid-cols-4">
                        <div className="form-control ">
                            <label className=" w-full max-w-xs">
                                <div className="label">
                                    {' '}
                                    <span className="label-text">
                                        Min amount :
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    className="mw-50 input input-bordered input-sm mt-1"
                                    id="min"
                                    name="min"
                                    defaultValue={minSize}
                                />
                            </label>
                        </div>
                        <div className="form-control">
                            <label className=" w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Sports :</span>
                                </div>
                                <select
                                    id="sport"
                                    name="sport"
                                    className="select  select-bordered  select-sm"
                                    multiple
                                    defaultValue={sports}
                                >
                                    {sportList.map((sport) => (
                                        <option key={sport} value={sport}>
                                            {sport}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="form-control">
                            <label className=" w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">
                                        Min bet time :
                                    </span>
                                </div>

                                <input
                                    type="datetime-local"
                                    className="input input-bordered input-sm"
                                    id="betTime"
                                    name="betTime"
                                    defaultValue={betTime}
                                />
                            </label>
                        </div>
                        {/* <div className="form-control">
                            <label className="flex items-start gap-2 ">
                                <span className="label-text cursor-pointer">
                                    Hide live bet
                                </span>

                                <input
                                    type="checkbox"
                                    className="checkbox-accent checkbox"
                                    id="live"
                                    name="live"
                                    value="true"
                                    defaultChecked={live}
                                />
                            </label>
                        </div> */}
                    </div>
                    <div className="flex flex-row-reverse gap-2">
                        <button
                            className="btn btn-outline btn-sm"
                            type="submit"
                        >
                            Apply filters
                        </button>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={handleReset}
                            type="reset"
                        >
                            Reset filters
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
};
