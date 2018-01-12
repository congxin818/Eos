var linebody_extend_service = require('../services/linebody_extend_service');
var Lossstatus = require('../models').Lossstatus; //引入数据库Lossstatus模块
var Lossstatuslog = require('../models').Lossstatuslog; //引入数据库Lossstatus模块
var Linebody = require('../models').Linebody; //引入数据库Linebody模块
var User = require('../models').User; //引入数据库User模块
var Classinformation = require('../models').Classinformation; //引入数据库Classinformation模块
var Kpitwolev = require('../models').Kpitwolev; //引入数据库Kpitwolev模块
var errorUtil = require('../utils/errorUtil');
var moment = require('moment');

var dataSuccess = {
    status: '0',
    msg: '请求成功',
    data: 'fas'
};

const valueUnit = 168000;

/*
    根据times和linebodys查询Overview数据
    */
async function selectOverviewByTimesAndLinebodys(req, res, next) {
    const TestStart = new Date().getTime();
    if (req.body.startTime == undefined || req.body.startTime == '' || req.body.startTime == null ||
        req.body.endTime == undefined || req.body.endTime == '' || req.body.endTime == null ||
        req.body.linebodyIds == undefined || req.body.linebodyIds == '' || req.body.linebodyIds == null ||
        req.body.userId == undefined || req.body.userId == '' || req.body.userId == null
    ) {
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
    // console.log("---Ids.length--->"+JSON.stringify(Ids.length));
    if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    await userKpitwo.sort((m, n) => n.userKpitwolev.sequence - m.userKpitwolev.sequence);
    const allTier3 = await this.selectTier3ByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids);
    const allTier2 = await this.selectTier2ByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids);
    const allClass = await this.selectAllClassInfoByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids);
    //console.log("---userKpitwo--->"+JSON.stringify(userKpitwo , null , 4));
    let returnData = new Array();
    for (var i = userKpitwo.length - 1; i >= 0; i--) {
        if (userKpitwo[i] == undefined || userKpitwo[i] == null || userKpitwo[i] == '') {
            continue;
        }
        const kpitwo = await Kpitwolev.findById(userKpitwo[i].kpitwoid);
        if (kpitwo == undefined || kpitwo == null || kpitwo == '') {
            continue;
        }
        let tier2 = {
            title: userKpitwo[i].name,
            order: userKpitwo[i].userKpitwolev.sequence,
            data: new Array(),
            value: '',
            losstier3: '',
            impprojectTop: ''
        };
        if (userKpitwo[i].name == 'OEE') {
            console.log("---yuzhizhe0-----" + JSON.stringify(userKpitwo[i].name, null, 4));
            const tier2Data = await this.selectBarchartByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids, userKpitwo[i].kpitwoid, allTier2, allClass);
            if (tier2Data == undefined || tier2Data == null || tier2Data == '' || tier2Data == 'NaN') {
                await returnData.push(tier2);
                continue;
            }
            tier2.data = tier2Data;
            let data2 = new Array();
            for (var f = 0; f < tier2Data.length; f++) {
                data2.push(tier2Data[f]);
            }
            //dataSuccess.value = await this.getWantString(data);
            tier2.value = await data2.pop().slice(1);
            tier2.losstier3 = await this.selectLosstier3Top3ByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids, userKpitwo[i].kpitwoid, allTier3, allClass);
            tier2.impprojectTop = await exports.showImpprojectTop(Ids, req.body.endTime);
        } else {

        }

        await returnData.push(tier2);
    }
    dataSuccess.data = returnData;
    const TestEnd = new Date().getTime();
    const DateDiff = Number(TestEnd) - Number(TestStart);
    console.log("---Overview_DataDiff--->" + JSON.stringify(DateDiff));
    res.end(JSON.stringify(dataSuccess));
}
exports.selectOverviewByTimesAndLinebodys = selectOverviewByTimesAndLinebodys;

/*
    拼接右上方的数据结构
*/
async function getWantString(argument) {
    if (argument == undefined || argument == null || argument == '') {
        return;
    }
    let data2 = new Array();
    for (var i = 0; i < argument.length; i++) {
        data2.push(argument[i]);
    }
    let data3 = await data2.pop().slice(1);
    const value1 = ['Current', 'Target', 'Vision', 'Ideal'];
    const value = ['../assets/images/current.png', '../assets/images/target.png', '../assets/images/vision.png', '../assets/images/ideal.png'];
    let returnData = new Array();
    for (var i = 0; i < data3.length; i++) {
        const data = {
            img: value[i],
            name: value1[i],
            value: data3[i]
        };
        returnData.push(data);
    }
    return returnData;
}
exports.getWantString = getWantString;

