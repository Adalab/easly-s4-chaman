import React, { Component } from "react";
import Daily from "../Daily";
import "./App.scss";
import Header from "../Header/index";
import Footer from '../Footer';
import WeekDetail from '../WeekDetail';
import sun from "../../images/sundark.png";
import arrayQuotes from '../arrayQuotes';
import { Switch, Route } from 'react-router-dom';
import DailyDetail from "../DailyDetail";

const url =
    "http://api.openweathermap.org/data/2.5/weather?APPID=e0911626bb8e9d069605aa705cac6693&id=6359304&units=metric&lang=es";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Endpoint: {},
            loaded: true,
            error: '',
            isVisible: true,
            quoteTxt: '',
        };
        this.showInput = this.showInput.bind(this);
    }

    fetchApi() {
        fetch(url)
            .then(res => res.json())
            .then(data =>
                this.setState({
                    Endpoint: data,
                    loaded: true
                })
            )
            .catch(error => this.setState({ error: error }));
    }


    componentDidMount() {
        this.fetchApi();
        this.randomQuote();
    }

    randomQuote(){
       const random= arrayQuotes[Math.floor(Math.random() * arrayQuotes.length)];
       this.setState ({
           quoteTxt: random
       })
    }

    showInput() {
        this.setState({
            visibility: "visible"
        });
    }

    render() {
        const { Endpoint, quoteTxt } = this.state;
        const BgImage = {
            backgroundImage: `url(${sun})`
        };
        console.log(this.state.quoteTxt);

        if (this.state.loaded) {
            return (
                <div className="App">
                    <div style={BgImage} className="bg-image container-app">
                    <div className='container-screen'>
                        <Header
                        onClickAction={this.showInput}
                        visibility={this.state.visibility} />
                        <Daily dataWeather={Endpoint} quote={quoteTxt}/>
                        </div>
                        <Switch >
                            <Route exact path='/' render={() => <WeekDetail />} />
                            <Route path='/detail' render={() => <DailyDetail />} />
                        </Switch>
                        <Footer />

                    </div>

                </div>
            );
        } else {
            return false;
        }
    }
}

export default App;
