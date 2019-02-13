import React from 'react';
import HourData from '../HourData';
import HeadBoard from '../HeadBoard';
import Moment from 'moment';
import './DailyDetail.scss';




class DailyDetail extends React.Component {

    paintDate(){
     //  let objDate = new Date(this.props.activeDay.dt_txt);
 // let d = Moment(objDate);
        // return d.format('ddd MMM DD YYYY');




        // let completeDate = this.props.activeDay.dt_txt;
        // let y = completeDate.splice(1, 4);
        // let m = completeDate.splice(5, 6);
        // let d = completeDate.splice(7, 8);
        // let date = `${m}/${d}/${y}`;
// console.log(date);
// console.log(this.props.activeDay.dt_txt);


      return Moment(this.props.activeDay.dt_txt).format('MMMM DD, YYYY');



    }

    render() {
        const {todayInfo, animation} = this.props;

        if(todayInfo.length === 0) {
            return(
                <p>Buscando resultados</p>
            )
        } else {
        return (
            <div className={`infoDaily-Detail ${animation}`}>
                <h3 className='title-detail'>Detailed information:<span className='table_title-day'> {this.paintDate()}</span></h3>
                <table className="dailyDetail__table">
                    <HeadBoard />
                    <tbody>
                         {todayInfo.map((result, key) => {

                            return(
                               <HourData key={key} hour={result.dt_txt} wind={result.wind.speed}
                               temp={result.main.temp} rain={result.weather[0].description}/>
                            )


                        })}

                    </tbody>
                </table>
            </div>



        )
    }}
}

export default DailyDetail;




