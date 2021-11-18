import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Avatar } from '@shopify/polaris';
import ReactPaginate from 'react-paginate';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import personFilledMarker from '../assets/person.png';
import personFilledMarker2 from '../assets/person2.png'
import { getPaging } from "../api/baseApi"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import data from "../utils/data";
//#region Fomat icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
// icon
const personMarker = L.icon({
    iconUrl: personFilledMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});
const personMarker2 = L.icon({
    iconUrl: personFilledMarker2,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});
//#endregion

const center = [51.505, -0.09]
const zoom = 18

//#region location
function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position} icon={personMarker2}>
            <Popup permanent>Bạn ở đây :))</Popup>
            <Tooltip direction="topleft" offset={[0, 20]} opacity={1} permanent>
                Bạn ở đây
            </Tooltip>
        </Marker>
    )
}
//#endregion


function UserList() {

    const [map, setMap] = useState(null); // bản đồ
    var users = data; //danh sách User

    //#region pagination
    const [itemsPerPage] = useState(5); // số lượng phần tử trên một trang
    const [currentItems, setCurrentItems] = useState(null); // tổng số lượng itema
    const [pageCount, setPageCount] = useState(0); // tổng số page
    const [itemOffset, setItemOffset] = useState(0); // vị trí item đầu tiên của page hiện tại

    /**
     * khi bắt đầu load page
     */
    useEffect(() => {
        toast.success("Login thành công!")
        const pageInt = 1;
        const pageSize = 250;
        getPaging(pageInt,pageSize).then((res) => {
            users = res.data;
            setPageCount(Math.ceil(users.length / itemsPerPage)); 
        })
    }, []);

    /**
     * cập nhật ?
     */
    useEffect(() => {  
        setPageCount(Math.ceil(users.length / itemsPerPage)); 
        setCurrentItems(users.slice(itemOffset, itemOffset + itemsPerPage));      
    }, [itemOffset, itemsPerPage]);

    /**
     * Hàm thay đổi page
     * @param {*} event sự kiện thay đổi page
     */
    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage % users.length;
        setItemOffset(newOffset);
    }
    /**
     * cập nhật vị trí user trên bản đồ 
     */
    const onClick = useCallback((user) => {
        const userCenter = [user.latitude, user.longitude];
        map.flyTo(userCenter, map.getZoom());
    }, [map])
    //#endregion

    const displayMap = useMemo(
        () => (
            <MapContainer
                className="height"
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                whenCreated={setMap}
            >
                <TileLayer
                    url='http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                />
                <>
                    {users &&
                        users.map((item) => (
                            <Marker position={[item.latitude, item.longitude]} key={item.userId} icon={personMarker}>
                                <Tooltip>
                                    <>
                                        <div>Họ và tên: {item.firstName + " " + item.lastName}</div>
                                        <div>Số điện thoại: {item.phoneNumber}</div>
                                        <div>Địa chỉ: {item.address}</div>
                                    </>
                                </Tooltip>
                            </Marker>
                        ))}
                </>
                <LocationMarker />
            </MapContainer>
        ),
        [users],
    )
    

    return (
        <div className="map">
            <ToastContainer />
            <div className="list-user">
                <span className="title">Danh sách User</span>
                <div className="list-User-detail">
                    {currentItems &&
                        currentItems.map((person) => (
                            <div className="list-item btn btn-gradient-border btn-glow" onClick={() => onClick(person)} key={person.userId}>
                                <Avatar customer name="Farrah" />
                                <span className="text-gradient">{person.firstName + " " + person.lastName}</span>
                                <span>( {person.address} )</span>

                            </div>
                        ))}
                </div>
                <div className="pagination-list">
                    <div className="pagination-item">
                        <ReactPaginate
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={1}
                            pageCount={pageCount}
                            previousLabel="<"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </div>
            </div>
            <div className="map-detail">
                {displayMap}
            </div >
        </div >
    )
}
export default UserList;
