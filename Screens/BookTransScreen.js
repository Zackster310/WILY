import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity, TextInput, Image} from 'react-native'
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'

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
                <View style = {{ flex: 1,
                                justifyContent: "center",
                                alignItems: "center"}}
                >

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
                </View>
            )
        }

    }
}