import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import FormFeild from "../../components/FormFeild";
import { StatusBar } from "expo-status-bar";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import Toast from "react-native-toast-message";
const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Toast.show({
        type: "error",
        text1: "Please fill all the details.",
        position: "bottom",
        bottomOffset: 90,
        visibilityTime: 5000, // 5 seconds
      });
    }
    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLoggedIn(true);
      //set it to global state
      Toast.show({
        type: "success",
        text1: "User signed in successfully",
        position: "bottom",
        bottomOffset: 90,

        visibilityTime: 5000, // 5 seconds
      });
      router.replace("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        position: "bottom",

        bottomOffset: 90,
        text2: error.message,
        visibilityTime: 5000, // 5 seconds
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView>
        <View className={"w-full justify-center min-h-[82vh] px-4 my-6"}>
          <View className={"w-full items-center "}>
            <View className="w-42 h-42 border border-white overflow-hidden rounded-lg">
              <Image
                resizeMode="cover"
                className="w-40 h-40  "
                source={images.logo}
              />
            </View>
          </View>
          <Text
            className={"text-2xl text-white text-semibold mt-5 font-psemibold"}
          >
            Create an account.
          </Text>
          <FormFeild
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-2"
          />
          <FormFeild
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormFeild
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title={"create account."}
            handlePress={submit}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href={"/sign-in"}
              className="text-lg font-semibold text-secondary-100"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
