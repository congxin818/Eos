/*
	Loss表的一些sql查找
	创建人：Android
	时间：2017/10/30
 */

var Losscategory = require('../models').Losscategory;

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
	根据ID删除一个loss
 */
async function deleteLossById(lossId){
	if (lossId == '' || lossId == undefined || lossId == null)
    {
        return 0;
    }
    const loss = await Losscategory.findById(id);
    if (loss == '' || loss == undefined || loss == null)
    {
        return 0;
    }
    const falg = await loss.destroy({where:{lossid:lossId}});
    if (falg == null && falg != 1) {
            return 0;
    }
    return falg;
}
exports.selectLossById = selectLossById;

/*
	添加
 */
async function addLossOne(lossName){
	if (lossname == '' || lossname == undefined || lossname == null)
    {
        return ;
    }
    let loss = {
    	lossname : lossName
    };
    try{
    	const data = await Losscategory.create(loss);
    	if (data == '' || data == undefined || data == null)
    	{
        	return ;
    	}
    	return data;
    }catch(err){
    	console.log('yuzhizhe_err---->' + err);
    }
}
exports.addLossOne = addLossOne;

/*
	更新
 */
async function updateLossById(lossId,lossName){
	if (lossId == '' || lossId == undefined || lossId == null
		|| lossName == '' || lossName == undefined || lossName == null)
    {
        return 0;
    }
    let loss = {
    	lossid:lossId,
    	lossname:lossName
    };
    const falg = await Losscategory.update(loss,{where:{lossid:lossId}});
    return falg;
}
exports.updateLossById = updateLossById;

