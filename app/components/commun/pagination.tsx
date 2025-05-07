import { useSearchParams } from '@remix-run/react';
import React from 'react';

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    page,
    pageSize,
    total,
}) => {
    const [, setSearchParams] = useSearchParams();
    const totalPages = Math.ceil(total / pageSize);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setSearchParams((prevParams) => {
                prevParams.set('page', newPage.toString());
                return prevParams;
            });
        }
    };

    return (
        <div className="flex flex-row-reverse">
            <div className="join">
                <button
                    className="btn  join-item"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    ← Previous
                </button>
                <button
                    className="btn  join-item	text-base-content"
                    tabIndex={-1}
                    aria-disabled="true"
                >{`Page ${page} of ${totalPages} `}</button>
                <button
                    className="btn  join-item"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};
