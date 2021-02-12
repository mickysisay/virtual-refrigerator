const SECRETKEYJWT = 'secret';
const SECRETSALT = 'anotherSecret';
const SALTROUNDS = 10;
const EXPIRATIONTIME = "5m";

let mockUsers = [
    
];


module.exports = {
    SECRETKEY : SECRETKEYJWT,
    SECRETSALT : SECRETSALT,
    SALTROUNDS : SALTROUNDS,
    mockUsers : mockUsers,
    EXPIRATIONTIME : EXPIRATIONTIME
}