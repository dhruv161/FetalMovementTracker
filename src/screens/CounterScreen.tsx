import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Modal,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { desiredFonts } from '../utils/theme';
import uuid from 'react-native-uuid';
import { saveSession } from '../utils/sessionStorage';

export default function CounterScreen({ navigation }) {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);

    const formatTime = () => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    const [showInfo, setShowInfo] = useState(false);

    const handleSave = async () => {
  if (seconds === 0) return;

  await saveSession({
    id: uuid.v4().toString(),
    startedAt: Date.now(),
    durationInSeconds: seconds,
  });

  navigation.goBack();
};

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require("../assets/images/Back.png")}
                        style={styles.backText}
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Record DFM</Text>

                <TouchableOpacity onPress={() => setShowInfo(true)}>
                    <Image
                        source={require("../assets/images/Info.png")}
                        style={styles.infoText}
                    />
                </TouchableOpacity>

            </View>

            {/* Content */}
            <View style={styles.content}>
                <View>
                    <View style={styles.bubble}>
                        <Text style={styles.bubbleText}>Stop recording after{'\n'}10 kicks</Text>
                    </View>

                    {/* Timer */}
                    <View style={styles.timerWrapper}>
                        <Text style={styles.timerText}>{formatTime()}</Text>
                    </View>

                    {/* Play / Stop Button */}
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => setIsRunning(!isRunning)}
                    >
                        <Text style={styles.controlIcon}>
                            {isRunning ? '■' : '▶'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton}   onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>

                {/* Help Link */}
                <Text style={styles.helpText}>
                    What if I am not getting{'\n'}enough kicks?
                </Text>
            </View>

            <Modal
                visible={showInfo}
                transparent
                animationType="slide"
                onRequestClose={() => setShowInfo(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowInfo(false)}
                        >
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>
                                👣 Steps to count fetal kicks
                            </Text>

                            <Text style={styles.modalItem}>
                                1. Choose a time when you are least distracted or when you typically feel the fetus move.
                            </Text>

                            <Text style={styles.modalItemBG}>
                                2. Get comfortable. Lie on your left side or sit with your feet propped up.
                            </Text>

                            <Text style={styles.modalItem}>
                                3. Place your hands on your belly.
                            </Text>

                            <Text style={styles.modalItemBG}>
                                4. Start a timer or watch the clock.
                            </Text>

                            <Text style={styles.modalItem}>
                                5. Count each kick. Keep counting until you get to 10 kicks / flutters / swishes / rolls.
                            </Text>

                            <Text style={styles.modalItemBG}>
                                6. Once you reach 10 kicks, jot down how many minutes it took.
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        backgroundColor: '#FFFFFF',
        paddingBottom: 20
    },
    backText: {
        height: 24,
        width: 32
    },
    headerTitle: {
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_18", "BLACK", "600"),
        color: '#121212'
    },
    infoText: {
        height: 24,
        width: 26
    },

    /* Content */
    content: {
        flex: 1,
        alignItems: 'center',
        alignContent: 'center',
        paddingTop: 80,
        justifyContent: 'space-between',
        backgroundColor: '#F9F4F8',
    },

    bubble: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 40,
        paddingVertical: 40,
        borderRadius: 16,
        marginBottom: 40,
        alignSelf: 'center'
    },
    bubbleText: {
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_24", "BLACK", "700"),
        textAlign: 'center',
        color: '#121212'
    },

    timerWrapper: {
        width: 220,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        alignSelf: 'center'
    },
    timerText: {
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_36", "BLACK", "700"),
        color: '#E15B45',
    },

    controlButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 36,
        alignSelf: 'center'
    },
    controlIcon: {
        fontSize: 40,
    },

    saveButton: {
        width: '85%',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 48,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    saveText: {
        fontSize: 16,
        fontWeight: '500',
    },

    helpText: {
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_18", "BLACK", "600"),
        textAlign: 'center',
        textDecorationLine: 'underline',
        paddingBottom: 40
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },

    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: '75%',
    },

    closeButton: {
        position: 'absolute',
        right: 16,
        top: 12,
        zIndex: 1,
    },

    closeText: {
        fontSize: 18,
    },

    modalTitle: {
        marginBottom: 16,
        paddingTop: 8,
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_18", "BLACK", "900"),

    },

    modalItem: {
        lineHeight: 22,
        marginBottom: 12,
        ...desiredFonts("INSTRUMENTSANS_MEDIUM", "SIZE_14", "BLACK", "500"),
        paddingHorizontal: 12,
        paddingVertical: 20
    },
    modalItemBG: {
        lineHeight: 22,
        marginBottom: 12,
        ...desiredFonts("INSTRUMENTSANS_MEDIUM", "SIZE_14", "BLACK", "500"),
        backgroundColor: '#EFEFEF',
        paddingHorizontal: 12,
        paddingVertical: 20
    },

});
