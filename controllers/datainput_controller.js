/*
    数据输入处理
    创建人：THree
    时间：2017/11/15
    */

//引入数据库Message模块
const twolevServices = require('../services/kpitwolev_service');
const lossstatusServices = require('../services/lossstatus_service');
const datainputServices = require('../services/datainput_service');
const textServices = require('../services/linebody_extend_service');
const Kpitwolev = require('../models').Kpitwolev;
const Losscategory = require('../models').Losscategory;
const errorUtil = require('../utils/errorUtil');
const moment = require('moment');

var dataSuccess = {
    status: '0',
    msg: '请求成功',
    data: 'fas'
};

const parameterError = {
    status: '1',
    msg: '参数错误'
};

const addObjectError = {
    status: '201',
    msg: '添加失败'
};

const lossnotinclass = {
    status: '202',
    msg: '该loss不在开班时间内'
};

const updateError = {
    status: '301',
    msg: '更新数据错误'
};

const showLosstier34 = {
    losstier3: '',
    losstier4: ''
}

var showAddPrpductData = {
    productid: '',
    productname: '',
    conformproduct: '',
    normalcycletime: ''
}


/*
    根据用户设置的顺序展示二级结构
    */
exports.showKpitwolev = async function (req, res) {
    if (req.body.userId == null || req.body.userId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        const kpitwolevidList = await datainputServices.selectKpitwolevidByuser(req.body.userId)
        var showList = []
        for (var i = 0; i < kpitwolevidList.length; i++) {
            var kpitwolev = await datainputServices.selectKpitwolevNameByid(kpitwolevidList[i].kpitwolevKpitwoid)
            showList.push(kpitwolev.name)
        }
        dataSuccess.data = showList
        res.end(JSON.stringify(dataSuccess))
    }
}


/*
    datainput 添加loss中展示三级目录结构结构
    */
exports.showLosstier3 = async function (req, res) {
    if (req.body.twolevName == null || req.body.twolevName == '') {
        res.end(JSON.stringify(parameterError))
    }
    // 找到对应的三级目录结构
    const twolevdata = await datainputServices.selectTwoLevByName(req.body.twolevName)
    const losstier3DataList = await datainputServices.selectLosstier3BytwoId(twolevdata.kpitwoid)
    var losstier4List = []
    var flag = true
    for (var i = 0; i < losstier3DataList.length; i++) {
        var losstier4NameList = await datainputServices.selectLosstier4Bytier3Id(losstier3DataList[i].lossid)
        if (losstier4NameList != null) {
            if (flag == true) {
                losstier4List = losstier4NameList
                flag = false
            } else {
                losstier4List = await losstier4List.concat(losstier4NameList)
            }
        }
    }
    showLosstier34.losstier4 = losstier4List
    showLosstier34.losstier3 = losstier3DataList
    dataSuccess.data = showLosstier34
    res.end(JSON.stringify(dataSuccess))
}


/*
    点击确定按钮，创建一条数据并添加时间
    */
exports.addLosstier4time2 = async function (req, res) {
    if (req.body.classinfId == null || req.body.classinfId == '' ||
        req.body.twolevName == null || req.body.twolevName == '' ||
        req.body.losstier3Id == null || req.body.losstier3Id == '' ||
        req.body.losstier4Id == null || req.body.losstier4Id == '' ||
        req.body.linebodyId == null || req.body.linebodyId == '' ||
        req.body.starttime == null || req.body.starttime == '' ||
        req.body.endtime == null || req.body.endtime == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        // 判断这个四级loss在不在开班时间内
        var addReturn = null
        var classinforData = await datainputServices.classinforSelectById(req.body.classinfId)
        if (moment(req.body.starttime) >= moment(classinforData.classstarttime) &&
            moment(req.body.endtime) <= moment(classinforData.classendtime)) {
            // loss四级时间在开班时间内
            addReturn = await exports.addLosstierData(req, res)
        } else {
            addReturn = 202
        }

        // 返回值设定
        if (addReturn != null && addReturn != 1 && addReturn != 202) {
            dataSuccess.data = addReturn
            res.end(JSON.stringify(dataSuccess))
        } else if (addReturn == 1) {
            res.end(JSON.stringify(errorUtil.existError))
        } else if (addReturn == 202) {
            res.end(JSON.stringify(lossnotinclass))
        } else {
            res.end(JSON.stringify(addObjectError))
        }
    }
}

/*
    创建并增加二级-四级loss value数据
    */
