/*
	Loss表的一些sql查找
	创建人：Android
	时间：2017/10/30
 */

var Losscategory = require('../models').Losscategory;
var Kpitwolev = require('../models').Kpitwolev;
/*
	查询所有
 */
async function selectLossAll(){
	const allLoss = await Losscategory.findAll();
	if (allLoss == '' || allLoss == undefined || allLoss == null)
    {
        return ;
    }
    return allLoss;
}
exports.selectLossAll = selectLossAll;

/*
	根据ID查询一个loss
 */
async function selectLossById(id){
	if (id == '' || id == undefined || id == null)
    {
        return ;
    }
    const loss = await Losscategory.findById(id);
    if (loss == '' || loss == undefined || loss == null)
    {
        return ;
    }
    return loss;
}
exports.selectLossById = selectLossById;

/*
    根据Name查询一个loss
 */
async function selectLossByName(lossName , newpId){
    if (lossName == '' || lossName == undefined || lossName == null
        ||newpId == '' || newpId == undefined || newpId == null)
    {
        return ;
    }
    const loss = await Losscategory.findOne({where:{name:lossName,pId:newpId}});
    if (loss == '' || loss == undefined || loss == null)
    {
        return ;
    }
    return loss;
}
exports.selectLossByName = selectLossByName;

/*
	根据ID删除一个loss
 */
async function deleteLossById(lossId){
	if (lossId == '' || lossId == undefined || lossId == null)
    {
        return ;
    }
    const loss = await Losscategory.findById(lossId);
    if (loss == '' || loss == undefined || loss == null)
    {
        return ;
    }
    const falg = await loss.destroy({where:{lossid:lossId}});
    if (falg == null && falg != 1) {
            return ;
    }
    return falg;
}
exports.deleteLossById = deleteLossById;

/*
	添加
 */
async function addLossOne(lossName , newpId){
	if (lossName == '' || lossName == undefined || lossName == null
        || newpId == '' || newpId == undefined || newpId == null)
    {
        return ;
    }
    //console.log('yuzhizhe_1---->' + lossName);
    let loss = {
    	name : lossName,
        pId : newpId
    };
    const kpitwoId = await newpId.slice(1);
    if (kpitwoId == undefined || kpitwoId == null || kpitwoId == '') {
        return ;
    }
    const kpiTwo = await Kpitwolev.findById(kpitwoId);
    if (kpiTwo == undefined || kpiTwo == null || kpiTwo == '') {
        return ;
    }
    //console.log('yuzhizhe_2---->' + kpiTwo);
    try{
    	let data = await Losscategory.create(loss);
    	if (data == '' || data == undefined || data == null)
    	{
        	return ;
    	}
        const lossId = data.lossid;

        const newLoss = {
            id:'l' + lossId
        }
        const falg = await Losscategory.update(newLoss,{where:{lossid:lossId}});
        if (falg == undefined || falg == null || falg == ''||falg != 1) {
            return;
        }
        data['id'] = 'l' + lossId;
        //console.log('yuzhizhe_3---->' + data);
        kpiTwo.addKpitwolevLosscategory(data);
    	return data;
    }catch(err){
    	console.log('yuzhizhe_err---->' + err);
    }
}
exports.addLossOne = addLossOne;

/*
	更新
 */
async function updateLossById(lossId,lossName,newpId){
	if (lossId == '' || lossId == undefined || lossId == null
		|| lossName == '' || lossName == undefined || lossName == null)
    {
        return ;
    }
    let loss = {
    	lossid:lossId,
    	name:lossName,
        pId:newpId
    };
    const falg = await Losscategory.update(loss,{where:{lossid:lossId}});
    return falg;
}
exports.updateLossById = updateLossById;

