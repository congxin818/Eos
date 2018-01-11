/*
    auther:Android,
    NOTE:lossmapping表的controller层,
    time:20171108
 */

var service = require('../services/user_service');
var User = require('../models').User; //引入数据库User模块
var Linebody = require('../models').Linebody;
var Workshop = require('../models').Workshop;
var Kpitwolev = require('../models').Kpitwolev;
var Losstier3 = require('../models').Losstier3;
var Losstier4 = require('../models').Losstier4;
var LinebodyKpitwolev = require('../models').LinebodyKpitwolev;
var LinebodyLosstier3 = require('../models').LinebodyLosstier3;
var LinebodyLosstier4 = require('../models').LinebodyLosstier4;
var Classinformation = require('../models').Classinformation;
var errorUtil = require('../utils/errorUtil');
var moment = require('moment');
var linebody_extend_service = require('../services/linebody_extend_service');

var dataSuccess = {
    status: '0',
    msg: '请求成功',
    data: 'fas'
};

/*
    根据times和linebodys查询Lossmapping数据
    */
async function selectLossmappingByTimesAndLinebodys(req, res, next) {
    const TestStart = new Date().getTime();
    if (req.body.startTime == undefined || req.body.startTime == '' || req.body.startTime == null ||
        req.body.endTime == undefined || req.body.endTime == '' || req.body.endTime == null ||
        req.body.linebodyIds == undefined || req.body.linebodyIds == '' || req.body.linebodyIds == null ||
        req.body.userId == undefined || req.body.userId == '' || req.body.userId == null) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const user = await User.findById(req.body.userId);
    if (user == undefined || user == '' || user == null) {
        res.end(JSON.stringify(errorUtil.noExistError));
        return;
    }
    const userKpitwo = await user.getUserKpitwolevs();

    const Ids = req.body.linebodyIds.split(',');
    //console.log("---Ids.length--->"+JSON.stringify(userKpitwo));
    if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const allTier4 = await this.selectTier4ByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids);
    const allTier3 = await this.selectTier3ByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids);
    const allTier2 = await this.selectTier2ByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids);
    const allClass = await this.selectAllClassInfoByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids);
    //console.log("---allTier4--->"+JSON.stringify(allClass , null , 4));
    await userKpitwo.sort((m, n) => n.userKpitwolev.sequence - m.userKpitwolev.sequence);
    let returnData = new Array();
    for (var i = userKpitwo.length - 1; i >= 0; i--) {
        if (userKpitwo[i] == undefined || userKpitwo[i] == null || userKpitwo[i] == '') {
            continue;
        }
        const kpitwo = await Kpitwolev.findById(userKpitwo[i].kpitwoid);
        if (kpitwo == undefined || kpitwo == null || kpitwo == '') {
            continue;
        }
        const tier2Value = await this.computeAll2ByTimes(req.body.startTime, req.body.endTime, Ids, userKpitwo[i].kpitwoid, allTier2, allClass);

        // console.log("---tier2Value--->"+JSON.stringify(tier2Value , null , 4));
        // console.log('\n');
        let tier2 = {
            title: userKpitwo[i].name,
            order: userKpitwo[i].userKpitwolev.sequence,
            data: new Array(),
            link: new Array()
        };
        if (tier2Value == undefined || tier2Value == null || tier2Value == '' || tier2Value == 0 || tier2Value == 'NaN') {
            await returnData.push(tier2);
            continue;
        }
        const tier2Data = {
            name: userKpitwo[i].name,
            value: tier2Value
        };
        await tier2.data.push(tier2Data);

        const losstier3All = await kpitwo.getKpitwolevLosscategory();
        for (var j = losstier3All.length - 1; j >= 0; j--) {
            if (losstier3All[j] == undefined || losstier3All[j] == null || losstier3All[j] == '') {
                continue;
            }
            const losstier3 = await Losstier3.findById(losstier3All[j].lossid);
            if (losstier3 == undefined || losstier3 == null || losstier3 == '') {
                continue;
            }
            const tier3Value = await this.computeAll3ByTimes(req.body.startTime, req.body.endTime, Ids, losstier3All[j].lossid, allTier3, allClass);

            // console.log("---tier3Value--->"+JSON.stringify(tier3Value , null , 4));
            // console.log('\n');
            if (tier3Value == undefined || tier3Value == null || tier3Value == '' || tier3Value == 0 || tier3Value == 'NaN') {
                continue;
            }
            const tier3Data = {
                name: losstier3All[j].name,
                value: tier3Value
            };
            const tier3Link = {
                source: userKpitwo[i].name,
                target: losstier3All[j].name,
                value: tier3Value
            };
            await tier2.data.push(tier3Data);
            await tier2.link.push(tier3Link);

            const losstier4All = await losstier3.getLosscategoryLosstier4();
            //console.log("---yuzhizhe1111-----" + JSON.stringify(losstier4All , null , 4));
            for (var k = losstier4All.length - 1; k >= 0; k--) {
                //console.log("---yuzhizhe1-----");
                if (losstier4All[k] == undefined || losstier4All[k] == null || losstier4All[k] == '') {
                    continue;
                }
                const losstier4 = await Losstier4.findById(losstier4All[k].tier4id);
                if (losstier4 == undefined || losstier4 == null || losstier4 == '') {
                    continue;
                }
                const tier4Value = await this.computeAll4ByTimes(req.body.startTime, req.body.endTime, Ids, losstier4All[k].tier4id, allTier4, allClass);

                // console.log("---tier4Value--->"+JSON.stringify(tier4Value , null , 4));
                // console.log('\n');
                if (tier4Value == undefined || tier4Value == null || tier4Value == '' || tier4Value == 0 || tier4Value == 'NaN') {
                    continue;
                }
                const tier4Data = {
                    name: losstier4All[k].name,
                    value: tier4Value
                };
                const tier4Link = {
                    source: losstier3All[j].name,
                    target: losstier4All[k].name,
                    value: tier4Value
                };
                await tier2.data.push(tier4Data);
                await tier2.link.push(tier4Link);
                //console.log("---yuzhizhe22-----");
            }
        }
        await returnData.push(tier2);
    }
    dataSuccess.data = returnData;
    const TestEnd = new Date().getTime();
    const DateDiff = Number(TestEnd) - Number(TestStart);
    console.log("---Loss_DataDiff--->" + JSON.stringify(DateDiff));
    res.end(JSON.stringify(dataSuccess));
}
exports.selectLossmappingByTimesAndLinebodys = selectLossmappingByTimesAndLinebodys;

