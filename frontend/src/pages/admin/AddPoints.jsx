import { useState } from "react";
import api from "../../services/api";
import UserDropdown from "../../components/UserDropdown";

function AddPoints() {
    const [points, setPoints] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");

    const handleAddPoints = async () => {
        if (!selectedUser) return;

        await api.post(`/admin/users/${selectedUser.id}/add-points`, {
            points,
        });

        setMessage("Points added successfully");
        setPoints(0);
    };

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold my-3">Add Points</h2>
            <div className="">
                <h3 className=" text-2xl my-3">Selected User: <span className="text-primary font-bold sm:text-xl">
                    {selectedUser ? selectedUser.username : "No user selected"}</span></h3>
                <h3 className=" text-2xl my-3">Current Points: <span className="text-primary font-bold sm:text-xl">
                    {selectedUser ? selectedUser.points : 0} + <span className="text-[#000000] font-light">{points || 0} = <span className="text-primary font-bold">{selectedUser ? selectedUser.points + points : 0}</span></span></span></h3>
            </div>
            <UserDropdown onSelect={setSelectedUser} />

            <input
                type="number"
                value={points}
                onClick={(e) => setPoints("")}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="border mt-4"
            />

            <button
                onClick={handleAddPoints}
                className="bg-primary text-white px-4 py-2 mt-3"
            >
                Add Points
            </button>

            <p className="text-green-500">{message}</p>
        </div>
    );
}

export default AddPoints;