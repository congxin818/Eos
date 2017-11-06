/*
	Loss表的一些sql查找
	创建人：Android
	时间：2017/10/30
 */

var Lossstatus = require('../models').Lossstatus;

/*
	根据loss三级目录id查询一个loss status
 */
async function selectLostatusById(lossid){
    const lossstatusdata = await Lossstatus.findAll({
        where:{losscategoryLossid:lossid}
    });
    return lossstatusdata;
}
exports.selectLostatusById = selectLostatusById;

/*
	更新
 */
async function updateLostatusById(req , res){
    const lossstatus = {
    	status:req.body.status,
        projectnumber:req.body.projectNumber,
        projectname:req.body.projectName,
        areablong:req.body.areaBlong,
        projectmethod:req.body.projectMethod,
        projectmanager:req.body.projectManager,
        teammember:req.body.teamMember,
        planstart:req.body.planStart,
        actualstart:req.body.actualStart,
        planend:req.body.planEnd,
        actualend:req.body.actualEnd,
        target:req.body.target,
        actualvalue:req.body.actualValue
    };
    const updataReturn = await Lossstatus.update(lossstatus,{where:{losscategoryLossid:req.body.lossId}});
    return updataReturn;
}
exports.updateLostatusById = updateLostatusById;

/*
    根据关联清理数据库
 */
async function lossClear(){
    const loss = await Lossstatus.findAll({where:{ losscategoryLossid:null}});
    //console.log(JSON.stringify(workshop.length));
    for (var i = loss.length - 1; i >= 0; i--) {
        await loss[i].destroy();
    }
}
exports.lossClear = lossClear;