import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator,
    TouchableOpacity, Image, TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const getImageUri = (imagePath) => {
    if (!imagePath) return null;
    const normalized = imagePath.replace(/\\/g, '/');
    return normalized.startsWith('uploads/')
        ? `http://192.168.1.30:5000/${normalized}`
        : `http://192.168.1.30:5000/uploads/${normalized}`;
};

const HomeScreen = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const fetchCars = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://192.168.1.30:5000/api/cars?page=1&limit=10');
            const data = await res.json();
            if (Array.isArray(data)) {
                const uniqueCars = Array.from(new Map(data.map(car => [car._id, car])).values());
                setCars(uniqueCars);
                setFilteredCars(uniqueCars);
            }
        } catch (err) {
            console.error('Araçlar getirilemedi:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCars(); }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchCars);
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        let results = [...cars];
        if (searchQuery) {
            results = results.filter(car =>
                car.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.modelYear?.toString().includes(searchQuery)
            );
        }

        if (sortOption === 'year') {
            results.sort((a, b) => b.modelYear - a.modelYear);
        } else if (sortOption === 'priceAsc') {
            results.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'priceDesc') {
            results.sort((a, b) => b.price - a.price);
        }

        setFilteredCars(results);
    }, [searchQuery, sortOption, cars]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('CarDetail', { car: item })}
            style={styles.cardWrapper}
        >
            <View style={styles.card}>
                {item.image ? (
                    <Image
                        source={{ uri: getImageUri(item.image) }}
                        style={styles.cardImage}
                    />
                ) : (
                    <View style={styles.noImageContainer}>
                        <Text style={styles.noImageText}>Resim Yok</Text>
                    </View>
                )}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.sub}>{item.brand} - {item.modelYear}</Text>
                <Text style={styles.price}>{item.price} ₺</Text>
                {item.isFavorite && <Text style={styles.favorite}>⭐</Text>}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Yükleniyor...</Text>
            </View>
        );
    }

    if (!loading && filteredCars.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>Hiç araç bulunamadı.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                style={styles.searchInput}
                placeholder="Araç ara (marka, model, yıl...)"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.filterRow}>
                <TouchableOpacity onPress={() => setSortOption('year')}>
                    <Text style={styles.filterButton}>📅 Yıla Göre</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSortOption('priceAsc')}>
                    <Text style={styles.filterButton}>💸 Fiyat Artan</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSortOption('priceDesc')}>
                    <Text style={styles.filterButton}>💰 Fiyat Azalan</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredCars}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate('AddCar')}
                style={styles.addButton}
            >
                <Text style={styles.addButtonText}>+ Araç Ekle</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('FavoriteCars')}
                style={styles.favoriteButton}
            >
                <Text style={styles.favoriteButtonText}>Favoriler</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    list: { padding: 20, paddingBottom: 100 },
    cardWrapper: { marginBottom: 15 },
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
    noImageContainer: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: 10,
    },
    noImageText: { color: '#888', fontSize: 14 },
    title: { fontSize: 18, fontWeight: 'bold' },
    sub: { marginTop: 4, fontSize: 14, color: '#555' },
    price: { marginTop: 8, fontSize: 16, fontWeight: '600', color: 'green' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        margin: 20,
        marginBottom: 0,
        backgroundColor: '#fff',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    filterButton: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 10,
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 20,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    favoriteButton: {
        backgroundColor: '#FF9500',
        padding: 15,
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    favoriteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    favorite: { fontSize: 18, color: '#FF9500' },
});

export default HomeScreen;
