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
                this.addProject("Project Tracker", "A project tracker and planner for this web app");
            }
        });

        this.db.nodes.toArray().then(nodes => {
            if (nodes.length <= 0) {
                this.addNode(1, "v1.0 - Initial Release", "The feature complete version of this web app", 0, 0, 1250, [], [2, 3], false, []);
                this.addNode(1, "Features", "", 0, 500, 1000, [1], [4, 5], false, []);
                this.addNode(1, "Bugs", "", 0, 500, 2500, [1], [], false, []);
                this.addNode(1, "UI", "", 0, 1000, 800, [2], [6, 7, 8, 9, 10, 11, 12, 13], false, []);
                this.addNode(1, "Functionality", "", 0, 1000, 1800, [2], [14, 15, 16], false, []);
                this.addNode(1, "Checklist in node", "Another option of tracking stuff besides creating nodes", 2, 1500, 0, [4], [], false, []);
                this.addNode(1, "Comment nodes", "Special nodes that could be used to comment certain parts of the graph", 0, 1500, 200, [4], [], false, []);
                this.addNode(1, "Grouping nodes together", "Wrapping nodes in a nameable group node that could move all the grouped nodes together", 0, 1500, 400, [4], [], false, []);
                this.addNode(1, "Setting node states", "Either not started, cancelled, active, or finished", 3, 1500, 600, [4], [], false, []);
                this.addNode(1, "Connect node when dragging from another node", "Automatically connects new nodes when created by dragging using the plus knob", 3, 1500, 800, [4], [], false, []);
                this.addNode(1, "Reference nodes", "Be able to reference a node from somewhere else in the graph or a different project altogether, always syncing the reference with the real node", 0, 1500, 1000, [4], [], false, []);
                this.addNode(1, "Adding node from toolbar", "Be able to create a node directly from the toolbar by dragging it into the work area", 0, 1500, 1200, [4], [], false, []);
                this.addNode(1, "Tooltips", "Details about the functionality when hovering over, say, buttons", 0, 1500, 1400, [4], [], false, []);
                this.addNode(1, "Basic hotkeys", "Basic hotkeys like deleting a node, copy-pasting, duplicating, undo/redo, etc.", 0, 1500, 1600, [5], [], false, []);
                this.addNode(1, "Undo/Redo", "Keep track of an undo/redo history and be able to go back and forth", 0, 1500, 1800, [5], [], false, []);
                this.addNode(1, "Make node description optional", "", 3, 1500, 2000, [5], []);
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

    addNode(projectId, name, description, state, initialX, initialY, connectedFrom, connectedTo, hasChecklist, checklist) {
        const node = {
            projectId,
            name,
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