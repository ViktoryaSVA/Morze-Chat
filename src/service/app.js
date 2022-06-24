module.exports = (qwertyArray, message) => {

    const test = Object.entries(qwertyArray);
    const morzeWorlds = Object.values(qwertyArray);
  
    const userMessage = message;
    const newUserMessage = userMessage.split(' ');

    let num = 0;
    const testBuff = [];
    newUserMessage.forEach((element) => {
        if (morzeWorlds.includes(element)){
            console.log('It is morze text');
            for (key in qwertyArray){
                let value = qwertyArray[key];
                if (element == value) {
                    testBuff.push(key);
                    num += 1;
                }
            }
            
        } else {
        
            console.log('ERROR');
        
        }

    })    
    console.log(testBuff.toString());

};