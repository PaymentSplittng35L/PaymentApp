class Message{
    constructor(name, amount, groupname){
        this.person = name;
        this.howmuch = amount;
        this.org = groupname;
    }

    MyName(){
        return this.person;
    }

    MyAmount(){
        return this.howmuch;
    }

    MyGroup(){
        return this.org;
    }


}

class Messages{
    constructor(list){
        this.collection = [];
        for(var i = 0; i < list.len; i++){
            this.collection[i] = new Message(list[i][0], list[i][1], list[i][2]);
        }
    }


}


export{Message, Messages};