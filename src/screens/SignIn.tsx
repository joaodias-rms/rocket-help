import React, { useState } from "react";
import { VStack, Heading, Icon, useTheme } from "native-base";
import auth from "@react-native-firebase/auth";
import { Envelope, Key } from "phosphor-react-native";

import Logo from "../assets/logo_primary.svg";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

export function SignIn() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert("Atenção", "Informe email e senha");
    }
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error);

        setIsLoading(false);
        if (error.code === "auth/invalid-email") {
          Alert.alert("Atenção", "Email ou senha inválida");
        }
        if (error.code === "auth/user-not-found") {
          Alert.alert("Atenção", "Usuário não cadastrado");
        }
        if (error.code === "auth/wrong-password") {
          Alert.alert("Atenção", "Email ou senha inválido");
        }
        return Alert.alert("Atenção", "Não foi possível acessar");
      });
  }

  return (
    <VStack flex="1" alignItems="center" bg="gray.600" px={8} pt="24">
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt="20" mb="6">
        Acesse a conta
      </Heading>
      <Input
        placeholder="Email"
        marginBottom={5}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
      />
      <Input
        mb={2}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
      />
      <Button
        title="Entrar"
        w={"full"}
        mt="6"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
}
