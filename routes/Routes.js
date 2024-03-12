import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import HomeNosz from "../screens/HomeNosz";
import Perfil from "../screens/PerfilNosz";
import Login from "../screens/LoginNosz";
import Initial from "../screens/Initial";
import Cadastro from "../screens/CadastroNosz";

const Stack = createNativeStackNavigator()

export default function Routes() {
  return (
    <Stack.Navigator
      initialRouteName='Pagina Inicial'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Pagina Inicial" component={Initial} />
      <Stack.Screen name="Perfil" component ={Perfil} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Inicio">
        {() => (
          <BottomTabNavigator>
            <HomeNosz />
          </BottomTabNavigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
};
