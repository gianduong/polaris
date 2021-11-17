import req from '../utils/req.js';
const PREFIX_URL = "api/v1/Users";

/**
 * Lấy toàn bộ dữ liệu 
 * @returns danh sách dữ liệu
 * CreatedBy: NGDuong 15/11/2021
 */
 export const getAll = () =>
 req.get(`${PREFIX_URL}`)
     .then(res => Promise.resolve(res))
     .catch(err => Promise.reject(err));
        
/**
 * Lấy dữ liệu theo tìm kiếm, phân trang, sắp xếp
 * @param {object} filterData chuỗi json filter
 * @returns danh sách
 * CreatedBy: NGDuong 15/11/2021
 */
 export const getPaging = (pageInt,pageSize) =>
 req({
     url: `${PREFIX_URL}/Filter?pageInt=${pageInt}&pageSize=${pageSize}`,
     method: 'GET'
 })
     .then(res => Promise.resolve(res.data))
     .catch(err => Promise.reject(err));

/**
* Lấy thông tin theo ID
* @param {uuid} id  
* @returns true/false
* CreatedBy: NGDuong (15/11/2021)
*/
export const getItemByID = (id) =>
    req.get(`${PREFIX_URL}/${id}`)
        .then(res => Promise.resolve(res.data))
        .catch(err => Promise.reject(err));

/**
* Lưu thông tin layer
* @param {object, boolean}  
* @returns 
* CreatedBy: NGDuong (15/11/2021)
*/
export const saveItem = (data, isInsert = true) =>
    req({
        url: isInsert ? `${PREFIX_URL}` : `${PREFIX_URL}/${data.id}`,
        data: data,
        method: isInsert ? 'POST' : 'PUT'
    })
        .then(res => Promise.resolve(res.data))
        .catch(err => Promise.reject(err));
