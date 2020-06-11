import React from 'react';

const Localinfo = (localInfo,index) => {
  // console.log(localInfo);
  // console.log(localInfo.localinfo.Geometry.Coordinates);
  const latlng = localInfo.localinfo.Geometry.Coordinates.split(",");
  // console.log(latlng);
  console.log(localInfo.localinfo);

  return (
    <li key={index}>
      {localInfo.localinfo.Name}
      {latlng[0]}
      {latlng[1]}
    </li>
  );
}
export default Localinfo;