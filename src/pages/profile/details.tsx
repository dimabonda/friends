import { FC } from "react";
import { useParams } from 'react-router-dom';


const ProfileDetails:FC = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Profile Details for ID: {id}</h1>
        </div>
    );
}

export default ProfileDetails;