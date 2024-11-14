import { Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { HOST } from './config';

const CaNhan = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false); // Thêm biến state để kiểm tra trạng thái đăng nhập

    useEffect(() => {
        const userId = props?.route?.params && props?.route?.params?.userId;

        if (!loggedIn) { // Chỉ gọi fetch khi chưa đăng xuất
            fetch(`${HOST}/nguoidung/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setUserInfo(data);
                })
                .catch(error => console.error('Error fetching user info:', error));
        }
    }, [loggedIn, props?.route?.params]);

    useEffect(() => {
        if (loggedIn) {
            props.navigation.navigate('DangNhap')
        }
    }, [loggedIn, props.navigation]);

    async function onSignOut() {
        try {
            // await GoogleSignin.signOut();
            setLoggedIn(true);
        } catch (error) {
            console.error(error);
        }
    }

    if (!userInfo) {
        return <Text>Loading...</Text>;
    }
  return (
    <SafeAreaView style={{flex:1,paddingHorizontal:20,backgroundColor:'#4D9BDC'}}>
        <TouchableOpacity
        style={{width:'100%',height:100,marginBottom:30,flexDirection:'row',backgroundColor:'#FFF75A',marginTop:60,borderWidth:2,borderRadius:7,borderColor:'white'}}>
<Image source={userInfo && userInfo.anh && userInfo.anh[0] ? {uri: userInfo.anh[0]} : require('../Asset/b.jpg')}
            style={{width:60,height:60,borderRadius:30,marginTop:18,marginLeft:10}}></Image>
            <View style={{flexDirection:'column',marginTop:24,marginLeft:10}}>
            {userInfo ? (
    <>
      <Text style={styles.txt4}>{userInfo && userInfo.hoten ? userInfo.hoten: 'Vũ Văn Việt'}</Text>
      <Text style={styles.txt5}>{userInfo && userInfo.email ? userInfo.email: 'vietvvph32598@fpt.edu.vn'}</Text>
    </>
  ) : (
    <Text>Loading...</Text>
  )}
            </View>

        </TouchableOpacity>
 <Text style={styles.txt}>Nổi Bật</Text>
        <View style={{backgroundColor:'#E13E46',height:2,width:"100%",marginBottom:15}}></View>
        <TouchableOpacity style={styles.btn} onPress={()=>props.navigation.navigate('ChinhSua',{item:userInfo})}>
            <View style={{flexDirection:'row'}}>
            <Text style={styles.txt1}>Chỉnh Sửa Thông Tin</Text>
            <Text style={styles.txt2}>➠</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>props.navigation.navigate('LichSu')}>
        <View style={{flexDirection:'row'}}>
            <Text style={styles.txt1}>Lịch Sử Mua Hàng</Text>
            <Text style={styles.txt2}>➠</Text>
            </View>
        </TouchableOpacity>
        <Text style={styles.txt}>Chung</Text>
        <View style={{backgroundColor:'#E13E46',height:2,width:"100%",marginBottom:15}}></View>
        <TouchableOpacity style={styles.btn} onPress={()=>setModalVisible(true)}>
            <View style={{flexDirection:'row'}}>
            <Text style={styles.txt1}>Trung Tâm Hỗ Trợ</Text>
            <Text style={styles.txt2}>➠</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>setModalVisible(true)}>
        <View style={{flexDirection:'row'}}>
            <Text style={styles.txt1}>Giới Thiệu</Text>
            <Text style={styles.txt2}>➠</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>props.navigation.navigate('Q&A')}>
        <View style={{flexDirection:'row'}}>
            <Text style={styles.txt1}>Q & A</Text>
            <Text style={styles.txt2}>➠</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>setModalVisible(true)}>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.txt1}>Điều Khoản VStore</Text>
                <Text style={styles.txt2}>➠</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={()=>setModalVisible(true)}>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.txt1}>Yêu Cầu Xóa Tài Khoản</Text>
                <Text style={styles.txt2}>➠</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}onPress={()=>onSignOut()}>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.txt1}>Đăng Xuất</Text>
                <Text style={styles.txt2}>➠</Text>
                </View>
            </TouchableOpacity>
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
            <View style={styles.khung}>
                <Text style={styles.txt7}>Đang Nâng Cấp</Text>
             <TouchableOpacity
              style={styles.btn}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.txt6} >Đóng</Text>
            </TouchableOpacity>
            </View>
        </Modal>
    </SafeAreaView>
  )
}

export default CaNhan

const styles = StyleSheet.create({
    txt:{marginTop:20,paddingLeft:10,color:'#E13E46',fontSize:25,height:30,backgroundColor:'#61EE51'},
    txt1:{color:'#4D9BDC',fontSize:20},
    txt2:{color:'#4D9BDC',fontSize:20,position:'absolute',right:10},
    txt4:{color:'#4D9BDC',fontSize:20,fontWeight:'bold'},
    txt5:{color:'#E13E46',fontSize:15,fontWeight:'300'},
    txt6:{color:'#4D9BDC',fontSize:20,fontWeight:'bold',textAlign:'center'},
    txt7:{color:'#E13E46',fontSize:20,fontWeight:'bold',textAlign:'center'},

    btn:{backgroundColor:'#FFF75A',marginTop:10,borderWidth:2,borderRadius:7,borderColor:'white',paddingHorizontal:10},
    khung:{width:300,height:150,padding:20,justifyContent:'center',alignContent:'center',marginTop:300,marginLeft:55,backgroundColor:'#61EE51',borderWidth:5,borderColor:'white'}

})