/*
    根据times和linebodys查询losstier3的TOP3
*/
async function selectLosstier3Top3ByTimesAndLinebodys(startTime, endTime, Ids, type, allTier2, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null ||
        type == undefined || type == '' || type == null ||
        allTier2 == undefined || allTier2 == '' || allTier2 == null ||
        allClass == undefined || allClass == '' || allClass == null) {
        return;
    }
    //console.log("---yuzhizhe0-----" + JSON.stringify(type , null , 4));
    //const kpitwo = await Kpitwolev.findById({where:{kpitwoid:type}});
    const kpitwo = await Kpitwolev.findById(type);
    if (kpitwo == undefined || kpitwo == null || kpitwo == '') {
        return;
    }

    const returnData = Array();
    const tier3 = await kpitwo.getKpitwolevLosscategory();
    for (var i = tier3.length - 1; i >= 0; i--) {
        if (tier3[i] == undefined || tier3[i] == null || tier3[i] == '') {
            continue;
        }
        let value = await this.computeAll3ByTimes(startTime, endTime, Ids, tier3[i].lossid, allTier2, allClass);
        if (value == undefined || value == '' || value == null || value == 'NaN') {
            value = 0;
        }
        let tier3Data = {
            name: tier3[i].name,
            value: value
        };
        returnData.push(tier3Data);
    }
    await returnData.sort((m, n) => n.value - m.value);
    return returnData.slice(0, 3);
}
exports.selectLosstier3Top3ByTimesAndLinebodys = selectLosstier3Top3ByTimesAndLinebodys;

/*
    根据times和linebodys查询Overview中柱状图数据
    */
async function selectBarchartByTimesAndLinebodys(startTime, endTime, Ids, type, allTier2, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null ||
        type == undefined || type == '' || type == null ||
        allTier2 == undefined || allTier2 == '' || allTier2 == null ||
        allClass == undefined || allClass == '' || allClass == null) {
        return;
    }

    const endTime_num = new Date(endTime).getTime();
    //console.log("---endTime_num--->"+JSON.stringify(moment(endTime)));

    let sTime_num = new Date(startTime).getTime();
    //console.log("---sTime_num--->"+JSON.stringify(sTime_num));
    let eTime_num = Number(sTime_num) + 86400000;
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    let returnData = new Array();
    while (eTime_num <= endTime_num) {
        //console.log("---sTime--1->"+JSON.stringify(sTime));
        //console.log("---eTime--1->"+JSON.stringify(eTime));
        const value = await this.computeTodayByTimes(sTime_num, eTime_num, Ids, type, allTier2, allClass);

        if (value === undefined || value === null || value === '') {
            console.log("---yuzhizhe0--->");
        } else {
            await returnData.push(value);
        }
        //console.log("---eTime--->"+JSON.stringify(eTime));
        sTime_num = Number(sTime_num) + 86400000;
        eTime_num = Number(eTime_num) + 86400000;
    }

    return returnData;
}
exports.selectBarchartByTimesAndLinebodys = selectBarchartByTimesAndLinebodys;

