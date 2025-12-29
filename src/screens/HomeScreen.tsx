import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import {
    SafeAreaView,
} from 'react-native-safe-area-context';
import { desiredFonts } from '../utils/theme';
import { useFocusEffect } from '@react-navigation/native';
import { getSessions } from '../utils/sessionStorage';
import { FetalSession } from '../utils/session';

export default function HomeScreen({ navigation }) {
    const renderItem = ({ item }: { item: FetalSession }) => {
        const minutes = Math.ceil(item.durationInSeconds / 60);

        return (
            <View style={styles.recordCard}>
                <Text style={styles.recordDate}>
                    {new Date(item.startedAt).toDateString()}
                </Text>
                <Text style={styles.recordDuration}>
                    {minutes} mins
                </Text>
            </View>
        );
    };

    const [sessions, setSessions] = useState<FetalSession[]>([]);
    useFocusEffect(
        React.useCallback(() => {
            const loadSessions = async () => {
                const data = await getSessions();
                setSessions(
                    data.sort((a, b) => b.startedAt - a.startedAt)
                );
            };
            loadSessions();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.babyIcon}> </Text>
                <Text style={styles.headerTitle}>DFM (Kick counter)</Text>

                <View style={styles.headerRight}>
                    <Image
                        source={require("../assets/images/Badge.png")}
                        style={styles.badgeImage}
                    />

                </View>
            </View>

            {/* Article Card */}
            <View style={styles.articleCard}>
                <Image
                    source={require("../assets/images/Articles.png")}
                    style={styles.articleImage}
                />

            </View>

            {/* CTA Button */}
            <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Counter')}>
                <Text style={styles.ctaText}>Record fetal movement</Text>
            </TouchableOpacity>

            {/* Past Records */}
            <Text style={styles.sectionTitle}>Past records</Text>

            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                        No records yet
                    </Text>
                }
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 16,
    },
    headerTitle: {
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_18", "BLACK", "600"),
        color: '#121212'
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    babyIcon: {
        fontSize: 18,
        marginRight: 4,
    },
    countText: {
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_16", "BLACK", "500"),
    },

    /* Article Card */
    articleCard: {
        marginTop: 16,
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
    },
    articleImage: {
        width: '100%',
        height: '100%',
    },
    badgeImage: {
        width: 62,
        height: 36,
    },
    articleOverlay: {
        position: 'absolute',
        bottom: 12,
        left: 12,
    },
    articleTag: {
        fontSize: 12,
        color: '#FFFFFF',
        marginBottom: 4,
        opacity: 0.9,
    },

    /* CTA */
    ctaButton: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 48,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 32,
    },
    ctaText: {
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_16", "BLACK", "500"),
    },

    /* Section */
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },

    /* Record Card */
    recordCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EEE',
        marginBottom: 10,
    },
    recordDate: {
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_14", "BLACK", "500"),
        color: '#333',
    },
    recordDuration: {
        ...desiredFonts("INSTRUMENTSANS_BOLD", "SIZE_14", "BLACK", "500"),
        color: '#333',

    },
});
