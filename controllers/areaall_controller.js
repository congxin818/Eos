/*
    区域控制处理
    创建人：THree
    时间：2017/10/26
    */

/*
    修改区域控制处理
    修改内容：
    修改人：Android
    修改时间：2017/12/12
 */

//引入数据库Message模块
const groupconler = require('./group_controller');
const factoryconler = require('./factory_controller');
const workshopconler = require('./workshop_controller');
const linebodyconler = require('./linebody_controller');
const services = require('../services/group_service');
const facServices = require('../services/factory_service');
const wksServices = require('../services/workshop_service');
const linbyServices = require('../services/linebody_service');
const errorUtil = require('../utils/errorUtil');
var moment = require('moment');
const Linebody = require('../models').Linebody;
const Productdata = require('../models').Productdata;
const Productname = require('../models').Productname;
const Productsubclass = require('../models').Productsubclass;
const Productbigclass = require('../models').Productbigclass;
const LinebodyProductname = require('../models').LinebodyProductname;

const dataSuccess = {
    status: '0',
    msg: '请求成功',
    data: 'fas'
};

const parameterError = {
    status: '1',
    msg: '参数错误'
};

const namehasError = {
    status: '101',
    msg: '集团已存在'
};

const addAreaError = {
    status: '201',
    msg: '添加数据错误'
};
const updateAreaError = {
    status: '301',
    msg: '更新数据错误'
};

/*
    查询所有集团和工厂
    */
async function selectAreaAll(req, res) {
    if (req == '') {
        return parameterError
    }
    var treeShowGroupData = [];
    var treeShowFacData = [];
    var treeShowWosData = [];
    var treeShowLinbyData = [];

    const groupData = await services.selectGroupAll(req, res)
    //把集团表通过一定格式展示出来
    groupData.forEach(groupDataOne => {
        const data1 = areaValSet(groupDataOne.groupid, groupDataOne.groupname, null, groupDataOne.checked)
        treeShowGroupData.push(data1)
    })

    const factoryData = await facServices.selectFactoryAll(req, res)
    factoryData.forEach(factoryDataOne => {
        const data2 = areaValSet('f' + factoryDataOne.factoryid, factoryDataOne.factoryname,

            factoryDataOne.factorybelong, factoryDataOne.checked)
        treeShowFacData.push(data2)
    })

    const workshopData = await wksServices.selectWorkshopAll(req, res)
    //把车间表通过一定格式展示出来
    workshopData.forEach(workshopDataOne => {
        const data3 = areaValSet('w' + workshopDataOne.workshopid, workshopDataOne.workshopname,

            workshopDataOne.workshopbelong, workshopDataOne.checked);
        treeShowWosData.push(data3)
    })

    const linebodyData = await linbyServices.selectLinebodyAll(req, res)
    //把线体表通过一定格式展示出来
    linebodyData.forEach(linebodyDataOne => {
        const data4 = areaValSet('l' + linebodyDataOne.linebodyid, linebodyDataOne.linebodyname,
            linebodyDataOne.linebodybelong, linebodyDataOne.checked);
        treeShowLinbyData.push(data4)
    })
    var contGFData = await treeShowGroupData.concat(treeShowFacData)
        .concat(treeShowWosData).concat(treeShowLinbyData)

    return contGFData
}
exports.selectAreaAll = selectAreaAll;
/*
    把区域的格式设置为树图格式
    */
var areaValSet = function (id, name, pId, checked) {
    var treeShow = {
        id: 'fas',
        name: 'fas',
        pId: null,
        checked: 'fas'
    };

    treeShow.id = id;
    treeShow.name = name;
    treeShow.pId = pId;
    treeShow.checked = checked;
    return treeShow;
}

/*
    判断要更改的表（集团、工厂、车间、线体）
    调用相对应的update函数
    */
