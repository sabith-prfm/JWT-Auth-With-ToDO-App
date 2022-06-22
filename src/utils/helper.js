const conn = require("../connection/connection");

exports.findChildIdsToDelete = async (subTasks, subTaskObj, cb) => {
  let finalIds = [];

  Object.keys(subTasks).forEach((parentTask, parentIndex) => {
    let flag = true;
    //function to loop on subIds
    function recursiveFunction() {
      let dbCalls;

      console.log(">>>>subTasks", subTasks);
      subTasks[parentTask]?.length > 0 &&
        subTasks[parentTask]?.forEach((item) => {
          // let selectQry = `select * from taskRelation WHERE parentId='${item}'`;
          let selectQry = `select * from taskRelation INNER JOIN tasks ON taskRelation.parentId=tasks.id WHERE taskRelation.parentId='${item}'`;
          //Promise to fullfill all dbCalls in each level looping
          dbCalls = new Promise((resolve, reject) => {
            conn.mySql.query(selectQry, (err, selectResp) => {
              if (err) reject(err);

              //finding child is in_progress or not
              let isInProgress = selectResp?.find(
                (item) => item.status === "IN_PROGRESS"
              );

              console.log(">>>?????", isInProgress);

              if (isInProgress) {
                //removing duplicate elements and removing the inProgress child's parentElement
                finalIds = [...new Set(finalIds)];
                finalIds.splice(parentIndex, 1);
                resolve({});
              } else {
                //adding and removing duplicates the parent elment if it's child is not in inProgress
                finalIds.push(item);
                finalIds = [...new Set(finalIds)];

                //creating next reccursiveFunction's subTasks
                subTaskObj[item] = selectResp?.map((item) => item.taskId);
                resolve(subTaskObj);
              }
            });
          });
        });

      if (dbCalls) {
        dbCalls
          .then((promiseResp) => {
            //flattenArrayValues is used to when to stop reccursion
            let flattenArrayValues = Object.values(promiseResp).flat();

            if (flattenArrayValues?.length > 0) {
              flag = false;
              subTaskObj = {};
              subTasks = promiseResp;

              recursiveFunction();
            } else {
              //returning the ids to delete as a CB
              cb(finalIds);
            }
          })
          .catch((err) => console.log(">>>>>>>>>>>", err));
      } else {
        cb(finalIds);
      }
    }

    flag && recursiveFunction();
  });
};
