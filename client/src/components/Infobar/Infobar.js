import React from "react";
import './Infobar.css';
import {faThumbsUp, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const InfoBar = ({ room }) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            <FontAwesomeIcon icon={faThumbsUp} />
            <h3>Room: {room} </h3>
        </div>
        <div className="rightInnerContainer">
            <FontAwesomeIcon icon={faTimesCircle} />
        </div>
    </div>
);

export default InfoBar;
