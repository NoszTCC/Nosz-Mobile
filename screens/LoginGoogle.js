import { Button, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function SignInScreen({ promptAsync }) {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#4285F4",
          width: "75%",
          padding: 8,
          borderRadius: 15,
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 15,
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 10 },
          shadowOpacity: 1,
        }}
        onPress={() => promptAsync()}
      >
        <AntDesign name="google" size={30} color="white" />
        <Text style={{ fontWeight: "bold", color: "white", fontSize: 17 }}>
          Continuar com Google
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}