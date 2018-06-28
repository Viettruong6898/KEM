import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Dashboard = () => (
  <div  className="content" >
 <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '10vh', fontSize:'150%'}}>
    <h1> Kohl's Experience Manager </h1>
</div>
<div className="content" style={cardStyleNormal}>
    <div style={{display : 'inline-block'}}> 
      <button style={cardStyleTopLeft} onClick={() => alert("This URL is not yet implemented")}> Experience Manager </button> 
      <button style={cardStyleTopCenter} onClick={() => alert("This URL is not yet implemented")}> Search Tools  </button> 
      <button style={cardStyleTopRight} onClick={() => alert("This URL is not yet implemented")}>Assortment Creation & Management  </button>  
      <div style={{display : 'inline-block'}}> 
      <button style={cardStyleMiddleLeft} onClick={() => alert("This URL is not yet implemented")}> SEO Tools  </button> 
      <Link style={cardStyleMiddleCenter} to={{pathname:`/`}}> Site Content & Messaging </Link> 
      <button style={cardStyleMiddleRight} onClick={() => alert("This URL is not yet implemented")}> Check Pricing & Inventory  </button> 
      <div style={{display : 'inline-block'}}> 
      <a style={cardStyleBottomLeft} href='http://10.208.17.221/reference-app/index.html'> Link Builder </a> 
      <a style={cardStyleBottomCenter} href='https://www-staging1.kohls.com/preview/StagePreview.jsp'> Staging </a> 
      <button style={cardStyleBottomRight} onClick={() => alert("This URL is not yet implemented")}> Admin Module  </button> 
      </div>
    </div>
    </div>   
  </div>
  </div>
);


// All these codes below are just the styling for this form. 
  var cardStyleNormal = {
    height: '25vh',
    width:"45vh",
    border:'15px',
    padding: '15px',
    verticalTop:'top',
    overFlow: 'auto',
    borderRadius:'500px',
    borderColor:' black',
    borderWidth:'2',
    fontSize:'150%',
    lineHeight:'60%'
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
    fontSize:'150%',
    marginBottom: '30px'
    };
   
    var cardStyleMiddleLeft = {
      display: 'flex',
      justifyContent:'center',
      alignItems:'center',
      height: '25vh',
      backgroundColor:'#f4a460',
      width:"45vh",
      border:'15px solid #fff',
      padding: '15px',
      float:'left',
      overFlow: 'auto',
      borderRadius:'50px',
      borderColor:' black',
      borderWidth:'2',
      fontSize:'150%',
      marginBottom: '30px'
      };
        
  var cardStyleBottomLeft = {
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    height: '25vh',
    backgroundColor:'#afeeee',
    width:"45vh",
    border:'15px solid #fff',
    padding: '15px',
    float:'left',
    overFlow: 'auto',
    borderRadius:'50px',
    borderColor:' black',
    borderWidth:'2',
    fontSize:'150%',
    marginBottom: '30px'
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
    var cardStyleMiddleCenter = {
      display: 'flex',
      justifyContent:'center',
      alignItems:'center',
      height: '25vh',
      backgroundColor:'#a020f0',
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
      var cardStyleBottomCenter = {
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        height: '25vh',
        backgroundColor:'#ffa500',
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

var cardStyleMiddleRight = {
  display: 'flex',
  justifyContent:'center',
  alignItems:'center',
  height: '25vh',
  backgroundColor:'#fa8072',
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

var cardStyleBottomRight = {
  display: 'flex',
  justifyContent:'center',
  alignItems:'center',
  height: '25vh',
  backgroundColor:'#d3d3d3',
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