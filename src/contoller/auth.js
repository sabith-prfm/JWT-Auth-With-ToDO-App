const jwt = require("jsonwebtoken");
const conn = require("../connection/connection");

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    let qry = `select * from users where userName='${userName}' and password='${password}'`;

    conn.mySql.query(qry, (err, result) => {
      if (err || result?.length == 0) {
        res
          .status(401)
          .send({ message: "No user is Found in Provided Database" });
      } else {
        //data to be encoded in JWT
        const resp = {
          id: result[0]?.id,
          userName: result[0]?.userName,
          //   firstName: result[0].firstName,
          //   lastName: result[0].lastName,
        };

        //no expiration time is defined on token signIn
        let token = jwt.sign({ user: resp }, "secretkey");
        res.status(200).send({
          status: "success",
          message: "Authentication successful",
          data: {
            token: token,
            display_name: result[0].firstName + " " + result[0].lastName,
          },
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: `Unable to login due to... ${err}`,
    });
  }
};

module.exports = {
  login,
};
