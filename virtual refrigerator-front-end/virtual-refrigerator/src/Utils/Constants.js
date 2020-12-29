export const APPURL = "https://api-vr.ngrok.io/api/"//"http://192.168.1.21:5000/api/" //"http://localhost:5000/api/";

export const orderByFrequency = async (arr) =>{
    const counts = {};
    arr.forEach(element => {
        if(!counts[element]){
            counts[element] = 0;
        }
        counts[element]++;
    });
    let countt = 0;
    let largest;
    for(const prop in counts){
        if(countt === 0){
            largest = prop;
        }
        if(counts[prop] > counts[largest]){
            largest = prop;
        }
        countt++;
    }
    return largest;
}