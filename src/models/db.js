import { Dexie } from 'dexie';
import { config } from '../config';

export const db = new Dexie('colyricsDB');

db.version(1).stores({
    settings: 'id',
});

// Populates default settings on first load
db.on.populate.subscribe(() => {
    db.on.ready.subscribe((db) => {
        db.settings.put({
            id: 1,
            view: {
                theme: config.view.defaultTheme,
                layout: config.view.defaultLayout,
            }
        })
    })
})
