/**
 * form Thông báo 
 * CreatedBy: NGDuong (14/11/2021)
 */
var notify = {
Notify_Success(){ return "Lấy dữ liệu thành công!"},
Notify_Error(){ return "Lấy dữ liệu thất bại!"},
Notify_Delete(id){return "Xóa dữ liệu " + id + " thành công!"},
Notify_Save(){return "Lưu dữ liệu thành công!"},
Notify_Email_Error(){return "Email không hợp lệ!"},
Notify_Password_Error(){return 'Password không hợp lệ'},
Notify_Recapcha_Error(){return "Vui lòng xác minh danh tính!"},
Notify_Data_Empty(){return "Không bỏ trống các ô có chứa hoa thị!"},
Notify_Eror_500(){return "Hệ thống đang có vấn đề! Vui lòng liên hệ Dương để được trợ giúp!"},
Notify_validate(){return "Vui lòng nhập đúng định dạng dữ liệu!"}
}
export default notify