exports.addLosstierData = async function (req, res) {

    // 验证添加的这个四级loss数据是否重复(重合)
    var checkFlag = await datainputServices.selectLosstier4DataBy(req, res)
    if (checkFlag == 1) {
        return checkFlag
    }
    //----------------------------------------------------------------------01/02

    // 添加四级loss发生的开始时间和结束时间
    var losstier4dataList = await datainputServices.addLosstier4datatime(req, res)
    var showAddloss4After = {
        losstier2name: '',
        losstier3name: '',
        losstier4name: '',
        losstier4Dataid: '',
        starttime: '',
        endtime: '',
    }

    // 封装成前台需要的格式
    for (var i = 0; i < losstier4dataList.length; i++) {
        showAddloss4After.losstier4Dataid = showAddloss4After.losstier4Dataid + ',' + losstier4dataList[i].id
    }
    // 把多余的 ，去掉
    showAddloss4After.losstier4Dataid = showAddloss4After.losstier4Dataid.slice(1, )
    showAddloss4After.starttime = req.body.starttime
    showAddloss4After.endtime = req.body.endtime
    showAddloss4After = await datainputServices.showNameByloss4dataId(
        showAddloss4After, req.body.losstier4Id, req.body.losstier3Id, req.body.twolevName)
    return showAddloss4After
}

/*
    展示产品名字（最小的产品类）下拉列表
    */
exports.showProductName = async function (req, res) {
    if (req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        const data = await datainputServices.selectProductnameById(req.body.linebodyId)
        dataSuccess.data = data
        res.end(JSON.stringify(dataSuccess))
    }
}

/*
    增加产品信息
    */
exports.addProduct = async function (req, res) {
    if (req.body.productNameId == null || req.body.productNameId == '' ||
        req.body.conformProduct == null || req.body.conformProduct == '' ||
        req.body.classinfId == null || req.body.classinfId == '' ||
        req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        var addReturn
        // 验证产品信息是否重复
        const checkData = await datainputServices.selectProductdataBy(req.body.linebodyId, req.body.classinfId, req.body.productNameId)
        if (checkData == '' || checkData == null || checkData == undefined) {
            // 增加一条产品信息数据
            addReturn = await datainputServices.addProduct(req, res)
            if (addReturn != null || addReturn != '') {
                // 调用展示全部产品信息
                exports.showProduct(req, res)
            }
        } else {
            res.end(JSON.stringify(errorUtil.existError))
        }
    }
}

/*
    展示产品信息
    */
exports.showProduct = async function (req, res) {
    if (req.body.classinfId == null || req.body.classinfId == '' ||
        req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        const showProduct = await exports.showProductinf(req.body.classinfId, req.body.linebodyId)
        dataSuccess.data = showProduct
        res.end(JSON.stringify(dataSuccess))
    }
}
/*
    展示产品信息
    */

exports.showProductinf = async function (classinfId, linebodyId) {
    var showProduct = []
    // 查找一条产品信息     
    const data = await datainputServices.selectProductByclassId(classinfId)
    if (data != null && data != '') {
        for (var j = 0; j < data.length; j++) {
            const samenamedata = await datainputServices.selectProductDataByName(
                data[j].linebodyproductnameId, classinfId)
            var showAddPrpductData = {
                productid: '',
                productname: '',
                conformproduct: '',
                normalcycletime: ''
            }
            if (samenamedata != null || samenamedata != '') {
                // 设置展示的list 的值
                showAddPrpductData.productid = samenamedata.productid
                const concatName = await datainputServices.selectconcatNameById(samenamedata.linebodyproductnameId)
                showAddPrpductData.productname = concatName
                showAddPrpductData.conformproduct = samenamedata.conformproduct
                const lineproname = await datainputServices.selectCCYtimeById(samenamedata.linebodyproductnameId)
                showAddPrpductData.normalcycletime = lineproname.normalcycletime
                showProduct.push(showAddPrpductData)
            }
        }
    }
    return showProduct
}

/*
    编辑产品信息
    */
exports.updateProduct = async function (req, res) {
    if (req.body.conformProduct == null || req.body.conformProduct == '' ||
        req.body.productId == null || req.body.productId == '' ||
        req.body.classinfId == null || req.body.classinfId == '' ||
        req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        // 更改一条产品信息
        const updateReturn = await datainputServices.updateProduct(req, res)
        if (updateReturn != 1) {
            res.end(JSON.stringify(updateError))
        }
        // 调用展示全部产品信息
        exports.showProduct(req, res)
    }

}

/*
    删除产品信息
    */
