import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen.js';  // .js ekledik
import AddCarScreen from '../screens/AddCarScreen.js';  // .js ekledik
import CarDetailScreen from '../screens/CarDetailScreen.js';  // .js ekledik
import EditCarScreen from '../screens/EditCarScreen.js';  // .js ekledik
import FavoriteCarsScreen from '../screens/FavoriteCarsScreen.js'; // .js ekledik
import SignUpScreen from '../screens/SignUpScreen.js'; // .js ekledik
import LoginScreen from '../screens/LoginScreen.js';  // .js ekledik

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Araçlar' }}
                />
                <Stack.Screen
                    name="AddCar"
                    component={AddCarScreen}
                    options={{ title: 'Araç Ekle' }}
                />
                <Stack.Screen
                    name="CarDetail"
                    component={CarDetailScreen}
                    options={{ title: 'Araç Detayı' }}
                />
                <Stack.Screen
                    name="EditCar"
                    component={EditCarScreen}
                    options={{ title: 'Aracı Güncelle' }}
                />
                <Stack.Screen
                    name="FavoriteCars"
                    component={FavoriteCarsScreen} // Favori ekranı burada
                    options={{ title: 'Favori Araçlar' }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen} // SignUp ekranı burada
                    options={{ title: 'Kayıt Ol' }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Giriş Yap' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MainNavigator;
