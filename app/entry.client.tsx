/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { type BettorNames } from './db/names';

declare global {
    interface Window {
        $ssbettorNames: BettorNames;
    }
}

const bettorsName = localStorage.getItem('bettorsName');

if (bettorsName !== null) {
    window.$ssbettorNames = JSON.parse(bettorsName);
} else {
    window.$ssbettorNames = {};
}

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <RemixBrowser />
        </StrictMode>
    );
});
