function Attendance(){
    const totalClasses=60;
    const attendedClasses=59;
    const attendance= (attendedClasses/totalClasses)*100;
    return(
        <div>
            <h1>Attendance</h1>
            <hr/>
            <p>Total Classes: {totalClasses}</p> 
            <p>Attended Classes: {attendedClasses}</p>
            <p>Attendance: {attendance.toFixed(2)}% </p>
        </div>
    )
}
export default Attendance;
