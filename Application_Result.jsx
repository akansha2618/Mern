function Result(){
    const java=90;
    const python=95;
    const math=99;
    const total=(java+python+math);
    const per=(total/300)*100;
    return(
        <div>
            <h1>Result</h1>
            <hr/>
            <p>Marks: 300</p>
            <p>Total Marks: {total}</p>
            <p>Percentage: {per.toFixed(2)}% </p>
            <p>Grade: A+</p>
        </div>
    );
}
export default Result;
