import { db } from './db';

export const getSettings = async () => {
    return await db.settings.get(1);
};

export const updateSettings = async (settings) => {
    return await db.settings.put({ id: 1, ...settings });
};
