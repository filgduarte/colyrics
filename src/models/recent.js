import { db } from './db';
import { config } from '../config';

export const getRecentProjects = async () => {
    return await db.recentProjects.toArray();
};

export const getRecentProject = async (id) => {
    return await db.recentProjects.get(id);
};

export const addToRecentProjects = async (project) => {
    await db.recentProjects.add({
        ...project,
        timestamp: Date.now()
    });

    const allProjects = await db.recentProjects.orderBy('timestamp').reverse().toArray();

    // If the number of recent projects exceeds the configured limit, remove the oldest ones
    if (allProjects.length > config.recentProjectsSize) {
        const toRemove = allProjects.slice(config.recentProjectsSize);
        await Promise.all(toRemove.map(entry => db.recentProjects.delete(entry.id)));
    }
};

export const updateRecentProject = async (id, project) => {
    return await db.recentProjects.put({ id, ...project });
};

export const deleteRecentProject = async (id) => {
    return await db.recentProjects.delete(id);
};