exports.deleteProduct = async function (req, res) {
    if (req.body.productId == null || req.body.productId == '' ||
        req.body.classinfId == null || req.body.classinfId == '' ||
        req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        // 删除一条产品信息
        const deleteReturn = await datainputServices.deleteProduct(req.body.productId)
        if (deleteReturn == null || deleteReturn == '') {
            res.end(JSON.stringify(updateError))
        }

        // 调用展示全部产品信息
        exports.showProduct(req, res)
    }
}


/*
    增加开班详细信息
    */
exports.addClassinf = async function (req, res) {
    if (req.body.classStarttime == null || req.body.classStarttime == '' ||
        req.body.classEndtime == null || req.body.classEndtime == '' ||
        req.body.shouldAttendance == null || req.body.shouldAttendance == '' ||
        req.body.actualAttendance == null || req.body.actualAttendance == '' ||
        req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        // 判断开班时间是否重合
        var checkFlag = await datainputServices.checkClassData(req.body.linebodyId, req.body.classStarttime, req.body.classEndtime)
        if (checkFlag == 1) {
            res.end(JSON.stringify(errorUtil.existError))
        } else {
            // 增加一条产品信息数据
            const addReturn = await datainputServices.addClassinf(req.body.classStarttime,
                req.body.classEndtime, req.body.shouldAttendance, req.body.actualAttendance, req.body.linebodyId)
            dataSuccess.data = addReturn
            res.end(JSON.stringify(dataSuccess))
        }
    }
}

/*
    编辑添加loss后的三级四级项目时间
    */
