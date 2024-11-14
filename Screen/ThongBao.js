import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HOST } from './config';

const ThongBao = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dsDatHang, setDsDatHang] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selected,setSelected] = useState(null)
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
  React.useEffect(()=>{
    const unb = props.navigation.addListener('focus',()=>{
      getDs();
    })
    return unb;
  },[props.navigation])

  const renderItem=({item})=>{
  const show=(tb)=>{
  setSelected(tb);
  setModalVisible2(true)
  }
    return(
      <TouchableOpacity onPress={()=>show(item)}>
      <View style={styles.khung1}>
      <View style={{flexDirection:'row'}}>
      <Image source={{uri:item.anh}}
      style={{width:40,height:40,marginTop:7}}></Image>
      <View style={{flexDirection:'column',marginLeft:10,width:320}}>
        <Text style={styles.txt5} >Đã xác nhận thanh toán {item.vanchuyen}</Text>
        <Text style={styles.txt6} >Đơn hàng {item.id} đã được xác nhận. Vui lòng chờ đợi thêm 
        thời gian để vận chuyển hàng hãy chú ý cuộc gọi thời gian tới.</Text>
      </View>
</View>
      </View>
      </TouchableOpacity>
    )
  }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F3F3F1'}}>
      <View style={{padding:20}}>
      <TouchableOpacity style={styles.btn} onPress={()=>setModalVisible(true)}>
            <View style={{flexDirection:'row'}}>
            <Text style={styles.txt1}>Khuyến Mãi</Text>
            <Text style={styles.txt2}>➠</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>setModalVisible(true)}>
            <View style={{flexDirection:'row'}}>
            <Text style={styles.txt1}>Live & Video</Text>
            <Text style={styles.txt2}>➠</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>setModalVisible(true)}>
            <View style={{flexDirection:'row'}}>
            <Text style={styles.txt1}>Thông Tin Tài Chính</Text>
            <Text style={styles.txt2}>➠</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>setModalVisible(true)}>
            <View style={{flexDirection:'row'}}>
            <Text style={styles.txt1}>Cập Nhật VStore</Text>
            <Text style={styles.txt2}>➠</Text>
            </View>
        </TouchableOpacity>
        </View>
        <View style={styles.khung}>
        <View style={{flexDirection:'row',margin:15}}>
          <Text style={styles.txt3}>Cập Nhật Đơn Hàng</Text>
          <Text style={styles.txt4}>Đọc Tất Cả</Text>
        </View>
        {isLoading?
        <ActivityIndicator></ActivityIndicator>:
        <FlatList
        data={dsDatHang}
        renderItem={renderItem}
        keyExtractor={item=>item.id}
        ></FlatList>
}
        </View>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
            <View style={styles.khung3}>
                <Text style={styles.txt8}>Đang Nâng Cấp</Text>
             <TouchableOpacity
              style={styles.btn1}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.txt7} >Đóng</Text>
            </TouchableOpacity>
            </View>
        </Modal>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible2(!modalVisible2);
        }}>

            <View style={styles.khung4}>
        {selected&&(
            <View>
              <Image source={{uri:selected.anh}}
              style={{width:50,height:50,resizeMode:'stretch',marginLeft:140}}></Image>
            <Text style={styles.txt8}>Tên Sản Phẩm: {selected.ten}</Text>
            <Text style={styles.txt8}>Số Lượng: {selected.soluong} sản phẩm</Text>
            <Text style={styles.txt8}>Tên Khách Hàng: {selected.hoten}</Text>
            <Text style={styles.txt8}>Địa Chỉ: {selected.diachi}</Text>
            <Text style={styles.txt8}>Số Điện Thoại: {selected.sodienthoai}</Text>
            <Text style={styles.txt8}>PT Vận Chuyển: {selected.vanchuyen}</Text>
            <Text style={styles.txt8}>PT Thanh Toán: {selected.thanhtoan}</Text>
            <Text style={styles.txt8}>Tổng Tiền: {selected.tongtien}₫</Text>
            <Text style={styles.txt8}>Thời Gian: {selected.thoigian}</Text>
</View>

)}
             <TouchableOpacity
              style={styles.btn1}
              onPress={() => setModalVisible2(!modalVisible2)}>
              <Text style={styles.txt7} >Đóng</Text>
            </TouchableOpacity>
            </View>
        </Modal>
        
    </SafeAreaView>
  )
}

export default ThongBao

const styles = StyleSheet.create({
  txt1:{color:'#4D9BDC',fontSize:20},
  txt2:{color:'#4D9BDC',fontSize:20,position:'absolute',right:10},
  txt3:{color:'#FFF75A',fontSize:15},
  txt4:{color:'#61EE51',fontSize:15,position:'absolute',right:10},
  txt5:{fontSize:20,color:'#E13E46'},
  txt6:{fontSize:15,color:'#E48954'},
  btn:{backgroundColor:'#FFF75A',height:50,justifyContent:'center',marginTop:10,borderWidth:2,borderRadius:7,borderColor:'white',paddingHorizontal:10},
  khung:{flex:1,backgroundColor:'#4D9BDC',borderWidth:2,borderColor:'#61EE51'},
  khung1:{backgroundColor:'#8FC0E7',margin:10,padding:10,borderWidth:2,borderColor:'#61EE51'},
  txt7:{color:'#4D9BDC',fontSize:20,fontWeight:'bold',textAlign:'center'},
  txt8:{color:'#E13E46',fontSize:20,fontWeight:'bold',textAlign:'center'},

  btn1:{backgroundColor:'#FFF75A',marginTop:10,borderWidth:2,borderRadius:7,borderColor:'white',paddingHorizontal:10},
  khung3:{width:300,height:150,padding:20,justifyContent:'center',alignContent:'center',marginTop:300,marginLeft:55,backgroundColor:'#61EE51',borderWidth:5,borderColor:'white'},
  khung4:{flex:1,padding:20,justifyContent:'center',alignContent:'center',marginVertical:180,marginHorizontal:15,backgroundColor:'#61EE51',borderWidth:5,borderColor:'white'}


})