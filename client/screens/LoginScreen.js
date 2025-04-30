import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert('Eksik bilgi', 'Lütfen tüm alanları doldurun');
        }

        try {
            const response = await fetch('http://192.168.1.30:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Başarılı', 'Giriş başarılı');
                // Token'ı kaydedebiliriz, örneğin AsyncStorage'a
                // await AsyncStorage.setItem('token', data.token);
                navigation.navigate('Home'); // Ana ekrana yönlendir
            } else {
                Alert.alert('Hata', data.message || 'Giriş başarısız');
            }
        } catch (error) {
            Alert.alert('Hata', 'Bir şeyler yanlış gitti');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giriş Yap</Text>
            <TextInput
                style={styles.input}
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Giriş Yap" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
});

export default LoginScreen;
