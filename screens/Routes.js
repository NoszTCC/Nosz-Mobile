import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from "./HomeNosz.js";
import Login from "./LoginNosz.js";
import Initial from "./Initial.js";
import Cadastro from "./CadastroNosz.js";

const Stack = createNativeStackNavigator()

export default function Routes() {

  return (
      <Stack.Navigator
        initialRouteName='Inicial'
        screenOptions={{
          headerShown: false, 
        }}
      >
        
        <Stack.Screen name="Pagina Inicial" component={Home}></Stack.Screen>
        <Stack.Screen name="Login" component={Login}></Stack.Screen>
        <Stack.Screen name="Inicial" component={Initial}></Stack.Screen>
        <Stack.Screen name="Cadastro" component={Cadastro}></Stack.Screen>
        
      </Stack.Navigator>
  );
};