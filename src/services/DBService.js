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
                this.addProject("Sample Project", "An example of a tracked project");
            }
        });

        this.db.nodes.toArray().then(nodes => {
            if (nodes.length <= 0) {
                this.addNode(1, "v0.5 - The Big Update", "The big update implementing lots of features and fixes lots of bugs!", 0, 0, 900, [], [2, 10, 12], false, []);
                    this.addNode(1, "Features", "", 0, 500, 450, [1], [3, 7], false, []);
                        this.addNode(1, "UI", "", 0, 1000, 200, [2], [4, 5, 6], false, []);
                            this.addNode(1, "A pending task", "", 2, 1500, 0, [3], [], false, []);
                            this.addNode(1, "Another pending task", "", 2, 1500, 200, [3], [], false, []);
                            this.addNode(1, "A finished task", "", 3, 1500, 400, [3], [], false, []);
                        this.addNode(1, "Functionality", "", 0, 1000, 700, [2], [8, 9], false, []);
                            this.addNode(1, "A cancelled task", "", 1, 1500, 600, [7], [], false, []);
                            this.addNode(1, "A finished task", "", 3, 1500, 800, [7], [], false, []);
                    this.addNode(1, "Fixes", "", 0, 500, 1000, [1], [11], false, []);
                        this.addNode(1, "A major bug", "This bug is finally squashed! Good job, team!", 3, 1000, 1000, [10], [], false, []);
                    this.addNode(1, "Known Bugs", "", 0, 500, 1300, [1], [13, 14], false, []);
                        this.addNode(1, "A major bug", "", 2, 1000, 1200, [12], [], false, []);
                        this.addNode(1, "A minor bug", "Allan, please add details.", 0, 1000, 1400, [12], [], false, []);
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

    addNode(projectId, title, description, state, initialX, initialY, connectedFrom, connectedTo, hasChecklist, checklist) {
        const node = {
            projectId,
            title,
            description,
            state,
            initialX,
            initialY,
            connectedFrom,
            connectedTo,
            hasChecklist,
            checklist
        };

        return this.db.nodes.add(node);
    }
}

export default new DBService();