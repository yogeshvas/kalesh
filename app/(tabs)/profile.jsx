import {
  View,
  Text,
  FlatList,
  Touchable,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";

import EmptyState from "../../components/EmptyState";
import { getUserPosts, searchPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../context/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { router, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import Toast from "react-native-toast-message";
const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(null);
    Toast.show({
      type: "success",
      text1: "Logged out successfully.",
      position: "bottom",
      visibilityTime: 5000,
    });
    router.replace("/sign-in");
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-2 px-4">
            <TouchableOpacity
              onPress={logout}
              className="w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                className={"w-6 h-6"}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%]  h-[90%] rounded-lg "
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="mt-2 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox title={"0"} subtitle="Followers" titleStyles="text-xl" />
            </View>
            <View className="mt-5 h-0.5 w-full bg-gray-500 rounded-3xl" />
            <Text
              className="
            mt-5 mb-2
            text-2xl
            text-white font-psemibold "
            >
              Your Videos
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle={"Be the First One to Upload a Video"}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
