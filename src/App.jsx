import React,{useState,useEffect, Component} from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import LocalInfo from './components/Localinfo.jsx';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

//axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

const  App =() => {

  let test;
  //#region GoogleMaps部分
  // const [defaultCenter,setDefaultCenter] = useState({lat:33,lng:33})
  const [defaultCenter,setDefaultCenter] = useState(null)
  const [center,setCenter] = useState(null)
  const [readcount,setReadCount] = useState(0)
  // const [lng,setLng] = useState({lat:lat,lng:lng})
  
  const [zoom,setZoom] =useState(14)


  const AnyReactComponent = ({ text }) => <div>{text}</div>;

  const onClickHandler=(event)=>{
    setCenter({lat:133,lng:33});
  };

  const onClickZoomHandler=(event)=>{
    setZoom(20);
  };

  const _onClick = ({x, y, lat, lng, event}) =>{
    console.log(x, y, lat, lng, event)
  }

  const _onDragEnd = (map) =>{
    console.log(map)
  }

  const handleApiLoaded = (map, maps) => {
    // use map and maps objects
    console.log(map)
  };
  //#endregion

  //#region 現在地取得部分
    const [location,setLocation] = useState({lat:0,lng:0});
    const [localinfolist,setLocalinfolist] = useState();
    // レスポンスで戻ってきた座標を表示する処理
    const mapsInit = (position) => {
      setLocation({lat:position.coords.latitude,lng:position.coords.longitude});
      setDefaultCenter({lat:position.coords.latitude,lng:position.coords.longitude});
      setCenter({lat:position.coords.latitude,lng:position.coords.longitude});
    }
    // 位置情報をリクエストする処理
    const GetMap = () => {
      navigator.geolocation.getCurrentPosition(mapsInit);
    }

    useEffect(() => {
      //const result = getLocalInfoList();
      if (readcount == 0){
        GetMap();
      }else{
        setReadCount(1);
      }
    },[])
    
  //#endregion

  //#region YahooAPIから取得する部分
  // ここでYahooAPIを使ってlocal情報を集めてくる
  const getLocalInfoList = async () =>{
    
    axios.get(`https://us-central1-functions-284d0.cloudfunctions.net/api/getlocalinfogeo/keyword/${encodeURIComponent(keyword)}/lat/${defaultCenter.lat}/lon/${defaultCenter.lng}/dist/${searchDistance}`)
    .then(function (response) {
        // handle success
        // stateに情報を追加する。
        setLocalinfolist(response.data.Feature);
    })
    .catch(function (error) {
        // handle error
      console.log(error);
    })
    .finally(function () {
        // always executed
    });

    // axios.get(`https://us-central1-functions-284d0.cloudfunctions.net/api/getlocalinfo/keyword/${encodeURIComponent(keyword)}`)
    // .then(function (response) {
    //     // handle success
    //     // stateに情報を追加する。
    //     setLocalinfolist(response.data.Feature);
    // })
    // .catch(function (error) {
    //     // handle error
    //   console.log(error);
    // })
    // .finally(function () {
    //     // always executed
    // });


  };

  const [keyword,setKeyword] = useState("");

  const SearchButtonOnClick = (event) =>{
    getLocalInfoList()
  }

  const keywordChangeHandler = (event) => {
    setKeyword(event.target.value)
  }

  const Locallist = localinfolist?.map((x, index) =>
    <div>
      <LocalInfo
        key={index}
        localinfo={x}
      />
    </div>
  )

  const Markers = localinfolist?.map((x, index) =>
    <AnyReactComponent
      lat = {x.Geometry.Coordinates.split(",")[0]}
      lng = {x.Geometry.Coordinates.split(",")[1]}
      text={x.Name}
      zIndex={index}
    />
  )

  //#endregion

  const [searchDistance, setSearchDistance] = React.useState(3);
  const handleChangeSearchDistance = (event) =>{
    setSearchDistance(event.target.value);
  }

  return (
    <>
      <div style={{marginBottom: '5px'}}>
        <TextField value={keyword} onChange={keywordChangeHandler} id="outlined-basic" label="Keyword"></TextField>
      </div>
      <div>
      <FormControl style ={{width:'200px', marginBottom:'5px'}}>
        <InputLabel id="demo-simple-select-label">検索する半径距離(km)</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={searchDistance}
          onChange={handleChangeSearchDistance}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </FormControl>
      </div>
      <div style={{marginBottom: '5px'}}>
        <Button variant="contained" color="primary" onClick = {SearchButtonOnClick} >LocalSearch</Button>
      </div>
      {/* <div style={{ height: '100vh', width: '100%' }}> */}
        {/* <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
          center={defaultCenter}
          zoom={zoom}
          // yesIWantToUseGoogleMapApiInternals
          // onClick={_onClick}
          // onDragEnd ={_onDragEnd}
          // onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        > */}
        {/* {
          localinfolist?.map((x, index) =>
            <div>
            <AnyReactComponent
              lat = {x.Geometry.Coordinates.split(",")[0]}
              lng = {x.Geometry.Coordinates.split(",")[1]}
              text={x.Name}
            />
            </div>
          )
        } */}
        {/* <AnyReactComponent
          text={"test2"}
          zIndex={2}
          lat = {140.1}
          lng = {140.1}
        /> */}
        {/* { Markers } */}
        {/* </GoogleMapReact> */}
      {/* </div> */}

      {/* <ul> 
        { Locallist }
      </ul> */}
      <GridList cellHeight={160}  cols={3}>
        {localinfolist?.map((x, index) => (
          <GridListTile key={index} cols={1}>
            <img src={x.Property.LeadImage} alt={x.Name} />
            <GridListTileBar
              title={x.Name}
              subtitle={<span>{x.Property.Address}</span>}
            />
          </GridListTile>
        ))}
      </GridList>

    </>
  );
}

export default App;
