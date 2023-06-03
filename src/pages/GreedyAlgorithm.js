import {Node,Graph} from './Graph.js'
class OptimizeCosts{
    constructor(inputGraph){
        this.allEdges = [];
        inputGraph.getAllEdges().forEach(edge =>{
            this.allEdges.push(edge);
        });
        this.nameList = [];
        inputGraph.getAllNames().forEach(name =>{
            this.nameList.push(name);
        });
    }

    calculate(){
        if(this.allEdges.length === 0){
            return;
        }
        console.log(this.allEdges);
        const deltalist = [];
        //deltalist.forEach(delta => (delta[1] = 0));
        console.log(this.nameList);
        //should we store based on name or UID ok
        //UID but for now lets do name we can edit all this stuff later
        //should take like an hour
        //wait lets first intialize the tuples with the weight being zero
        console.log("Before enter loop", deltalist);
        for(var i = 0;i<this.nameList.length;i++){
            var templist = [this.nameList[i],5];
            templist[1] -=5;
            deltalist.push(templist);
            console.log("Just added element: ", deltalist);
        }
        //This look right? yeah
        //so u have to search for the righ tname in deltalist first right
        //Yeah
        //theres like a neat way to do this in like one line oh acually" interesting 
        //its like basically in python when you have like that weird stuff like [line.get_hash() for line in blah blah]
        //Iterate through all the edges and for each edge we will modify the deltalist weights
        //No i think thats edge[2]
        //edge[2] is how much src owes destination
        //Ya
        //we have to update both src/destination so we need  both those index values
        //delt

        //wait when we add a new payment we'll have to recompute all this right? cuz technically we could just add the deltas
        //but the issue is if people pay off some of the payments in the middle then we need to reclaculate so 
        //prob better to do yeah
        //no your right we do have to completely recalculate everytime a new payment is made
        //But the thing is yeah
        //do u guys have a way to test all the graph stuff ok
        //Thats where the graph could be nice if we just delete edges on the graph after payment your algo
        //Will still work good on that new graph
        //lemme just reread this thing for sanity
        
        //yeah i can test this too 
        //pretty easily
        
        //Its just a matter of it would be nice if after we do all the matrix stuff we just make a New graph
        //with each edge being like the final payments
        //ok looks good lets move on
        //yeah we should for inbox thing mb 
        //are we still doing the optimization stuff u guys had ok
        this.allEdges.forEach(edge =>{
            var srcindex = deltalist.findIndex(([source, _]) => source === edge[0]);
            var dstindex = deltalist.findIndex(([dest, _]) => dest === edge[1]);
            console.log(dstindex);

            console.log("Adding", edge[2], "to ", deltalist[srcindex][0])
            deltalist[srcindex][1] = deltalist[srcindex][1] + edge[2];
            deltalist[dstindex][1] = deltalist[dstindex][1] - edge[2];
            console.log("Taking", edge[2], "from ", deltalist[dstindex][0])
            console.log(deltalist);
        });
        console.log(deltalist);
        //yeah this thing should handle that anyways
    
        //How does your thing work again, if A owes B 10, who gets negative 10 and who gets positive 10
        //if A owes $10 to B then deltaB -= 10 and deltaA += 10 gotcha
        //I see
        //Ok so i will make two lists
        //Delta list containing the actual delta values
        //And name list for the corresponding names and the index i for both list should correspond to same person
        //name[i] = A and delta[i] = delta value for A
        //cuz like delta A/B is a sngle value u keep changing for all the edges yeah
       //yeah we can either sepaarate array into positive or negative, or just do weird index stuff like jump to next positive/jump to next negative but t
       //that could get annoying
        //So now, we have all of the deltas calculated right
        //so just greedy algorithm?

        //Greedy algorithm:
        //ok lets separate that makes way more sense

        const positiveArray = [];
        const negativeArray = [];

        //gotcha
//what do we do if its zero //just ignore cuz that person chill
        deltalist.forEach(delta =>{
            if(delta[1] >0){
                positiveArray.push([delta[0],delta[1]]);
            }
            else if(delta[1] < 0){
                negativeArray.push([delta[0],delta[1]]);
            }
        });
        console.log("END: The positive is ", positiveArray[0]);
        console.log("END: The negative is ", negativeArray[0]);


//ok looks good now lets do greedy algorithm
//how do we store the payments like who pays who, make new graph? 
//Yeah we need to do that but lets think for a sec
//I think
//We can make new Node objects
//And we can add edges to those Nodes
//And just intiaizlie the graph as a list of nodes
//so like src owes "weight" to dst ?
//ya
//and also give me a list of names for like people who need to pay
//At the end of the greedy algorithm give me a list of lists [[src,dst,weight],[src,dst,weight]]
        
        var posIndx = 0;
        var negIndx = 0;
        const fullList = []; 

        //greedy algorithm, pay full
        while((posIndx < positiveArray.length) && (negIndx<negativeArray.length)){
            console.log("MOVING NEGATIVES ",negativeArray[negIndx][0],negativeArray[negIndx][1]);

            if(positiveArray[posIndx][1] <= (-1 * negativeArray[negIndx][1])){
                fullList.push([positiveArray[posIndx][0], negativeArray[negIndx][0], positiveArray[posIndx][1]]);
                negativeArray[negIndx][1] += positiveArray[posIndx][1];
                positiveArray[posIndx][1] = 0;
                posIndx += 1;
                if(negativeArray[negIndx][1] <0.1 && negativeArray[negIndx][1]>-0.1){
                    negativeArray[negIndx][1] = 0;
                }

                if(negativeArray[negIndx][1] === 0){
                    console.log("MOOOVED");
                    negIndx += 1;
                }
                console.log("FULLLIST IS : ",fullList[2]);
            }
            else{
                fullList.push([positiveArray[posIndx][0], negativeArray[negIndx][0], (-1 * negativeArray[negIndx][1])]);
                positiveArray[posIndx][1] -= (-1 * negativeArray[negIndx][1]);
                negativeArray[negIndx][1] = 0;
                console.log("MOOOVED2");

                negIndx += 1;
            }
        }

        console.log("FULL LIST IS : ", fullList);
        
        //[40, 30, 10, 90]
        //[-80, -10, -10, -70 ]


        //creating the new Graph
        this.retGraph = new Graph("myretgraph",this.nameList);
    this.retGraph.parseOptimization(fullList); 
        
    }
    
    getGraph(){
        return this.retGraph;
    }




}

//If there is an edge originating from A with destination B with weight 10 that means A owes B 10
//We can just log that directly in a list with A -10 and B 10 or other way around i dont remember
//b4, just whats scraped from firebase directly
//Basically, we comb through firebase and for each event lets say A payed 100 and there are 5 other members of the group
//It will do 100/5= 20 and create an edge at each other member to A with weight 20

//Yeah thats true but we already built code for making it a graph so ya basically just like dont wanna build other stuff
//Plus logging it as a graph could be nice just as a datastructure idk
//Not a big deal it should work with your algorithm after calling getALlEdges



//wait if we're doing this delta idea, what is the weight for the edge
//is this like the values after u go through th ealgorithm or b4? 
//but what do we use the graph for cuz u could just store the delta values directoly lmao ok
//yeah true

export { OptimizeCosts }
