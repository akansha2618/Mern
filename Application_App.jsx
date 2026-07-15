import Student from"./components/Student";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Result from "./components/Result";
import Attendance from "./components/Attendance";
function App(){
  return(
  <div>
    <Header/>
    <Student/>
    ---------------------------------------------------------
    <Attendance/>
    ---------------------------------------------------------
    <Result/>
    <Footer/>
  </div>
  );
}
export default App;
