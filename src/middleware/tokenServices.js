const jwt = require("jsonwebtoken");
const conn = require("../connection/connection");

//moddleware for JWT token verification
function verifyToken(req, res, next) {
  const bearerHeader = req?.headers["authorization"];

  if (typeof bearerHeader == "undefined") {
    console.log("invalid token");
    res.status(500).send({ message: "No token provided" }); //unauthorized client
  }

  //spliting the token from Bearer <token>
  let token = bearerHeader?.split(" ")[1];

  jwt.verify(token, "secretkey", (err, authData) => {
    if (err) {
      console.log("Authentication failed", err);
      res.status(401).send({ message: "Authentication failed" });
    } else {
      console.log("Authentication success", authData);
      let { user } = authData;

      //basic checking for firstName and lastName for token
      let qry = `select * from users where id='${user.id}' and userName='${user.userName}'`;

      conn.mySql.query(qry, (err, result) => {
        if (err || result?.length == 0) {
          res
            .status(401)
            .send({ message: "Authentication failed || invalid Token" });
        } else {
          next();
        }
      });
    }
  });
}

module.exports = { verifyToken };
