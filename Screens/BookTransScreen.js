import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity, TextInput, Image, Alert, ToastAndroid, KeyboardAvoidingView} from 'react-native'
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import db from '../config'
import firebase from 'firebase'

export default class BookTransScreen extends React.Component{

    constructor(){
        super()
        this.state = {
            hasCamPerms: null,
            scanned: false,
            scannedData: '',
            buttonState: 'normal',
            scannedBook: '',
            scannedStudent: '',
            transactionMessage: ''
        }
    }

    getCamPerms = async(ID) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({hasCamPerms:status === "granted",
                        buttonState: ID,
                        scanned: false
        })
    }

    handleBarCodeScanned = async({type, data}) => {
        var buttonState = this.state.buttonState
        if(buttonState === "BookID"){
            this.setState({scanned: true,
                scannedBook: data,
                buttonState: 'normal'
            })
        } 
        else if(buttonState === "StudentID"){
            this.setState({scanned: true,
                scannedStudent: data,
                buttonState: 'normal'
            })
        }  
        console.log(this.state.scannedBook + "Book")     
        console.log(this.state.scannedStudent + "Student")      
    }

    initiateBookIssue = async() => {
        db.collection("transaction").add({
            'StudentID': this.state.scannedStudent,
            'BookID': this.state.scannedBook,
            'Date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': "Issue"
        })
        db.collection("Books").doc(this.state.scannedBook).update({
            'bookAvailability': false
        })
        db.collection("Students").doc(this.state.scannedStudent).update({
            'numberOfBooksIssued': firebase.firestore.FieldValue.increment(1)
        })
        Alert.alert("Book Issued")
        ToastAndroid.show("Book Issued", ToastAndroid.SHORT)
    }

    initiateBookReturn = async() => {
        db.collection("transaction").add({
            'StudentID': this.state.scannedStudent,
            'BookID': this.state.scannedBook,
            'Date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': "Return"
        })
        db.collection("Books").doc(this.state.scannedBook).update({
            'bookAvailability': true
        })
        db.collection("Students").doc(this.state.scannedStudent).update({
            'numberOfBooksIssued': firebase.firestore.FieldValue.increment(-1)
        })
        Alert.alert("Book Returned")
        ToastAndroid.show("Book Returned", ToastAndroid.SHORT)
    }

    handleTransaction = async() => {
        var transactionMessage = null
        db.collection("Books").doc(this.state.scannedBook).get()
        .then((doc) => {
            var book = doc.data()
            if (book.bookAvailability){
                this.initiateBookIssue()
                transactionMessage = "Book Issued"
            }
            else{
                this.initiateBookReturn()
                transactionMessage = "Book Returned"
            }
        })

        this.setState({
            transactionMessage: transactionMessage,
            scannedBook: '',
            scannedStudent: '',
        })
    }

    render(){   
        
        const hasCamPerms = this.state.hasCamPerms;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState
        
        if(buttonState != "normal" && hasCamPerms){
            return(
                <BarCodeScanner onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScanned}
                                style = {StyleSheet.absoluteFillObject} 
                />
            )
        }
        else if(buttonState === "normal"){
            return(
                <KeyboardAvoidingView style = {{ flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center"}}
                                      behavior = "padding" enabled
                >
                    <View>
                        <View>
                            <Image  source = {require("../assets/booklogo.jpg")}
                                    style = {{width: 100, height: 100, marginLeft: 10}}
                            />
                            <Text style = {{fontSize: 65,
                                            fontWeight: 'bold'}}>
                                Wily
                            </Text>
                        </View>

                        <View style = {{flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: 20,}}
                        >
                            <TextInput style = {{width: 150, height: 50, borderWidth: 3, fontSize: 20}}
                                        placeholder = "Book ID"
                                        onChangeText = {text => {this.setState({scannedBook: text})}}
                                        value = {this.state.scannedBook}/>

                            <TouchableOpacity style = {{width: 100,
                                                        height: 30,
                                                        backgroundColor: "red",
                                                        borderWidth: 3,
                                                        margin: 5}}
                                                onPress = {() => {this.getCamPerms("BookID")}}
                            >
                                <Text> Scan </Text>
                            </TouchableOpacity>
                        </View>

                        <View style = {{flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: 20,}}
                        >
                            <TextInput style = {{width: 150, height: 50, borderWidth: 3, fontSize: 20}}
                                        placeholder = "Student ID"
                                        onChangeText = {text => {this.setState({scannedStudent: text})}}
                                        value = {this.state.scannedStudent}/>

                            <TouchableOpacity style = {{width: 100,
                                                        height: 30,
                                                        backgroundColor: "green",
                                                        borderWidth: 3,
                                                        margin: 5}}
                                                onPress = {() => {this.getCamPerms("StudentID")}}
                            >
                                <Text> Scan </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style = {{margin: 50,
                                                        backgroundColor: "blue",
                                                        width: 150,
                                                        height: 40,}}
                                              onPress = {() => {this.handleTransaction()}}
                            >
                                <Text style = {{fontSize: 20,
                                                textAlign: "center",
                                                color: "yellow",}}
                                > 
                                    Submit 
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            )
        }

    }
}