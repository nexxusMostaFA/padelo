import React from 'react';
import './Courts.css';

export const courts = [
    {
        __id: "6569c65cfc13ae761a4cd2de",
        address: "6-october",
        email: "5@dell.com",
        courtname: "5",
        photo: "/users_images/users (5).png",
        phone: "103-375-8934",
    },
    {
        __id: "6569cfc13ae761a4cd2de",
        address: "zayed",
        email: "4@dell.com",
        courtname: "4",
        photo: "/users_images/users (4).png",
        phone: "103-375-8934",
    },
    {
        __id: "65761a4cd2de",
        address: "shobra",
        email: "3@dell.com",
        courtname: "3",
        photo: "/users_images/users (3).png",
        phone: "103-375-8934",
    },
    {
        __id: "656d2de",
        address: "helwan",
        email: "2@dell.com",
        courtname: "2",
        photo: "/users_images/users (2).png",
        phone: "103-375-8934",
    },
    {
        __id: "6569c65cfcjdjdjda4cd2de",
        address: "6-october",
        email: "1@dell.com",
        courtname: "1",
        photo: "/users_images/users (9).png",
        phone: "103-375-8934",
    },
    {
        __id: "6569",
        address: "giza",
        email: "6@dell.com",
        courtname: "6",
        photo: "/users_images/users (6).png",
        phone: "103-375-8934",
    },
    {
        __id: "e761a4cd2de",
        address: "cairo",
        email: "7@dell.com",
        courtname: "7",
        photo: "/users_images/users (7).png",
        phone: "103-375-8934",
    },
];

const Courts = () => {
    return (
        <div className="courts-container">
            {courts.map((court) => (
                <div className="court-card" key={court.__id}>
                    <img
                        src={court.photo}
                        alt={court.courtname}
                        className="court-image"
                    />
                    <h3 className="court-name">Padel-beast {court.courtname}</h3>
                    <p className="court-address">{court.address}</p>
                </div>
            ))}
        </div>
    );
};

export default Courts;
