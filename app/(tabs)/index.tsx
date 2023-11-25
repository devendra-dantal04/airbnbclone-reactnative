import { View, Text } from "react-native";
import React, { useMemo, useState } from "react";
import { Link, Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import Listings from "@/components/Listings";
import listingsData from "@/assests/data/airbnb-listings.json"

const index = () => {
    const [category, setCategory] = useState('Tiny homes')
    const items = useMemo(() => listingsData as any, [])

    const onDataChange = (category: string) => {
        // console.log("Working...", category)
        setCategory(category)
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{
                header: () => (
                    <ExploreHeader onCategoryChange={onDataChange} />
                )
            }} />
            <Listings listings={items} category={category} />
        </View>
    );
};

export default index;
