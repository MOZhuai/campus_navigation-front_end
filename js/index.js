var IP = "localhost";
var PATH = "http://" + IP + ":8080/mobileapp/";

// 考生
function loadExaminee() {
    $.ajax({
        url: PATH + "examinee/allExaminees",
        type: "get",
        success: function (result) {
            if(result.code === 100){
                var addExaminees = "<tr><th>编号</th><th>姓名</th><th>准考证号</th><th>性别</th><th>身份证号</th>" +
                    "<th>查询考生：<input type=\"text\" id=\"examinee-search\" placeholder=\"准考证号、姓名或身份证\"><button onclick=\"searchExaminee()\"><span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span></button></th></tr>"
                var index = 1;
                $.each(result.extend.examinees, function () {
                    addExaminees = addExaminees +
                        "<tr>" +
                            "<td>" + index + "</td>" +
                            "<td>" + this.name + "</td>" +
                            "<td>" + this.eid + "</td>" +
                            "<td>" + (this.gender?'女':'男') + "</td>" +
                            "<td>" + this.idCard + "</td>" +
                            "<td>" + "<button onclick=\"showInfoOnExamineeUpdateModel(" + this.id + ")\" id=\"update-examinee-position\" data-toggle=\"modal\" data-target=\"#examinee-update-model\" class=\"btn btn-primary btn-xs\">修改</button>" +
                                    "  <button onclick=\"showInfoOnSubjectManageModel(" + this.id + ")\" id=\"examinee-subject-manage\" data-toggle=\"modal\" data-target=\"#examinee-subject-manage-model\" class=\"btn btn-primary btn-xs\">考试科目</button>" +
                            "</td>" +
                        "</tr>";
                    index = index + 1;
                });
                document.getElementById("examinee-list").innerHTML = addExaminees;
            }
        }
    });
}
function showInfoOnSubjectManageModel(id) {
    $.ajax({
        url: PATH + "examinee/getById/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                document.getElementById("manage-examinee-id").value = result.extend.examinee.id;
                document.getElementById("manage-examinee-name").value = result.extend.examinee.name;
            }
        }
    });
    $.ajax({
        url: PATH + "examinfo/getById/" + id,
        type: "get",
        success: function (result) {
            var addSubjects = "<tr><th>编号</th><th>科目代码</th><th>名称</th><th>开始时间</th><th>结束时间</th><th>楼层</th><th>考场</th><th>座位号</th><th>操作</th></tr>";
            if(result.code == 100){
                var index = 1;
                $.each(result.extend.examineeSubjects, function () {
                    addSubjects = addSubjects +
                        "<tr>" +
                        "<td>" + index + "</td>" +
                        "<td>" + this.s.sid + "</td>" +
                        "<td>" + this.s.name + "</td>" +
                        "<td>" + this.s.startTime + "</td>" +
                        "<td>" + this.s.endTime + "</td>" +
                        "<td>" + this.b.bname + "</td>" +
                        "<td>" + this.room + "</td>" +
                        "<td>" + this.seat + "</td>" +
                        "<td>" + "<button type=\"button\" onclick=\"showUpdateExamineeSubjectModel(" + this.id + ")\" class=\"btn btn-primary btn-xs\">修改</button>" + "</td>" +
                        "</tr>";
                    index = index + 1;
                });
            }
            document.getElementById("examinee-subject-list").innerHTML = addSubjects;
        },
    });
}
function showUpdateExamineeSubjectModel(id) {
    $('#examinee-subject-manage-model').modal('hide');
    $('#examinee-subject-update-model').modal();
    $.ajax({
        url: PATH + "building/allBuilding",
        type: "get",
        success: function (result) {
            if(result.code === 100){
                document.getElementById("update-es-building").options.length = 0;
                $.each(result.extend.buildings, function () {
                    document.getElementById("update-es-building").options.add(new Option(this.bname, this.id));
                });
            }
        }
    });
    $.ajax({
        url: PATH + "examinfo/getByPk/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                var examineeSubject = result.extend.examineeSubject;
                document.getElementById("update-es-id").value = examineeSubject.id;
                document.getElementById("update-es-examinee").value = "(" + examineeSubject.examinee.eid + ")" + examineeSubject.examinee.name;
                document.getElementById("update-es-subject").value = "(" + examineeSubject.s.sid + ")" + examineeSubject.s.name;
                document.getElementById("update-es-building").selectedIndex = result.extend.bnumber - 1;
                document.getElementById("update-es-seat").value = examineeSubject.seat;
                buildingSelectedChangedOnUpdate("update-es-building", result.extend.roomNumber);
            }
        }
    });
}
function clickCloseBtnOnSubjectManageModel() {
    $('#examinee-subject-manage-model').modal();
}
function updateExamineeSubject(){
    var id = document.getElementById("update-es-id").value;
    var building = document.getElementById("update-es-building").value;
    var room = document.getElementById("update-es-room").value;
    var seat = document.getElementById("update-es-seat").value;
    $.ajax({
        url: PATH + "examinfo/update",
        type: "post",
        data: {
            id: id,
            building: building,
            room: room,
            seat: seat
        },
        success: function (result) {
            if(result.code === 100){
                alert("修改成功");
            } else {
                alert("修改失败");
            }
            $('#examinee-subject-manage-model').modal();
            $('#examinee-subject-update-model').modal('hide');
            showInfoOnSubjectManageModel(document.getElementById("manage-examinee-id").value);
        }
    });
}
function buildingSelectedChangedOnUpdate(id, selected){
    $.ajax({
        url: PATH + "keyPoint/getByBuildingDestination/" + document.getElementById(id).value,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                document.getElementById("update-es-room").options.length = 0;
                $.each(result.extend.keyPoints, function () {
                    document.getElementById("update-es-room").options.add(new Option(this.pname, this.pname));
                });
                if(selected !== -1){
                    document.getElementById("update-es-room").selectedIndex = selected - 1;
                }
            }
        }
    });
}
function buildingSelectedChanged(id){
    $.ajax({
        url: PATH + "keyPoint/getByBuildingDestination/" + document.getElementById(id).value,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                document.getElementById("insert-es-room").options.length = 0;
                $.each(result.extend.keyPoints, function () {
                    document.getElementById("insert-es-room").options.add(new Option(this.pname, this.pname));
                });
            }
        }
    });
}
function showInfoOnExamineeUpdateModel(id){
    $.ajax({
        url: PATH + "examinee/getById/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                document.getElementById("update-examinee-id").value = result.extend.examinee.id;
                document.getElementById("update-examinee-eid").value = result.extend.examinee.eid;
                document.getElementById("update-examinee-name").value = result.extend.examinee.name;
                document.getElementById("update-examinee-gender").selectedIndex = result.extend.examinee.gender;
                document.getElementById("update-examinee-idcard").value = result.extend.examinee.idCard;
            }
        }
    });
}
function deleteExamineeSubject(id, eid) {
    $.ajax({
        url: PATH + "examinfo/deleteById/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                alert("删除成功");
                showInfoOnSubjectManageModel(eid);
            } else {
                alert("删除失败");
            }
        }
    });
}
function updateExaminee(){
    var id = document.getElementById("update-examinee-id").value;
    var name = document.getElementById("update-examinee-name").value;
    var eid = document.getElementById("update-examinee-eid").value;
    var gender = document.getElementById("update-examinee-gender").selectedIndex;
    var idcard = document.getElementById("update-examinee-idcard").value;
    $.ajax({
        url: PATH + "examinee/update",
        type: "post",
        data: {
            id: id,
            eid: eid,
            name: name,
            gender: gender,
            idCard: idcard
        },
        success: function (result) {
            if(result.code === 100){
                alert("修改成功");
                window.location.reload();
            } else {
                alert("修改失败");
            }
        }
    });
}
function deleteExaminee(id){
    $.ajax({
        url: PATH + "examinee/delete/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                alert("删除成功");
                window.location.reload();
            } else{
                alert("删除失败");
            }
        }
    });
}
function insertExaminee() {
    var eid = document.getElementById("insert-examinee-eid").value;
    var name = document.getElementById("insert-examinee-name").value;
    var gender = document.getElementById("insert-examinee-gender").selectedIndex;
    $.ajax({
        url: PATH + "examinee/add",
        type: "post",
        data: {
            eid: eid,
            name: name,
            gender: gender
        },
        success: function (result) {
            if(result.code === 100){
                alert("添加成功");
                window.location.reload();
            } else {
                alert("添加失败，已存在考生的考号为" + eid);
            }
        }
    });
}
function insertExamineeSubject() {
    var examinee = document.getElementById("manage-examinee-id").value;
    var subject = document.getElementById("insert-es-id").value;
    var building = document.getElementById("insert-es-building").value;
    var room = document.getElementById("insert-es-room").value;
    var seat = document.getElementById("insert-es-seat").value;
    $.ajax({
        url: PATH + "examinfo/add",
        type: "post",
        data: {
            eid: parseInt(examinee),
            subject: parseInt(subject),
            building: parseInt(building),
            room: parseInt(room),
            seat: parseInt(seat)
        },
        success: function (result) {
            if(result.code === 100){
                alert("添加成功");
                showInfoOnSubjectManageModel(examinee);
            } else {
                alert("添加失败");
            }
        }
    });
}
function searchExaminee(){
    var searchInfo = document.getElementById("examinee-search").value;
    if(searchInfo != ""){
        $.ajax({
            url: PATH + "examinee/getBySearchInfo/"+ searchInfo,
            type: "get",
            success: function (result) {
                if(result.code === 100){
                    var addExaminees = "<tr><th>编号</th><th>姓名</th><th>准考证号</th><th>性别</th><th>身份证号</th>" +
                        "<th>查询考生：<input type=\"text\" id=\"examinee-search\" placeholder=\"准考证号、姓名或身份证\"><button onclick=\"searchExaminee()\"><span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span></button></th></tr>"
                    var index = 1;
                    $.each(result.extend.examinees, function () {
                        addExaminees = addExaminees +
                            "<tr>" +
                            "<td>" + index + "</td>" +
                            "<td>" + this.name + "</td>" +
                            "<td>" + this.eid + "</td>" +
                            "<td>" + (this.gender?'女':'男') + "</td>" +
                            "<td>" + this.idCard + "</td>" +
                            "<td>" + "<button onclick=\"showInfoOnExamineeUpdateModel(" + this.id + ")\" id=\"update-examinee-position\" data-toggle=\"modal\" data-target=\"#examinee-update-model\" class=\"btn btn-primary btn-xs\">修改</button>" +
                            "  <button onclick=\"showInfoOnSubjectManageModel(" + this.id + ")\" id=\"examinee-subject-manage\" data-toggle=\"modal\" data-target=\"#examinee-subject-manage-model\" class=\"btn btn-primary btn-xs\">考试科目</button>" +
                            "  <button onclick=\"deleteExaminee(" + this.id + ")\" class=\"btn btn-warning btn-xs\">删除</button>" +
                            "</td>" +
                            "</tr>";
                        index = index + 1;
                    });
                    document.getElementById("examinee-list").innerHTML = addExaminees;
                }
            }
        });
    }
}
// 学科
function loadSubjects() {
    $.ajax({
        url: PATH + "subject/allSubjects",
        type: "get",
        success: function (result) {
            if(result.code === 100){
                var addSubjects = document.getElementById("subject-list").innerHTML;
                var index = 1;
                $.each(result.extend.subjects, function () {
                    addSubjects = addSubjects +
                        "<tr>" +
                        "<td>" + index + "</td>" +
                        "<td>" + this.sid + "</td>" +
                        "<td>" + this.name + "</td>" +
                        "<td>" + this.startTime + "</td>" +
                        "<td>" + this.endTime + "</td>" +
                        "<td>" + "<button onclick=\"showInfoOnSubjectUpdateModel(" + this.id + ")\" id=\"update-subject\" data-toggle=\"modal\" data-target=\"#subject-update-model\" class=\"btn btn-primary btn-xs\">修改</button>"
                        + "  <button onclick=\"showInfoOnExamineeManageModel(" + this.id + ")\" id=\"insert-examinee-into-subject\" data-toggle=\"modal\" data-target=\"#insert-examinee-into-subject-model\" class=\"btn btn-primary btn-xs\">参考考生管理</button>"
                        + "  <button onclick=\"deleteSubjectModel(" + this.id + ")\" id=\"delete-subject\"class=\"btn btn-warning btn-xs\">删除</button>" +
                        "</td>" +
                        "</tr>";
                    index = index + 1;
                });
                document.getElementById("subject-list").innerHTML = addSubjects;
            }
        }
    });
}
function updateSubject() {
    var id = document.getElementById("update-subject-id").value;
    var name = document.getElementById("update-subject-name").value;
    var date = document.getElementById("update-subject-date").value;
    var starttime = document.getElementById("update-subject-starttime").value;
    var endtime = document.getElementById("update-subject-endtime").value;
    $.ajax({
        url: PATH + "subject/update",
        type: "post",
        data: {
            id: parseInt(id),
            name: name,
            startTime: new Date(date + " " + starttime + ":00"),
            endTime: new Date(date + " " + endtime + ":00")
        },
        success: function (result) {
            if(result.code === 100){
                alert("更新成功");
                window.location.reload();
            } else {
                alert("更新失败");
            }
        }
    });
}
function showInfoOnExamineeManageModel(id){
    $.ajax({
        url: PATH + "subject/getById/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                document.getElementById("insert-examinee-into-subject-id").value = result.extend.subject.id;
                document.getElementById("insert-examinee-into-subject-name").value = result.extend.subject.name;
                document.getElementById("insert-es-subject").value = "(" + result.extend.subject.sid + ")" + result.extend.subject.name;
            }
        }
    });
    $.ajax({
        url: PATH + "examinfo/getBySubject/" + id,
        type: "get",
        success: function (result) {
            var addExaminees = "<tr><th>编号</th><th>准考证号</th><th>姓名</th><th>性别</th><th>楼层</th><th>考场</th><th>座位号</th><th>操作</th></tr>";
            if(result.code === 100){
                var index = 1;
                $.each(result.extend.examineeSubjects, function () {
                    addExaminees = addExaminees +
                        "<tr>" +
                        "<td>" + index + "</td>" +
                        "<td>" + this.examinee.eid + "</td>" +
                        "<td>" + this.examinee.name + "</td>" +
                        "<td>" + (this.examinee.gender?"女":"男") + "</td>" +
                        "<td>" + (this.b?this.b.bname:"-") + "</td>" +
                        "<td>" + this.room + "</td>" +
                        "<td>" + this.seat + "</td>" +
                        "<td>" + "<button type=\"button\" onclick=\"deleteExamineeSubjectOnPageSubject(" + this.id + ", " + id + ")\" class=\"btn btn-primary btn-xs\">删除</button>" + "</td>" +
                        "</tr>";
                    index = index + 1;
                });
            }
            document.getElementById("insert-examinee-list").innerHTML = addExaminees;
        },
    });
    $.ajax({
        url: PATH + "building/allBuilding",
        type: "get",
        success: function (result) {
            if(result.code === 100){
                document.getElementById("insert-es-building").options.length = 0;
                $.each(result.extend.buildings, function () {
                    document.getElementById("insert-es-building").options.add(new Option(this.bname, this.id));
                });
            }
        }
    });
}
function showInsertExamineeOnSubjectModel(){
    $('#subject-insert-examinee-model').modal();
}
function insertExamineeInfoChanged(){
    var eid = document.getElementById("insert-es-eid").value;
    var name = document.getElementById("insert-es-name").value;
    var idcard = document.getElementById("insert-es-idcard").value;
    if(eid=="" && name=="" && idcard==""){
        document.getElementById("etip-show").style.display = "none";
    }else{
        $.ajax({
            url: PATH + "examinee/getByExample",
            type: "post",
            data: {
                eid: eid,
                name: name,
                idCard: idcard
            },
            success: function (result) {
                if(result.code === 100){
                    document.getElementById("etip-show").style.display = "block";
                    console.log(result.extend.examinees);
                    document.getElementById("examinee-tip").innerText = "(" + result.extend.examinees[0].eid + ") " + result.extend.examinees[0].name + " " + result.extend.examinees[0].idCard;
                    document.getElementById("examinee-tip").onclick = function () {
                        document.getElementById("insert-es-eid").value = result.extend.examinees[0].eid;
                        document.getElementById("insert-es-name").value = result.extend.examinees[0].name;
                        document.getElementById("insert-es-idcard").value = result.extend.examinees[0].idCard;
                        document.getElementById("insert-es-gender").selectedIndex = result.extend.examinees[0].gender;
                        document.getElementById("etip-show").style.display = "none";
                    }
                } else {
                    console.log("no such examinee!");
                    document.getElementById("etip-show").style.display = "none";
                }
            }
        });
    }
}
function insertExamineeIntoSubject(){
    var subject = document.getElementById("insert-examinee-into-subject-id").value;
    var building = document.getElementById("insert-es-building").value;
    var room = document.getElementById("insert-es-room").value;
    var seat = document.getElementById("insert-es-seat").value;
    var eid = document.getElementById("insert-es-eid").value;
    var name = document.getElementById("insert-es-name").value;
    var idcard = document.getElementById("insert-es-idcard").value;
    var gender = document.getElementById("insert-es-gender").value;
    $.ajax({
        url: PATH + "examinee/judgeInsert",
        type: "post",
        data: {
            eid: parseInt(eid),
            name: name,
            idCard: idcard,
            gender: parseInt(gender)
        },
        success: function (result) {
            if(result.code === 100){
                console.log(result.extend);
                $.ajax({
                    url: PATH + "examinfo/add",
                    type: "post",
                    data: {
                        eid: result.extend.examinee.id,
                        subject: parseInt(subject),
                        building: parseInt(building),
                        room: parseInt(room),
                        seat: parseInt(seat)
                    },
                    success: function (result) {
                        if(result.code === 100){
                            alert("添加成功");
                            showInfoOnExamineeManageModel(subject);
                            $('#insert-examinee-into-subject-model').modal();
                            $('#subject-insert-examinee-model').modal('hide');
                        } else {
                            alert(result.extend.info);
                        }
                    }
                });
            } else {
                alert(result.extend.info);
            }
        }
    });
}
function reShowSubjectManageModel() {
    $('#insert-examinee-into-subject-model').modal();
}
function deleteExamineeSubjectOnPageSubject(id, sid) {
    $.ajax({
        url: PATH + "examinfo/deleteById/" + id,
        type: "get",
        success: function (result) {
            if (result.code === 100) {
                alert("删除成功");
                showInfoOnExamineeManageModel(sid);
            } else {
                alert("删除失败");
            }
        }
    });
}
function showInfoOnSubjectUpdateModel(id) {
    $.ajax({
        url: PATH + "subject/getById/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                var s = result.extend.subject;
                document.getElementById("update-subject-id").value = s.id;
                document.getElementById("update-subject-sid").value = s.sid;
                document.getElementById("update-subject-name").value = s.name;
                document.getElementById("update-subject-date").value = s.startTime.toString().substr(0,10);
                document.getElementById("update-subject-starttime").value = s.startTime.toString().substr(11,5);
                document.getElementById("update-subject-endtime").value = s.endTime.toString().substr(11,5);
            }
        }
    });
}
function deleteSubjectModel(id) {
    $.ajax({
        url: PATH + "subject/delete/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                alert("删除成功");
                window.location.reload();
            } else {
                alert("删除失败，该科目还在考生的待考列表中")
            }
        }
    });
}
function insertSubject() {
    var sid = document.getElementById("insert-subject-sid").value;
    var name = document.getElementById("insert-subject-name").value;
    var date = document.getElementById("insert-subject-date").value;
    var starttime = document.getElementById("insert-subject-starttime").value;
    var endtime = document.getElementById("insert-subject-endtime").value;
    $.ajax({
        url: PATH + "subject/add",
        type: "post",
        data: {
            sid: sid,
            name: name,
            startTime: new Date(date + " " + starttime + ":00"),
            endTime: new Date(date + " " + endtime + ":00")
        },
        success: function (result) {
            if(result.code === 100){
                alert("添加成功");
                window.location.reload();
            } else {
                alert("添加失败");
            }
        }
    });
}
// 地图
function loadBuildings(){
    $.ajax({
        url: PATH + "building/allBuilding",
        type: "get",
        success: function (result) {
            if(result.code === 100){
                var addBuildings = document.getElementById("building-list").innerHTML;
                var index = 1;
                $.each(result.extend.buildings, function () {
                    addBuildings = addBuildings +
                        "<tr>" +
                            "<td>" + index + "</td>" +
                            "<td>" + this.bname + "</td>" +
                            "<td>" + this.x + "</td>" +
                            "<td>" + this.y + "</td>" +
                            "<td>" +
                                "<button onclick=\"showInfoOnBuildingModel(" + this.id + ")\" id=\"update-building-position\" data-toggle=\"modal\" data-target=\"#building-update-model\" class=\"btn btn-primary btn-xs\">修改</button>" +
                                "  <button onclick=\"showInfoOnRoomModel(" + this.id + ")\" id=\"show-room\" data-toggle=\"modal\" data-target=\"#show-room-model\" class=\"btn btn-primary btn-xs\">查看考试教室</button>" +
                            "</td>" +
                        "</tr>";
                    index = index + 1;
                });
                document.getElementById("building-list").innerHTML = addBuildings;
            }
        }
    });
}
function showInfoOnRoomModel(id) {
    $.ajax({
        url: PATH + "building/getById/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                document.getElementById("show-building-name").value = result.extend.buildings.bname;
            }
        }
    });
    document.getElementById("show-rooms").innerHTML = "";
    $.ajax({
        url: PATH + "keyPoint/getByBuilding/" + id,
        type: "get",
        success: function (result) {
            if(result.code === 100){
                var addRooms = "";
                $.each(result.extend.keyPoints, function () {
                    addRooms = addRooms + " " + this.pname;
                });
                document.getElementById("show-rooms").innerHTML = addRooms;
            }
        }
    });
}
function showInfoOnBuildingModel(id) {
    $.ajax({
        url: PATH + "building/getById/" + id,
        type: "get",
        success: function (result) {
            console.log(result);
            if(result.code === 100){
                document.getElementById("update-building-id").value = result.extend.buildings.id;
                document.getElementById("update-building-name").value = result.extend.buildings.bname;
                document.getElementById("update-building-longitude").value = result.extend.buildings.x;
                document.getElementById("update-building-latitude").value = result.extend.buildings.y;
            }
        }
    });
}
function updateBuilding(){
    var id = document.getElementById("update-building-id").value;
    var x = document.getElementById("update-building-longitude").value;
    var y = document.getElementById("update-building-latitude").value;
    $.ajax({
        url: PATH + "/building/updatePosition",
        type: "post",
        data: {
            id : parseInt(id),
            x: x,
            y: y
        },
        success: function (result) {
            if(result.code === 100){
                alert("更新成功");
                window.location.reload();
            } else {
                alert("更新失败");
            }
        }
    });
}
