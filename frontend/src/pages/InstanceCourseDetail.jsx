import { useNavigate } from "react-router-dom";

function InstanceCourseDetail() {
    const navigate = useNavigate();
    return (
        <>
            <h1>Instance Course Detail</h1>
            <button className="bg-[#4d4d4d] text-white px-4 py-2 rounded-xl hover:bg-[#a1a1a1] m-6" onClick={(e) => { e.stopPropagation(); navigate(-2) }}>Back</button>
        </>
    );
}
export default InstanceCourseDetail;