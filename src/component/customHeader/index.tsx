import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  findNodeHandle,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  UIManager,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { ms, s, vs } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import User from "../../assets/images/user.svg";
import { setIsLogin } from "../../state/redux/slice/authSlice";
import { Routes } from "../../utils/routes";
import { Color, desiredFonts, FontFamily, FontSize } from "../../utils/theme";
import CustomLabel from "../customLabel";
import { ICustomHeader } from "../interface";
import ChatIcon from "../../assets/images/chatHeader.svg";
import Profile from "../../assets/images/AnthonyProfile.svg";

import CustomButton from "../customButton";
import BellIcon from "../../assets/images/bellBordered.svg";
import NotificationBellIcon from "../../assets/images/notificationBell.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Filter from "../../assets/images/filter.svg";

const CustomHeader = ({
  headerTitle,
  onPress,
  stackName,
  onPressBell,
  onPressJobFilter,
  bell = false,
  chatIcon = false,
  isHomeScreen = false,
  isJobScreen = false,
  isChatSupportModalVisible = true,
}: ICustomHeader) => {
  const {
    profileData,
    totalGlobalNotificatoinCandCount,
    totalGlobalNotificatoinHMCount,
  } = useSelector((state) => state.homeReducer);

  const { isSkipHome } = useSelector((state) => state.authReducer);
  const { managerStatus, managerData, isLoginType } = useSelector(
    (state) => state.authReducer
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const iconRef = useRef<View>(null);

  const openTooltip = () => {
    // Measure the icon position on screen
    // const handle = findNodeHandle(iconRef.current);
    // if (handle) {
    //   UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
    //     console.log("measure ment is", pageX, pageY, height, width);
    //     setCoords({ x: pageX, y: pageY, width, height });
    setVisible(true);
    // });
    // }
  };

  const onNavigateProfile = () => {
    if (stackName != "" && stackName != undefined) {
      if (isSkipHome) {
        Alert.alert(
          "Login Required",
          "Please login/register your details to gain access.",
          [
            {
              text: "Login",
              onPress: () => {
                dispatch(setIsLogin(false));
                navigation.navigate(Routes.SIGN_UP);
              },
            },
            { text: "Close", onPress: () => {} },
          ]
        );
      } else if (managerStatus?.Status__c == "Pending") {
        Alert.alert(
          "Pending Verification",
          "Your details are being reviewed. Once verified you will gain access.",
          [{ text: "Close", onPress: () => {} }]
        );
      } else {
        (Array.isArray(managerData) &&
          managerData?.length > 0 &&
          managerData[0]?.Id) ||
        managerData?.Id
          ? navigation.navigate(Routes.SETTING_SCREEN, {
              params: { fromStack: stackName },
            })
          : navigation.navigate(Routes.EDIT_PROFILE_SCREEN, {
              params: { fromStack: stackName },
            });
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* <CustomLabel customStyle={styles.title}>{headerTitle}</CustomLabel> */}
      {isHomeScreen ? (
        // Profile icon on the left (instead of title)
        <Pressable
          testID="profile-image-left"
          accessibilityRole="button"
          onPress={onNavigateProfile}
          style={styles.profilecontainer}
        >
          {isLoginType === "manager" ? (
            profileData?.[0]?.Public_Image_Url__c ? (
              <FastImage
                source={{ uri: profileData[0].Public_Image_Url__c }}
                style={styles.profile}
                onError={() => console.log("Manager image failed to load")}
              />
            ) : (
              <User
                width={vs(32)}
                height={vs(32)}
                style={{ alignSelf: "center" }}
                onPress={onPress}
              />
            )
          ) : profileData?.[0]?.Public_Image_Url__c ? (
            <FastImage
              source={{ uri: profileData[0].Public_Image_Url__c }}
              style={styles.profile}
              onError={() => console.log("Profile image failed to load")}
            />
          ) : (
            <User
              width={vs(32)}
              height={vs(32)}
              style={{ alignSelf: "center" }}
              onPress={onPress}
            />
          )}
        </Pressable>
      ) : (
        // Header title (default case)
        <CustomLabel customStyle={styles.title}>{headerTitle}</CustomLabel>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {bell && (
          <Pressable
            style={[
              styles.chatIconContainer,
              { marginRight: chatIcon ? 5 : undefined },
            ]}
            onPress={onPressBell}
          >
            <NotificationBellIcon onPress={onPressBell} />
            {isLoginType == "manager" &&
              totalGlobalNotificatoinHMCount?.hmCount +
                totalGlobalNotificatoinHMCount?.candidateCount >
                0 && (
                <View style={styles.badgeContainer}>
                  {/* <CustomLabel customStyle={styles.badgeText}>
                  {unReviewNotificatoinCount > 99
                    ? "99+"
                    : unReviewNotificatoinCount}
                </CustomLabel> */}
                </View>
              )}
            {isLoginType == "candidate" &&
              totalGlobalNotificatoinCandCount?.hmCount +
                totalGlobalNotificatoinCandCount?.candidateCount >
                0 && (
                <View style={styles.badgeContainer}>
                  {/* <CustomLabel customStyle={styles.badgeText}>
                  {unReviewNotificatoinCount > 99
                    ? "99+"
                    : unReviewNotificatoinCount}
                </CustomLabel> */}
                </View>
              )}
          </Pressable>
        )}
        {chatIcon && (
          <Pressable
            ref={iconRef}
            style={[styles.chatIconContainer]}
            onPress={() => navigation.navigate(Routes.CHAT_CONVERSATION_SCREEN)}
            onLayout={async () => {
              if (iconRef.current) {
                setTimeout(
                  async () => {
                    iconRef.current?.measureInWindow(
                      async (x, y, width, height) => {
                        setCoords({ x, y, width, height });

                        // AsyncStorage check
                        try {
                          let key =
                            isLoginType === "manager"
                              ? "hiringChatToolTipViewed"
                              : "candidateChatToolTipViewed";

                          const viewed = await AsyncStorage.getItem(key);
                          // if (true) {
                          if (viewed !== "true" && isChatSupportModalVisible) {
                            setVisible(true); // show tooltip
                            await AsyncStorage.setItem(key, "true"); // mark as viewed
                          }
                        } catch (error) {
                          console.log("Error checking tooltip viewed:", error);
                          setVisible(false); // fallback: show tooltip
                        }
                      }
                    );
                  },
                  Platform.OS == "android" ? 300 : 700
                );
                // }, 200);
              }
            }}
          >
            <ChatIcon width={vs(17)} height={vs(17)} />
            {isLoginType == "candidate" &&
              totalGlobalNotificatoinCandCount?.ChatCount > 0 && (
                <View style={styles.badgeContainer}></View>
              )}
            {isLoginType == "manager" &&
              totalGlobalNotificatoinHMCount?.ChatCount > 0 && (
                <View style={styles.badgeContainer}></View>
              )}
          </Pressable>
        )}
        {isJobScreen && (
          <Filter onPress={onPressJobFilter} width={vs(32)} height={vs(32)} />
        )}
        {!isHomeScreen && (
          <Pressable
            testID="profile-image"
            accessibilityRole="button"
            onPress={onNavigateProfile}
            style={styles.profilecontainer}
          >
            {isLoginType === "manager" ? (
              profileData?.[0]?.Public_Image_Url__c ? (
                <FastImage
                  source={{ uri: profileData[0].Public_Image_Url__c }}
                  style={styles.profile}
                  onError={() => console.log("Manager image failed to load")}
                />
              ) : (
                <User
                  width={vs(32)}
                  height={vs(32)}
                  style={{ alignSelf: "center" }}
                  onPress={onPress}
                />
              )
            ) : profileData?.[0]?.Public_Image_Url__c ? (
              <FastImage
                source={{ uri: profileData[0].Public_Image_Url__c }}
                style={styles.profile}
                onError={() => console.log("Profile image failed to load")}
              />
            ) : (
              <User
                width={vs(32)}
                height={vs(32)}
                style={{ alignSelf: "center" }}
                onPress={onPress}
              />
            )}
          </Pressable>
        )}
      </View>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.5)" },
          ]}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={[
              styles.chatIconContainer,
              {
                position: "absolute",
                top: coords.y, // same coords captured earlier
                left: coords.x,
                zIndex: 3, // higher than overlay
                backgroundColor: Color.LIGHT_BLUE,
              },
            ]}
            onPress={onPressBell}
          >
            <ChatIcon width={vs(17)} height={vs(17)} />
          </Pressable>
          <View
            style={[
              styles.diamondContainer,
              {
                top: coords.y + 47,
                left: coords.x + coords.width / 2 - vs(7), // center it horizontally
                // right: vs(coords.y),
                // right: coords.y + 6,
              },
            ]}
          ></View>
          <View
            style={[
              styles.tooltip,
              {
                right: vs(5),
                top: coords.y + coords.height + 6, // just below icon
              },
            ]}
          >
            <View style={styles.tooltipBody}>
              <View style={styles.tooltipHeaderContainer}>
                <Profile />
                <CustomLabel customStyle={styles.profileHeaderText}>
                  Anthony Wilks
                </CustomLabel>
                <View style={styles.recruiterContainer}>
                  <CustomLabel customStyle={styles.recruiterText}>
                    Recruiter
                  </CustomLabel>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.bodyContainer}>
                <CustomLabel customStyle={styles.bodyHeaderText}>
                  {isLoginType == "manager"
                    ? "Need To Fill A Role?"
                    : "Advance Your Career!"}
                </CustomLabel>
                <CustomLabel customStyle={styles.bodySubTitleText}>
                  {isLoginType == "manager"
                    ? "The Anteo recruitment team fills difficult and urgent roles when you need it most."
                    : "Get 1-on-1 career guidance. The Anteo recruitment team is here to support you!"}
                </CustomLabel>
                <View>
                  <View style={styles.tooltipFooterContainer}>
                    <CustomButton
                      title="Start Chat"
                      containerStyle={{ height: vs(31), flex: 1 }}
                      onPress={() => {
                        setVisible(false);
                        setTimeout(() => {
                          navigation.navigate(Routes.CHAT_CONVERSATION_SCREEN);
                        }, 200);
                      }}
                      labelStyle={[styles.buttonText, { color: Color.WHITE }]}
                    />
                    <CustomButton
                      title="Close"
                      containerStyle={styles.outlinedButtonContainer}
                      labelStyle={styles.buttonText}
                      onPress={() => setVisible(false)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: Color.BLUE,
    alignItems: "center",
  },
  title: {
    fontFamily: FontFamily.SATOSHI_BOLD,
    color: Color.WHITE,
    fontSize: FontSize.SIZE_20,
    textAlign: "left",
    fontWeight: "900",
    alignSelf: "center",
    bottom: s(4),
    flex: 0.9,
  },
  profilecontainer: {
    width: vs(45),
    height: vs(45),
    alignItems: "center",
    justifyContent: "center",
  },
  profile: {
    width: vs(32),
    height: vs(32),
    borderRadius: vs(32),
    alignSelf: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: -2,
    right: 4,
    backgroundColor: Color.RED_BG,
    borderRadius: 10,
    minWidth: 10,
    height: 10,
    paddingHorizontal: 3,
    zIndex: 1,
  },
  badgeText: {
    ...desiredFonts("SATOSHI_REGULAR", "SIZE_10", "WHITE", "400"),
  },
  chatIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: vs(32),
    width: vs(32),
    borderRadius: vs(32),
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  tooltip: {
    position: "absolute",
    maxWidth: "70%",
  },
  text: { color: "#fff" },
  profileHeaderText: {
    ...desiredFonts("SATOSHI_BOLD", "SIZE_16", "BLACK", "700"),
  },
  recruiterContainer: {
    padding: 8,
    backgroundColor: "#C9BAFF",
    borderRadius: 1234,
  },
  recruiterText: {
    ...desiredFonts("SATOSHI_REGULAR", "SIZE_10", "BLACK", "400"),
  },
  separator: {
    marginVertical: vs(11),
    height: 1,
    backgroundColor: "#0000001A",
  },
  bodyContainer: {
    marginTop: vs(12),
    rowGap: vs(12),
    flex: 1,
  },
  bodyHeaderText: {
    ...desiredFonts("SATOSHI_BOLD", "SIZE_20", "BLACK", "700"),
  },
  bodySubTitleText: {
    ...desiredFonts("SATOSHI_REGULAR", "SIZE_12", "BLACK", "400"),
    color: "#000000E0",
  },
  buttonText: {
    ...desiredFonts("SATOSHI_BOLD", "SIZE_14", "BLACK", "700"),
  },
  diamondContainer: {
    height: 20,
    width: 20,
    backgroundColor: "white",
    position: "absolute",
    zIndex: 1,
    transform: [{ rotate: "45deg" }],
    overflow: "visible",
    flex: 1,
  },
  tooltipBody: {
    backgroundColor: Color.WHITE,
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    flex: 1,
  },
  tooltipFooterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: vs(10),
  },
  outlinedButtonContainer: {
    height: vs(31),
    flex: 0.7,
    borderColor: Color.BLACK,
    backgroundColor: Color.WHITE,
    borderWidth: 1,
  },
  tooltipHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: vs(4),
  },
});
