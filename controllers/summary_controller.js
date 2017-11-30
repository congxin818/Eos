/*
 	auther:Android,
 	NOTE:lossmapping表的controller层,
 	time:20171108
 */


var User = require('../models').User;//引入数据库User模块
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

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

/*
	项目状态分布（上）接口
 */
async function selectProjectStateByTimeAndLinebodyIds(req , res , next){
	// console.log(JSON.stringify(req.body.time , null , 4));
	// console.log(JSON.stringify(req.body.linebodyIds , null , 4));
	if (req.body.time == undefined || req.body.time == null || req.body.time == ''
		|| req.body.linebodyIds == undefined || req.body.linebodyIds == null || req.body.linebodyIds == ''
		|| req.body.type == undefined || req.body.type == null || req.body.type == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	const Ids = await req.body.linebodyIds.split(",");
	if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
		res.end(JSON.stringify(errorUtil.serviceError));
	}
	const allData = await this.selectOEEByLinebodyIds(req.body.time , req.body.linebodyIds , req.body.type);
	res.end(JSON.stringify(allData , null , 4));
}
exports.selectProjectStateByTimeAndLinebodyIds = selectProjectStateByTimeAndLinebodyIds;

/*
	查询OEE根据linebodyIds
 */
async function selectOEEByLinebodyIds(time , linebodyIds , type){
	if (time == undefined || time == null || time == ''
		|| linebodyIds == undefined || linebodyIds == null || linebodyIds == ''
		|| type == undefined || type == null || type == '') {
		return errorUtil.parameterError;
	}
	const Ids = await linebodyIds.split(",");
	if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
		return errorUtil.serviceError;
	}
	let allLossStatus = new Array();
	for (var i = Ids.length - 1; i >= 0; i--) {
		//const linebody = await Linebody.findById(Ids[i],{'attributes': ['linebodyid']});
		const linebody = await Linebody.findById(Ids[i]);
		if (linebody != undefined && linebody != null && linebody != '') {
			const lossStatus = await linebody.getLinebodyLossstatus();
			if (lossStatus != undefined && lossStatus != null && lossStatus != '') {
				allLossStatus.push(lossStatus);
			}
		}
	}
	console.log('yuzhizhe01----->'+JSON.stringify(allLossStatus , null , 4));
	const falg = await this.computeLossStatusBytime(allLossStatus , time);
	if (falg == null || falg == '') {
		return errorUtil.serviceError;
	}
	console.log('yuzhizhe02----->'+JSON.stringify(allLossStatus , null , 4));
	const allData = await this.selectAllDataByAllLossStatus(allLossStatus , Ids.length , type);
	//console.log(JSON.stringify(allLossStatus , null , 4));
	dataSuccess.data = allData;
	return dataSuccess;
}
exports.selectOEEByLinebodyIds = selectOEEByLinebodyIds;

/*
	根据时间过滤
 */
async function computeLossStatusBytime(allLossStatus , time){
	if (time == undefined || time == null || time == ''
		|| allLossStatus == undefined || allLossStatus == null || allLossStatus == '') {
		return ;
	}
	const Time = new Date(time).getTime();
	for (var i = allLossStatus.length - 1; i >= 0; i--) {
		for (var j = allLossStatus[i].length - 1; j >= 0; j--) {
			const projectStartTime = allLossStatus[i][j].objectstarttime;
			const projectEndTime = allLossStatus[i][j].planendtime;
			if (projectStartTime == null || projectStartTime == ''
				||projectEndTime == null || projectEndTime == '') {
				allLossStatus[i].splice(j , 1);//删除该元素
				continue;
			}
			// console.log('==========>projectStartTime--->'+JSON.stringify(projectStartTime));
			// console.log('==========>projectEndTime--->'+JSON.stringify(projectEndTime));
			// const mStartTime = moment(classstarttime);
			// const mEndTime = moment(classendtime);

			const mStartTime = new Date(projectStartTime).getTime();
			const mEndTime = new Date(projectEndTime).getTime();
			console.log('==========>mStartTime--->'+mStartTime);
			console.log('==========>Time--->'+Time);
			console.log('==========>projectEndTime--->'+mEndTime);
			console.log('\n\n');
			if (Time < mStartTime || Time > mEndTime) {
				allLossStatus[i].splice(j , 1);//删除该元素
				continue;
			}
		}
	}
	return 1;
}
exports.computeLossStatusBytime = computeLossStatusBytime;

