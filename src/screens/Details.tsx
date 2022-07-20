import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import { Box, HStack, ScrollView, Text, useTheme, VStack } from "native-base";

import { dateFormat } from "../utils/firebaseDateFormat";

import { Input } from "../components/Input";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { OrderProps } from "../components/Order";
import { CardDetails } from "../components/CardDetails";

import {
  CircleWavyCheck,
  Clipboard,
  DesktopTower,
  Hourglass,
} from "phosphor-react-native";

import { OrderFirestoreDTO } from "../DTOs/OrderDTO";
import { Button } from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed?: string;
};

export function Details() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [solution, setSolution] = useState("");

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  function handleCloseOrder() {
    if (!solution) {
      return Alert.alert(
        "Atenção",
        "Preencha a solução para encerrar a solicitação"
      );
    }
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "Fechado",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação encerrada.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        return Alert.alert("Atenção", "Não foi possível encerrar solicitação");
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          created_at,
          status,
          closed_at,
          solution,
        } = doc.data();
        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          when: dateFormat(created_at),
          solution,
          closed,
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg={"gray.700"}>
      <Box p={6}>
        <Header title="Solicitação" />
      </Box>
      <HStack bg={"gray.500"} justifyContent={"center"} p={4}>
        {order.status === "Fechado" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}
        <Text
          fontSize={"sm"}
          color={
            order.status === "Fechado"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform={"uppercase"}
        >
          {order.status === "Fechado" ? "Finalizado" : "Em andamento"}
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Equipamento"
          description={`Patrimônio: ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />
        <CardDetails
          title="Descrição do problema"
          description={order.description}
          icon={Clipboard}
        />
        <CardDetails
          title="Solução"
          description={order.solution}
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "Aberto" && (
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              h={24}
              textAlignVertical={"top"}
              multiline
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === "Aberto" && (
        <Button title="Encerra solicitação" m={5} onPress={handleCloseOrder} />
      )}
    </VStack>
  );
}
