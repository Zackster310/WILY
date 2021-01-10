import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity, TextInput, Image, Alert, ToastAndroid, KeyboardAvoidingView, TouchableNativeFeedbackBase} from 'react-native'
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import db from '../config'
import firebase from 'firebase'

export default class LoginScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    Login = async(email, password) => {
        if(email && password){
            try{
                const response = await firebase.auth().signInWithEmailAndPassword(email, password)

                if(response){
                    this.props.navigation.navigate('Transaction')
                }
            }
            catch(error){
                switch(error.code){
                    case 'auth/user-not-found':
                        Alert.alert("User Not Found")
                    break

                    case 'auth/invalid-email':
                        Alert.alert("Email Not Registered")
                    break
                }
            }
        }
        else{
            Alert.alert("Please Enter Email And Password")
        }
    }

    render(){
        return(
            <KeyboardAvoidingView style = {{alignItems: "center", marginTop: 100}}>
                <View>
                    <Image  source = {require("../assets/booklogo.jpg")}
                            style = {{width: 100, height: 100, marginLeft: 10}}
                    />
                    <Text style = {{fontSize: 65,
                                    fontWeight: 'bold'}}>
                        Wily
                    </Text>
                </View>
                <View>
                    <TextInput style = {{width: 200, height: 40, borderWidth: 3}}
                               placeholder = "abc@example.com" 
                               keyboardType = 'email-address'
                               onChangeText = {text => {this.setState({email: text})}}
                    />

                    <TextInput style = {{width: 200, height: 40, borderWidth: 3}}
                               placeholder = "******" 
                               secureTextEntry = {true}
                               onChangeText = {text => {this.setState({password: text})}}
                    />

                    <TouchableOpacity style = {{height: 30, width: 125, borderRadius: 10, backgroundColor: "green",
                                                marginTop: 20, alignItems: "center", marginLeft: 30}}
                                      onPress = {() => this.Login(this.state.email, this.state.password)}
                    >
                        <Text> Login </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}