exports.updateObjectimeAfteradd = async function (req, res) {
    if (req.body.losstier4DataidList == null || req.body.losstier4DataidList == '' ||
        req.body.starttime == null || req.body.starttime == '' ||
        req.body.endtime == null || req.body.endtime == '' ||
        req.body.classinfId == null || req.body.classinfId == '' ||
        req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        // 判断修改的四级loss时间在不在开班时间内
        var classinforData = await datainputServices.classinforSelectById(req.body.classinfId)
        if (moment(req.body.starttime) >= moment(classinforData.classstarttime) &&
            moment(req.body.endtime) <= moment(classinforData.classendtime)) {
            // loss四级时间在开班时间内
            var showAddloss4After = {
                losstier2name: '',
                losstier3name: '',
                losstier4name: '',
                losstier4Dataid: '',
                starttime: '',
                endtime: ''
            }
<<<<<<< HEAD
            var losstier4DataidList = req.body.losstier4DataidList.split(",")
            const reqEndtime = req.body.endtime // 传入的结束日期，存值
            const reqStarttime = req.body.starttime // 传入的结束日期，存值

            const losstier4Data0 = await datainputServices.selectLosstier4DataByid(losstier4DataidList[0])
            // addLosstierData一些参数设定
            var lossreq = await datainputServices.selectreqByloss4data(losstier4Data0)
            req.body.losstier4Id = losstier4Data0.losstier4Tier4id
            req.body.losstier3Id = lossreq.losstier3Id
            req.body.twolevName = lossreq.losstier2name

            const checkFlag = await datainputServices.checkUpdateLoss4Data(losstier4DataidList, req.body.starttime, req.body.endtime)
            if (checkFlag == 0) {
                // 更改后loss和之前完全不重合
                for (var i = 0; i < losstier4DataidList.length; i++) {
                    await datainputServices.deleteLoss32data(losstier4DataidList[i])
                    await datainputServices.deleteLoss4data(losstier4DataidList[i])
=======

            // 增加传入的loss
            showAddloss4After = await exports.addLosstierData(req, res)
        } else {
            // 更改后loss和之前重合
            // 更改之前loss是否跨15分钟
            if (losstier4DataidList.length == 1) {
                // 开始和结束的值
                if (moment(reqStarttime).unix() < moment(losstier4Data0.starttime).unix()) {
                    // 参数设定
                    req.body.starttime = reqStarttime
                    req.body.endtime = losstier4Data0.starttime
                    showAddloss4After = await exports.addLosstierData(req, res)
                }
                if (moment(reqEndtime).unix() > moment(losstier4Data0.endtime).unix()) {
                    // 参数设定
                    req.body.starttime = losstier4Data0.endtime
                    req.body.endtime = reqEndtime
                    showAddloss4After = await exports.addLosstierData(req, res)
                }
                if (moment(reqStarttime).unix() > moment(losstier4Data0.starttime).unix()) {
                    // 小于15分钟，直接update
                    const updateReturn = await datainputServices.updateLoss4data(
                        losstier4Data0, reqStarttime, losstier4Data0.endtime)
                }
                if (moment(reqEndtime).unix() < moment(losstier4Data0.endtime).unix()) {
                    // 小于15分钟，直接update
                    const updateReturn = await datainputServices.updateLoss4data(
                        losstier4Data0, losstier4Data0.starttime, reqEndtime)
>>>>>>> Android
                }

                // 增加传入的loss
                showAddloss4After = await exports.addLosstierData(req, res)
            } else {
                // 更改后loss和之前重合
                // 更改之前loss是否跨15分钟
                if (losstier4DataidList.length == 1) {
                    // 开始和结束的值
                    if (moment(reqStarttime).unix() < moment(losstier4Data0.starttime).unix()) {
                        // 参数设定
                        req.body.starttime = reqStarttime
                        req.body.endtime = losstier4Data0.starttime
                        showAddloss4After = await exports.addLosstierData(req, res)
                    }
<<<<<<< HEAD
                    if (moment(reqEndtime).unix() > moment(losstier4Data0.endtime).unix()) {
                        // 参数设定
                        req.body.starttime = losstier4Data0.endtime
                        req.body.endtime = reqEndtime
                        showAddloss4After = await exports.addLosstierData(req, res)
=======
                    if (ccyTimeindex == null) {
                        ccyTimeindex = 1
>>>>>>> Android
                    }
                    if (moment(reqStarttime).unix() > moment(losstier4Data0.starttime).unix()) {
                        // 小于15分钟，直接update
                        const updateReturn = await datainputServices.updateLoss4data(
                            losstier4Data0, reqStarttime, losstier4Data0.endtime)
                    }
                    if (moment(reqEndtime).unix() < moment(losstier4Data0.endtime).unix()) {
                        // 小于15分钟，直接update
                        const updateReturn = await datainputServices.updateLoss4data(
                            losstier4Data0, losstier4Data0.starttime, reqEndtime)
                    }
                } else {
                    // 开始和结束的值
                    const losstier4Data1 = await datainputServices.selectLosstier4DataByid(losstier4DataidList[1])

                    if (moment(reqStarttime).unix() < moment(losstier4Data0.starttime).unix()) {
                        // 参数设定
                        req.body.starttime = reqStarttime
                        req.body.endtime = losstier4Data0.starttime
                        showAddloss4After = await exports.addLosstierData(req, res)
                    }
                    if (moment(reqEndtime).unix() > moment(losstier4Data1.endtime).unix()) {
                        // 参数设定
                        req.body.starttime = losstier4Data1.endtime
                        req.body.endtime = reqEndtime
                        showAddloss4After = await exports.addLosstierData(req, res)
                    }
                    if (moment(reqStarttime).unix() > moment(losstier4Data0.starttime).unix()) {
                        var ccyTimeindex = null
                        // 超过15分钟 ccyTimeindex
                        for (var i = 0; i < losstier4DataidList.length; i++) {
                            if (i == 1) {
                                continue
                            }
                            const losstier4Data = await datainputServices.selectLosstier4DataByid(losstier4DataidList[i])
                            if (moment(reqStarttime).unix() >= moment(losstier4Data.endtime).unix()) {
                                //删除超过的部分
                                await datainputServices.deleteLoss32data(losstier4DataidList[i])
                                await datainputServices.deleteLoss4data(losstier4DataidList[i])
                            } else {
                                ccyTimeindex = i
                                break
                            }
                        }

                        if (ccyTimeindex == null) {
                            ccyTimeindex = 1
                        }
                        // 更改余下的部分
                        const losstier4Data = await datainputServices.selectLosstier4DataByid(losstier4DataidList[ccyTimeindex])
                        const updateReturn = await datainputServices.updateLoss4data(
                            losstier4Data, reqStarttime, losstier4Data.endtime)
                    }
                    if (moment(reqEndtime).unix() < moment(losstier4Data1.endtime).unix()) {
                        var ccyTimeindex = ''
                        // 超过15分钟 超过的整个删除
                        for (var i = losstier4DataidList.length - 1; i >= 0; i--) {
                            if (i == 1)
                                continue
                            var loopFlag = false
                            if (loopFlag == false) {
                                if (moment(reqEndtime).unix() <= moment(losstier4Data1.starttime).unix()) {
                                    await datainputServices.deleteLoss32data(losstier4DataidList[1])
                                    await datainputServices.deleteLoss4data(losstier4DataidList[1])

                                } else {
                                    ccyTimeindex = 1
                                    break
                                }
                                loopFlag = true
                            }
                            const losstier4Data = await datainputServices.selectLosstier4DataByid(losstier4DataidList[i])
                            if (moment(reqEndtime).unix() <= moment(losstier4Data.starttime).unix()) {
                                //删除超过的部分
                                await datainputServices.deleteLoss32data(losstier4DataidList[i])
                                await datainputServices.deleteLoss4data(losstier4DataidList[i])
                            } else {
                                ccyTimeindex = i
                                break
                            }
                        }
                        // 更改余下的部分
                        const losstier4Data = await datainputServices.selectLosstier4DataByid(losstier4DataidList[ccyTimeindex])
                        const updateReturn = await datainputServices.updateLoss4data(
                            losstier4Data, losstier4Data.starttime, reqEndtime)
                    }
                }
            }

            // 设置返回值
            const showlossinf = await datainputServices.showloss4inf(req.body.classinfId, req.body.linebodyId, lossreq.losstier2name)
            dataSuccess.data = showlossinf
            res.end(JSON.stringify(dataSuccess))
        } else {
            res.end(JSON.stringify(lossnotinclass))
        }
    }
}

/*
    删除loss信息
    */
exports.deleteLoss4data = async function (req, res) {
    if (req.body.losstier4DataidList == null || req.body.losstier4DataidList == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        var deleteReturn
        var losstier4DataidList = req.body.losstier4DataidList.split(",")
        for (var i = 0; i < losstier4DataidList.length; i++) {
            await datainputServices.deleteLoss32data(losstier4DataidList[i])
            deleteReturn = await datainputServices.deleteLoss4data(losstier4DataidList[i])
        }
        if (deleteReturn != null) {
            dataSuccess.data = ''
            res.end(JSON.stringify(dataSuccess))
        } else {
            // 删除失败
        }
    }
}

exports.getClassflag = async function (req, res) {
    var classflag = await textServices.getClassflag(req.body.classStarttime, req.body.classEndtime, req.body.linebodyId);
    dataSuccess.data = classflag
    res.end(JSON.stringify(dataSuccess))
}

/*
    开班历史信息展示接口
    */
exports.showClassinfHistory = async function (req, res) {
    if (req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        const showClassinfdata = await datainputServices.selectClassinfBylineby(req.body.linebodyId)
        dataSuccess.data = showClassinfdata
        res.end(JSON.stringify(dataSuccess))
    }
}

/*
    开班历史信息删除接口
    */
exports.deleteClassinfHistory = async function (req, res) {
    if (req.body.classinfId == null || req.body.classinfId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        // 删除一条开班历史信息
        const deleteReturn = await datainputServices.deleteClassinfHistory(req.body.classinfId)
        if (deleteReturn == null || deleteReturn == '') {
            res.end(JSON.stringify(updateError))
        } else {
            dataSuccess.data = deleteReturn
            res.end(JSON.stringify(dataSuccess))
        }
    }
}

/*
    展示右侧产品loss班次
    */
exports.showClassinfHisRight = async function (req, res) {
    if (req.body.classinfId == null || req.body.classinfId == '' ||
        req.body.userId == null || req.body.userId == '' ||
        req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(parameterError))
    } else {
        var classinfHisRight = {
            classstarttime: '',
            classendtime: '',
            shouldattendance: '',
            actualattendance: '',
            product: '',
            loss: ''
        }
        // 查找班次信息
        const classinfData = await datainputServices.classinforSelectById(req.body.classinfId)
        classinfHisRight.classstarttime = classinfData.classstarttime
        classinfHisRight.classendtime = classinfData.classendtime
        classinfHisRight.shouldattendance = classinfData.shouldattendance
        classinfHisRight.actualattendance = classinfData.actualattendance
        // 查找产品信息
        const productinf = await exports.showProductinf(req.body.classinfId, req.body.linebodyId)
        classinfHisRight.product = productinf
        // 查找loss信息

        var lossinfW = []
        const kpitwolevidList = await datainputServices.selectKpitwolevidByuser(req.body.userId)
        for (var i = 0; i < kpitwolevidList.length; i++) {
            var lossinf = {}
            var kpitwolev = await datainputServices.selectKpitwolevNameByid(kpitwolevidList[i].kpitwolevKpitwoid)
            lossinf[kpitwolev.name] = '';
            var loss4inf = await datainputServices.showloss4inf(req.body.classinfId, req.body.linebodyId, kpitwolev.name)
            lossinf[kpitwolev.name] = loss4inf
            lossinfW.push(lossinf)
        }
        classinfHisRight.loss = lossinfW

        dataSuccess.data = classinfHisRight
        res.end(JSON.stringify(dataSuccess))
    }
}