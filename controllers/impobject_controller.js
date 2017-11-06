/*
    改进方案处理
    创建人：THree
    时间：2017/11/3
    */

//引入数据库Message模块
const twolevServices = require('../services/kpitwolev_service');
const lossstatusServices = require('../services/lossstatus_service');
const Kpitwolev = require('../models').Kpitwolev;
const Losscategory = require('../models').Losscategory;

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

const parameterError = {
    status: '1', 
    msg: '参数错误'
};

const updateError = {
    status: '115', 
    msg: '更新失败'
};

const kpiTwoShow = {
    id: 'fas', 
    name: 'fas',
    pId:'fas'
};

/*
    improvment展示项目池信息
    */ 
    exports.showImpItempool = async function(req , res) {
        // 把loss二级目录名字查找出来
        const KpitwolevNameList = await Kpitwolev.findAll();
        var showNameList =[];
        var LosscategoryNameList = [];
        for(var i = 0;i < KpitwolevNameList.length; i++){
            var itempoolOutput = { 
                name:'',
                data:''
            }
            itempoolOutput.name = KpitwolevNameList[i].name
            const data = await twolevServices.selectTwoLevByName(KpitwolevNameList[i].name ,
               KpitwolevNameList[i].pId)
            // 把loss三级目录名字查找出来
            LosscategoryNameList = await Losscategory.findAll({attributes: ['name'],
                where:{pId: data.id},order: [['value', 'ASC']]})

            itempoolOutput.data =  LosscategoryNameList
            await showNameList.push(itempoolOutput)
        }
        res.end(JSON.stringify(showNameList))     
    }
/*
    improvment编辑项目状态
    */
    exports.updateImpItemstatus = async function(req , res) {
        if(req.body.lossId == null||req.body.id == ''){
            res.end(JSON.stringify(parameterError))
        }
        const updateData = await lossstatusServices.updateLostatusById(req , res)
        if(updateData == 1){
            res.end(JSON.stringify(dataSuccess))
        }else{
            res.end(JSON.stringify(updateError))
        }     
    }

/*
    improvment展示项目状态
    */
    exports.showImpItemstatus = async function(req , res) {
        if(req.body.lossId == null||req.body.lossId == ''){
            res.end(JSON.stringify(parameterError))
        }
        const data = await lossstatusServices.selectLostatusById(req.body.lossId)
        dataSuccess.data = data 
        res.end(JSON.stringify(dataSuccess))
    }
/*
    test
    */ 
    exports.selectImpobjectT = async function(req , res) {

        const data = await Losscategory.findAll({attributes: ['name']});
        console.log(data)
        textoutput.data = data
        res.end(JSON.stringify(textoutput))
    }

    const textoutput = { 
        name:'OEE',
        data:''
    }