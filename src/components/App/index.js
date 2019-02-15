import React, { Component } from "react";
import Daily from "../Daily";
import "./App.scss";
import Header from "../Header/index";
import Footer from "../Footer";
import WeekDetail from "../WeekDetail";
import arrayQuotes from "../arrayQuotes";
import DailyDetail from "../DailyDetail";
import { backgrounds } from "../../backgrounds/backgrounds";
import Error from "../Error";
import ApiServices from "../../services/apiServices";

const saveFavorites = JSON.parse(localStorage.getItem("favorites"));
const uniqueFavorites = saveFavorites
    ? saveFavorites.filter((value, index, array) => {
          return (
              array.findIndex(
                  valueArray =>
                      JSON.stringify(valueArray) === JSON.stringify(value)
              ) === index
          );
      })
    : false;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: uniqueFavorites ? uniqueFavorites.slice(0, 5) : [],
            coordinates: {},
            endpointCurrent: {},
            endpointForecast: [],
            weekForecast: [],
            loadedCurrent: true,
            loadedForecast: true,
            error: false,
            quoteTxt: "",
            date: "",
            theme: "",
            activeDay: "",
            selectedLocation: {},
            currentLocation: true,
            forecastInf: "",
            todayInfo: "",
            animation: "",
            animationDetail: "",
            selectedDay: "",
            CurrentHour: "",
            loading:"true",
        };

        this.printDayNameNumber = this.printDayNameNumber.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.onDayClick = this.onDayClick.bind(this);
        this.paintDayDetail = this.paintDayDetail.bind(this);
        this.defaultDetailInfo = this.defaultDetailInfo.bind(this);
        this.addFavorite = this.addFavorite.bind(this);
        this.showPosition = this.showPosition.bind(this);
        this.showError = this.showError.bind(this);
        this.getLocationCoordinates = this.getLocationCoordinates.bind(this);
    }

    componentDidMount() {
        this.getLocationCoordinates();
        this.randomQuote();
        this.printDayNameNumber();
    }

    getLocationCoordinates() {
        //get coordinates and then call weather endpoints
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this.showPosition,
                this.showError
            );
        }
    }

    showPosition(position) {
        this.setState(
            { coordinates: position.coords },

            () => {
                const { coordinates } = this.state;
                this.currentDayData(
                    coordinates.latitude,
                    coordinates.longitude,
                    true
                );
                this.forecastData(coordinates.latitude, coordinates.longitude);
            }
        );
    }

    showError(error) {
        if (error.PERMISSION_DENIED) {
            this.currentDayData(40.66191, -4.0189, true);
            this.forecastData(40.66191, -4.0189);
        }
    }

    addFavorite() {
        console.log("selected", this.state.selectedLocation);
        const favorite = this.state.selectedLocation.event;
        const favorites = this.state.favorites;

        if (favorite) {
            this.setState(
                {
                    favorites: [favorite, ...favorites]
                },
                () => {
                    localStorage.setItem(
                        "favorites",
                        JSON.stringify(this.state.favorites)
                    );
                }
            );
        }
    }

    currentDayData(lat, lon, currentLoc, event) {
        const current = item => ({
            city: item.name,
            country: item.sys.country
        });
        const locationFiltered = e => ({
            event: e,
            city: e.value.name,
            country: `${e.codeCountry}`
        });

        //get data current Day
        ApiServices.currentDayServiceCoordinates(lat, lon)
            .then(data => {
                this.setState({
                    selectedLocation: currentLoc
                        ? current(data)
                        : locationFiltered(event),
                    endpointCurrent: data,
                    loaded: true,
                    theme: backgrounds.changeBackground(
                        data.dt,
                        data.sys.sunrise,
                        data.sys.sunset,
                        data.weather[0].description
                    ),
                    animation: backgrounds.changeAnimation(
                        data.dt,
                        data.sys.sunrise,
                        data.sys.sunset,
                        data.weather[0].description
                    ),
                    animationDetail: backgrounds.changeAnimationDetail(
                        data.dt,
                        data.sys.sunrise,
                        data.sys.sunset,
                        data.weather[0].description
                    )
                });
            })
            .catch(error => this.setState({ error: error }));
    }

    forecastData(lat, lon) {
        //get data current Day
        ApiServices.forecastServiceCoordinates(lat, lon)
            .then(data => {
                this.setState({
                    forecastInf: data
                });
                const myList = data.list.map(item => {
                    item.formattedDate = item.dt_txt.slice(0, 10);
                    return item;
                });
                this.defaultDetailInfo();

                const grouped = this.groupDateBy(myList, "formattedDate");

                const weekList = [];

                grouped.forEach(single => {
                    let minTmp = single[0].main.temp_min;
                    let maxTmp = single[0].main.temp_max;
                    single.forEach(item => {
                        const min = item.main.temp_min;
                        const max = item.main.temp_max;
                        if (min < minTmp) {
                            minTmp = min;
                        }
                        if (max > maxTmp) {
                            maxTmp = max;
                        }
                    });

                    single[0].minTmp = Math.round(minTmp);
                    single[0].maxTmp = Math.round(maxTmp);
                    weekList.push(single[0]);
                });

                this.setState({
                    endpointForecast: myList,
                    weekForecast: weekList,
                    loaded: true,
                    activeDay: weekList[0]
                });
            })
            .catch(error => this.setState({ error: error }));
    }

    onChangeCity(e) {
        if (e) {
            this.currentDayData(e.value.lat, e.value.lon, false, e);
            this.forecastData(e.value.lat, e.value.lon);
        } else {
            return console.log("error");
        }
    }

    getCurrentLocation() {
        this.getLocationCoordinates();
    }

    groupDateBy(list, keyGetter) {
        const listFromDate = new Map();
        list.forEach(item => {
            const key = item[keyGetter];
            const collection = listFromDate.get(key);
            if (!collection) {
                listFromDate.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return listFromDate;
    }

    randomQuote() {
        const random =
            arrayQuotes[Math.floor(Math.random() * arrayQuotes.length)];
        this.setState({
            quoteTxt: random
        });
    }

    printDayNameNumber() {
        const currentDate = new Date();
        const weekNumber = currentDate.getDate();
        const weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";
        const weekName = weekday[currentDate.getDay()];
        this.setState({
            date: weekName + " " + weekNumber
        });
    }

    onDayClick(day) {
        this.setState(
            {
                activeDay: day
            },
            () => this.paintDayDetail()
        );
    }

    defaultDetailInfo() {
        const currentInfo = this.state.forecastInf.list;
        const defaultInfo = currentInfo.slice(0, 8);
        this.setState({
            todayInfo: defaultInfo
        });
    }

    paintDayDetail() {
        const daySelected = this.state.activeDay.dt_txt;
        const indexSelected = this.state.forecastInf.list.map(item => {
            const indexdate = item.dt_txt;
            return indexdate;
        });
        const index = indexSelected.indexOf(daySelected);
        const secondIndex = index + 8;
        const dailyDetailInfo = this.state.forecastInf.list;

        const todayInfo = dailyDetailInfo.slice(index, secondIndex);
        this.setState({
            todayInfo: todayInfo
        });
    }

    render() {
        console.log(this.state.selectedLocation);

        const {
            favorites,
            error,
            endpointCurrent,
            quoteTxt,
            date,
            currentLocation,
            selectedLocation,
            weekForecast,
            activeDay,
            animation,
            animationDetail,
            theme
        } = this.state;

        const { textInput, focusTextInput } = this.props;

        const BgImage = {
            backgroundImage: `url(${theme})`
        };

        return (
            <div className={`App ${animation}`}>
                <div className="bg-image container-app">
                    <div className="container-screen" style={BgImage}>
                        <Header
                            getCurrentLocation={this.getCurrentLocation}
                            currentLocation={currentLocation}
                            selectedLocation={selectedLocation}
                            date={date}
                            textInput={textInput}
                            focusInput={focusTextInput}
                            onChangeCity={this.onChangeCity}
                            addFavorite={this.addFavorite}
                            favorites={favorites}
                        />
                        <Daily dataWeather={endpointCurrent} quote={quoteTxt} />
                    </div>
                    <WeekDetail
                        forecastData={weekForecast}
                        onDayClick={this.onDayClick}
                        activeDay={activeDay}
                        animation={animationDetail}
                    />
                    <DailyDetail
                        todayInfo={this.state.todayInfo}
                        activeDay={this.state.activeDay}
                        animation={animationDetail}
                    />

                    <Footer />
                </div>
            </div>
        );
    }
}

export default App;
