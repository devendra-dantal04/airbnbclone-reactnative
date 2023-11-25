import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";




const categories = [
    {
        name: 'Tiny homes',
        icon: 'home',
    },
    {
        name: 'Cabins',
        icon: 'house-siding',
    },
    {
        name: 'Trending',
        icon: 'local-fire-department',
    },
    {
        name: 'Play',
        icon: 'videogame-asset',
    },
    {
        name: 'City',
        icon: 'apartment',
    },
    {
        name: 'Beachfront',
        icon: 'beach-access',
    },
    {
        name: 'Countryside',
        icon: 'nature-people',
    },
];


interface Props {
    onCategoryChange: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChange }: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const itemRef = useRef<Array<TouchableOpacity | null>>([]);
    const [activeState, setActiveState] = useState(0);

    const selectCategory = (index: number) => {
        setActiveState(index);

        const selected = itemRef.current[index];

        selected?.measure((x) => {
            scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true })
        })

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onCategoryChange(categories[index].name);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.actionRow}>
                    <Link href={'/(modals)/booking'} asChild>
                        <TouchableOpacity style={styles.searchBtn}>
                            <Ionicons name="search" size={24} />
                            <View>
                                <Text style={{ fontFamily: 'mon-sb' }}>Where to ?</Text>
                                <Text style={{ fontFamily: 'mon', color: Colors.grey }}>Anywhere · Any week</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                    <TouchableOpacity>
                        <Ionicons size={24} name="options-outline" style={styles.filterBtn} />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    ref={scrollRef}
                    contentContainerStyle={{
                        gap: 15,
                        paddingHorizontal: 16,
                        alignItems: 'center',
                    }}
                >
                    {categories?.map((category, index) => (
                        <TouchableOpacity key={index}
                            ref={(el) => itemRef.current[index] = el}
                            style={activeState === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                            onPress={() => selectCategory(index)}
                        >
                            <MaterialIcons name={category.icon as any} size={24} color={activeState === index ? '#000' : Colors.grey} />
                            <Text style={activeState === index ? styles.categoryActiveText : styles.categoryText}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        height: 150
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 16,
        gap: 10
    },
    filterBtn: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 24
    },
    searchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderColor: '#c2c2c2',
        borderWidth: StyleSheet.hairlineWidth,
        elevation: 2,
        flex: 1,
        padding: 14,
        borderRadius: 30,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 1,
            height: 1
        },
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'mon-sb',
        color: Colors.grey
    },
    categoryActiveText: {
        fontSize: 14,
        fontFamily: 'mon-sb',
        color: '#000'
    },
    categoriesBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
    },
    categoriesBtnActive: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#000',
        borderBottomWidth: 2,
        paddingBottom: 8,
    },
})

export default ExploreHeader;
