class Flow {
    constructor(name = '', description = '', flows = []) {
        this.name = name;
        this.description = description;
        this.flows = flows.map(flow => Flow.fromJSON(flow));
    }

    addFlow(flow) {
        if (flow instanceof Flow) {
            this.flows.push(flow);
        } else {
            throw new Error('El objeto debe ser una instancia de Flow');
        }
    }

    countFlows() {
        let count = 1;
        for (let flow of this.flows) {
            count += flow.countFlows();
        }
        return count;
    }

    static fromJSON(json) {
        return new Flow(json.name, json.description, json.flows);
    }
}

module.exports = Flow;