exports.updateArea = async function (req, res) {
    //如果没有post数据或者数据为空,直接返回
    if (req.body.id == null || req.body.id == '' || req.body.name == null
        || req.body.name == '') {
        return parameterError
    }
    var areaFlag = await req.body.id.slice(0, 1);
    var areaId = req.body.id.slice(1, );
    if (!isNaN(areaFlag)) {
        // 更改一个集团
        const updateReturn = await groupconler.updateGroupById(req, res);
        // 验证更改的名字是否重复
        if (updateReturn.status == '101')
            res.end(JSON.stringify(updateReturn));
        if (updateReturn == 1) {
            res.end(JSON.stringify(dataSuccess))
        } else {
            res.end(JSON.stringify(updateAreaError))
        }
    }

    if (areaFlag == 'f') {
        // 更改一个工厂
        req.body.factoryId = areaId;
        const updateReturn = await factoryconler.updateFactoryById(req, res);
        // 验证更改的名字是否重复
        if (updateReturn.status == '101')
            res.end(JSON.stringify(updateReturn));
        if (updateReturn.length == 1) {
            res.end(JSON.stringify(dataSuccess))
        } else {
            res.end(JSON.stringify(updateAreaError))
        }
    }
    if (areaFlag == 'w') {
        // 更改一个车间
        req.body.workshopId = areaId;
        const updateReturn = await workshopconler.updateWorkshopById(req, res);
        // 验证更改的名字是否重复
        if (updateReturn.status == '101')
            res.end(JSON.stringify(updateReturn));
        if (updateReturn == '1') {
            res.end(JSON.stringify(dataSuccess))
        } else {
            res.end(JSON.stringify(updateAreaError))
        }
    }
    if (areaFlag == 'l') {
        // 更改一个线体           
        req.body.linebodyId = areaId;
        const updateReturn = await linebodyconler.updateLinebodyById(req, res);
        // 验证更改的名字是否重复
        if (updateReturn.status == '101')
            res.end(JSON.stringify(updateReturn));
        if (updateReturn == 1) {
            res.end(JSON.stringify(dataSuccess))
        } else {
            res.end(JSON.stringify(updateAreaError))
        }
    }
}

/*  
    判断要增加的表（集团、工厂、车间、线体）
    调用相对应的增加函数
    */
exports.addAreaOne = async function (req, res) {
    //如果没有post数据或者数据为空,直接返回
    if (req.body.name == null || req.body.name == '' || req.body.pId == '') {
        res.end(JSON.stringify(parameterError));
    } else {
        if (req.body.pId == null) {
            // 添加一个集团
            const addData = await groupconler.addGroupOne(req, res);
            // 增加的验证
            if (addData.status == '101')
                res.end(JSON.stringify(addData));
            if (addData == null || addData == '')
                res.end(JSON.stringify(addAreaError));
            // 按格式显示
            const addRetrun = await areaValSet(addData.groupid, addData.groupname, null, addData.checked);
            res.end(JSON.stringify(addRetrun));
        }
        var areaFlag = await req.body.pId.slice(0, 1);
        if (!isNaN(areaFlag)) {
            // 添加一个工厂
            const addData = await factoryconler.addFactoryOne(req, res);
            // 增加的验证
            if (addData.status == '101' || addData.status == '1')
                res.end(JSON.stringify(addData));
            if (addData == null || addData == '')
                res.end(JSON.stringify(addAreaError));
            // 按格式显示
            const addRetrun = await areaValSet('f' + addData.factoryid, addData.factoryname,
                addData.factorybelong, addData.checked);
            res.end(JSON.stringify(addRetrun));
        } else {
            if (areaFlag == 'f') {
                // 添加一个车间
                const addData = await workshopconler.addWorkshopOne(req, res);
                // 增加的验证
                if (addData.status == '101' || addData.status == '1')
                    res.end(JSON.stringify(addData));
                if (addData == null || addData == '')
                    res.end(JSON.stringify(addAreaError));
                // 按格式显示
                const addRetrun = await areaValSet('w' + addData.workshopid, addData.workshopname,
                    addData.workshopbelong, addData.checked);
                res.end(JSON.stringify(addRetrun));
            } else if (areaFlag == 'w') {
                // 添加一个线体
                const addData = await linebodyconler.addLinebodyOne(req, res);
                // 增加的验证
                if (addData.status == '101' || addData.status == '1')
                    res.end(JSON.stringify(addData));
                if (addData == null || addData == '')
                    res.end(JSON.stringify(addAreaError));
                // 按格式显示
                const addRetrun = await areaValSet('l' + addData.linebodyid, addData.linebodyname,
                    addData.linebodybelong, addData.checked);
                res.end(JSON.stringify(addRetrun));
            }
        }
    }

}


