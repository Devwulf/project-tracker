import Dexie from 'dexie';

class DBService {
    // TODO: Eventually use the # hastag private class fields
    constructor() {
        this.db = new Dexie('ProjectTrackerDB');
        // This means it creates a projects table with
        // an id primary key and an indexed title column
        this.db.version(1).stores({ 
            projects: "++id,title",
            nodes: "++id,projectId"
        });
        this.db.open().catch(e => {
            console.error("Opening the db '" + this.db.name + "' failed: " + e);
        });

        this.seedData();
    }

    seedData() {
        this.db.projects.toArray().then(projects => {
            if (projects.length <= 0) {
                this.addProject("Adventure Game", "Creating a new, fun adventure game!");
                this.addProject("Test Project", "A simple test project.");
            }
        });

        this.db.nodes.toArray().then(nodes => {
            if (nodes.length <= 0) {
                this.addNode(1, "Test", "Description", 150, 100, [2], []);
                this.addNode(1, "Another Test", "Description", 200, 300, [3], [1]);
                this.addNode(1, "Another Another Test", "Description", 300, 450, [], [2]);
                this.addNode(2, "Different Project", "Description", 100, 200, [], []);
                this.addNode(2, "Another node", "Description", 150, 400, [], []);
            }
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

    get nodes() {
        return this.db.nodes;
    }

    addNode(projectId, name, description, initialX, initialY, connectedFrom, connectedTo) {
        const node = {
            projectId,
            name,
            description,
            initialX,
            initialY,
            connectedFrom,
            connectedTo
        };

        return this.db.nodes.add(node);
    }
}

export default new DBService();