/*
    根据times和线体ID查询所有四级错误
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function selectTier4ByTimesAndLinebodys(startTime, endTime, Ids) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null) {
        return;
    }
    const sTime_num = new Date(startTime).getTime();
    const eTime_num = new Date(endTime).getTime();
    let allData = new Array();
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const linebodyLosstier4 = await linebody.getLinebodyLosstier4();
        //console.log(Ids[i] + "---linebodyLosstier4--->"+JSON.stringify(linebodyLosstier4 , null , 4));
        for (var h = linebodyLosstier4.length - 1; h >= 0; h--) {
            if (linebodyLosstier4[h] === null || linebodyLosstier4[h] === '') {
                continue;
            }
            const csTime = new Date(linebodyLosstier4[h].starttime).getTime();
            const ceTime = new Date(linebodyLosstier4[h].endtime).getTime();
            if (csTime == undefined || csTime == '' || csTime == null ||
                ceTime == undefined || ceTime == '' || ceTime == null) {
                //console.log('yuzhizhe03');
                continue;
            }
            if (csTime >= sTime_num && ceTime <= eTime_num) {
                await allData.push(linebodyLosstier4[h]);
            } else {
                continue;
            }
        }
    }
    return allData;
}
exports.selectTier4ByTimesAndLinebodys = selectTier4ByTimesAndLinebodys;

/*
    根据times和allData时间区域内计算tire4级
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeAll4ByTimes(startTime, endTime, Ids, typeId, allData, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null ||
        typeId == undefined || typeId == '' || typeId == null ||
        allData == undefined || allData == '' || allData == null ||
        allClass == undefined || allClass == '' || allClass == null) {
        //console.log("---yuzhizhe1--->");
        return;
    }
    const sTime = new Date(startTime);
    let sTime_num = sTime.getTime();
    let eTime_num = Number(sTime_num) + 900000;
    const endTime_num = new Date(endTime).getTime();
    let returnData = new Array();
    while (eTime_num <= endTime_num) {
        const value = await this.computeQuarter4ByTimes(sTime_num, eTime_num, Ids, typeId, allData, allClass);

        if (value === undefined || value === null || value === '' || value === -1) {
            //console.log("---yuzhizhe0--->");
        } else {
            await returnData.push(value);
        }
        sTime_num = Number(sTime_num) + 900000;
        eTime_num = Number(eTime_num) + 900000;
    }
    let sum = 0;
    let weight = 0;
    if (returnData.length != 0) {
        sum = await returnData.map(a => a.value).reduce((pre, cur) => pre + cur);
        weight = await returnData.map(a => a.weight).reduce((pre, cur) => pre + cur);
    }
    let average = 0;
    if (weight != 0) {
        average = Number(sum) / Number(weight);
    }
    return average.toFixed(4);
}
exports.computeAll4ByTimes = computeAll4ByTimes;

/*
    根据times和allData每15分钟计算tire4级
    startTime:15分钟开始时间
    endTime:15分钟结束时间
*/
async function computeQuarter4ByTimes(startTime, endTime, Ids, typeId, allData, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null ||
        typeId == undefined || typeId == '' || typeId == null ||
        allData == undefined || allData == '' || allData == null ||
        allClass == undefined || allClass == '' || allClass == null) {
        //console.log("---yuzhizhe1--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let returnData = new Array();
    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const classflag = await this.selectClassInfo(sTime_num, eTime_num, Ids[i], allClass);
        if (classflag == 0) {
            continue;
        }
        const value = await this.computeQuarter4ValueByTimes(sTime_num, eTime_num, allData, Ids[i], typeId);
        const weight = linebody.weight;
        valueSum += Number(classflag) * Number(value) * Number(weight);
        weightSum += Number(classflag) * Number(weight);
    }
    const data = {
        value: valueSum,
        weight: weightSum
    }
    return data;
}
exports.computeQuarter4ByTimes = computeQuarter4ByTimes;

