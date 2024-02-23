import {NavigationContainer} from "@react-navigation/native";

import Routes from "./screens/Routes.js";
import HomeNosz from "./screens/HomeNosz.js";
import LoginNosz from "./screens/LoginNosz.js";

export default function App(){
  return(
    <NavigationContainer>
      <Routes/>
    </NavigationContainer>
  );
}