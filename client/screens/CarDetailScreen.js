import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Button,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CarDetailScreen = ({ route }) => {
    const { car } = route.params;
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(car.isFavorite || false);

    const getImageUri = () => {
        if (!car.image) return null;
        return `http://192.168.1.30:5000/${car.image.replace(/\\/g, '/')}`;
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://192.168.1.30:5000/api/cars/${car._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                Alert.alert('✅ Silindi', 'Araç başarıyla silindi');
                navigation.goBack();
            } else {
                Alert.alert('❌ Hata', data.message || 'Silinemedi');
            }
        } catch (err) {
            Alert.alert('🚨 Hata', 'Sunucuya ulaşılamadı');
        }
    };

    const handleToggleFavorite = async () => {
        try {
            const res = await fetch(`http://192.168.1.30:5000/api/cars/${car._id}/favorite`, {
                method: 'PUT',
            });
            const data = await res.json();
            if (res.ok) {
                setIsFavorite(data.car.isFavorite);
                Alert.alert('⭐ Güncellendi', `Favori durumu: ${data.car.isFavorite ? 'Eklendi' : 'Kaldırıldı'}`);
            } else {
                Alert.alert('❌ Hata', data.message || 'Favori durumu değiştirilemedi');
            }
        } catch (err) {
            Alert.alert('🚨 Hata', 'Sunucuya ulaşılamadı');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {car.image ? (
                <Image
                    source={{ uri: getImageUri() }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>Resim Yok</Text>
                </View>
            )}

            <Text style={styles.title}>{car.title}</Text>
            <Text style={styles.sub}>{car.brand} - {car.modelYear}</Text>
            <Text style={styles.price}>{car.price} ₺</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Açıklama:</Text>
                <Text style={styles.text}>{car.description || 'Açıklama girilmedi.'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Yakıt Türü:</Text>
                <Text style={styles.text}>{car.fuelType || 'Bilinmiyor'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Şanzıman:</Text>
                <Text style={styles.text}>{car.transmission || 'Bilinmiyor'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Kilometre:</Text>
                <Text style={styles.text}>{car.mileage || 0} km</Text>
            </View>

            <View style={styles.favoriteContainer}>
                <Icon
                    name="star"
                    size={30}
                    color={isFavorite ? '#FF9500' : '#ccc'}
                    onPress={handleToggleFavorite}
                />
            </View>

            <View style={{ marginTop: 20 }}>
                <Button title="Aracı Sil" color="red" onPress={handleDelete} />

                <View style={{ marginTop: 10 }}>
                    <Button
                        title="Aracı Düzenle"
                        color="#007AFF"
                        onPress={() => navigation.navigate('EditCar', { car })}
                    />
                </View>

                <View style={{ marginTop: 10 }}>
                    <Button
                        title={isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
                        color={isFavorite ? "#FF9500" : "#34C759"}
                        onPress={handleToggleFavorite}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 100,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#eee',
    },
    noImageContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: 10,
        marginBottom: 20,
    },
    noImageText: {
        color: '#999',
        fontSize: 14,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sub: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    price: {
        fontSize: 20,
        color: 'green',
        fontWeight: '600',
        marginBottom: 15,
    },
    section: {
        marginBottom: 15,
    },
    label: {
        fontWeight: '600',
        marginBottom: 3,
    },
    text: {
        fontSize: 15,
    },
    favoriteContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
});

export default CarDetailScreen;
