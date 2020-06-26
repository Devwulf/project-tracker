import Dexie from 'dexie';

class DBService {
    // TODO: Eventually use the # hastag private class fields
    constructor() {
        this.db = new Dexie('ProjectTrackerDB');
        // This means it creates a projects table with
        // an id primary key and an indexed title column
        this.db.version(1).stores({ projects: "++id,title" });
        this.db.open().catch(e => {
            console.error("Opening the db '" + this.db.name + "' failed: " + e);
        });
    }

    get projects() {
        return this.db.projects;
    }

    addProject(title, description) {
        const project = {
            title, 
            description
        };

        return this.db.projects.add(project);
    }
}

export default new DBService();