/*
    根据times和allData每15分钟计算tire2级值
    startTime:15分钟开始时间
    endTime:15分钟结束时间
    */
async function computeQuarter4ValueByTimes(startTime, endTime, allData, linebodyId, typeId) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        allData == undefined || allData == '' || allData == null ||
        typeId == undefined || typeId == '' || typeId == null ||
        linebodyId == undefined || linebodyId == '' || linebodyId == null) {
        //console.log("---allData为空--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let valueSum = 0;
    for (var i = allData.length - 1; i >= 0; i--) {
        if (allData[i] == null || allData[i] == '' || allData[i].losstier4Tier4id != typeId ||
            allData[i].linebodyLinebodyid != linebodyId) {
            continue;
        }
        const csTime = new Date(allData[i].starttime).getTime();
        const ceTime = new Date(allData[i].endtime).getTime();
        //console.log('----sTime_num-->'+JSON.stringify(sTime , null , 4));
        if (csTime == undefined || csTime == '' || csTime == null ||
            ceTime == undefined || ceTime == '' || ceTime == null) {
            //console.log('yuzhizhe03');
            continue;
        }
        if (csTime >= sTime_num && ceTime <= eTime_num) {
            valueSum += Number(allData[i].value);
        } else {
            //console.log('yuzhizhe04');
            continue;
        }
    }
    return valueSum;
}
exports.computeQuarter4ValueByTimes = computeQuarter4ValueByTimes;


/*
   根据times和线体ID查询所有三级错误
   startTime:当天开始时间
   endTime:当天结束时间
   */
async function selectTier3ByTimesAndLinebodys(startTime, endTime, Ids) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null) {
        return;
    }
    const sTime_num = new Date(startTime).getTime();
    const eTime_num = new Date(endTime).getTime();
    let allData = new Array();
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const linebodyLosstier3 = await linebody.getLinebodyLosstier3();
        //console.log(Ids[i] + "---linebodyLosstier3--->"+JSON.stringify(linebodyLosstier3 , null , 4));
        for (var h = linebodyLosstier3.length - 1; h >= 0; h--) {
            if (linebodyLosstier3[h] === null || linebodyLosstier3[h] === '') {
                continue;
            }
            const csTime = new Date(linebodyLosstier3[h].starttime).getTime();
            const ceTime = new Date(linebodyLosstier3[h].endtime).getTime();
            if (csTime == undefined || csTime == '' || csTime == null ||
                ceTime == undefined || ceTime == '' || ceTime == null) {
                //console.log('yuzhizhe03');
                continue;
            }
            if (csTime >= sTime_num && ceTime <= eTime_num) {
                await allData.push(linebodyLosstier3[h]);
            } else {
                continue;
            }
        }
    }
    return allData;
}
exports.selectTier3ByTimesAndLinebodys = selectTier3ByTimesAndLinebodys;

