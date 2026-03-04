import { useState, useEffect, useRef } from "react";
import { fetchUsers } from "../services/fetchUser";

function UserDropdown({ onSelect }) {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchUsers();
            setUsers(data);
        };
        loadUsers();
    }, []);

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

    return (
        <div ref={dropdownRef} className="relative">
            <input
                value={search}
                onClick={() => { setOpen(true), setSearch("") }}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setOpen(true);
                }}
                placeholder="Search user"
                className="border border-slate-200 dark:border-slate-500 w-full rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-700 dark:text-white"
            />

            {open && filtered.length > 0 && (
                <ul className="absolute bg-white border mt-1 w-full z-50 dark:bg-slate-800 rounded-lg shadow-lg py-2 max-h-60 overflow-y-auto border-slate-200 dark:border-slate-700">
                    {filtered.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => {
                                onSelect(user);
                                setSearch(user.username);
                                setOpen(false);
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-slate-700"
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserDropdown;