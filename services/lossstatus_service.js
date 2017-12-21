/*
	Loss表的一些sql查找
	创建人：Android
	时间：2017/10/30
 */

 var Lossstatus = require('../models').Lossstatus;


/*
    根据loss状态id查找一条loss状态数据
    */
    async function selectLostatusBySid(lostatusid){
      return await Lossstatus.findById(lostatusid)
    }
    exports.selectLostatusBySid = selectLostatusBySid;

/*
    根据线体id查询lossstatus的名字集合
    */
    async function selectLostatusBylineid(linebodyid){
      const lostatusNameList = await Lossstatus.findAll({
        where:{linebodyLinebodyid:linebodyid}
      });
      return lostatusNameList
    }
    exports.selectLostatusBylineid = selectLostatusBylineid;

/*
	根据loss三级目录id查询一个loss status
 */
 async function selectLostatusById(losstier3id,linebodyid){
  const lossstatusList = await Lossstatus.findAll({
    where:{losstier3Lossid:losstier3id,linebodyLinebodyid:linebodyid}
  })
  var lossstatus
  if(lossstatusList!=null){
   for(var i = 0;i<lossstatusList.length;i++){
    if(lossstatusList[i].status != 4){
      lossstatus = lossstatusList[i]
      break
    }
  }
}

return lossstatus
}
exports.selectLostatusById = selectLostatusById;

/*
	更新数据
 */
 async function updateLostatusById(req , res){
  const lossstatus = {
    projectnumber:req.body.projectnumber,
    projectname:req.body.projectname,
    losscategory:req.body.losscategory,
    status:req.body.status,
    startperformance :req.body.startperformance,
    target:req.body.target,
    performance :req.body.performance,
    objectstarttime:req.body.objectstarttime,
    planendtime:req.body.planendtime,
    stage:req.body.stage
  };
  var updataReturn = await Lossstatus.update(lossstatus,{
    where:{id:req.body.id}})
  if(updataReturn == 1){
    updataReturn = await Lossstatus.findById(req.body.id)
  }
  return updataReturn
}
exports.updateLostatusById = updateLostatusById;


/*
    根据线体id删除现进行项目
    */
    async function deleteObjectnowBylossid(linebodyid , lossid){
     const lossstatus= await Lossstatus.findOne({
      where:{linebodyLinebodyid:linebodyid,losstier3Lossid:lossid}});
     const deleteReturn  = await lossstatus.destroy()
     return deleteReturn
   }
   exports.deleteObjectnowBylossid = deleteObjectnowBylossid;