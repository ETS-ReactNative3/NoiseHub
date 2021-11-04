import React from 'react';
import { View, StyleSheet } from 'react-native';

const PageIndicator = (props) => {

    let indicators = [];

    for (let i = 1; i <= props.totalPages; i++){
        if (i == props.currentPage){
            indicators.push(
                <View key ={i} style = {styles.circle2}></View>
            )
        }
        else{
            indicators.push(
                <View key ={i} style = {styles.circle}></View>
            )
        }
        
    }

    return(
        <View style={styles.circleContainer}>
            { indicators }
        </View>
    );
};

const styles = StyleSheet.create({
    circle:{
        width: 8,
        height: 8,
        borderRadius: 500,
        backgroundColor: '#dfe2e8',
        margin: 5,
    },
    circle2:{
        width: 8,
        height: 8,
        borderRadius: 500,
        backgroundColor: '#30339e',
        margin: 5,
    },
    circleContainer:{
        flexDirection: 'row',
        marginTop: 30
    }
});

export default PageIndicator;