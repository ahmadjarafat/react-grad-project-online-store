import React from "react";
import './App.css';
import {Home} from "./Pages/Home/Home"
import {theme} from "./Theme/Theme"
import { ThemeProvider } from '@material-ui/core/styles';
import {Header} from "./Components/Header/Header"
 import{ BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {Shop} from "./Pages/Shop/Shop"
import {Footer} from "./Components/Footer/Footer"
import {CustomerCare} from "./Pages/CoustmerCare/CustomerCare"
import {Stockists} from "./Pages/Stockists/Stockists"
import {QuickView} from "./Pages/QuickView/QuickView"
import {useEffect,useState,useRef} from "react";
import Cart from "./Pages/Cart/Cart";
import {useReducer} from "react";












function App() {

  // const [countState,setCountState] = useState(0)

  let initialState = {total:0,items:[],cartCount: 0}
 const reducer = (state, action) => {
   let flag = true;
    switch (action.type) {
      case "Add Item":
        let itemsCopy = state.items.map((value) => {
         if (value.url === action.objInfo.url && value.size === action.objInfo.size )
         {
           flag = false;
           return {...value, countItem: parseInt(action.objInfo.quantity) + value.countItem}
         }
         else 
         return value;
        })
        if(flag){
       return {...state,
        total: parseFloat((state.total + (parseFloat(action.objInfo.price.replace("$",""))*action.objInfo.quantity)).toFixed(2)),
        cartCount: parseInt(action.objInfo.quantity) + state.cartCount,
        items: [...state.items, {
          size: action.objInfo.size,
          price: action.objInfo.price,
          color: action.objInfo.color,
          url: action.objInfo.url,
          caption: action.objInfo.caption,
          countItem: parseInt(action.objInfo.quantity)}]
        }}
        else 
        return {...state, 
          total: parseFloat((state.total + (parseFloat(action.objInfo.price.replace("$",""))*action.objInfo.quantity)).toFixed(2)),
          cartCount:  parseInt(action.objInfo.quantity) + state.cartCount,
          items: [...itemsCopy]}
        case "add-one-item":
        return {...state, 
        cartCount:  1 + state.cartCount,
        total: parseFloat((state.total + parseFloat(action.price.replace("$",""))).toFixed(2)),
        items: state.items.map((value, index) => {
          if (value.url === action.url && value.size === action.size )
            return {...value, countItem: value.countItem+1}
          else 
          return value;
      
        })}
        case "remove-one-item":
          return {...state, 
          cartCount: state.cartCount - 1,
          total: parseFloat((state.total - parseFloat(action.price.replace("$",""))).toFixed(2)),
          items: state.items.map((value, index) => {
            if (value.url === action.url && value.size === action.size )
              return {...value, countItem: value.countItem - 1}
            else 
            return value;
        
          })}
          case "remove-every-item":
            console.log(action.obj)
          return {...state, 
            cartCount: state.cartCount - action.obj.count,
            total: parseFloat((state.total - (parseFloat(action.obj.price.replace("$",""))*action.obj.count)).toFixed(2)),
            items: state.items.filter((value) => {
              return (value.url !== action.obj.url || value.size !== action.obj.size )
            })
          }
        default:
        return state;
    }}
  // const [count, setCount] = useState(0);
  const [state, dispatch] = useReducer(reducer,initialState);
  
  const addToCart = function (objInfo) {
     dispatch({type:"Add Item", objInfo})
}

const addProducts = (size, url,price) => {
  dispatch({type:"add-one-item", size: size,url: url,price: price})
}

 const removeProducts = (size, url,price) => {
  dispatch({type:"remove-one-item", size: size,url: url, price: price})
}

const removeAllOfOneProduct = (obj) => {
  dispatch({type:"remove-every-item",  obj })
}





  
    
  
return (
    
      <Router>
        <ThemeProvider theme={theme}>
        <Header cart={state.cartCount} />
   <Switch>
   <Route path="/CustomerCare">
            <CustomerCare />
          </Route>
          <Route path="/quickView">
          <QuickView add= {addToCart}/>
          </Route>
   <Route path="/shop">
            <Shop />
          </Route>
          <Route path="/Stockists">
            <Stockists />
          </Route>
          <Route path="/Cart">
            <Cart removeAllOfOneProduct={removeAllOfOneProduct}  removeFunction={removeProducts} addFunction={addProducts} info={state} />
          </Route>
   <Route path="/">
            <Home />
          </Route>
   </Switch>
   <Footer />
   </ThemeProvider>
    </Router>

  );

}

export default App;