/*
    根据times和allData每天计算OEE中柱状图数据
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeTodayByTimes(startTime, endTime, Ids, type, allTier2, allClass) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null ||
        type == undefined || type == '' || type == null ||
        allTier2 == undefined || allTier2 == '' || allTier2 == null ||
        allClass == undefined || allClass == '' || allClass == null) {
        console.log("---yuzhizhe1--->");
        return;
    }
    //console.log("---startTime--2->"+JSON.stringify(startTime));
    //console.log("---endTime--2->"+JSON.stringify(endTime));
    const Target = await this.computeTodayTargetByTimes(startTime, endTime, Ids);
    const Vision = await this.computeTodayVisionByTimes(startTime, endTime, Ids);
    const Ideal = await this.computeTodayIdealByTimes(startTime, endTime, Ids);

    const sTime = new Date(startTime);
    const sTime_num = startTime;
    const eTime_num = endTime;
    //console.log("---sTime--->"+JSON.stringify(sTime));
    const returnTime = sTime.getFullYear() + '/' + Number(sTime.getMonth() + 1) + '/' + sTime.getDate();
    const value = await this.computeAll2ByTimes(startTime, endTime, Ids, type, allTier2, allClass);
    //console.log("---value--->"+JSON.stringify(value));
    let data = new Array();
    await data.push(returnTime);
    const returnValue = Number(1 - value) * 100;
    await data.push(returnValue.toFixed(2));
    await data.push(await (Number(Target) * 100).toFixed(2));
    await data.push(await (Number(Vision) * 100).toFixed(2));
    await data.push(await (Number(Ideal) * 100).toFixed(2));
    return data;
}
exports.computeTodayByTimes = computeTodayByTimes;

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

/*
    根据times和allData每天计算OEE中柱状图Target数据
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeTodayTargetByTimes(startTime, endTime, Ids) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null) {
        console.log("---参数错误--->");
        return 0;
    }

    let sTime_num = startTime;
    //console.log("---sTime--->"+JSON.stringify(sTime));
    let eTime_num = endTime;

    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const csTime_num = new Date(linebody.targetstrattime).getTime();
        const ceTime_num = new Date(linebody.targetendtime).getTime();
        if (sTime_num >= csTime_num && eTime_num < ceTime_num) {
            valueSum += Number(linebody.targetvalue) * Number(linebody.weight);
        } else {
            valueSum += 0;
        }
        weightSum += Number(linebody.weight);
    }
    const average = valueSum / weightSum;
    return average;
}
exports.computeTodayTargetByTimes = computeTodayTargetByTimes;

/*
    根据times和allData每天计算OEE中柱状图vision数据
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeTodayVisionByTimes(startTime, endTime, Ids) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null) {
        console.log("---参数错误--->");
        return 0;
    }

    let sTime_num = startTime;
    //console.log("---sTime--->"+JSON.stringify(sTime));
    let eTime_num = endTime;

    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const csTime_num = new Date(linebody.visionstrattime).getTime();
        const ceTime_num = new Date(linebody.visionendtime).getTime();
        if (sTime_num >= csTime_num && eTime_num < ceTime_num) {
            valueSum += Number(linebody.visionvalue) * Number(linebody.weight);
        } else {
            valueSum += 0;
        }
        weightSum += Number(linebody.weight);
    }
    const average = valueSum / weightSum;
    return average;
}
exports.computeTodayVisionByTimes = computeTodayVisionByTimes;

/*
    根据times和allData每天计算OEE中柱状图ideal数据
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeTodayIdealByTimes(startTime, endTime, Ids) {
    if (startTime == undefined || startTime == '' || startTime == null ||
        endTime == undefined || endTime == '' || endTime == null ||
        Ids == undefined || Ids == '' || Ids == null) {
        console.log("---参数错误--->");
        return 0;
    }

    let sTime_num = startTime;
    //console.log("---sTime--->"+JSON.stringify(sTime));
    let eTime_num = endTime;

    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const csTime_num = new Date(linebody.idealstrattime).getTime();
        const ceTime_num = new Date(linebody.idealendtime).getTime();
        if (sTime_num >= csTime_num && eTime_num < ceTime_num) {
            valueSum += Number(linebody.idealvalue) * Number(linebody.weight);
        } else {
            valueSum += 0;
        }
        weightSum += Number(linebody.weight);
    }
    const average = valueSum / weightSum;
    return average;
}
exports.computeTodayIdealByTimes = computeTodayIdealByTimes;

/*
overview右侧improvement provement前三
*/
exports.showImpprojectTop = async function (linebodyIdList, endtime) {
    var returnList = []
    var threeupList = []
    for (var i = 0; i < linebodyIdList.length; i++) {
        // 找到实施运行状态的项目
        var lossstatusData = []
        const lossstatusDataLs = await Lossstatus.findAll({
            where: {
                linebodyLinebodyid: linebodyIdList[i]
            }
        })
        if (lossstatusDataLs != null && lossstatusDataLs != '') {
            for (var j = 0; j < lossstatusDataLs.length; j++) {
                const lossstatusLslog = await Lossstatuslog.findAll({
                    where: {
                        lossstatusId: lossstatusDataLs[j].id
                    }
                })
                if (lossstatusLslog == null || lossstatusLslog == '') {
                    if (lossstatusDataLs[j].status == 2) {
                        lossstatusData.push(lossstatusDataLs[j])
                    }
                } else {
                    var losslogTimeList = []
                    for (var k = 0; k < lossstatusLslog.length; k++) {
                        var logdata = {
                            statuslogData: '',
                            createdAt: ''
                        }
                        logdata.statuslogData = lossstatusLslog[k]
                        logdata.createdAt = lossstatusLslog[k].createdAt
                        losslogTimeList.push(logdata)
                    }
                    // 把结束时间放进排序数组中
                    var logdata2 = {
                        statuslogData: '',
                        createdAt: ''
                    }
                    logdata2.statuslogData = null
                    logdata2.createdAt = new Date(endtime)
                    losslogTimeList.push(logdata2)
                    losslogTimeList.sort((m, n) => m.createdAt - n.createdAt)
                    var kflag
                    for (var k = 0; k < losslogTimeList.length; k++) {
                        if (losslogTimeList[k].createdAt.getTime() == new Date(endtime).getTime()) {
                            kflag = k
                            break
                        }
                    }
                    // 小于结束时间的最大时间的log是否存在
                    if (k == 0) {
                        if (losslogTimeList[k + 1].statuslogData.beforstatus == 2) {
                            lossstatusData.push(lossstatusDataLs[j])
                        }
                    } else {
                        if (losslogTimeList[k - 1].statuslogData.status == 2) {
                            lossstatusData.push(lossstatusDataLs[j])
                        }
                    }

                }
            }
        }

        const linebody = await Linebody.findById(linebodyIdList[i])
        const weight = linebody.weight
        // 计算能够产生的收益
        if (lossstatusData != null || lossstatusData != '') {
            for (var j = 0; j < lossstatusData.length; j++) {
                var impproject = {
                    name: '',
                    value: ''
                }
                const impvalue = (lossstatusData[j].startperformance - lossstatusData[j].target) * weight * valueUnit
                impproject.name = lossstatusData[j].projectname
                impproject.value = impvalue
                threeupList.push(impproject)
            }
        }
    }
    threeupList.sort((m, n) => n.value - m.value)
    if (threeupList.length <= 3) {
        returnList = threeupList
    } else {
        returnList = threeupList.slice(0, 3)
    }
    return returnList
}