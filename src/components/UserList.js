import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Avatar } from '@shopify/polaris';
// import GoogleMapReact from 'google-map-react';
import ReactPaginate from 'react-paginate';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import personFilledMarker from '../assets/person.jpg';
import { getAll, getPaging } from "../api/baseApi"
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
// Create marker icon according to the official leaflet documentation
const personMarker = L.icon({
    iconUrl: personFilledMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});
//#endregion

const center = [51.505, -0.09]
const zoom = 13

//#region show center
function DisplayPosition({ map }) {
    const [position, setPosition] = useState(map.getCenter())

    const onClick = useCallback(() => {
        map.setView(center, zoom)
    }, [map])

    const onMove = useCallback(() => {
        setPosition(map.getCenter())
    }, [map])

    useEffect(() => {
        map.on('move', onMove)
        return () => {
            map.off('move', onMove)
        }
    }, [map, onMove])

    return (
        <p>
            latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
            <button onClick={onClick}>reset</button>
        </p>
    )
}
//#endregion

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
        <Marker position={position}>
            <Popup permanent>Bạn ở đây :))</Popup>
            <Tooltip direction="topleft" offset={[0, 20]} opacity={1} permanent>
                Bạn ở đây
            </Tooltip>
        </Marker>
    )
}


function UserList() {

    const [map, setMap] = useState(null)
    var users = data;

    //#region pagination
    const [itemsPerPage] = useState(5);
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
    useEffect(() => {
        toast.success("Login thành công!")
        const pageInt = 1;
        const pageSize = 10;
        getPaging(pageInt, pageSize).then((res) => {
            users = res.data;
        })
    }, []);
    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(users.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(users.length / itemsPerPage));
        // })
    }, [itemOffset, itemsPerPage, users]);

    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage % users.length;
        setItemOffset(newOffset);
    }
    //#endregion
    const displayMap = useMemo(
        () => (
            <MapContainer
                className="height"
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                whenCreated={setMap}
                on
            >

                <TileLayer
                    url='http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                />
                <>
                    {users &&
                        users.map((item) => (
                            <Marker position={[item.latitude, item.longitude]} key={item.userId}>
                                <Popup>
                                    <>
                                        <div>Họ và tên: {item.firstName + " " + item.lastName}</div>
                                        <div>Số điện thoại: {item.phoneNumber}</div>
                                        <div>Địa chỉ: {item.address}</div>
                                    </>
                                </Popup>
                            </Marker>
                        ))}
                </>
                <LocationMarker />
            </MapContainer>
        ),
        [users],
    )
    const onClick = useCallback((user) => {
        const userCenter = [user.latitude, user.longitude];
        console.log(user);
        map.flyTo(userCenter, map.getZoom());
    }, [map])
    return (
        <div className="map">
            <ToastContainer />
            <div className="list-user">
                <span className="title">Danh sách User</span>
                <div className="list-User-detail">
                    {currentItems &&
                        currentItems.map((person) => (
                            <div className="list-item" onClick={() => onClick(person)} key={person.userId}>
                                <Avatar customer name="Farrah" />
                                <span>{person.lastName}</span>
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
