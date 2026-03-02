import CreateCourse from "./CreateCourse";
import AllCourse from "./AllCourse";
import AddPoints from "./AddPoints";
import Approve from "./Approve";

function Admin() {
    return (
        <>
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold text-primary">Admin</h1>
                <hr className="border-gray-300 dark:border-gray-700 my-4" />
                <CreateCourse />
                <hr className="border-gray-300 dark:border-gray-700 my-4" />
                <AllCourse />
                <hr className="border-gray-300 dark:border-gray-700 my-4" />
                <AddPoints />
                <hr className="border-gray-300 dark:border-gray-700 my-4" />
                <Approve />
            </div>
        </>
    );
}

export default Admin;