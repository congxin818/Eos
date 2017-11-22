/*
	Loss表的一些sql查找
	创建人：Android
	时间：2017/10/30
 */

 var Lossstatus = require('../models').Lossstatus;


/*
    根据线体id查询lossstatus的名字集合
    */
    async function selectLostatusBylineid(linebodyid){
        const lostatusNameList = await Lossstatus.findAll({'attributes': ['projectname','losstier3Lossid'],
            where:{linebodyLinebodyid:linebodyid}
        });
        return lostatusNameList
    }
    exports.selectLostatusBylineid = selectLostatusBylineid;

/*
	根据loss三级目录id查询一个loss status
 */
 async function selectLostatusById(losstier3id,linebodyid){
    const lossstatus = await Lossstatus.findAll({
        where:{losstier3Lossid:losstier3id,linebodyLinebodyid:linebodyid}
    });
    return lossstatus
}
exports.selectLostatusById = selectLostatusById;

/*
	更新
 */
 async function updateLostatusById(req , res){
    const lossstatus = {
        projectnumber:req.body.projectNumber,
        projectname:req.body.projectName,
        losscategory:req.body.losscategory,
        status:req.body.status,
        startperformance :req.body.startperformance,
        target:req.body.target,
        performance :req.body.performance,
        objectstarttime:req.body.projectMethod,
        planendtime:req.body.projectManager,
        stage:req.body.stage
    };
    const updataReturn = await Lossstatus.update(lossstatus,{
        where:{linebodyLinebodyid:req.body.linebodyId,losstier3Lossid:req.body.lossId}});
    return updataReturn;
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