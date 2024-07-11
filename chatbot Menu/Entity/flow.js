class Flow {
    constructor(id, name, description, parent_id, flows) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.parent_id = parent_id;
        this.flows = flows || [];
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
        return new Flow(
            json.id,
            json.name,
            json.description,
            json.parent_id,
            json.flows ? json.flows.map(Flow.fromJSON) : []
        );
    }
}

module.exports = Flow;
