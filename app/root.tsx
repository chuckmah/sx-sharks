import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useLocation,
    type MetaFunction,
} from '@remix-run/react';
import { useEffect } from 'react';

import { Layout } from './components/layout';
import styles from './styles.css';
import { pageview } from './utils/google-analytics/gtags.client';

export const meta: MetaFunction = () => {
    return [
        { title: 'SX Sharks' },
        { name: 'description', content: 'unofficial sx.bet stats site' },
    ];
};

export const links: LinksFunction = () => [
    ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
    { rel: 'stylesheet', href: styles },
];

export const loader = async () => {
    return json({ gaTrackingId: process.env.GA_TRACKING_ID });
};

export default function App() {
    const location = useLocation();
    const { gaTrackingId } = useLoaderData<typeof loader>();

    useEffect(() => {
        if (gaTrackingId?.length) {
            pageview(location.pathname, gaTrackingId);
        }
    }, [location, gaTrackingId]);

    return (
        <html lang="en" data-theme="dark" className="dark">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <Layout>
                    <Outlet />
                </Layout>

                <ScrollRestoration />
                <Scripts />
                <LiveReload />
                {process.env.NODE_ENV === 'development' ||
                !gaTrackingId ? null : (
                    <>
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
                        />
                        <script
                            async
                            id="gtag-init"
                            dangerouslySetInnerHTML={{
                                __html: `
                                        window.dataLayer = window.dataLayer || [];
                                        function gtag(){dataLayer.push(arguments);}
                                        gtag('js', new Date());

                                        gtag('config', '${gaTrackingId}', {
                                            page_path: window.location.pathname,
                                        });
                                    `,
                            }}
                        />
                    </>
                )}
            </body>
        </html>
    );
}
