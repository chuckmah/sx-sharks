import { Form, useSearchParams } from '@remix-run/react';
import { useState, type FC } from 'react';

export const BettorTradesFilters: FC<{ sportList: string[] }> = ({
    sportList,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const all = searchParams.get('all') === 'all';
    const minSize = searchParams.get('min') || undefined;
    const sports = searchParams.getAll('sport') || [];
    const maxbettime = searchParams.get('maxbettime') || undefined;
    const minbettime = searchParams.get('minbettime') || undefined;
    const hidemaker = searchParams.get('hidemaker') === 'true';
    const hidetaker = searchParams.get('hidetaker') === 'true';

    const hasFilters: boolean = !!(
        minSize ||
        sports.length > 0 ||
        maxbettime ||
        minbettime ||
        hidemaker ||
        hidetaker
    );
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
                                        Min bet date :
                                    </span>
                                </div>

                                <input
                                    type="date"
                                    className="input input-bordered input-sm"
                                    id="minbettime"
                                    name="minbettime"
                                    defaultValue={minbettime}
                                />
                            </label>
                            <label className=" w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">
                                        Max bet date :
                                    </span>
                                </div>

                                <input
                                    type="date"
                                    className="input input-bordered input-sm"
                                    id="maxbettime"
                                    name="maxbettime"
                                    defaultValue={maxbettime}
                                />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="mt-3 flex items-start gap-2">
                                <span className="label-text cursor-pointer">
                                    Filter maker bets
                                </span>

                                <input
                                    type="checkbox"
                                    className="checkbox "
                                    id="hidemaker"
                                    name="hidemaker"
                                    value="true"
                                    defaultChecked={hidemaker}
                                />
                            </label>
                            <label className="mt-3 flex items-start gap-2 ">
                                <span className="label-text cursor-pointer">
                                    Filter taker bets
                                </span>

                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    id="hidetaker"
                                    name="hidetaker"
                                    value="true"
                                    defaultChecked={hidetaker}
                                />
                            </label>
                            <label className="mt-3 flex items-start gap-2 ">
                                <span className="label-text cursor-pointer">
                                    All
                                </span>

                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    id="all"
                                    name="all"
                                    value="true"
                                    defaultChecked={all}
                                />
                            </label>
                        </div>
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
