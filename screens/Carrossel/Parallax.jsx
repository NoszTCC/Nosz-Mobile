import { useState } from "react";
import { View, Dimensions, StyleSheet, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, { useSharedValue } from "react-native-reanimated";

const PAGE_WIDTH = Dimensions.get('window').width;

const list = [
    { id: '1', img: require('./carrossel1.jpg') },
    { id: '2', img: require('./carrossel2.jpg') },
    { id: '3', img: require('./carrossel3.jpg') },
];

function Parallax() {
    const [autoPlay, setAutoPlay] = useState(true);
    const progressValue = useSharedValue(0);

    return (
        <View style={{ flex: 0.45, marginTop: 10, alignItems: "center"}}>
            <Carousel
                width={PAGE_WIDTH * 1} 
                height={PAGE_WIDTH * 0.5} 
                loop
                pagingEnabled={true}
                snapEnabled={true}
                autoPlay={autoPlay}
                autoPlayInterval={2300}
                onProgressChange={(_, absoluteProgress) => (progressValue.value = absoluteProgress)}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 80,
                }}
                data={list}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                    <View style={[styles.CarouselItem, { backgroundColor: item?.color }]}>
                        <Image style={styles.img} source={item.img} />
                    </View>
                )}
            />
        </View>
    );
}

export default Parallax;

const styles = StyleSheet.create({
    CarouselItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 20,
        marginHorizontal: 30,
    },
    img: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    }
});
