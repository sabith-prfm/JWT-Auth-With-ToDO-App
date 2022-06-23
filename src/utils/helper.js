const conn = require("../connection/connection");

exports.findChildIdsToDelete = async (subTasks, subTaskObj, cb) => {
  let finalIds = {};
  let subTaskCount = Object.keys(subTasks).length;
  let dummy = {};

  Object.keys(subTasks).forEach((parentTask, parentIndex) => {
    let useUpdatedValue = false;
    finalIds[parentTask] = [];
    //function to loop on subIds
    function recursiveFunction() {
      let dbCalls;
      dummy = useUpdatedValue
        ? Object.values(subTasks).flat()
        : subTasks[parentTask];

      // console.log(">>>>subTasks", subTasks,dummy);
      dummy.length > 0 &&
        dummy?.forEach((item) => {
          let selectQry = `select * from childTable where parentId='${item}'`;
          //Promise to fullfill all dbCalls in each level looping
          dbCalls = new Promise((resolve, reject) => {
            conn.mySql.query(selectQry, (err, selectResp) => {
              if (err) reject(err);

              //finding child is in_progress or not
              let isInProgress = selectResp?.find(
                (item) => item.status === "IN_PROGRESS"
              );

              if (isInProgress || finalIds[parentTask] === undefined) {
                //removing duplicate elements and removing the inProgress child's parentElement
                finalIds[parentTask] = [...new Set(finalIds[parentTask])];
                let key = parentTask;
                delete finalIds[key];
                resolve(finalIds);
              } else {
                //adding and removing duplicates the parent elment if it's child is not in inProgress
                finalIds[parentTask].push(item);
                finalIds[parentTask] = [...new Set(finalIds[parentTask])];

                //creating next reccursiveFunction's subTasks
                subTaskObj[item] = selectResp?.map((item) => item.taskId);
                resolve(subTaskObj);
              }
            });
          });
        });

      // if (dbCalls) {
      dbCalls
        .then((promiseResp) => {
          // console.log(">>>>>>>>>>>flatten", promiseResp)
          //flattenArrayValues is used to when to stop reccursion
          let flattenArrayValues = Object.values(promiseResp).flat();

          if (flattenArrayValues?.length > 0) {
            useUpdatedValue = true;
            subTaskObj = {};
            subTasks = promiseResp;

            recursiveFunction();
          } else {
            //returning the ids to delete as a CB

            subTaskCount === parentIndex + 1 && cb(finalIds);
          }
        })
        .catch((err) => console.log(">>>>>>>>>>>", err));
      // } else {
      //   subTaskCount === parentIndex + 1 && cb(finalIds);
      // }
    }

    recursiveFunction();
  });
};
