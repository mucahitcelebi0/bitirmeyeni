import React, { useState } from 'react';
import {
    View, Text, TextInput, Button, StyleSheet,
    ScrollView, Alert, Image, TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AddCarScreen = () => {
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [modelYear, setModelYear] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const selected = result.assets[0];
            console.log('📷 Seçilen görsel URI:', selected.uri);
            setImage(selected);
        }
    };

    const handleSubmit = async () => {
        if (!title || !brand || !modelYear || !price) {
            Alert.alert('Eksik bilgi', 'Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        const formData = new FormData();

        formData.append('title', title);
        formData.append('brand', brand);
        formData.append('modelYear', modelYear);
        formData.append('price', price.replace(',', '.')); // 💡 Virgül noktaya çevrildi
        formData.append('description', description);

        if (image?.uri) {
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
            const response = await fetch('http://192.168.1.30:5000/api/cars', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('✅ Başarılı', 'Araç başarıyla eklendi!');
                setTitle('');
                setBrand('');
                setModelYear('');
                setPrice('');
                setDescription('');
                setImage(null);
            } else {
                Alert.alert('🚫 Hata', data.message || 'Araç eklenemedi.');
            }
        } catch (error) {
            console.error('❌ Sunucu hatası:', error);
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

            <Text style={styles.label}>Fiyat</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={(text) => setPrice(text.replace(/[^0-9.,]/g, ''))} // 💡 sadece sayı/virgül/nokta
                keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <Button title="Araç Ekle" onPress={handleSubmit} />
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
        borderColor: '#ddd',
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
    },
});

export default AddCarScreen;
