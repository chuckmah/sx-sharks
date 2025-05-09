/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { AxiosError, AxiosProxyConfig } from 'axios';
import axios, { AxiosHeaders } from 'axios';
import type {
    SportXIGetTradesRequest,
    SportXIMarket,
    SportXIMarketResponse,
    SportXIResponseArray,
    SportXITradeResponse,
    SportxActiveMarketsRequest,
} from './sportx-model.cjs';

export interface SportXService {
    getActiveMarkets(
        request: SportxActiveMarketsRequest,
        paginationKey?: string,
        pageSize?: number
    ): Promise<SportXIMarketResponse>;

    marketLookup(marketHashes: string[]): Promise<SportXIMarket[]>;

    getTrades(request: SportXIGetTradesRequest): Promise<SportXITradeResponse>;
}

export class SportxHttpService implements SportXService {
    private headers: AxiosHeaders = new AxiosHeaders();
    private proxy: AxiosProxyConfig | undefined;
    private chainVersion: string | undefined;
    private urlBase;
    constructor(
        apiKey: string | undefined,
        apiAddr: string,

        proxy?: AxiosProxyConfig,
        chainVersion?: string
    ) {
        if (apiKey) {
            this.headers.set('X-Api-Key', apiKey);
        }

        this.headers.set('Content-Type', 'application/json');
        this.urlBase = apiAddr;
        this.proxy = proxy;
        this.chainVersion = chainVersion;
    }

    async getActiveMarkets(
        request: SportxActiveMarketsRequest,
        paginationKey?: string,
        pageSize?: number
    ): Promise<SportXIMarketResponse> {
        // const params = {
        //     ...(onlyMainLine !== undefined && { onlyMainLine }),
        //     ...(eventId !== undefined && { eventId }),
        //     ...(leagueId !== undefined && { leagueId }),
        //     ...(sportIds !== undefined && { sportIds }),
        //     ...(liveOnly !== undefined && { liveOnly }),
        //     ...(betGroup !== undefined && { betGroup }),
        //     ...(type !== undefined && { type }),
        //     ...(paginationKey !== undefined && { paginationKey }),
        //     ...(pageSize !== undefined && { pageSize }),
        // };

        const params = {
            ...request,
            ...(paginationKey !== undefined && { paginationKey }),
            ...(pageSize !== undefined && { pageSize }),
            ...(this.chainVersion !== undefined && {
                chainVersion: this.chainVersion,
            }),
        };

        try {
            const resp = await axios.get<SportXIMarketResponse>(
                `${this.urlBase}markets/active`,
                {
                    params,
                    headers: this.headers,
                    ...(this.proxy && { proxy: this.proxy }),
                }
            );

            return resp.data;
        } catch (e: unknown) {
            console.log(e);
            throw new Error(
                `Response status code ${
                    (e as AxiosError).response?.status as number
                } got error  ${JSON.stringify(
                    (e as AxiosError).response?.data
                )}`
            );
        }
    }

    async marketLookup(marketHashes: string[]): Promise<SportXIMarket[]> {
        try {
            const hashes = marketHashes.join(',');

            const resp = await axios.get<SportXIResponseArray<SportXIMarket>>(
                `${this.urlBase}markets/find?marketHashes=${hashes}`,
                {
                    headers: this.headers,
                    ...(this.proxy && { proxy: this.proxy }),
                }
            );

            return resp.data.data;
        } catch (e: unknown) {
            throw new Error(
                `Response status code ${
                    (e as AxiosError).response?.status as number
                } got error  ${JSON.stringify(
                    (e as AxiosError).response?.data
                )}`
            );
        }
    }

    async getTrades(
        request: SportXIGetTradesRequest
    ): Promise<SportXITradeResponse> {
        const queryParams = [];
        if (request.startDate !== undefined) {
            queryParams.push(`startDate=${request.startDate}`);
        }
        if (request.endDate !== undefined) {
            queryParams.push(`endDate=${request.endDate}`);
        }
        if (request.bettor !== undefined) {
            queryParams.push(`bettor=${request.bettor}`);
        }
        if (request.marketHashes !== undefined) {
            queryParams.push(`marketHashes=${request.marketHashes.join(',')}`);
        }
        if (request.settled !== undefined) {
            queryParams.push(`settled=${request.settled ? 'true' : 'false'}`);
        }
        if (request.paginationKey !== undefined) {
            queryParams.push(`paginationKey=${request.paginationKey}`);
        }
        if (request.pageSize !== undefined) {
            queryParams.push(`pageSize=${request.pageSize}`);
        }
        if (request.baseToken !== undefined) {
            queryParams.push(`baseToken=${request.baseToken}`);
        }
        if (request.affiliate !== undefined) {
            queryParams.push(`affiliate=${request.affiliate}`);
        }
        if (this.chainVersion !== undefined) {
            queryParams.push(`chainVersion=${this.chainVersion}`);
        }

        //console.log(`queryParams: ${queryParams.join('&')}`);

        try {
            const resp = await axios.get<SportXITradeResponse>(
                `${this.urlBase}trades?${queryParams.join('&')}`,
                {
                    headers: this.headers,
                    ...(this.proxy && { proxy: this.proxy }),
                }
            );

            return resp.data;
        } catch (e: unknown) {
            console.log(e);
            throw new Error(
                `Response status code ${
                    (e as AxiosError).response?.status as number
                } got error  ${JSON.stringify(
                    (e as AxiosError).response?.data
                )}`
            );
        }
    }
}
