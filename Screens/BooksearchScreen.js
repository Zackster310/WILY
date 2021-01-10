import React from 'react'
import {View,Text,Stylesheet,TouchableOpacity,FlatList, Image} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import db from '../config'
import firebase from 'firebase'

export default class BookSearchScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            allTransactions: [],
            lastVisibleTransaction: null,
            search: ''
        }
    }

    searchTransactions = async(text) => {
        var enteredText = text.split("")
        if(enteredText[0].toUpperCase() === 'B'){
            const transaction = await db.collection("transaction").where('BookID', '==', text).get()
            transaction.docs.map((doc) => {this.setState({allTransactions: [...this.state.allTransactions, doc.data()], 
                                                          lastVisibleTransaction: doc})})
        }
        else if(enteredText[0].toUpperCase() === 'S'){
            const transaction = await db.collection("transaction").where('StudentID', '==', text).get()
            transaction.docs.map((doc) => {this.setState({allTransactions: [...this.state.allTransactions, doc.data()], 
                                                          lastVisibleTransaction: doc})})
        }
    }

    fetchMoreTransactions = async() => {
        var text = this.state.search.toUpperCase()
        var enteredText = text.split("")
        if(enteredText[0].toUpperCase() === 'B'){
            const transaction = await db.collection("transaction").where('BookID', '==', text).startAfter(this.state.lastVisibleTransaction).get()
            transaction.docs.map((doc) => {this.setState({allTransactions: [...this.state.allTransactions, doc.data()], 
                                                          lastVisibleTransaction: doc})})
        }
        else if(enteredText[0].toUpperCase() === 'S'){
            const transaction = await db.collection("transaction").where('StudentID', '==', text).startAfter(this.state.lastVisibleTransaction).get()
            transaction.docs.map((doc) => {this.setState({allTransactions: [...this.state.allTransactions, doc.data()], 
                                                          lastVisibleTransaction: doc})})
        }
    }

    render(){
        return(
            <View>
                <View style = {{justifyContent: "center", alignItems: "center"}}>
                    <Image  source = {require("../assets/booklogo.jpg")}
                            style = {{width: 100, height: 100, marginLeft: 10}}
                    />
                    <Text style = {{fontSize: 65,
                                    fontWeight: 'bold'}}>
                        Wily
                    </Text>
                </View>
                <View style = {{marginTop: 50, alignItems: "center"}}>
                    <Text>Book Search Screen</Text>

                    <TextInput style = {{width: 150, height: 50, borderWidth: 3, fontSize: 20}}
                               placeholder = "Enter Book ID or Student ID"
                               onChangeText = {text => {this.setState({search: text})}}
                    />

                    <TouchableOpacity style = {{width: 100, height: 25, borderRadius: 20, backgroundColor: "red", alignItems: "center"}}
                                      onPress = {() => {this.searchTransactions(this.state.search)}}
                    >
                        <Text> Search </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <FlatList data = {this.state.allTransactions}
                              renderItem = {({item}) => (
                                    <View style = {{borderBottomWidth: 2}}>
                                        <Text> {"Book ID:" + item.BookID} </Text>
                                        <Text> {"Student ID:" + item.StudentID} </Text>
                                        <Text> {"Transaction Type:" + item.transactionType} </Text>
                                        <Text> {"Date:" + item.Date.toDate()} </Text>
                                    </View>
                              )}
                              keyExtractor = {(item, index) => index.toString()}
                              onEndReached = {this.fetchMoreTransactions}
                              onEndReachedThreshold = {0.7}
                    />
                </View>
            </View>
        )
    }
}