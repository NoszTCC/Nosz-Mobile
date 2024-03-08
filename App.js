import {NavigationContainer} from "@react-navigation/native";
import Routes from "./screens/Routes.js";

export default function App(){
  return(
    <NavigationContainer>
      <Routes/>
    </NavigationContainer>
  );
}