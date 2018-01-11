const dataSuccess = {
    status: '0',
    msg: '请求成功',
    data: 'fas'
};

const parameterError = {
    status: '1',
    msg: '请求缺少必要参数或参数错误'
};

const loginError = {
    status: '2',
    msg: '用户名或密码验证失败'
};

const existError = {
    status: '101',
    msg: '已存在'
};
const noExistError = {
    status: '4',
    msg: '不存在'
};
const serviceError = {
    status: '-2',
    msg: '服务器错误'
};
const serviceBusyError = {
    status: '-1',
    msg: '服务器忙'
};
exports.dataSuccess = dataSuccess;
exports.parameterError = parameterError;
exports.existError = existError;
exports.noExistError = noExistError;
exports.serviceError = serviceError;
exports.serviceBusyError = serviceBusyError;