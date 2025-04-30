import React, { useState } from 'react';
import {
    View, Text, TextInput, Button, StyleSheet,
    ScrollView, Alert, Image, TouchableOpacity, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const EditCarScreen = ({ route, navigation }) => {
    const { car } = route.params;

    const [title, setTitle] = useState(car.title || '');
    const [brand, setBrand] = useState(car.brand || '');
    const [modelYear, setModelYear] = useState(car.modelYear?.toString() || '');
    const [price, setPrice] = useState(car.price?.toString() || '');
    const [description, setDescription] = useState(car.description || '');
    const [image, setImage] = useState({
        uri: car.image ? `http://192.168.1.30:5000/${car.image.replace(/\\/g, '/')}` : null
    });
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selected = result.assets[0];
            setImage({ uri: selected.uri });
        }
    };

    const handleUpdate = async () => {
        if (!title || !brand || !modelYear || !price) {
            Alert.alert('Eksik bilgi', 'Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('brand', brand);
        formData.append('modelYear', parseInt(modelYear));
        formData.append('price', parseFloat(price.replace(',', '.')));
        formData.append('description', description);

        if (image?.uri && image.uri.startsWith('file://')) {
            const filename = image.uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename ?? '');
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', {
                uri: image.uri,
                name: filename,
                type,
            });
        }

        try {
            setLoading(true);
            const res = await fetch(`http://192.168.1.30:5000/api/cars/${car._id}`, {
                method: 'PUT',
                body: formData,
            });

            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                Alert.alert('✅ Başarılı', 'Araç güncellendi');
                navigation.goBack();
            } else {
                Alert.alert('❌ Hata', data.message || 'Güncelleme başarısız');
            }
        } catch (err) {
            setLoading(false);
            console.error('❌ Hata:', err);
            Alert.alert('Sunucu Hatası', 'Bağlantı kurulamadı.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Text style={styles.label}>Görsel Seç (Opsiyonel)</Text>
                {image?.uri && (
                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                )}
            </TouchableOpacity>

            <Text style={styles.label}>Araç Başlığı</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Marka</Text>
            <TextInput style={styles.input} value={brand} onChangeText={setBrand} />

            <Text style={styles.label}>Model Yılı</Text>
            <TextInput
                style={styles.input}
                value={modelYear}
                onChangeText={setModelYear}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Fiyat (₺)</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={(val) => setPrice(val.replace(/[^0-9.,]/g, ''))}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={description}
                onChangeText={setDescription}
                multiline
            />

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : (
                <Button title="Güncelle" onPress={handleUpdate} />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 100,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginTop: 5,
    },
    imagePicker: {
        marginBottom: 10,
    },
    imagePreview: {
        width: '100%',
        height: 180,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: '#eee',
    },
});

export default EditCarScreen;
