


var linebody_extend_service = require('../services/linebody_extend_service');
var Lossstatus = require('../models').Lossstatus;//引入数据库Lossstatus模块
var Linebody = require('../models').Linebody;//引入数据库Linebody模块
var Classinformation = require('../models').Classinformation;//引入数据库Classinformation模块
var Kpitwolev = require('../models').Kpitwolev;//引入数据库Kpitwolev模块
var Lossstatuslog = require('../models').Lossstatuslog;
var errorUtil = require('../utils/errorUtil');
var moment = require('moment');

var dataSuccess = {
    status: '0',
    msg: '请求成功',
    data: 'fas',
    value: '',
    losstier3: '',
    impprojectTop: ''
};

const valueUnit = 168000

/*
    根据times和linebodys查询Overview数据
    */
async function selectOverviewByTimesAndLinebodys(req, res, next) {
    //console.log("---req.body.startTime--->"+JSON.stringify(req.body.startTime));
    //console.log("---req.body.endTime--->"+JSON.stringify(req.body.endTime));
    //console.log("---req.body.linebodyIds--->"+JSON.stringify(req.body.linebodyIds));
    if (req.body.startTime == undefined || req.body.startTime == '' || req.body.startTime == null
        || req.body.endTime == undefined || req.body.endTime == '' || req.body.endTime == null
        || req.body.linebodyIds == undefined || req.body.linebodyIds == '' || req.body.linebodyIds == null
        //||req.body.userId == undefined || req.body.userId == ''|| req.body.userId == null
    ) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    // const user = await User.findById(req.body.userId);
    // if (user == undefined || user == ''|| user == null) {
    //     res.end(JSON.stringify(errorUtil.noExistError));
    //     return;
    // }
    // const userKpitwo = await user.getUserKpitwolevs();
    const Ids = req.body.linebodyIds.split(',');
    // console.log("---Ids.length--->"+JSON.stringify(Ids.length));
    if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    //console.log("---req.body.startTime--->"+JSON.stringify(req.body.startTime));
    // for (var i = userKpitwo.length - 1; i >= 0; i--) {
    //     if (userKpitwo[i] == undefined || userKpitwo[i] == null || userKpitwo[i] == '') {
    //         continue;
    //     }
    //     const kpitwo = await Kpitwolev.findById(userKpitwo[i].kpitwoid);
    //     if (kpitwo == undefined || kpitwo == null || kpitwo == '') {
    //         continue;
    //     }
    // }

    const data = await this.selectBarchartByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids, 'OEE');
    dataSuccess.data = data;
    let data2 = new Array();
    for (var i = 0; i < data.length; i++) {
        data2.push(data[i]);
    }
    //dataSuccess.value = await this.getWantString(data);
    dataSuccess.value = await data2.pop().slice(1);
    dataSuccess.losstier3 = await this.selectLosstier3Top3ByTimesAndLinebodys(req.body.startTime, req.body.endTime, Ids, 'OEE')

    dataSuccess.impprojectTop = await exports.showImpprojectTop(Ids, req.body.endTime)
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
async function selectLosstier3Top3ByTimesAndLinebodys(startTime, endTime, Ids, type) {
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null
        || type == undefined || type == '' || type == null) {
        return;
    }
    const kpitwo = await Kpitwolev.findOne({ where: { name: type } });
    if (kpitwo == undefined || kpitwo == null || kpitwo == '') {
        return;
    }

    const returnData = Array();
    const tier3 = await kpitwo.getKpitwolevLosscategory();
    for (var i = tier3.length - 1; i >= 0; i--) {
        if (tier3[i] == undefined || tier3[i] == null || tier3[i] == '') {
            continue;
        }
        let value = await this.computeAll3ByTimes(startTime, endTime, Ids, tier3[i].lossid);
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
async function selectBarchartByTimesAndLinebodys(startTime, endTime, Ids, type) {
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null
        || type == undefined || type == '' || type == null) {
        return;
    }

    const endTime_num = new Date(endTime).getTime();
    //console.log("---endTime_num--->"+JSON.stringify(moment(endTime)));

    let sTime_num = new Date(startTime).getTime();
    console.log("---sTime_num--->" + JSON.stringify(sTime_num));
    let eTime_num = Number(sTime_num) + 86400000;
    console.log("---eTime_num--->" + JSON.stringify(eTime_num));
    let returnData = new Array();
    while (eTime_num <= endTime_num) {
        //console.log("---sTime--1->"+JSON.stringify(sTime));
        //console.log("---eTime--1->"+JSON.stringify(eTime));
        const value = await this.computeTodayByTimes(sTime_num, eTime_num, Ids, type);

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
async function computeTodayByTimes(startTime, endTime, Ids, type) {
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null
        || type == undefined || type == '' || type == null) {
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
    const value = await this.computeAll2ByTimes(sTime_num, eTime_num, Ids, type);
    console.log("---value--->" + JSON.stringify(value));
    let data = new Array();
    await data.push(returnTime);
    const returnValue = Number(1 - value) * 100;
    await data.push(returnValue.toFixed(2));
    await data.push(await (Number(Target) * 100).toFixed(2));
    await data.push(await (Number(Vision) * 100).toFixed(2));
    await data.push(await (Number(Ideal) * 100).toFixed(2));
    console.log('\n')
    return data;
}
exports.computeTodayByTimes = computeTodayByTimes;

/*
    根据times和allData时间区域内计算tire2级
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeAll2ByTimes(startTime, endTime, Ids, typeId) {
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null
        || typeId == undefined || typeId == '' || typeId == null) {
        console.log("---yuzhizhe1--->");
        return;
    }

    let sTime_num = startTime;
    let eTime_num = Number(sTime_num) + 900000;

    const endTime_num = endTime;

    let returnData = new Array();
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    //console.log("---endTime_num--->"+JSON.stringify(endTime_num));
    while (eTime_num <= endTime_num) {
        //console.log("---sTime_num--->"+JSON.stringify(sTime_num));
        //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
        const value = await this.computeQuarter2ByTimes(sTime_num, eTime_num, Ids, typeId);

        if (value === undefined || value === null || value === '' || value === -1) {
            //console.log("---yuzhizhe0--->");
        } else {
            //console.log("---value--->"+JSON.stringify(value));
            await returnData.push(value);
        }
        sTime_num = Number(sTime_num) + 900000;
        eTime_num = Number(eTime_num) + 900000;
        //console.log("---eTime--->"+JSON.stringify(eTime));
    }
    //console.log("---returnData--->"+JSON.stringify(returnData));
    let sum = 0;
    let weight = 0;
    let average = 0;
    if (returnData.length != 0) {
        sum = await returnData.map(a => a.value).reduce((pre, cur) => pre + cur);
        weight = await returnData.map(a => a.weight).reduce((pre, cur) => pre + cur);
        //average = sum / returnData.length;
    }
    if (weight == 0) {
        average = 0;
    } else {
        average = Number(sum) / Number(weight);
    }
    //const returnTime = sTime.date();
    console.log("---sum--->" + JSON.stringify(sum));
    console.log("---weight--->" + JSON.stringify(weight));
    return average.toFixed(4);
}
exports.computeAll2ByTimes = computeAll2ByTimes;

/*
    根据times和allData每15分钟计算tire2级
    startTime:15分钟开始时间
    endTime:15分钟结束时间
    */
async function computeQuarter2ByTimes(startTime, endTime, Ids, typeId) {
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null
        || typeId == undefined || typeId == '' || typeId == null) {
        //console.log("---yuzhizhe1--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let returnData = new Array();
    //console.log("---sTime_num--->"+JSON.stringify(sTime_num));
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    let valueSum = 0;
    let weightSum = 0;
    // let value = 0;
    // let weight = 0;
    // let classflag = 0;
    const kpitwo = await Kpitwolev.findOne({ where: { name: typeId } });
    //console.log("---losstier4--->"+JSON.stringify(losstier4 , null , 4));
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        // console.log("---sTime_num--->"+JSON.stringify(new Date(sTime_num)));
        //console.log("---losstier4.tier4id--->"+JSON.stringify(losstier4.tier4id));
        const classflag = await linebody_extend_service.getClassflag(new Date(sTime_num), new Date(eTime_num), Ids[i]);
        const kinebodyKpitwolev = await linebody.getLinebodyKpitwolev({ where: { kpitwolevKpitwoid: kpitwo.kpitwoid } });
        //console.log("---kinebodyKpitwolev--->"+JSON.stringify(kinebodyKpitwolev , null , 4));
        const value = await this.computeQuarterValueByTimes(sTime_num, eTime_num, kinebodyKpitwolev);

        const weight = linebody.weight;
        //console.log("---classflag--->"+JSON.stringify(classflag));
        //console.log("---weight--->"+JSON.stringify(weight));
        //console.log("---valuedfsd--->"+JSON.stringify(value));
        valueSum += Number(classflag) * Number(value) * Number(weight);
        weightSum += Number(classflag) * Number(weight);
    }
    const data = {
        value: valueSum,
        weight: weightSum
        // ,
        // classflag:classflag
    }
    return data;
}
exports.computeQuarter2ByTimes = computeQuarter2ByTimes;

/*
    根据times和allData时间区域内计算tire3级
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeAll3ByTimes(startTime, endTime, Ids, typeId) {
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null
        || typeId == undefined || typeId == '' || typeId == null) {
        console.log("---yuzhizhe1--->");
        return -1;
    }
    //console.log("---startTime--2->"+JSON.stringify(startTime));
    //console.log("---endTime--2->"+JSON.stringify(endTime));
    const sTime = new Date(startTime);
    let sTime_num = sTime.getTime();
    //console.log("---sTime--->"+JSON.stringify(sTime));
    //console.log("---eTime--->"+JSON.stringify(eTime));
    let eTime_num = Number(sTime_num) + 900000;

    const endTime_num = new Date(endTime).getTime()

    let returnData = new Array();
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    //console.log("---endTime_num--->"+JSON.stringify(endTime_num));
    while (eTime_num <= endTime_num) {
        //console.log("---sTime_num--->"+JSON.stringify(sTime_num));
        //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
        const value = await this.computeQuarter3ByTimes(sTime_num, eTime_num, Ids, typeId);

        if (value === undefined || value === null || value === '' || value === -1) {
            //console.log("---yuzhizhe0--->");
        } else {
            //console.log("---value--->"+JSON.stringify(value));
            await returnData.push(value);
        }
        sTime_num = Number(sTime_num) + 900000;
        eTime_num = Number(eTime_num) + 900000;
        //console.log("---eTime--->"+JSON.stringify(eTime));
    }
    let sum = 0;
    let weight = 0;
    //let classflag = 0;
    if (returnData.length != 0) {
        sum = await returnData.map(a => a.value).reduce((pre, cur) => pre + cur);
        weight = await returnData.map(a => a.weight).reduce((pre, cur) => pre + cur);
        //classflag = await returnData.map(a => a.classflag).reduce ((pre, cur) => pre + cur);
        //average = sum / returnData.length;
    }
    //const returnTime = sTime.date();
    console.log("---sum3--->" + JSON.stringify(sum));
    console.log("---weight3--->" + JSON.stringify(weight));
    // console.log("---classflag--->"+JSON.stringify(classflag));
    console.log('\n');
    const average = Number(sum) / Number(weight);
    return average.toFixed(4);
}
exports.computeAll3ByTimes = computeAll3ByTimes;

/*
    根据times和allData每15分钟计算tire3级
    startTime:15分钟开始时间
    endTime:15分钟结束时间
    */
async function computeQuarter3ByTimes(startTime, endTime, Ids, typeId) {
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null
        || typeId == undefined || typeId == '' || typeId == null) {
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
        const classflag = await linebody_extend_service.getClassflag(new Date(sTime_num), new Date(eTime_num), Ids[i]);
        const linebodyLosstier3 = await linebody.getLinebodyLosstier3({ where: { losstier3Lossid: typeId } });
        const value = await this.computeQuarterValueByTimes(sTime_num, eTime_num, linebodyLosstier3);

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
async function computeQuarterValueByTimes(startTime, endTime, allData) {
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || allData == undefined || allData == '' || allData == null) {
        //console.log("---allData为空--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let valueSum = 0;
    for (var i = allData.length - 1; i >= 0; i--) {
        if (allData[i] === null || allData[i] === '') {
            continue;
        }
        const csTime = new Date(allData[i].starttime).getTime();
        const ceTime = new Date(allData[i].endtime).getTime();
        //console.log('----sTime_num-->'+JSON.stringify(sTime , null , 4));
        if (csTime == undefined || csTime == '' || csTime == null
            || ceTime == undefined || ceTime == '' || ceTime == null) {
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
exports.computeQuarterValueByTimes = computeQuarterValueByTimes;

/*
    根据times和allData每天计算OEE中柱状图Target数据
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeTodayTargetByTimes(startTime, endTime, Ids) {
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null) {
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
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null) {
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
    if (startTime == undefined || startTime == '' || startTime == null
        || endTime == undefined || endTime == '' || endTime == null
        || Ids == undefined || Ids == '' || Ids == null) {
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
        const lossstatusDataLs = await Lossstatus.findAll({ where: { linebodyLinebodyid: linebodyIdList[i] } })
        if (lossstatusDataLs != null && lossstatusDataLs != '') {
            for (var j = 0; j < lossstatusDataLs.length; j++) {
                const lossstatusLslog = await Lossstatuslog.findAll({ where: { lossstatusId: lossstatusDataLs[j].id } })
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
