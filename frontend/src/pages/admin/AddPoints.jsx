import { useState, useRef, useEffect, useContext } from "react";
import api from "../../services/api";

function AddPoints() {
    const [points, setPoints] = useState(0);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const options = users.map((user) => user.username);

    const dropdownRef = useRef(null);

    const filtered =
        search.trim() === ""
            ? users
            : users.filter((user) =>
                user.username.toLowerCase().includes(search.toLowerCase())
            );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");

            setUsers(res.data);
        } catch (err) {
            console.log(err.response?.status);
            console.log(err.response?.data);
            console.error(err);
        }
    };

    const handleAddPoints = async () => {
        try {
            const res = await api.post(`/admin/users/${selectedUser.id}/add-points`, {
                points,
            });
            setMessage("Points added successfully");
            setPoints(0);
            setSelectedUser(null);
            setSearch("");
            setTimeout(() => {
                setMessage("");
            }, 2000);
            fetchUsers();
        }
        catch (err) {
            console.error(err)
        }
    };

    return (
        <>
            <div className="container mx-auto px-4">
                <h2 className="text-xl font-bold text-primary my-3">Add Points</h2>
                <div className="">
                    <h3 className=" text-2xl my-3">Selected User: <span className="text-primary font-bold sm:text-xl">
                        {selectedUser ? selectedUser.username : "No user selected"}</span></h3>
                    <h3 className=" text-2xl my-3">Current Points: <span className="text-primary font-bold sm:text-xl">
                        {selectedUser ? selectedUser.points : 0} + <span className="text-[#000000] font-light">{points || 0} = <span className="text-primary font-bold">{selectedUser ? selectedUser.points + points : 0}</span></span></span></h3>
                </div>
                <div className="" ref={dropdownRef}>
                    <input
                        onClick={() => [setOpen(true), setSearch("")]}
                        value={search || ""}
                        onChange={(e) => {
                            setOpen(true);
                            setSearch(e.target.value);
                        }}
                        placeholder="Search user"
                        className="border border-slate-200 dark:border-slate-700"
                    />
                    {open && filtered.length > 0 && (
                        <ul className="absolute bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 w-full">
                            {filtered.map((user) => {
                                return (
                                    <li
                                        key={user.id}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setSearch(user.username);
                                            setPoints(0);
                                            setOpen(false);
                                        }}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                        {user.username}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                <input className="border border-slate-200 dark:border-slate-700" type="number"
                    value={points}
                    placeholder="Enter points"
                    onClick={() => setPoints("")}
                    onChange={(e) => setPoints(Number(e.target.value))} />
                <button onClick={handleAddPoints} className="bg-primary text-white px-4 py-2 rounded-md mt-5 mx-2 cursor-pointer">Add Points</button>
                <p className="text-green-500">{message}</p>
            </div>
        </>
    );
}

export default AddPoints;