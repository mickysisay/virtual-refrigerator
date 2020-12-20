const SECRETKEYJWT = 'secret';
const SECRETSALT = 'anotherSecret';
const SALTROUNDS = 10;
const EXPIRATIONTIME = "20m";

let mockUsers = [
    
];


module.exports = {
    SECRETKEY : SECRETKEYJWT,
    SECRETSALT : SECRETSALT,
    SALTROUNDS : SALTROUNDS,
    mockUsers : mockUsers,
    EXPIRATIONTIME : EXPIRATIONTIME
}