/*
    判断要删除的表（集团、工厂、车间、线体）
    调用相对应的update函数
    */
exports.deleteArea = async function (req, res) {
    //如果没有post数据或者数据为空,直接返回
    if (req.query.id == null || req.query.id == '') {
        res.end(JSON.stringify(parameterError));
    }
    var deleteReturn;
    var areaFlag = await req.query.id.slice(0, 1);
    var areaId = req.query.id.slice(1, );
    if (!isNaN(areaFlag)) {
        // 删除一个集团
        deleteReturn = await groupconler.deleteGroupById(req, res);
    }
    else if (areaFlag == 'f') {
        // 删除一个工厂
        req.query.factoryId = areaId;
        deleteReturn = await factoryconler.deleteFactoryById(req, res);
    }
    else if (areaFlag == 'w') {
        // 删除一个车间
        req.query.workshopId = areaId;
        deleteReturn = await workshopconler.deleteWorkshopById(req, res);
    }
    else if (areaFlag == 'l') {
        // 删除一个线体           
        req.query.linebodyId = areaId;
        deleteReturn = await linebodyconler.deleteLinebodyById(req, res);
    } else {
        deleteReturn = errorUtil.noExistError
    }
    if (deleteReturn == '' || deleteReturn == null || deleteReturn == undefined) {
        res.end(JSON.stringify(dataSuccess));
    } else if (deleteReturn.status == 4) {
        res.end(JSON.stringify(deleteReturn));
    } else {
        dataSuccess.data = deleteReturn
        res.end(JSON.stringify(dataSuccess));
    }

}

/*
    把区域的树状图展示出来
    */
exports.showAreaAll = async function (req, res) {
    const allData = await exports.selectAreaAll(req, res);
    res.end(JSON.stringify(allData));
}

/**
    * 时间转为秒
    * @param time 时间(00:00:00)
    * @returns {string} 时间戳（单位：秒）
    */
async function time_to_sec(time) {
    var s = '';
    if (time == undefined || time == null || time == '') {
        return 0;
    }
    var hour = time.split(':')[0];
    var min = time.split(':')[1];
    var sec = time.split(':')[2];

    s = Number(hour * 3600) + Number(min * 60) + Number(sec);

    return s;
}
exports.time_to_sec = time_to_sec;

/**
     * 时间秒数格式化
     * @param s 时间戳（单位：秒）
     * @returns {*} 格式化后的时分秒
     */
async function sec_to_time(s) {
    var t;
    if (s > -1) {
        var hour = Math.floor(s / 3600);
        var min = Math.floor(s / 60) % 60;
        var sec = s % 60;
        if (hour < 10) {
            t = '0' + hour + ":";
        } else {
            t = hour + ":";
        }

        if (min < 10) { t += "0"; }
        t += min + ":";
        if (sec < 10) { t += "0"; }
        t += sec.toFixed(2);
    } else {
        t = '00:00:00';
    }
    return t;
}
exports.sec_to_time = sec_to_time;

/**
     * 根据线体ID查询线体的所有能生产的产品
     * @param req 请求
     * @returns res 请求返回
     */
