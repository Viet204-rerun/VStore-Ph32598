import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import moment from 'moment-timezone'
import { HOST } from './config';

const ThanhToan = (props) => {
    const [hoTen, setHoTen] = useState('')
    const [diaChi, setDiaChi] = useState('')
    const [soDienThoai, setSoDienThoai] = useState('')
    // const tongTien = props.route.params?.thanhtoan+'.000.000₫';
    const [gioHang, setGioHang] = useState(props.route.params?.gioHangChon)
    const layGioHang = gioHang[0]
    const anh=layGioHang.anh
    const ten=layGioHang.ten
    const soluong=layGioHang.soluong
    const gia=parseFloat(layGioHang.gia)
    const tongtien = gia*soluong+'0.000'
    const tongtien1 = parseFloat(tongtien)*1000000
// console.log(tongtien1);
    const [vanChuyen,setVanChuyen] = useState('')
    const [vanChuyen1,setVanChuyen1] = useState()
    const vanchuyen2 = vanChuyen1*1000
// console.log(vanchuyen2);
    const TongTien = tongtien1+vanchuyen2
    const [thanhToan,setThanhToan] = useState('')
    const [thoigian,setThoigian] = useState('')

    const objData={anh:anh,ten:ten,soluong:soluong,thoigian:thoigian,hoten:hoTen,diachi:diaChi,sodienthoai:soDienThoai,vanchuyen:vanChuyen,thanhtoan:thanhToan,tongtien:TongTien}

    const datHang=async()=>{
    
        const datetime = 
        moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')
        setThoigian(datetime)
        fetch(`${HOST}/dathang`,{
            method:'POST',
            headers:{
                Accpet:'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(objData),
        })
        .then((res)=>{
            if(res.status==201){
                Alert.alert('Đặt Hàng Thành Công!')
            }
        })
        .catch((ex)=>{
            console.log(ex);
        })
    }
    const confirmBackHome =()=>{
        Alert.alert(
            'Thông Báo !',
            'Bạn Có Chắc Chắn Đặt Hàng Không?',
            [
                {text:'Không',style:'cancel'},
                {text:'Có',onPress:datHang}
            ]
        )
    }
    const vanchuyen=()=>{
        setVanChuyen('Nhanh')
        setVanChuyen1(15)
    }
    const vanchuyen1=()=>{
        setVanChuyen('COD')
        setVanChuyen1(20)
    }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#4D9BDC'}}>
        <ScrollView style={{paddingHorizontal:20}}>
        <Text style={styles.txt}>Thông Tin Khách Hàng</Text>
        <View style={{backgroundColor:'#E13E46',height:2,width:"100%",marginBottom:15}}></View>
        <TextInput style={styles.input}
         placeholder='    Nhap Ho Ten' placeholderTextColor={'gray'} onChangeText={txt=>setHoTen(txt)}></TextInput>
         
  <TextInput style={styles.input}
         placeholder='    Nhap Dia Chi' placeholderTextColor={'gray'} onChangeText={txt=>setDiaChi(txt)}></TextInput>
  <TextInput style={styles.input}
         placeholder='    Nhap So Dien Thoai' placeholderTextColor={'gray'}onChangeText={txt=>setSoDienThoai(txt)}></TextInput>
 <Text style={styles.txt}>Phương Thức Vận Chuyển</Text>
        <View style={{backgroundColor:'#E13E46',height:2,width:"100%",marginBottom:10}}></View>
        <TouchableOpacity  style={[styles.btn, vanChuyen === 'Nhanh' ? {backgroundColor:'#E7B6DD'} : null]}
        onPress={() => vanchuyen()}
        >
            <Text style={styles.txt1}>Giao Hàng Nhanh - 15.000₫</Text>
            <Text style={styles.txt2}>Nhận Hàng Vào 20 Tháng 3 - 20 Tháng 12</Text>
        <View style={{backgroundColor:'#E48954',height:1,width:"100%",marginBottom:5}}></View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, vanChuyen === 'COD' ? {backgroundColor:'#E7B6DD'} : null]}
        onPress={() => vanchuyen1()}>
            <Text style={styles.txt1}>Giao Hàng COD - 20.000₫</Text>
            <Text style={styles.txt2}>Nhận Hàng Vào 30 Tháng 3 - 30 Tháng 12</Text>
        <View style={{backgroundColor:'#E48954',height:1,width:"100%",marginBottom:5}}></View>
        </TouchableOpacity >
        <View style={{height:10}}></View>
        <Text style={styles.txt}>Phương Thức Thanh Toán</Text>
        <View style={{backgroundColor:'#E13E46',height:2,width:"100%",marginBottom:15}}></View>
        <TouchableOpacity style={[styles.btn, thanhToan === 'Thẻ ATM' ? {backgroundColor:'#E7B6DD'} : null]}
        onPress={() => setThanhToan('Thẻ ATM')}>
            <Text style={styles.txt1}>Thẻ ATM</Text>
        <View style={{backgroundColor:'#E48954',height:1,width:"100%",marginBottom:5}}></View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, thanhToan === 'Thanh Toán Khi Nhận Hàng' ? {backgroundColor:'#E7B6DD'} : null]}
         onPress={() => setThanhToan('Thanh Toán Khi Nhận Hàng')}>
            <Text style={styles.txt1}>Thanh Toán Khi Nhận Hàng</Text>
        <View style={{backgroundColor:'#E48954',height:1,width:"100%",marginBottom:5}}></View>
        </TouchableOpacity>
        </ScrollView>
        <View style={styles.khung}>
            <View style={{borderWidth:2,borderColor:'#F3F3F1',padding:10}}>
            <View style={{flexDirection:'row',paddingTop:10}}>
            <Text style={styles.txt3}>Tổng Tiền Hàng</Text>
            <Text style={styles.txt4}>{tongtien}₫</Text>
            </View>
            <View style={{flexDirection:'row',paddingTop:10}}>
            <Text style={styles.txt3}>Phí Vận Chuyển</Text>
            <Text style={styles.txt4}>{vanchuyen2}₫</Text>
            </View>
            <View style={{flexDirection:'row',paddingTop:10}}>
            <Text style={styles.txt5}>Tổng Thanh Toán</Text>
            <Text style={styles.txt6}>{TongTien}₫</Text>
            </View>
            <TouchableOpacity style={styles.btn2} onPress={confirmBackHome}>
            <Text style={styles.txt7}>Đặt Hàng</Text>
            </TouchableOpacity>
        </View>
        </View>
    </SafeAreaView>
  )
}

