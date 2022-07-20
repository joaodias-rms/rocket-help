import { VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

export function Register() {
  const [loading, setLoading] = useState(false);
  const [patrimony, setPatrimony] = useState("");
  const [description, setDescription] = useState("");

  const navigation = useNavigation();

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert("Atenção", "Preencha todos os campos");
    }
    setLoading(true);
    firestore()
      .collection("orders")
      .add({
        patrimony,
        description,
        status: "Aberto",
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "solicitação registrada com sucesso");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        return Alert.alert(
          "Solicitação",
          "Não foi possível registrar o pedido"
        );
      });
  }
  return (
    <VStack flex={1} p={6} bg={"gray.600"}>
      <Header title="Nova solicitação" />
      <Input placeholder="Nº do patrimônio" mt={4} onChangeText={setPatrimony}/>
      <Input
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />
      <Button title="Cadastrar" mt={5} onPress={handleNewOrderRegister}/>
    </VStack>
  );
}
