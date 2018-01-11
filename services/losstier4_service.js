/*
	Loss表的一些sql查找
	创建人：Android
	时间：2017/11/22
 */

var Losstier4 = require('../models').Losstier4;
var Losstier3 = require('../models').Losstier3;
/*
	查询所有
 */
async function selectLosstier4All() {
    const allLoss = await Losstier4.findAll();
    if (allLoss == '' || allLoss == undefined || allLoss == null) {
        return;
    }
    return allLoss;
}
exports.selectLosstier4All = selectLosstier4All;

/*
	根据ID查询一个loss
 */
async function selectLosstier4ById(id) {
    if (id == '' || id == undefined || id == null) {
        return;
    }
    const loss = await Losstier4.findById(id);
    if (loss == '' || loss == undefined || loss == null) {
        return;
    }
    return loss;
}
exports.selectLosstier4ById = selectLosstier4ById;

/*
    根据Name查询一个loss
 */
async function selectLosstier4ByName(lossName, newpId) {
    if (lossName == '' || lossName == undefined || lossName == null
        || newpId == '' || newpId == undefined || newpId == null) {
        return;
    }
    const loss = await Losstier4.findOne({ where: { name: lossName, pId: newpId } });
    if (loss == '' || loss == undefined || loss == null) {
        return;
    }
    return loss;
}
exports.selectLosstier4ByName = selectLosstier4ByName;

/*
	根据ID删除一个loss
 */
async function deleteLosstier4ById(lossId) {
    if (lossId == '' || lossId == undefined || lossId == null) {
        return;
    }
    const loss = await Losstier4.findById(lossId);
    if (loss == '' || loss == undefined || loss == null) {
        return;
    }
    const falg = await loss.destroy({ where: { lossid: lossId } });
    if (falg == null && falg != 1) {
        return;
    }
    return falg;
}
exports.deleteLosstier4ById = deleteLosstier4ById;

/*
	添加
 */
async function addLosstier4One(lossName, newpId) {
    if (lossName == '' || lossName == undefined || lossName == null
        || newpId == '' || newpId == undefined || newpId == null) {
        return;
    }
    //console.log('yuzhizhe_1---->' + lossName);
    let loss = {
        name: lossName,
        pId: newpId
    };
    const kpitwoId = await newpId.slice(1);
    if (kpitwoId == undefined || kpitwoId == null || kpitwoId == '') {
        return;
    }
    const kpiTwo = await Kpitwolev.findById(kpitwoId);
    if (kpiTwo == undefined || kpiTwo == null || kpiTwo == '') {
        return;
    }
    //console.log('yuzhizhe_2---->' + kpiTwo);
    try {
        let data = await Losstier4.create(loss);
        if (data == '' || data == undefined || data == null) {
            return;
        }
        const lossId = data.lossid;

        const newLoss = {
            id: 'l' + lossId
        }
        const falg = await Losstier4.update(newLoss, { where: { lossid: lossId } });
        if (falg == undefined || falg == null || falg == '' || falg != 1) {
            return;
        }
        data['id'] = 'l' + lossId;
        //console.log('yuzhizhe_3---->' + data);
        kpiTwo.addKpitwolevLosscategory(data);
        return data;
    } catch (err) {
        console.log('yuzhizhe_err---->' + err);
    }
}
exports.addLosstier4One = addLosstier4One;

/*
	更新
 */
async function updateLosstier4ById(lossId, lossName, newpId) {
    if (lossId == '' || lossId == undefined || lossId == null
        || lossName == '' || lossName == undefined || lossName == null) {
        return;
    }
    let loss = {
        lossid: lossId,
        name: lossName,
        pId: newpId
    };
    const falg = await Losstier4.update(loss, { where: { lossid: lossId } });
    return falg;
}
exports.updateLosstier4ById = updateLosstier4ById;

/*
    根据关联清理数据库
 */
async function losstier4Clear() {
    const loss = await Losstier4.findAll({ where: { losstier3Lossid: null } });
    //console.log(JSON.stringify(workshop.length));
    for (var i = loss.length - 1; i >= 0; i--) {
        await loss[i].destroy();
    }
}
exports.losstier4Clear = losstier4Clear;