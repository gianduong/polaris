import axios from 'axios';

import { BASE_URL } from './envConst.js';

/**
 * Khởi tạo config mặc định
 * CreatedBy: NGDuong 13/11/2021
// */
export default axios.create({
    baseURL: BASE_URL,
    timeout: 600000,
    headers: {
        'Content-Type': 'application/json'
    }
});