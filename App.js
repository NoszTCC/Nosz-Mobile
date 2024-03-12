import {NavigationContainer} from "@react-navigation/native";
import Routes from "./routes/Routes.js";

export default function App(){
  return(
    <NavigationContainer>
      <Routes/>
    </NavigationContainer>
  );
}