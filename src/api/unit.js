import req from '../utils/req.js';
const PREFIX_URL = "api/v1/Users";

/**
* Lấy toàn bộ dữ liệu đơn vị tính
* @param {}  
* @returns Đơn vị tính
* CreatedBy: NGDuong (14/11/2021)
*/
export const getUnits = () => req.get(`${PREFIX_URL}`)
    .then(res => Promise.resolve(res.data))
    .catch(err => Promise.reject(err));