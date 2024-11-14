import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const ManHinhChao = (props) => {
  useEffect(() => {
    const Time = setTimeout(() => {
      props.navigation.replace('DangNhap')
    }, 3000);
    return () => {
      clearTimeout(Time)
    }
  }, [])
  
  return (
    <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'white',flex:1}}>
        <Image source={require('../Asset/logo3.jpg')} style={{flex:1,resizeMode:'contain'}}></Image>
    </View>
  )
}

export default ManHinhChao


const styles = StyleSheet.create({
})