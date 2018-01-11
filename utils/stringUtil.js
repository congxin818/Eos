/**
 * 作者：Android
 * 创建时间：2017/10/26
 * 说明：字符串工具类
 *
 */

async function getIds(string, falg) {
	let groupIds = new Array();
	//console.log('stringJson->'+string);
	if (string == undefined || string == '' || string == null) {
		return groupIds;
	}
	let groupIdsJson = JSON.parse(string);
	if (groupIdsJson == undefined || groupIdsJson == '' || string == null) {
		return groupIds;
	}
	let allIds = await exports.jsonToArray(groupIdsJson);
	//console.log('allIds->'+allIds.length);
	if (allIds == undefined || allIds == '' || allIds == null) {
		return groupIds;
	}
	if (falg == undefined || falg == null || falg == '') {
		for (var i = allIds.length - 1; i >= 0; i--) {
			const value = allIds[i];
			if (!isNaN(value)) {
				groupIds.push(value);
			}
		}
	} else {
		for (var i = allIds.length - 1; i >= 0; i--) {
			const value = allIds[i];
			if (isNaN(value)) {
				let ch = await value.slice(0, 1);
				if (ch != '' && ch == falg) {
					let chend = value.slice(1);
					groupIds.push(chend);
				}
			}
		}
	}
	//console.log(groupIds.length);
	return groupIds;
}
exports.getIds = getIds;

/*json字符串转数组*/
async function jsonToArray(data) {
	if (data == undefined || data == '') {
		return null;
	}
	const len = eval(data).length;
	let arr = [];
	for (var i = 0; i < len; i++) {
		//console.log(data[i].id);
		arr.push(data[i].id);
	}
	//console.log(arr.length);
	return arr;
}
exports.jsonToArray = jsonToArray;


