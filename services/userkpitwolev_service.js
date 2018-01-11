/*
 auther:Android,
 NOTE:用户表的service,
 time:2017113
 */
var UserKpitwolev = require('../models').UserKpitwolev;

var stringUtil = require('../utils/stringUtil');
var errorUtil = require('../utils/errorUtil');

/**
 *	根据userID,kpitwoID跟新sequence（顺序）
 */
async function updateSequenceById(userId, kpitwoId, newSequence) {
    if (userId == undefined || userId == null || userId == ''
        || kpitwoId == undefined || kpitwoId == null || kpitwoId == ''
        || newSequence == undefined || newSequence == null || newSequence == '') {
        return;
    }
    const value = {
        sequence: newSequence
    };
    const falg = await UserKpitwolev.update(value, {
        where: {
            userUserid: userId,
            kpitwolevKpitwoid: kpitwoId
        }
    });
    return falg;
}
exports.updateSequenceById = updateSequenceById;