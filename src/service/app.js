module.exports = (qwertyArray, message) => {

    const test = Object.entries(qwertyArray);
    const morzeWorlds = Object.values(qwertyArray);
  
    const userMessage = message;
    const newUserMessage = userMessage.split(' ');

    let num = 0;
    const testBuff = [];
    newUserMessage.forEach((element) => {
        let checkSpace = element;

        if (checkSpace == '/' || checkSpace == '') {
            testBuff.push(' ');
        }

        if (morzeWorlds.includes(element)){
            for (key in qwertyArray){
                let value = qwertyArray[key];
                if (element == value) {
                    testBuff.push(key);
                    num += 1;
                }
            }
            
        } else {
            console.error('ERROR');
        }

    })  
    const result = testBuff.join('');
    console.log(testBuff.join(''));

    return result;

};