const baseurl = "http://api.login2explore.com:5577";
var tak_List = [];

// put command to add a task in JPDB
document.querySelector("#addTask").addEventListener("click", function () {
  let task = document.querySelector("#text");
  if (task.value != "") {
    let jsonData = {
      id: Math.random() + 1,
      text: task.value,
      completed: false,
    };
    let requestObj = {
      token: "90939266|-31949286908944203|90939709",
      dbName: "Tasks",
      rel: "task",
      cmd: "PUT",
      jsonStr: jsonData,
    };
    let url = baseurl + "/api/iml";
    let request = JSON.stringify(requestObj);
    $.post(url, request, function (result) {
      task.value = "";
      showTask();
    }).fail(function (result) {
      var dataJsonObj = result.responseText;
      console.log(JSON.parse(dataJsonObj));
    });
    alert("Task added in your ToDo list Success fully");
  }

});


// Funtion to delete a task from JPDB
const deleteTask = async (id, rec_no) => {
  let requestObj = {
    token: "90939266|-31949286908944203|90939709",
    dbName: "Tasks",
    rel: "task",
    cmd: "REMOVE",
    record: rec_no,
    jsonStr: { id: id },
  };
  let url = baseurl + "/api/iml";
  let request = JSON.stringify(requestObj);
  $.post(url, request, function (result) {
    console.log(JSON.parse(result));
    showTask();
  }).fail(function (result) {
    var dataJsonObj = result.responseText;
    console.log(JSON.parse(dataJsonObj));
  });
  alert("Task deleted Successfully");
};


//Function to Update a Task in JPDB
function updateText(rec_no) {
  let json_records = `{"${rec_no}":{"text":"${
    document.querySelector(`#text${rec_no}`).value
  }"}}`;
  let requestObj = `{"token":"90939266|-31949286908944203|90939709","dbName":"Tasks","rel":"task","cmd":"UPDATE","jsonStr":${json_records}}`;
  let url = baseurl + "/api/iml";
  let request = requestObj;
  $.post(url, request, function (result) {
    document.querySelector(`#close${rec_no}`).click();
    showTask();
  }).fail(function (result) {
    var dataJsonObj = result.responseText;
    console.log(JSON.parse(dataJsonObj));
  });
  alert("Task is updated Successfully")
}


//Function to Check a completed task
function toggleCheck(rec_no, completed) {
  let json_records = `{"${rec_no}":{"completed":"${!completed}"}}`;
  let requestObj = `{"token":"90939266|-31949286908944203|90939709","dbName":"Tasks","rel":"task","cmd":"UPDATE","jsonStr":${json_records}}`;
  let url = baseurl + "/api/iml";
  let request = requestObj;
  $.post(url, request, function (result) {
    showTask();
  }).fail(function (result) {
    var dataJsonObj = result.responseText;
    console.log(JSON.parse(dataJsonObj));
  });
  if(document.getElementById("checkbox").checked === false){
    alert("Task Unchecked")
  }
  else{
    alert("Task Completed")
  }
}


// Function to fetch tasks from JPDB and display on webpage
function showTask() {
  const list = document.querySelector(".tasks");
  list.innerHTML = "";
  let requestObj = {
    token: "90939266|-31949286908944203|90939709",
    dbName: "Tasks",
    rel: "task",
    cmd: "GET_ALL",
    pageNo: 1,
    pageSize: 25,
    createTime: true,
    updateTime: true,
  };
  let url = baseurl + "/api/irl";
  let request = JSON.stringify(requestObj);
  $.post(url, request, function (result) {
    const data = JSON.parse(JSON.parse(result).data).json_records;
    data.forEach((element) => {
      if (element.record != null) {
        let li = document.createElement("li");
        let updateButton = document.createElement("i");
        updateButton.className = "fas fa-edit";
        updateButton.setAttribute("data-bs-toggle", "modal");
        updateButton.setAttribute(
          "data-bs-target",
          `#exampleModal${element.rec_no}`
        );
        let deleteButton = document.createElement("i");
        deleteButton.className = "fas fa-trash";
        deleteButton.setAttribute(
          "onclick",
          `deleteTask(${element.record.id},${element.rec_no})`
        );
        // <input type="checkbox" >
        let checkbox = `<input type="checkbox" id="checkbox" ${
          element.record.completed === "true" ? "checked" : ""
        } onclick="toggleCheck(${element.rec_no},${
          element.record.completed
        })">`;
        li.innerHTML += `${checkbox}`;

        li.setAttribute("class", "list-group-item");
        li.innerHTML += element.record.text;
        li.appendChild(updateButton);
        li.appendChild(deleteButton);
        list.appendChild(li);
        list.innerHTML += `<div class="modal fade" id="exampleModal${element.rec_no}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <input type="text" class="form-control" id="text${element.rec_no}" value="${element.record.text}">
                  </div>
                  <div class="modal-footer">
                    <button type="button" id="close${element.rec_no}" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="updateText(${element.rec_no})">Save changes</button>
                  </div>
                </div>
              </div>
            </div>`;
      }
    });
  }).fail(function (result) {
    var dataJsonObj = result.responseText;
    console.log(JSON.parse(dataJsonObj));
  });
}


window.onload = function () {
  showTask();
};
