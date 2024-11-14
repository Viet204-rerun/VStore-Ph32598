import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HOST } from './config';

const LichSu = (props) => {
  const [dsDatHang, setDsDatHang] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getDs= async()=>{
    try {
      const response = await fetch(`${HOST}/dathang`);
      const json = await response.json();
      setDsDatHang(json);
    } catch (error) {
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  }
  const confirmBack =()=>{
      Alert.alert(
        'Bạn Ơi!',
        'Bạn Có Chắc Trở Về Màn Hình Trang Chủ Không?',
        [
          {text:'Không',style:'cancel'},
          {text:'Có',onPress:()=>props.navigation.navigate('Home')}
        ]
      )
  }
  const renderItem =({item})=>{
    return(
    <View >
        <Text style={styles.txt}>{item.thoigian}</Text>
        <View style={{backgroundColor:'#E13E46',height:2,width:"100%",marginBottom:15}}></View>
        <View style={styles.khung}>
          <Image source={{uri:item.anh}} style={{ width: 90, height: 90,marginTop:5 }} />
          <View style={{flexDirection:'column',marginLeft:10}}>
            <Text style={styles.txt1}>Đặt Hàng Thành Công</Text>
            <Text style={styles.txt2}>{item.ten}</Text>
            <Text style={styles.txt3}>{item.soluong} Sản Phẩm</Text>
         
          </View>
</View>
    </View>
    )
  }
  React.useEffect(()=>{
    const unb = props.navigation.addListener('focus',()=>{
      getDs();
    })
    return unb;
  },[props.navigation])
  

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#4D9BDC',padding:10}}>
            {isLoading?
        <ActivityIndicator></ActivityIndicator>:
        <FlatList
        data={dsDatHang}
        renderItem={renderItem}
        keyExtractor={item=>item.id}
        ></FlatList>
}
<TouchableOpacity style={styles.btn2}onPress={confirmBack}>
            <Text style={styles.txt7}>Trở Về Màn Hình Trang Chủ</Text>
          </TouchableOpacity>

    </SafeAreaView>
  )
}

export default LichSu

const styles = StyleSheet.create({
  txt:{color:'#E13E46',fontSize:25,width:'auto',height:30,backgroundColor:'#61EE51',marginTop:5},
  khung: { width: 390, height: 120, backgroundColor: '#F3F3F1', borderWidth: 2, borderColor: '#FFF75A', borderRadius: 10, paddingLeft: 10, flexDirection: 'row', paddingTop: 10 ,paddingRight:10,},
  txt1:{color:'#61EE51',fontSize:21,},
  txt2:{color:'#4D9BDC',fontSize:18},
  txt3:{color:'#E13E46',fontSize:15,position:'absolute',bottom:10},
  btn2:{width:'100%',height:50,backgroundColor:'#FFF75A',marginTop:20,borderRadius:20,borderColor:'white',borderWidth:3,justifyContent:'center',alignItems:'center'},
  txt7:{color:'#4D9BDC',fontSize:25,fontWeight:'bold'}

})