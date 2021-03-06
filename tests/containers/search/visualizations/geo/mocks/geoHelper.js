import { geo } from '../../mockVisualizations';

// Fetch Transactions Total for Geo
export const performTransactionsTotalSearch = () => (
    {
        promise: new Promise((resolve) => {
            process.nextTick(() => {
                resolve({
                    data: geo
                });
            });
        }),
        cancel: jest.fn()
    }
);
