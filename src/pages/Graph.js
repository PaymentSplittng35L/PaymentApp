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

    //basically, will look at each edge that originates at this vertex and push them to retList
    //edge[0] is the destination and edge[1] is weight getName() is the source
    //So basically, retList will now have every edge originating at this specific node
    getEdges(){
        var retList = []
        this.myedges.forEach(edge =>{
            retList.push([this.getName(),edge[0],edge[1]]); 
        });
        return retList
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
        
    } //ok makes sense
    //What this does is intializes a list called allEdges, then iterates through every node in the graph
    //And calls the getEdges method to get all edges that originate at that vertex in the form [src,dest,weight]
    //And then takes the list of all those edges and appends each edge to the allEdges list
    getGraphName(){
        return this.name;
    }
    addAnEdge(src,dst,weight){
        this.nodeList.forEach(node =>{
            if(node.getName() === src){
                node.addEdge(dst,weight);
            }
        });
    }
    getAllEdges(){
        var allEdges = [];
        this.nodeList.forEach(node =>{
            var tempEdges = node.getEdges();
            if(tempEdges.length !== 0){
            
                tempEdges.forEach(edge =>{
                    allEdges.push(edge);
                });
            }   
        });
        return allEdges;
    }
    //should give us all the names of the people
    getAllNames(){
        var allNames = [];
        this.nodeList.forEach(node =>{
            allNames.push(node.getName());
        });
        return allNames;
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

    parseOptimization(listOfLists){
        listOfLists.forEach(edge =>{
            var srcIndex = this.nodeList.findIndex(source => source.getName() === edge[0]);
            this.nodeList[srcIndex].addEdge(edge[1],edge[2]);
        });
    }
    
    Optimize(){
        this.caseA();
        this.caseB();
    }


    groupPurchase(payer, debts, total){
        const divideTotal = total/(debts.length+1);
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