/*
    根据times和allData时间区域内计算tire3级
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeAll3ByTimes(startTime, endTime, Ids, typeId, allData, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null ||
        typeId == undefined || typeId == '' || typeId == null ||
        allData == undefined || allData == '' || allData == null ||
        allClass == undefined || allClass == '' || allClass == null) {
        //console.log("---yuzhizhe1--->");
        return;
    }
    const sTime = new Date(startTime);
    let sTime_num = sTime.getTime();
    let eTime_num = Number(sTime_num) + 900000;

    const endTime_num = new Date(endTime).getTime()

    let returnData = new Array();
    while (eTime_num <= endTime_num) {
        const value = await this.computeQuarter3ByTimes(sTime_num, eTime_num, Ids, typeId, allData, allClass);

        if (value === undefined || value === null || value === '' || value === -1) {
            //console.log("---yuzhizhe0--->");
        } else {
            //console.log("---value--->"+JSON.stringify(value));
            await returnData.push(value);
        }
        sTime_num = Number(sTime_num) + 900000;
        eTime_num = Number(eTime_num) + 900000;
    }
    let sum = 0;
    let weight = 0;
    if (returnData.length != 0) {
        sum = await returnData.map(a => a.value).reduce((pre, cur) => pre + cur);
        weight = await returnData.map(a => a.weight).reduce((pre, cur) => pre + cur);
    }
    let average = 0;
    if (weight != 0) {
        average = Number(sum) / Number(weight);
    }
    return average.toFixed(4);
}
exports.computeAll3ByTimes = computeAll3ByTimes;

/*
    根据times和allData每15分钟计算tire3级
    startTime:15分钟开始时间
    endTime:15分钟结束时间
*/
async function computeQuarter3ByTimes(startTime, endTime, Ids, typeId, allData, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null ||
        typeId == undefined || typeId == '' || typeId == null ||
        allData == undefined || allData == '' || allData == null ||
        allClass == undefined || allClass == '' || allClass == null) {
        //console.log("---yuzhizhe1--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let returnData = new Array();
    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const classflag = await this.selectClassInfo(sTime_num, eTime_num, Ids[i], allClass);
        if (classflag == 0) {
            continue;
        }
        const value = await this.computeQuarter3ValueByTimes(sTime_num, eTime_num, allData, Ids[i], typeId);
        const weight = linebody.weight;
        valueSum += Number(classflag) * Number(value) * Number(weight);
        weightSum += Number(classflag) * Number(weight);
    }
    const data = {
        value: valueSum,
        weight: weightSum
    }
    return data;
}
exports.computeQuarter3ByTimes = computeQuarter3ByTimes;

/*
    根据times和allData每15分钟计算tire2级值
    startTime:15分钟开始时间
    endTime:15分钟结束时间
    */
async function computeQuarter3ValueByTimes(startTime, endTime, allData, linebodyId, typeId) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        allData == undefined || allData == '' || allData == null ||
        typeId == undefined || typeId == '' || typeId == null ||
        linebodyId == undefined || linebodyId == '' || linebodyId == null) {
        //console.log("---allData为空--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let valueSum = 0;
    for (var i = allData.length - 1; i >= 0; i--) {
        if (allData[i] == null || allData[i] == '' || allData[i].losstier3Lossid != typeId ||
            allData[i].linebodyLinebodyid != linebodyId) {
            continue;
        }
        const csTime = new Date(allData[i].starttime).getTime();
        const ceTime = new Date(allData[i].endtime).getTime();
        //console.log('----sTime_num-->'+JSON.stringify(sTime , null , 4));
        if (csTime == undefined || csTime == '' || csTime == null ||
            ceTime == undefined || ceTime == '' || ceTime == null) {
            //console.log('yuzhizhe03');
            continue;
        }
        if (csTime >= sTime_num && ceTime <= eTime_num) {
            valueSum += Number(allData[i].value);
        } else {
            //console.log('yuzhizhe04');
            continue;
        }
    }
    return valueSum;
}
exports.computeQuarter3ValueByTimes = computeQuarter3ValueByTimes;

