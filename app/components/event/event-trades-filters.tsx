import { Form, useSearchParams } from '@remix-run/react';
import { useState, type FC } from 'react';

export const EventTradesFilters: FC<{}> = ({}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const hidemaker = searchParams.get('hidemaker') === 'true';
    const hidetaker = searchParams.get('hidetaker') === 'true';
    const minSize = searchParams.get('min') || undefined;

    const hasFilters: boolean = !!(minSize || hidemaker || hidetaker);
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
                        </div>
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