/*
	得到设备损失数组
 */
async function selectAllDataByAllLossStatus(allLossStatus , Size , Type){
	if (allLossStatus == undefined || allLossStatus == null || allLossStatus == ''
		|| Size == undefined || Size == null || Size == ''
		|| Type == undefined || Type == null || Type == '') {
		return ;
	}
	let OEE = {
		key:'设备损失',
		value: new Array()
	};
	let Safety = {
		key:'人力损失',
		value: new Array()
	};
	let Defect = {
		key:'物料损失',
		value: new Array()
	};

	OEE.value.push(Size * 4);
	Safety.value.push(Size * 3);
	Defect.value.push(Size * 3);
	let OEE_began = 0;
	let OEE_run = 0;
	let OEE_delay = 0;
	let OEE_follow = 0;
	let OEE_close = 0;

	let Safety_began = 0;
	let Safety_run = 0;
	let Safety_delay = 0;
	let Safety_follow = 0;
	let Safety_close = 0;

	let Defect_began = 0;
	let Defect_run = 0;
	let Defect_delay = 0;
	let Defect_follow = 0;
	let Defect_close = 0;

	let Identify_problem = 0;//1.明确问题,代表码：a
	let Grasp_status = 0;//2.把握现状,代表码：b
	let Set_goals = 0;//3.设定目标,代表码：c
	let Analysis_cause = 0;//4.分析原因,代表码：d
	let Countermeasures_plan = 0;//5.	对策计划,代表码：e
	let Countermeasures_ = 0;//6.	对策落实,代表码：f
	let Effect_confirmation = 0;//7.	效果确认,代表码：g
	let Consolidation_results = 0;//8.	成果巩固,代表码：h
	for (var i = allLossStatus.length - 1; i >= 0; i--) {
		for (var j = allLossStatus[i].length - 1; j >= 0; j--) {
			const losstier3 = await Losstier3.findById(allLossStatus[i][j].losstier3Lossid);
			if (losstier3 == null || losstier3 == ''|| losstier3 == undefined) {
				continue ;
			}
			// console.log('==========>projectStartTime--->'+JSON.stringify(projectStartTime));
			// console.log('==========>projectEndTime--->'+JSON.stringify(projectEndTime));
			// const mStartTime = moment(classstarttime);
			// const mEndTime = moment(classendtime);
			const kpitwo = await Kpitwolev.findById(losstier3.kpitwolevKpitwoid);
			if (kpitwo == null || kpitwo == ''|| kpitwo == undefined) {
				continue ;
			}
			if (kpitwo.name == 'OEE') {
				const status = allLossStatus[i][j].status;
				const stage = allLossStatus[i][j].stage;
				if (status == 1) {
					OEE_began += 1;
				}else if(status == 2){
					OEE_run += 1;
					if (stage == 'a') {
						Identify_problem += 1;
					}else if(stage == 'b'){
						Grasp_status += 1;
					}else if(stage == 'c'){
						Set_goals += 1;
					}else if(stage == 'd'){
						Analysis_cause += 1;
					}else if(stage == 'e'){
						Countermeasures_plan += 1;
					}else if(stage == 'f'){
						Countermeasures_ += 1;
					}else if(stage == 'g'){
						Effect_confirmation += 1;
					}else if(stage == 'h'){
						Consolidation_results += 1;
					}
				}else if(status == 3){
					OEE_delay += 1;
				}else if(status == 4){
					OEE_follow += 1;
				}else if(status == 5){
					OEE_close += 1;
				}else{
					continue ;
				}

			}else if(kpitwo.name == 'Safety'){
				const status = allLossStatus[i][j].status;
				if (status == 1) {
					Safety_began += 1;
				}else if(status == 2){
					Safety_run += 1;
					if (stage == 'a') {
						Identify_problem += 1;
					}else if(stage == 'b'){
						Grasp_status += 1;
					}else if(stage == 'c'){
						Set_goals += 1;
					}else if(stage == 'd'){
						Analysis_cause += 1;
					}else if(stage == 'e'){
						Countermeasures_plan += 1;
					}else if(stage == 'f'){
						Countermeasures_ += 1;
					}else if(stage == 'g'){
						Effect_confirmation += 1;
					}else if(stage == 'h'){
						Consolidation_results += 1;
					}
				}else if(status == 3){
					Safety_delay += 1;
				}else if(status == 4){
					Safety_follow += 1;
				}else if(status == 5){
					Safety_close += 1;
				}else{
					continue ;
				}
			}else{
				const status = allLossStatus[i][j].status;
				if (status == 1) {
					Defect_began += 1;
				}else if(status == 2){
					Defect_run += 1;
					if (stage == 'a') {
						Identify_problem += 1;
					}else if(stage == 'b'){
						Grasp_status += 1;
					}else if(stage == 'c'){
						Set_goals += 1;
					}else if(stage == 'd'){
						Analysis_cause += 1;
					}else if(stage == 'e'){
						Countermeasures_plan += 1;
					}else if(stage == 'f'){
						Countermeasures_ += 1;
					}else if(stage == 'g'){
						Effect_confirmation += 1;
					}else if(stage == 'h'){
						Consolidation_results += 1;
					}
				}else if(status == 3){
					Defect_delay += 1;
				}else if(status == 4){
					Defect_follow += 1;
				}else if(status == 5){
					Defect_close += 1;
				}else{
					continue ;
				}
			}
		}
	}
	await OEE.value.push(OEE_began);
	await OEE.value.push(OEE_run);
	await OEE.value.push(OEE_delay);
	await OEE.value.push(OEE_follow);
	await OEE.value.push(OEE_close);

	await Safety.value.push(Safety_began);
	await Safety.value.push(Safety_run);
	await Safety.value.push(Safety_delay);
	await Safety.value.push(Safety_follow);
	await Safety.value.push(Safety_close);

	await Defect.value.push(Defect_began);
	await Defect.value.push(Defect_run);
	await Defect.value.push(Defect_delay);
	await Defect.value.push(Defect_follow);
	await Defect.value.push(Defect_close);

	let allStatusData = new Array();
	await allStatusData.push(OEE);
	await allStatusData.push(Safety);
	await allStatusData.push(Defect);

	let statusOtherData = {
		projectNumber:Size * 10,
		beganNumber:OEE_began + Safety_began + Defect_began,
		runNumber:OEE_run + Safety_run + Defect_run,
		delayNumber:OEE_delay + Safety_delay + Defect_delay,
		followNumber:OEE_follow + Safety_follow + Defect_follow,
		closeNumber:OEE_close + Safety_close + Defect_close
	};

	let IdentifyProblem = {
		key:'明确问题',
		value:Identify_problem
	};//1.明确问题,代表码：a
	let GraspStatus = {
		key:'把握现状',
		value:Grasp_status
	};//2.把握现状,代表码：b
	let SetGoals = {
		key:'设定目标',
		value:Set_goals
	};//3.设定目标,代表码：c
	let AnalysisCause = {
		key:'分析原因',
		value:Analysis_cause
	};//4.分析原因,代表码：d
	let CountermeasuresPlan = {
		key:'对策计划',
		value:Countermeasures_plan
	};//5.	对策计划,代表码：e
	let Countermeasures = {
		key:'对策落实',
		value:Countermeasures_
	};//6.	对策落实,代表码：f
	let EffectConfirmation = {
		key:'效果确认',
		value:Effect_confirmation
	};//7.	效果确认,代表码：g
	let ConsolidationResults = {
		key:'成果巩固',
		value:Consolidation_results
	};//8.	成果巩固,代表码：h

	let allStageData = new Array();
	await allStageData.push(ConsolidationResults);
	await allStageData.push(EffectConfirmation);
	await allStageData.push(Countermeasures);
	await allStageData.push(CountermeasuresPlan);
	await allStageData.push(AnalysisCause);
	await allStageData.push(SetGoals);
	await allStageData.push(GraspStatus);
	await allStageData.push(IdentifyProblem);

	let stageOtherData = {
		IdentifyProblem:Identify_problem,
		GraspStatus:Grasp_status,
		SetGoals:Set_goals,
		AnalysisCause:Analysis_cause,
		CountermeasuresPlan:Countermeasures_plan,
		Countermeasures:Countermeasures_,
		EffectConfirmation:Effect_confirmation,
		ConsolidationResults:Consolidation_results
	};

	let allData = {
		status:allStatusData,
		statusOther:statusOtherData,
		type:Type,
		stage:allStageData,
		stageOther:stageOtherData
	};
	return allData;
}
exports.selectAllDataByAllLossStatus = selectAllDataByAllLossStatus

