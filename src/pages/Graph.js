class Node{
    constructor(prop1){
        this.name = prop1;
        this.myedges = [];
    }
    getName(){
        return this.name;
    }
    addEdge(dest,weight){
        this.myedges.push([dest,weight]);
    }
    edgeExist(nameOfEdge) {
        for (const edge of this.myedges) {
          if (edge[0] === nameOfEdge) {
            return true;
          }
        }
        return false;
      }
      getWeight(nameOfEdge) {
        for (const edge of this.myedges) {
          if (edge[0] === nameOfEdge) {
            return edge[1];
          }
        }
        // Return a default value or handle the case when the edge is not found
        return null; // or throw an error, depending on your requirements
      }
    delEdge(dest) {
        const index = this.myedges.findIndex(([d]) => d === dest);
        if (index !== -1) {
          this.myedges.splice(index, 1);
        }
    }
    removeEdgesByDestination(dest) {
        this.myedges = this.myedges.filter(([destination, _]) => destination !== dest);
    }
    printEdges() {
        console.log(`Edges for Node ${this.name}:`);
        this.myedges.forEach(([dest, weight]) => {
          console.log(`Destination: ${dest}, Weight: ${weight}`);
        });
    }
    removeParallelEdges(){
        for(var i = 0; i < this.myedges.length; i++){
            const candidate = this.myedges[i][0];
            var len = 0;
            for(var j = 0; j < this.myedges.length; j++){
                if(this.myedges.at(j)[0] === candidate){
                    len = len + this.myedges.at(j)[1];
                }
            }
            this.removeEdgesByDestination(candidate);
            this.addEdge(candidate, len);
        }
    }

}


class Graph{

    constructor(prop1,prop2){
        this.name = prop1;
        this.nodeList = [];
        
        for(var i = 0; i < prop2.length; i++){
            this.nodeList.push(new Node(prop2[i]));
        }
        
    }

    caseA(){
        this.nodeList.forEach(node =>{
            node.removeParallelEdges();
        });
    }

    caseB(){
        for(var i = 0; i < this.nodeList.length; i++){
            var candidate = this.nodeList[i];
            for(var j = 0; j < this.nodeList.length; j++){
                if(candidate.edgeExist(this.nodeList[j].getName())){
                    if(this.nodeList[j].edgeExist(candidate.getName())){
                        var startend = candidate.getWeight(this.nodeList[j].getName());
                        var endstart = this.nodeList[j].getWeight(candidate.getName());
                        var finalEnd = startend - endstart;
                        candidate.delEdge(this.nodeList[j].getName());
                        this.nodeList[j].delEdge(candidate.getName());
                        if(finalEnd>0){
                            candidate.addEdge(this.nodeList[j].getName(),finalEnd);
                        }
                        if (finalEnd < 0){
                            finalEnd = -finalEnd;
                            this.nodeList[j].addEdge(candidate.getName(), finalEnd);
                        }
                    }
                }
                
            }
            
        }
    }
    
    Optimize(){
        this.caseA();
        this.caseB();
    }


    groupPurchase(payer, debts, total){
        const divideTotal = total/debts.length;
        var debtList = []
        this.nodeList.forEach(node =>{
            if(debts.includes(node.getName())){
                debtList.push(node);
            }
        });
        
        debtList.forEach(dude => {
            dude.addEdge(payer,divideTotal);
        });
    }

    printNodesAndEdges() {
        console.log(`Nodes and Edges in Graph ${this.name}:`);
        this.nodeList.forEach((node) => {
          console.log(`Node: ${node.getName()}`);
          node.printEdges();
        });
      }
    
    
}

export {Node,Graph};
