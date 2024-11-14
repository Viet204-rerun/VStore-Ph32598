import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CheckBox from '@react-native-community/checkbox';
import ManHinhChinh from './ManHinhChinh';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { HOST } from './config';

const DangNhap = (props) => {
    const [state, setState] = React.useState(false);
    const [taiKhoan, setTaiKhoan] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [base64Images, setBase64Images] = useState([]);
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState();

    useEffect(() => {
      if (props?.route?.params?.taiKhoanParams && props?.route?.params?.matKhauParams && props?.route?.params?.anhParams  && props?.route?.params?.hoTenParams  && props?.route?.params?.soDienThoaiParams) {
        setTaiKhoan(props.route.params.taiKhoanParams);
        setMatKhau(props.route.params.matKhauParams);
        setBase64Images(props.route.params.anhParams)
        setHoTen(props.route.params.hoTenParams)
        setSoDienThoai(props.route.params.soDienThoaiParams)

      }
    }, [props?.route?.params]);

const dangNhap=()=>{
    if(!taiKhoan||!matKhau){
      Alert.alert('Hãy Nhập Đủ Thông Tin')
      return;
    }
     // Kiểm tra xem người dùng nhập vào là email hay số điện thoại
  let endpoint;
  if (taiKhoan.includes('@')) {
    // Nếu là email
    endpoint = `email=${taiKhoan}`;
  } else {
    // Nếu là số điện thoại
    endpoint = `sodienthoai=${taiKhoan}`;
  }

  // Thực hiện yêu cầu đăng nhập đến API
  fetch(`${HOST}/nguoidung?${endpoint}&matkhau=${matKhau}`, {
        method: 'GET',
        headers: {
          Accpet: 'application/json',
          'Content-type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((data) => {
        // Kiểm tra dữ liệu trả về từ yêu cầu đăng nhập
        if (data.length > 0) {
          // Đăng nhập thành công, chuyển hướng đến màn hình home
          props.navigation.navigate('Main',{
            userId:data[0].id
          });
          Alert.alert('Đăng Nhập Thành Công!')
          
          if (!state.react) {
            setTaiKhoan('');
            setMatKhau('');
          }
        
        } else {
          // Đăng nhập không thành công, hiển thị thông báo lỗi
          Alert.alert('Tài Khoản Hoặc Mật Khẩu Không Đúng!');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    };

    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        // Khởi tạo cấu hình cho Google Sign-In khi component được tạo ra
        GoogleSignin.configure({
            webClientId: '800689882506-hm096fqp6i22qlreso2dj40s1fr267rg.apps.googleusercontent.com',
            
        });
    }, []);

    async function onGoogleButtonPress() {
      try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
    
          // Trích xuất chi tiết người dùng bao gồm URL ảnh hồ sơ
          const { idToken, user: { photo } } = userInfo;
    
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
          await auth().signInWithCredential(googleCredential);
          
          // Ghi nhật ký URL của ảnh đại diện của người dùng
          console.log('URL Ảnh Đại Diện của Người Dùng:', photo);
    
          // Sau khi đăng nhập thành công, chuyển hướng đến màn hình chính hoặc xử lý ảnh hồ sơ ở đây
          props.navigation.navigate('Main');
    
          // Thiết lập trạng thái để biểu thị việc đăng nhập thành công
          setLoggedIn(true);
          
      } catch (error) {
          console.error('Lỗi Đăng Nhập Google:', error);
          // Xử lý lỗi đăng nhập ở đây
      }
    }
    
  
    useEffect(() => {
      if (loggedIn) {
          props.navigation.navigate('Main');
      }
  }, [loggedIn, props.navigation]);
  

  return (
    <View style={{flex:1}}>
        <Image source={require('../Asset/logo2.jpg')} style={{width:412,height:240,resizeMode:'stretch'}}></Image>
    <View style={styles.khung}>
    <View style={{alignItems:'center'}}>
      <Text style={styles.txt}>Chào Mừng !</Text>
      <Text style={styles.txt1}>Đăng Nhập Tài Khoản</Text>
      <TextInput placeholder='    Nhập email hoặc số điện thoại'placeholderTextColor={'gray'} style={styles.inputTaiKhoan} onChangeText={(txt)=>setTaiKhoan(txt)}value={taiKhoan}></TextInput>
      <TextInput placeholder='    Nhập mật khẩu'placeholderTextColor={'gray'} style={styles.inputTaiKhoan} onChangeText={(txt)=>setMatKhau(txt)}value={matKhau} secureTextEntry={true}></TextInput>
      </View>
      <View style={styles.checkboxWrapper}>
      <CheckBox
              value={state.react}
              onValueChange={value =>
                setState({
                  ...state,
                  react: value,
                })
              }
            />
        <Text style={styles.txt2}>Nhớ Tài Khoản</Text>
    <TouchableOpacity>
        <Text style={styles.txt3}>Quên Mật Khẩu</Text>
    </TouchableOpacity>
            </View>

    <TouchableOpacity style={styles.btnDangNhap}onPress={()=>dangNhap()}>
        <Text style={styles.txt4}>Đăng Nhập</Text>
    </TouchableOpacity>
    <View style={{flexDirection:'row',marginLeft:17,marginTop:20}}>
        <View style={{height:1,width:170,backgroundColor:'#FFF75A'}}></View>
    <Text style={styles.txt5}> Hoặc </Text>
    <View style={{height:1,width:170,backgroundColor:'#FFF75A'}}></View>
    </View>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity onPress={onGoogleButtonPress}>
        <Image source={require('../Asset/google.png')} style={styles.imgGG}></Image>
        </TouchableOpacity>


    </View>
    <View style={{flexDirection:'row',paddingTop:20,alignItems:'center',justifyContent:'center'}}>
    <Text style={styles.txt6}>Bạn Không Có Tài Khoản ?  </Text>
    <TouchableOpacity onPress={()=>{props.navigation.navigate('DangKy')}}>
        <Text  style={styles.txt7}> Tạo Tài Khoản</Text>
    </TouchableOpacity>
    </View>
  
</View>
    </View>
  )
}

export default DangNhap

const styles = StyleSheet.create({
    khung:{backgroundColor:'#4D9BDC',flex:1},
    txt:{fontSize:30,color:'#FFF75A',fontWeight:'bold',marginTop:10,marginTop:20},
    txt1:{fontSize:20,color:'#FFF75A',marginTop:10,marginBottom:10},
    inputTaiKhoan:{borderWidth:2,borderColor:'#FFF75A',borderRadius:10,width:380,marginTop:10,backgroundColor:'#F3F3F1'},
    checkboxWrapper: {
        flexDirection: 'row',
        paddingVertical: 15,
        marginLeft:10,
      },

    txt2:{color:'#FFF75A',marginTop:5},
    txt3:{color:'#FFF75A', fontWeight:'bold',position:'absolute',left:160,marginTop:5},
    btnDangNhap:{backgroundColor:'#FFF75A', marginLeft:15,width:380,height:50,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'white',borderRadius:10},
    txt4:{color:'#4D9BDC',fontSize:25,},
    txt5:{position:'relative',bottom:10,fontSize:12,fontWeight:'500',color:'#FFF75A'},
    imgGG:{width:50,height:50},
    imgFB:{width:50,height:50},
    txt6:{color:'#FFF75A'},
    txt7:{color:'#FFF75A', fontWeight:'bold'},



})