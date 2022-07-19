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

import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";

import Logo from "../assets/logo_secondary.svg";
import { useState } from "react";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";

export function Home() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [statusSelected, setStatusSelected] = useState<"Aberto" | "Fechado">(
    "Aberto"
  );
  const [orders, setOrders] = useState<OrderProps[]>([
    {
      id: "123",
      patrimony: "455",
      when: "18/07/2022 às 10:00",
      status: "Aberto",
    },
  ]);

  const handleNewOrder = () => {
    navigation.navigate("new");
  };

  function handleOpenDetails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

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
        <IconButton icon={<SignOut size={26} color={colors.gray[300]} />} />
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
        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