export default ThanhToan

const styles = StyleSheet.create({
    txt:{color:'#E13E46',fontSize:25,width:'auto',height:30,backgroundColor:'#61EE51',marginTop:5,textAlign:'center'},
    input:{borderWidth:2,borderColor:'#FFF75A',fontSize:20,borderRadius:10,width:370,marginBottom:10,backgroundColor:'#F3F3F1'},
    txt1:{color:'#4D9BDC',fontSize:20},
    txt2:{color:'#E48954',fontSize:15},
    btn:{backgroundColor:'#FFF75A',marginTop:5,borderWidth:1,borderColor:'white',paddingHorizontal:10},
    khung:{width:"100%",backgroundColor:'#61EE51',height:220,padding:10},
    txt3:{color:'#FFF75A',fontSize:17},
    txt4:{color:'#E48954',fontSize:17,position:'absolute',right:0},
    txt5:{color:'#FFF75A',fontSize:20,fontWeight:'bold'},
    txt6:{color:'#E13E46',fontSize:20,fontWeight:'bold',position:'absolute',right:0},
    btn2:{width:'100%',height:50,backgroundColor:'#FFF75A',marginTop:20,borderRadius:20,borderColor:'white',borderWidth:3,justifyContent:'center',alignItems:'center'},
    txt7:{color:'#4D9BDC',fontSize:25,fontWeight:'bold'},
 
})