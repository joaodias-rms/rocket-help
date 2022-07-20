import {
  Center,
  FlatList,
  Heading,
  HStack,
  IconButton,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { ChatTeardropText, SignOut } from "phosphor-react-native";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";

import Logo from "../assets/logo_secondary.svg";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { dateFormat } from "../utils/firebaseDateFormat";
import { Loading } from "../components/Loading";

export function Home() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [statusSelected, setStatusSelected] = useState<"Aberto" | "Fechado">(
    "Aberto"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [loading, setLoading] = useState(true);

  const handleNewOrder = () => {
    navigation.navigate("new");
  };

  function handleOpenDetails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

  function handleLogOut() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        return Alert.alert("Atenção", "Não foi possível sair");
      });
  }

  useEffect(() => {
    setLoading(true);
    const subscriber = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          };
        });
        setOrders(data);
        setLoading(false);
      });

    return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w={"full"}
        justifyContent="space-between"
        alignItems={"center"}
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogOut}
        />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w={"full"}
          mt={8}
          mb={4}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Heading color={"gray.100"}>Meus Chamados</Heading>
          <Text color={"gray.200"}>{orders.length}</Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            onPress={() => setStatusSelected("Aberto")}
            title="Em andamento"
            type="Aberto"
            isActive={statusSelected == "Aberto"}
          />
          <Filter
            onPress={() => setStatusSelected("Fechado")}
            title="Finalizados"
            type="Fechado"
            isActive={statusSelected == "Fechado"}
          />
        </HStack>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text
                  fontSize={"xl"}
                  mt={"6"}
                  textAlign={"center"}
                  color={"gray.300"}
                >
                  Você ainda não possui {"\n"} solicitações{" "}
                  {statusSelected === "Aberto" ? "abertas" : "finalizadas"}
                </Text>
              </Center>
            )}
          />
        )}
        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
