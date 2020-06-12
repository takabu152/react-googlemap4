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
import IconButton from '@material-ui/core/IconButton';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';

import firebase from './firebase/index';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

//axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

const App =() => {

  const useStyles = makeStyles((theme) => ({
    paper: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        marginBottom: theme.spacing(2),
        // width: theme.spacing(16),
        // height: theme.spacing(16),
      },
    },
  }));

  const classes = useStyles();

  let test;
  //#region GoogleMaps部分
  // const [defaultCenter,setDefaultCenter] = useState({lat:33,lng:33})
  const [defaultCenter,setDefaultCenter] = useState(null)
  const [center,setCenter] = useState(null)
  const [readcount,setReadCount] = useState(0)
  // const [lng,setLng] = useState({lat:lat,lng:lng})
  
  const [zoom,setZoom] =useState(14)

  const [favoritelist ,setFavoritelist] = useState(null);


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

      const result = getFavoritelistFromFirestore();

    },[])
    
  //#endregion

  //#region YahooAPIから取得する部分
  // ここでYahooAPIを使ってlocal情報を集めてくる
  const getLocalInfoList = async () =>{
    
    axios.get(`https://us-central1-functions-284d0.cloudfunctions.net/api/getlocalinfogeo/keyword/${encodeURIComponent(keyword)}/lat/${defaultCenter.lat}/lon/${defaultCenter.lng}/dist/${searchDistance}`)
    .then(function (response) {
        // handle success
        // stateに情報を追加する。
        console.log(response);
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

  // Firestoreにデータを送信する関数
  const postDataToFirestore = async (collectionName, postData) => {
    const addedData = await firebase.firestore().collection(collectionName).add(postData);
    return addedData;
  }

  // firestoreから全データを取得してstateに格納する関数
  const getFavoritelistFromFirestore = async () => {
    const favoriteList_FB = await firebase.firestore().collection('favoritelist')
      //並び替え
      .get();
    console.log(favoriteList_FB.docs[0].data().name);
    const favoriteListArray = favoriteList_FB.docs.map(x => {
      return {
        shopid: x.id,
        name: x.data().name,
      }
    })
    setFavoritelist(favoriteListArray);
    return favoriteListArray;
  }


  const onClickIconBtn = async (shopinfo,event) => {
    
    // firebaseへお気に入り登録する
    //if (todo === '' || limit === '') { return false };
    const postData = {
      shopid: shopinfo.Id,
      name: shopinfo.Name,
    }
    const addedData = await postDataToFirestore('favoritelist', postData);
    //getTodosFromFirestore();

    alert("お気に入りに追加されました！")

    getFavoritelistFromFirestore();
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
      <div className={classes.paper}>
        <Paper elevation={3}>
        <List 
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              お気に入りリスト
            </ListSubheader>
          }>
            {favoritelist?.map((x, index) => (
              <ListItem button key={index}>
                <ListItemText primary={x.name} />
              </ListItem>
            ))}
        </List>
        </Paper>
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
              actionIcon={
                <IconButton aria-label={`info about ${x.Name}`} color="primary" onClick={onClickIconBtn.bind(this,x)} id = {x.uid}>
                  <AddCircleRoundedIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </>
  );
}

export default App;
