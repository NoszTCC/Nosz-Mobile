import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import BottomTabParceiro from './BottomTabParceiro';

//INITIAL PAGES
import Onboarding from '../screens/Onboarding/Onboarding';
import Login from "../screens/Auth/LoginNosz";
import EsqueceuSenha from '../screens/Auth/EsqueceuSenha';
import Cadastro from "../screens/Auth/CadastroNosz";

//USER
import Home from '../screens/HomeNosz';
import Config from '../screens/Perfil/Config';
import DadosConta from '../screens/Perfil/DadosConta';
import Endereco from '../screens/Perfil/Endereco';

//PARCEIRO
import Parceiro from '../screens/Parceiros/ParceiroNosz';
import ConfigParceiro from '../screens/Parceiros/PerfilParceiro/ConfigParceiro';
import DadosParceiro from '../screens/Parceiros/PerfilParceiro/AltDadosParceiro';
import EnderecoParceiro from '../screens/Parceiros/PerfilParceiro/EndParceiro';
import AlterarProduto from '../screens/Parceiros/AlterarProduto';

const Stack = createNativeStackNavigator()

export default function Routes() {
  return (
    <Stack.Navigator
      initialRouteName='Onboarding'
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* ROTAS INICIAS */}
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />

      {/* ROTAS USER */}
      <Stack.Screen name="Inicio">
        {() => (
          <BottomTabNavigator>
            <Home />
          </BottomTabNavigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="Configuracoes" component={Config} />
      <Stack.Screen name ="DadosConta" component={DadosConta}/>
      <Stack.Screen name ="Endereco" component={Endereco}/>

      {/* ROTAS PARCEIRO */}
      <Stack.Screen name="HomeParceiro">
        {() => (
          <BottomTabParceiro>
            <Parceiro />
          </BottomTabParceiro>
        )}
      </Stack.Screen>
      <Stack.Screen name ="ConfiguracoesParceiro" component={ConfigParceiro}/>
      <Stack.Screen name ="DadosParceiro" component={DadosParceiro}/>
      <Stack.Screen name ="EnderecoParceiro" component={EnderecoParceiro}/>
      <Stack.Screen name ="AlterarProduto" component={AlterarProduto}/>

    </Stack.Navigator>
  );
};