/*
   根据times和线体ID查询所有二级错误
   startTime:当天开始时间
   endTime:当天结束时间
   */
async function selectTier2ByTimesAndLinebodys(startTime, endTime, Ids) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null) {
        return;
    }
    const sTime_num = new Date(startTime).getTime();
    const eTime_num = new Date(endTime).getTime();
    let allData = new Array();
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const linebodyLosstier2 = await linebody.getLinebodyKpitwolev();
        //console.log(Ids[i] + "---linebodyLosstier2--->"+JSON.stringify(linebodyLosstier2 , null , 4));
        for (var h = linebodyLosstier2.length - 1; h >= 0; h--) {
            if (linebodyLosstier2[h] === null || linebodyLosstier2[h] === '') {
                continue;
            }
            const csTime = new Date(linebodyLosstier2[h].starttime).getTime();
            const ceTime = new Date(linebodyLosstier2[h].endtime).getTime();
            if (csTime == undefined || csTime == '' || csTime == null ||
                ceTime == undefined || ceTime == '' || ceTime == null) {
                //console.log('yuzhizhe03');
                continue;
            }
            if (csTime >= sTime_num && ceTime <= eTime_num) {
                await allData.push(linebodyLosstier2[h]);
            } else {
                continue;
            }
        }
    }
    return allData;
}
exports.selectTier2ByTimesAndLinebodys = selectTier2ByTimesAndLinebodys;

/*
    根据times和allData时间区域内计算tire2级
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeAll2ByTimes(startTime, endTime, Ids, typeId, allData, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null ||
        typeId == undefined || typeId == '' || typeId == null ||
        allData == undefined || allData == '' || allData == null ||
        allClass == undefined || allClass == '' || allClass == null) {
        //console.log("---yuzhizhe1--->");
        return;
    }
    const sTime = new Date(startTime);
    let sTime_num = sTime.getTime();
    let eTime_num = Number(sTime_num) + 900000;

    const endTime_num = new Date(endTime).getTime()

    let returnData = new Array();
    while (eTime_num <= endTime_num) {
        const value = await this.computeQuarter2ByTimes(sTime_num, eTime_num, Ids, typeId, allData, allClass);

        if (value === undefined || value === null || value === '' || value === -1) {
            //console.log("---yuzhizhe0--->");
        } else {
            //console.log("---value--->"+JSON.stringify(value));
            await returnData.push(value);
        }
        sTime_num = Number(sTime_num) + 900000;
        eTime_num = Number(eTime_num) + 900000;
    }
    let sum = 0;
    let weight = 0;
    if (returnData.length != 0) {
        sum = await returnData.map(a => a.value).reduce((pre, cur) => pre + cur);
        weight = await returnData.map(a => a.weight).reduce((pre, cur) => pre + cur);
        //average = sum / returnData.length;
    }
    let average = 0;
    if (weight != 0) {
        average = Number(sum) / Number(weight);
    }
    return average.toFixed(4);
}
exports.computeAll2ByTimes = computeAll2ByTimes;

/*
    根据times和allData每15分钟计算tire2级
    startTime:15分钟开始时间
    endTime:15分钟结束时间
*/
async function computeQuarter2ByTimes(startTime, endTime, Ids, typeId, allData, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null ||
        typeId == undefined || typeId == '' || typeId == null ||
        allClass == undefined || allClass == '' || allClass == null ||
        allData == undefined || allData == '' || allData == null) {
        //console.log("---yuzhizhe1--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let returnData = new Array();
    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const classflag = await this.selectClassInfo(sTime_num, eTime_num, Ids[i], allClass);
        if (classflag == 0) {
            continue;
        }
        const value = await this.computeQuarter2ValueByTimes(sTime_num, eTime_num, allData, Ids[i], typeId);
        const weight = linebody.weight;
        valueSum += Number(classflag) * Number(value) * Number(weight);
        weightSum += Number(classflag) * Number(weight);
    }
    const data = {
        value: valueSum,
        weight: weightSum
    }
    return data;
}
exports.computeQuarter2ByTimes = computeQuarter2ByTimes;

