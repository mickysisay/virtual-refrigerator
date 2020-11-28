const SECRETKEYJWT = 'secret';
const SECRETSALT = 'anotherSecret';
const SALTROUNDS = 10;
const EXPIRATIONTIME = "5m";

let mockUsers = [
    {
        id :1,
        username:'mike',
        email:'something@gmail.com' 
    },{
        id:2,
        username:"micky",
        email: "micky@gmail.com"
    }
];


module.exports = {
    SECRETKEY : SECRETKEYJWT,
    SECRETSALT : SECRETSALT,
    SALTROUNDS : SALTROUNDS,
    mockUsers : mockUsers,
    EXPIRATIONTIME : EXPIRATIONTIME
}