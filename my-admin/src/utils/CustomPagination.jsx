import React from 'react';
import { Pagination } from 'react-admin';

/**
 * 自定義分頁，每頁可選擇顯示數量
 * @param {*} props 
 * @returns 
 */
const CustomPagination = props => (
    <Pagination rowsPerPageOptions={[5, 10, 25, 50, 100, 500, 1000]} {...props} />
);

export default CustomPagination;