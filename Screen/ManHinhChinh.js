import { ActivityIndicator, Animated, FlatList, Image, PanResponder, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import { HOST } from './config';

const ManHinhChinh = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [dssp, setDssp] = useState([]);
    const [dsspSale, setDsspSale] = useState([]);
    
    const getSP =async()=>{
      try {
        const response = await fetch(`${HOST}/sanpham`);
        const json = await response.json();
        setDssp(json)
      } catch (error) {
        console.log(error);
      } finally{
        setIsLoading(false)
      }
    }
    const getSPSale =async()=>{
      try {
        const response = await fetch(`${HOST}/sanphamsale`);
        const json = await response.json();
        setDsspSale(json)
      } catch (error) {
        console.log(error);
      } finally{
        setIsLoading(false)
      }
    }
    const [loggedIn, setLoggedIn] = useState(false); // Thêm biến state để kiểm tra trạng thái đăng nhập
    const [userInfo, setUserInfo] = useState(null);

   const chiTiet=({item})=>{

   
        const userId = props?.route?.params && props?.route?.params?.userId;

            fetch(`${HOST}/nguoidung/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setUserInfo(data);
                })
                .catch(error => console.error('Error fetching user info:', error));

                {props.navigation.navigate('ChiTiet',{item:item,user:userInfo})}
    }
    const renderItem = ({item}) =>{
        return(
          <TouchableOpacity onPress={()=>chiTiet({item})} >
          <View style={{flexDirection:'row'}}>
       
        <View style={styles.khung1}>
          <Image source={{uri:item.anh}} style={styles.img2}></Image>
          <Text style={styles.txt3}>{item.ten}</Text>
          <Text style={styles.txt6}>{item.mota}</Text>
          <Text style={styles.txt4}>{item.gia}₫</Text>
          </View>
    
          </View>
           </TouchableOpacity>
        )
    }
    const renderItemSale = ({item}) =>{
      return(
        <TouchableOpacity onPress={()=>chiTiet({item})}>
        <View style={{flexDirection:'row'}}>
     
      <View style={styles.khung2}>
        <Image source={{uri:item.anh}} style={styles.img2}></Image>
        <Text style={styles.txt9}>{item.ten}</Text>
        <Text style={styles.txt10}>{item.mota}</Text>
        <View style={{flexDirection:'row',position:'absolute',bottom:25}}>
        <Text style={styles.txt7}> {item.giasale}</Text>
<Text style={styles.txt8}>   {item.giasale2}</Text>
</View>

        <Text style={styles.txt11}>{item.gia}₫</Text>


        </View>
  
        </View>
         </TouchableOpacity>
      )
  }
    React.useEffect(()=>{
      const unb = props.navigation.addListener('focus',()=>{
        getSP();
        getSPSale();
    })
      return unb;
      },[props.navigation])
      const [expanded, setExpanded] = useState(true);
  
  
      const [animation] = useState(new Animated.Value(200)); // chiều cao ban đầu của header
    
      const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
          const { dy } = gestureState;
          if (dy > 0 && !expanded) {
            Animated.spring(animation, {
              toValue: 200,
              useNativeDriver: false,
            }).start();
            setExpanded(true);
          } else if (dy < 0 && expanded) {
            Animated.spring(animation, {
              toValue: 100,
              useNativeDriver: false,
            }).start();
            setExpanded(false);
          }
        },
      });

      
  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView >
    <View style={{flex:1}} {...panResponder.panHandlers}>
      <Animated.View style={[styles.header, { height: animation }]}>
        {expanded && (
          <>
               <Image source={require('../Asset/logo3.jpg')} style={styles.img} resizeMode='repeat'></Image>
      <View style={{position:'absolute',top:20,left:20,right:0}}>
        <TouchableOpacity onPress={()=>props.navigation.navigate('GioHang')}>
      <Image source={require('../Asset/giohang.png')} style={{width:70,height:70,position:'absolute',top:120,right:0}}></Image>
      </TouchableOpacity>
      <Text style={styles.txt1}>Sale Cực Căng Săn Liền Kẻo Lỡ</Text>
      </View>
          </>
        )}
        <Image source={require('../Asset/logo3.jpg')} style={styles.img1} resizeMode='repeat'></Image>
      <View >
<View style={{backgroundColor:"#61EE51",height:40,width:'100%',justifyContent:'center',alignItems:'center'}}>
<Animatable.Text
            animation="flipInX"
            iterationCount="infinite"
            style={styles.txt12}
            direction="alternate"
          >
            Sale Cực Căng Săn Liền Kẻo Lỡ
          </Animatable.Text>
      </View>
      </View>
      </Animated.View>
    <View style={{flex:1,backgroundColor:'#4D9BDC'}}>


         
  <View style={{margin:20}}>
        <Text style={styles.txt5}>Điện Thoại</Text>
      {isLoading?
        <ActivityIndicator></ActivityIndicator>:
      <FlatList
        data={dssp}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
      />
}
</View>
<View style={{marginLeft:20,marginBottom:20}}>
        <Text style={styles.txt5}>Giá Cực Sốc</Text>
      {isLoading?
        <ActivityIndicator></ActivityIndicator>:
      <FlatList
        data={dsspSale}
        renderItem={renderItemSale}
        keyExtractor={item => item.id}
        horizontal={true}
      />
}
</View>

</View>
    </View>
    </ScrollView>
    </SafeAreaView>
  )

}

export default ManHinhChinh

const styles = StyleSheet.create({
    img:{width:412,height:200},
    img1:{width:412,height:60},

    txt:{color:'#E13E46',fontSize:25,width:250,fontWeight:'bold'},
    txt1:{color:'#61EE51',fontWeight:'bold',fontSize:20,marginTop:125},
    txt5:{color:'#FFF75A',fontWeight:'bold',fontSize:20,marginTop:15,marginBottom:10},
    khung:{backgroundColor:'#FFF75A',flex:1},
    img2:{width:130,height:160},
    khung1:{width:170,height:260,backgroundColor:'#F3F3F1',padding:8,borderWidth:2,borderColor:'#FFF75A',borderRadius:10,alignItems:'center',marginRight:30},
    khung2:{width:170,height:280,backgroundColor:'#F3F3F1',padding:8,borderWidth:2,borderColor:'#FFF75A',borderRadius:10,alignItems:'center',marginRight:30},

    txt3:{color:'#4D9BDC',fontWeight:'bold',fontSize:17,marginTop:5,justifyContent:'center',position:'absolute',bottom:40},
    txt4:{color:'#E13E46',fontWeight:'bold',fontSize:15,position:'absolute',bottom:5},
    txt6:{color:'#E48954',fontWeight:'bold',fontSize:13,position:'absolute',bottom:25},
    txt7:{color:'#61EE51',fontSize:12,textDecorationLine: 'line-through',marginTop:3},
    txt8:{color:'#E13E46',fontWeight:'bold',fontSize:15,},
    txt9:{color:'#4D9BDC',fontWeight:'bold',fontSize:17,marginTop:5,justifyContent:'center',position:'absolute',bottom:60},
    txt10:{color:'#E48954',fontWeight:'bold',fontSize:13,position:'absolute',bottom:45},
    txt11:{color:'#E13E46',fontWeight:'bold',fontSize:15,position:'absolute',bottom:5},
    txt12:{color:'#4D9BDC',fontWeight:'bold',fontSize:20},


    


})