/*
    根据times和allData每15分钟计算tire2级值
    startTime:15分钟开始时间
    endTime:15分钟结束时间
    */
async function computeQuarter2ValueByTimes(startTime, endTime, allData, linebodyId, typeId) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        allData == undefined || allData == '' || allData == null ||
        typeId == undefined || typeId == '' || typeId == null ||
        linebodyId == undefined || linebodyId == '' || linebodyId == null) {
        //console.log("---allData为空--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let valueSum = 0;
    for (var i = allData.length - 1; i >= 0; i--) {
        if (allData[i] == null || allData[i] == '' || allData[i].kpitwolevKpitwoid != typeId ||
            allData[i].linebodyLinebodyid != linebodyId) {
            continue;
        }
        const csTime = new Date(allData[i].starttime).getTime();
        const ceTime = new Date(allData[i].endtime).getTime();
        //console.log('----sTime_num-->'+JSON.stringify(sTime , null , 4));
        if (csTime == undefined || csTime == '' || csTime == null ||
            ceTime == undefined || ceTime == '' || ceTime == null) {
            //console.log('yuzhizhe03');
            continue;
        }
        if (csTime >= sTime_num && ceTime <= eTime_num) {
            valueSum += Number(allData[i].value);
        } else {
            //console.log('yuzhizhe04');
            continue;
        }
    }
    return valueSum;
}
exports.computeQuarter2ValueByTimes = computeQuarter2ValueByTimes;

/*
   根据times和线体ID查询所有二级错误
   startTime:当天开始时间
   endTime:当天结束时间
   */
async function selectAllClassInfoByTimesAndLinebodys(startTime, endTime, Ids) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null) {
        return;
    }
    const sTime_num = new Date(startTime).getTime();
    const eTime_num = new Date(endTime).getTime();
    let allData = new Array();
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const linebodyClassinf = await linebody.getLinebodyClassinf();
        //console.log(Ids[i] + "---linebodyLosstier2--->"+JSON.stringify(linebodyLosstier2 , null , 4));
        for (var h = linebodyClassinf.length - 1; h >= 0; h--) {
            if (linebodyClassinf[h] === null || linebodyClassinf[h] === '') {
                continue;
            }
            const csTime = new Date(linebodyClassinf[h].classstarttime).getTime();
            const ceTime = new Date(linebodyClassinf[h].classendtime).getTime();
            if (csTime == undefined || csTime == '' || csTime == null ||
                ceTime == undefined || ceTime == '' || ceTime == null) {
                //console.log('yuzhizhe03');
                continue;
            }
            if (csTime > eTime_num || ceTime < sTime_num) {
                continue;
            } else {
                await allData.push(linebodyClassinf[h]);
            }
        }
    }
    return allData;
}
exports.selectAllClassInfoByTimesAndLinebodys = selectAllClassInfoByTimesAndLinebodys;

/*
    查询线体（linebodyId）在时间段内是否开班，开班返回1，否则返回0
    startTime:15分钟开始时间
    endTime:15分钟结束时间
    */
async function selectClassInfo(startTime, endTime, linebodyId, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        allClass == undefined || allClass == '' || allClass == null ||
        linebodyId == undefined || linebodyId == '' || linebodyId == null) {
        //console.log("---allData为空--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let flag = 0;
    for (var i = allClass.length - 1; i >= 0; i--) {
        if (allClass[i] == null || allClass[i] == '' || allClass[i].linebodyLinebodyid != linebodyId) {
            continue;
        }
        const csTime = new Date(allClass[i].classstarttime).getTime();
        const ceTime = new Date(allClass[i].classendtime).getTime();
        //console.log('----sTime_num-->'+JSON.stringify(sTime , null , 4));
        if (csTime == undefined || csTime == '' || csTime == null ||
            ceTime == undefined || ceTime == '' || ceTime == null) {
            //console.log('yuzhizhe03');
            continue;
        }
        if (sTime_num >= csTime && eTime_num <= ceTime) {
            flag = 1;
            break;
        } else {
            //console.log('yuzhizhe04');
            continue;
        }
    }
    return flag;
}
exports.selectClassInfo = selectClassInfo;