async function selectLinebodyProductsByLinebodyId(req, res, next) {
    if (req.body.linebodyId == undefined || req.body.linebodyId == null || req.body.linebodyId == '') {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    //console.log(JSON.stringify(allProductbigclass , null , 4));
    //console.log('yuzhizhe');
    const linebody = await Linebody.findById(req.body.linebodyId);
    if (linebody == undefined || linebody == null || linebody == '') {
        res.end(JSON.stringify(errorUtil.noExistError));
        return;
    }
    let returnData = {
        modelList: new Array(),
        data: new Array()
    };
    let Data1 = {
        result: new Array(),
        data: new Array()
    };
    const linebodyProduct = await linebody.getLinebodyProductnames();
    for (var i = linebodyProduct.length - 1; i >= 0; i--) {
        if (linebodyProduct[i] == undefined || linebodyProduct[i] == null || linebodyProduct[i] == '') {
            continue;
        }
        let allProduct = {
            id: '',
            name: new Array(),
            value: ''
        }
        //const value = await linebodyProduct[i].getLineProductnameproductdata();
        allProduct.id = linebodyProduct[i].linebodyproductname.id;

        allProduct.value = await this.time_to_sec(linebodyProduct[i].linebodyproductname.normalcycletime);
        //console.log(JSON.stringify(allProduct.value, null , 4));

        await allProduct.name.push(linebodyProduct[i].id);
        const subClass = await Productsubclass.findById(linebodyProduct[i].productsubclassId);
        await allProduct.name.push(subClass.id);
        const bigClass = await Productbigclass.findById(subClass.productbigclassId);
        await allProduct.name.push(bigClass.id);
        await allProduct.name.reverse();
        //console.log(JSON.stringify(allProduct , null , 4));
        Data1.result.push(allProduct);
    }
    Data1.result.reverse();
    returnData.modelList.push(Data1);

    const allBigClass = await Productbigclass.findAll();
    if (allBigClass == undefined || allBigClass == null || allBigClass == '') {
        res.end(JSON.stringify(returnData));
        return;
    }
    for (var i = allBigClass.length - 1; i >= 0; i--) {
        //console.log('yuzhizhe03------>'+JSON.stringify(allBigClass[i] , null , 4));
        if (allBigClass[i] == undefined || allBigClass[i] == null || allBigClass[i] == '') {
            // /console.log('yuzhizhe');
            continue;
        } else {
            let bigClass = {
                value: allBigClass[i].id,
                label: allBigClass[i].name,
                children: new Array()
            };
            const allSubClass = await allBigClass[i].getProductbigSubclass();
            if (allSubClass == undefined || allSubClass == null || allSubClass == '') {
                //console.log('yuzhizhe');
                continue;
            } else {
                for (var j = allSubClass.length - 1; j >= 0; j--) {
                    //console.log('yuzhizhe02------>'+JSON.stringify(allSubClass[j] , null , 4));
                    if (allSubClass[j] == undefined || allSubClass[j] == null || allSubClass[j] == '') {
                        //console.log('yuzhizhe');
                        continue;
                    } else {
                        let subClass = {
                            value: allSubClass[j].id,
                            label: allSubClass[j].name,
                            children: new Array()
                        };
                        const allProduct = await allSubClass[j].getProductsubclassName();
                        if (allProduct == undefined || allProduct == null || allProduct == '') {
                            //console.log('yuzhizhe');
                            continue;
                        } else {
                            for (var k = allProduct.length - 1; k >= 0; k--) {
                                //console.log('yuzhizhe01------>'+JSON.stringify(allProduct[k] , null , 4));
                                if (allProduct[k] == undefined || allProduct[k] == null || allProduct[k] == '') {
                                    //console.log('yuzhizhe');
                                    continue;
                                } else {
                                    let product = {
                                        value: allProduct[k].id,
                                        label: allProduct[k].name
                                    };
                                    await subClass.children.push(product);
                                }
                            }
                        }
                        await bigClass.children.push(subClass);
                    }
                }
            }
            await returnData.data.push(bigClass);
        }
    }
    //console.log('yuzhizhe03------>'+JSON.stringify(allBigClass , null , 4));
    //console.log(JSON.stringify(returnData , null , 4));
    dataSuccess.data = returnData
    res.end(JSON.stringify(dataSuccess));
}
exports.selectLinebodyProductsByLinebodyId = selectLinebodyProductsByLinebodyId;

/**
 * 根据线体id添加能产品
 */
async function addLinebodyProductByLinebodyId(req, res, next) {
    if (req.body.linebodyId == undefined || req.body.linebodyId == null || req.body.linebodyId == ''
        || req.body.productId == undefined || req.body.productId == null || req.body.productId == ''
        || req.body.cTime == undefined || req.body.cTime == null || req.body.cTime == ''
    ) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const linebody = await Linebody.findById(req.body.linebodyId);
    const product = await Productname.findById(req.body.productId);
    if (linebody == undefined || linebody == null || linebody == ''
        || product == undefined || product == null || product == '') {
        res.end(JSON.stringify(errorUtil.noExistError));
        return;
    }
    const time = await this.sec_to_time(req.body.cTime);
    const flag = await linebody.addLinebodyProductnames(product, { through: { normalcycletime: time } });
    if (flag == undefined || flag == null || flag == '' || flag == 1) {
        res.end(JSON.stringify(errorUtil.existError));
        return;
    } else {
        dataSuccess.data = flag[0][0].id;
        res.end(JSON.stringify(dataSuccess));
    }
}
exports.addLinebodyProductByLinebodyId = addLinebodyProductByLinebodyId;

/**
 * 根据线体id删除能产品
 */
async function deleteLinebodyProductById(req, res, next) {
    if (req.body.id == undefined || req.body.id == null || req.body.id == '') {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const linebodyProductname = await LinebodyProductname.findById(req.body.id);
    if (linebodyProductname == undefined || linebodyProductname == null || linebodyProductname == '') {
        res.end(JSON.stringify(errorUtil.noExistError));
        return;
    }
    const flag = await linebodyProductname.destroy({ where: { id: req.body.id } });
    if (flag == undefined || flag == null || flag == '') {
        res.end(JSON.stringify(errorUtil.serviceError));
        return;
    } else {
        dataSuccess.data = flag;
        res.end(JSON.stringify(dataSuccess));
    }
    //console.log(JSON.stringify(flag , null , 4));
}
exports.deleteLinebodyProductById = deleteLinebodyProductById;

/**
 * 根据线体id编辑产品
 */
async function updateLinebodyProductById(req, res, next) {
    if (req.body.id == undefined || req.body.id == null || req.body.id == ''
        || req.body.productId == undefined || req.body.productId == null || req.body.productId == ''
        || req.body.cTime == undefined || req.body.cTime == null || req.body.cTime == ''
    ) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const linebodyProductname = await LinebodyProductname.findById(req.body.id);
    const product = await Productname.findById(req.body.productId);
    const linebody = await Linebody.findById(linebodyProductname.linebodyLinebodyid);
    if (linebodyProductname == undefined || linebodyProductname == null || linebodyProductname == ''
        || product == undefined || product == null || product == ''
        || linebody == undefined || linebody == null || linebody == '') {
        res.end(JSON.stringify(errorUtil.noExistError));
        return;
    }
    const linebodyProduct = await linebody.getLinebodyProductnames();
    for (var i = linebodyProduct.length - 1; i >= 0; i--) {
        if (linebodyProduct[i] == undefined || linebodyProduct[i] == null || linebodyProduct[i] == '') {
            continue;
        }
        if (linebodyProduct[i].linebodyproductname.id == req.body.id) {
            continue;
        } else {
            if (linebodyProduct[i].id == req.body.productId) {
                res.end(JSON.stringify(errorUtil.existError));
                return;
            }
        }
    }
    //console.log(JSON.stringify(linebodyProduct , null , 4));
    const time = await this.sec_to_time(req.body.cTime);
    let value = {
        normalcycletime: time,
        productnameId: req.body.productId
    }
    const flag = await LinebodyProductname.update(value, { where: { id: req.body.id } });
    console.log(JSON.stringify(flag, null, 4));
    if (flag == undefined || flag == null || flag == '' || flag != 1) {
        res.end(JSON.stringify(errorUtil.serviceError));
    } else {
        dataSuccess.data = flag;
        res.end(JSON.stringify(dataSuccess));
    }
}
exports.updateLinebodyProductById = updateLinebodyProductById;

