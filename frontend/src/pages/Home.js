import Button from '../components/Button';
import Calendar from '../components/Calendar';
import Header from '../components/Header'; 
import Sidebar from '../components/Sidebar'; 
import DeleteCourseModal from '../components/DeleteCourseModal'; 
import { BiPlus } from 'react-icons/bi';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import CourseInfoModal from '../components/CourseInfoModal';

function Home({ courses, setCourses, scheduleID}) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false); 
    const [itemToDelete, setItemToDelete] = useState(undefined); 

    const [openCourseInfoModal, setOpenCourseInfoModal] = useState(false); 
    const [courseInfo, setCourseInfo] = useState(undefined); 

    const infoModalHandler = () => {
        setCourseInfo(undefined); 
        setOpenCourseInfoModal(prevState => !prevState);
    }

    function formatTimeString(dateTimeString) {
        const options = { hour: 'numeric', minute: 'numeric' };
        const formattedTime = new Date(dateTimeString).toLocaleTimeString([], options);
        return formattedTime.split(" ")[0];
    } 

    function formatTimeStringShowMeridiem(dateTimeString) {
        const options = { hour: 'numeric', minute: 'numeric' };
        const formattedTime = new Date(dateTimeString).toLocaleTimeString([], options);
        return formattedTime;
    } 

    //Fetches the course info to show in modal
    const getCourseInfo = (course_id) => {
        //get the course info based on course_id
        fetch(`http://127.0.0.1:8081/class/info/get/${course_id}`)
        .then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const course = {
                'title': data.title, 
                'units': data.units, 
                'name': data.name, 
                'co-requisites': data['co-requisites'], 
                'description': data.description, 
                'professor': data.professor, 
                'start': formatTimeStringShowMeridiem(`2023-11-02T${data.start}:00`), 
                'end': formatTimeStringShowMeridiem(`2023-11-02T${data.end}:00`), 
                'location': data.location, 
                'days': data.days,
                'class_id': data.class_id
            }
            setCourseInfo(course);
            setOpenCourseInfoModal(prevState => !prevState);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

    const onConfirmDelete = (course_id) => {
        //send request to database to remove class (schedule_id & class_id)
        fetch(`http://127.0.0.1:8081/schedule/delete/${scheduleID}/${course_id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to delete class");
            }
        })
        .then((data) => {
            const newEvents = courses.events.filter((event) => event.id !== course_id);
            setCourses({events: newEvents});
            setItemToDelete(undefined);
            setOpenDeleteModal(prevState => !prevState); 
        })
        .catch((err)=> {
            setItemToDelete(undefined);
            setOpenDeleteModal(prevState => !prevState); 
        })
    }   

    const config = {
        viewType: "Resources",
        startDate: "2023-11-02", 
        columns: [
            {name: "mon", id: "M"},  
            {name: "tue", id: "T"},  
            {name: "wed", id: "W"},  
            {name: "thu", id: "TH"},  
            {name: "fri", id: "F"},  
            {name: "sat", id: "SA"},  
            {name: "sun", id: "SU"},  
        ],  
        timeRangeSelectedHandling: "Disabled",
        eventMoveHandling: "Disabled",
        eventResizeHandling: "Disabled",
        eventClickHandling: "Disabled",
        eventHoverHandling: "Disabled",
        cellHeight: 45, //dont change this value
        durationBarVisible: false, 
        useEventBoxes: "ShortEventsOnly",
        eventDeleteHandling: "Callback",
        onEventDeleted: (args) => {
            setItemToDelete(args.e.data); 
            setOpenDeleteModal(!openDeleteModal);
        },
    };

    //Runs on page load: gets users classes in their schedule
    useEffect(() => {
        //get users courses
        fetch(`http://127.0.0.1:8081/schedule/classes/get/${scheduleID}`)
        .then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((classes) => {
            const classesArr = [];
            if(classes.length <= 0) {
                return;
            }
            for(let singleClass of classes){
                const startTime = formatTimeString(`2023-11-02T${singleClass.start}:00`);
                const endTime = formatTimeString(`2023-11-02T${singleClass.end}:00`);
                const classObj = {
                    'resource': singleClass.days,
                    'start': `2023-11-02T${singleClass.start}:00`,
                    'end': `2023-11-02T${singleClass.end}:00`,
                    'text': `${singleClass.title}\n${startTime}-${endTime}`,
                    'title': singleClass.title,
                    'id': singleClass.class_id,
                }
                classesArr.push(classObj);
            }
            setCourses({
                events: classesArr
            })
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }, []);

    //Used to take the classes we have stored in state and convert them into a format the Calendar Component can use 
    const convertCoursesToCalendarFormat = (coursesList) => {
        const classesFormatted = {
            events: []
        }
        if(coursesList.length <= 0) return classesFormatted; 
        for(let i = 0; i < coursesList.length; i++){
            const daysOffered = coursesList[i].resource.split('/');
            for(let day of daysOffered){
                let newClass = { ...coursesList[i] };
                newClass.resource = day;
                classesFormatted.events.push(newClass);
            }
        }
        return classesFormatted;
    }

    return (
      <div className="vh-100 d-flex flex-column position-relative" style={{}}>
        {openDeleteModal && <DeleteCourseModal setOpenDeleteModal={setOpenDeleteModal} onConfirmDelete={onConfirmDelete} itemToDelete={itemToDelete}/>}
        {openCourseInfoModal && <CourseInfoModal courseInfo={courseInfo} btnInfo={[
            {
                clickHandler: infoModalHandler,
                btnText: 'Close', 
                id: 1
            }
        ]} btnText={"Close"}/>}
        <Header /> 
        <div className="m-3 p-0 d-flex row gap-2" style={{flex: 1}}> 
            <Sidebar courses={courses.events} getCourseInfo={getCourseInfo}/> 
            <div className="p-0 m-0 main col d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0 p-0 w-auto fw-bold text-dark">Schedule</h5>
                    <Link to="/search" className="text-reset m-0 p-0 w-auto d-flex gap-2" style={{
                        textDecoration: 'none'
                    }}>
                        <Button text="Add Course" icon={<BiPlus />} color={"#1ED760"} />
                    </Link>
                </div>
                <div className="calendar m-0 p-0" style={{flex: 1}}>
                    <Calendar config={config} courses={convertCoursesToCalendarFormat(structuredClone(courses.events))}/>
                </div>
            </div>
        </div>
      </div>
    );
  }
  
export default Home;