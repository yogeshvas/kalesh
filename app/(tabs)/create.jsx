import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormFeild from "../../components/FormFeild";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,

      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      } else {
        setTimeout(() => {
          Toast.show({
            type: "success",
            text1: "Thumbnail Picked",
            position: "bottom",

            bottomOffset: 90,

            visibilityTime: 5000, // 5 seconds
          });
        }, 100);
      }
    }
  };
  const submit = async () => {
    if (
      (form.prompt === "") |
      (form.title === "") |
      !form.thumbnail |
      !form.video
    ) {
      return Toast.show({
        type: "error",
        text1: "Please fill all the details.",

        position: "bottom",

        bottomOffset: 90,

        visibilityTime: 5000, // 5 seconds
      });
    }

    setUploading(true);
    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });

      Toast.show({
        type: "success",
        text1: "Video Created Successfully",
        position: "bottom",
        bottomOffset: 90,
        text2: "Swipe down to refresh",
        visibilityTime: 5000, // 5 seconds
      });

      router.push("/home");
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
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-5 ">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormFeild
          title="Video Title"
          value={form.title}
          placeholder={"Give your video a catchy title..."}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles={"mt-5"}
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 boder-black-200 ">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    resizeMode="contain"
                    source={icons.upload}
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 spacy-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rouded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 boder-black-200 flex-row space-x-2 mt-2">
                <Image
                  resizeMode="contain"
                  source={icons.upload}
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormFeild
          title="Description"
          value={form.prompt}
          placeholder={"add a description"}
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles={"mt-7"}
        />
        <CustomButton
          title="Submit & Publish"
          containerStyles={"mt-7"}
          isLoading={uploading}
          handlePress={submit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
