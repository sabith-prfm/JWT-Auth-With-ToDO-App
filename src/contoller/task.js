const cuid = require("cuid");
const helper = require("../utils/helper");
const conn = require("../connection/connection");

const createTask = async (req, res) => {
  try {
    //if the parentId is passed the task is considered as child Task otherwise it is a main Task
    let { taskName, taskStatus, completionDate, parentId } = req.body;
    let qry = "";
    let taskId = "task_" + cuid();

    //optional queries based on completionDate found
    if (completionDate) {
      qry = `insert into tasks(id,taskName,completionDate,status) values('${taskId}','${taskName}','${completionDate}','${taskStatus}')`;
    } else {
      qry = `insert into tasks(id,taskName,completionDate,status) values('${taskId}','${taskName}',NULL,'${taskStatus}')`;
    }

    conn.mySql.query(qry, (err, result) => {
      if (err) {
        res.status(500).send({ message: "Unable to create Tasks", data: err });
      } else {
        //if parentId is Found makes an update in taskRelation table
        if (parentId) {
          let relationInsertQuery = `insert into taskRelation(taskId,parentId) values('${taskId}','${parentId}')`;

          conn.mySql.query(
            relationInsertQuery,
            (err, succesResp) => succesResp
          );
        }

        res.status(200).send({
          status: "success",
          message: "Tasks created successfully",
          data: result,
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: `Unable to Create Tasks due to... ${err}`,
    });
  }
};

//used to support delete task controller for multiple delete
const deleteMultipleTask = (req, res) => {
  try {
    let { taskIds } = req.body;

    let qry = "DELETE FROM tasks WHERE (id) IN (?)";

    conn.mySql.query(qry, [taskIds], (err, result) => {
      if (err) {
        res.status(500).send({ message: "Unable to Delete Tasks", data: err });
      } else {
        res.status(200).send({
          status: "success",
          message: "Multiple Tasks Deleted successfully",
          data: result,
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: `Unable to Delete Tasks... ${err}`,
    });
  }
};

const deleteTask = (req, res) => {
  try {
    let { taskIds } = req.body;

    let idsToDelete = [];

    let selectQry = "select * from taskRelation WHERE (parentId) IN (?)";

    conn.mySql.query(selectQry, [taskIds], (err, result) => {
      if (err) {
        res.status(500).send({ message: "Unable to Delete Tasks", data: err });
      } else {
        let subTasks = {};
        let subTaskObj = {};

        //finding child taskIds o fthe parent ID
        taskIds?.forEach((inputId) => {
          let filteredArray = result?.filter(
            (item) => item.parentId === inputId
          );
          subTasks[inputId] = filteredArray?.map((item) => item.taskId);
        });

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> eg: format of subTasks starts>>>>>>>>>>>>>>>>>>>>>>>
        // {
        //   task_cl4nzcodf000083kzb96o3wnj: [
        //     'task_cl4nzp4yp0000zwkzacvp5qse',
        //     'task_cl4o0v1dv0000gqkz0dglaqbp',
        //     'task_cl4o1qnv20000mjkzegsvg84y',
        //     'task_cl4o1qsl00001mjkzbm8qh2rb'
        //   ],
        //   task_cl4nzp4yp0000zwkzacvp5qse: [
        //     'task_cl4o1tls60006mjkz50ub6x6e',
        //     'task_cl4o1tqki0007mjkz429u06v1',
        //     'task_cl4o1ttnm0008mjkz8m4lcq0w'
        //   ]
        // }
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>eg format ENDS>>>>>>>>>>>>>>>>>>>>>>>

        //finding the related child Id's who are not in  IN_PROGRSS state
        helper.findChildIdsToDelete(subTasks, subTaskObj, (value) => {
          console.log(">>>>>>>>>>>>from main", value);
          res.status(200).send({
            status: "success",
            message: "Tasks Deleted successfully",
            data: value,
          });
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: `Unable to Delete Tasks... ${err}`,
    });
  }
};

module.exports = {
  createTask,
  deleteMultipleTask,
  deleteTask,
};
