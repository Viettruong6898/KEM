import React from 'react';

const Dashboard = () => (
  <div className="content" >
 <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '10vh', fontSize:'150%'}}>
    <h1> Kohl's Experience Manager </h1>
</div>
<div style={cardStyleNormal}>
    <div style={{display : 'inline-block'}}> 
      <div style={cardStyleTopLeft}> Experience Manager </div>
      <div style={cardStyleTopCenter}> Search Tools </div>
      <div style={cardStyleTopRight}> Assortment Creation & Management </div>
    </div>
  </div>
    </div>
);
var cardStyleNormal = {
  display: 'flex',
  justifyContent:'center',
  alignItems:'center',
  height: '25vh',
  backgroundColor:'red',
  width:"45vh",
  border:'15px solid #fff',
  padding: '15px',
  float:'left',
  overFlow: 'auto',
  borderRadius:'50px',
  borderColor:' black',
  borderWidth:'2',
  fontSize:'150%'
  };
  var cardStyleTopLeft = {
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    height: '25vh',
    backgroundColor:'#ADD8E6',
    width:"45vh",
    border:'15px solid #fff',
    padding: '15px',
    float:'left',
    overFlow: 'auto',
    borderRadius:'50px',
    borderColor:' black',
    borderWidth:'2',
    fontSize:'150%'
    };

var cardStyleTopCenter = {
  display: 'flex',
  justifyContent:'center',
  alignItems:'center',
  height: '25vh',
  backgroundColor:'#00FF00',
  width:"45vh",
  border:'15px solid #fff',
  padding: '15px',
  position: 'absolute',
  right: '36.5%',
  overFlow: 'auto',
  borderRadius:'50px',
  borderColor:' black',
  borderWidth:'2',
  fontSize:'150%'
  };

var cardStyleTopRight = {
  display: 'flex',
  justifyContent:'center',
  alignItems:'center',
  height: '25vh',
  backgroundColor:'#ffb6c1',
  width:"45vh",
  border:'15px solid #fff',
  position: 'absolute',
  right: '1%',
  overFlow: 'auto',
  borderRadius:'50px',
  borderColor:' black',
  borderWidth:'2',
  fontSize:'120%'
  };


export default Dashboard;