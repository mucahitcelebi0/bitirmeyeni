import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FavoriteCarsScreen = () => {
    const [favoriteCars, setFavoriteCars] = useState([]);
    const navigation = useNavigation();

    const fetchFavoriteCars = async () => {
        try {
            const response = await fetch('http://192.168.1.30:5000/api/cars');
            const data = await response.json();
            // Favori olan araçları filtrele
            const filtered = data.filter(car => car.isFavorite);
            setFavoriteCars(filtered);
        } catch (error) {
            console.error('Favoriler alınamadı:', error);
        }
    };

    useEffect(() => {
        fetchFavoriteCars();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('CarDetail', { car: item })}
            style={styles.cardWrapper}
        >
            <View style={styles.card}>
                {item.image && (
                    <Image
                        source={{ uri: `data:image/png;base64,${item.image}` }}
                        style={styles.cardImage}
                    />
                )}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.sub}>{item.brand} - {item.modelYear}</Text>
                <Text style={styles.price}>{item.price} ₺</Text>
            </View>
        </TouchableOpacity>
    );

    if (favoriteCars.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>Favori araç bulunamadı.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={favoriteCars}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        padding: 20,
    },
    cardWrapper: {
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sub: {
        marginTop: 4,
        fontSize: 14,
        color: '#555',
    },
    price: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
        color: 'green',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FavoriteCarsScreen;
