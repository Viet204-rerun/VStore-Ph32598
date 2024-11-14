import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ImageLibraryOptions, ImagePickerResponse, OptionsCommon, launchImageLibrary } from 'react-native-image-picker';
import { HOST } from './config';

interface Props {
  navigation: any; // hoặc bạn có thể chỉ định kiểu dữ liệu chính xác của navigation
}
const convertImageToBase64 = async (uri: string): Promise<string | undefined> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return base64Data;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return undefined;
  }
};
const DangKy = (props:Props) => {
    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [soDienThoai, setSoDienThoai] = useState<string>();
    const [matKhau, setMatKhau] = useState('');
    const [images, setImages] = useState<ImagePickerResponse['assets'] >([]);
    const [base64Images, setBase64Images] = useState<string[]>([]);
    const commonOptions: OptionsCommon = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
  };
  const libraryOptions: ImageLibraryOptions = {
      selectionLimit: 10,
      ...commonOptions
  };
  const onOpenLibrary = async () => {
      const response: ImagePickerResponse = await launchImageLibrary(
          libraryOptions,
      );
      if (response?.assets) {
          const newBase64Images = await Promise.all(
            response.assets.map(async (asset) => {
              const base64Image = await convertImageToBase64(asset.uri);
              return base64Image || '';
            })
          )
          setBase64Images(newBase64Images);
          setImages(response.assets);
      } else {
          Alert.alert('Có lỗi xảy ra', response.errorMessage || 'Không có lỗi được thông báo');
      }
  };
  


    const dangKy=()=>{
        if(!hoTen||!email||!soDienThoai||!matKhau){
            Alert.alert('Hãy Nhập Đủ Thông Tin!');
            return;
        }
        const emailPattern=(kt:string)=>{
       const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        return emailPattern.test(kt);
        }
        // const emailPattern1=(kt)=>{
        //     const emailPatternFPT = /^[a-zA-Z0-9._%+-]+@fpt\.vn$/;

        //      return emailPatternFPT.test(kt);
        //      }
        if(!emailPattern(email)){
            Alert.alert('Hãy Nhập Đúng định Dạng Email!')
            return;
        }
        const phonePattern = /^\d+$/;
        if (!phonePattern.test(soDienThoai)) {
            Alert.alert('Số điện thoại Phải Là Số! Hãy nhập lại.');
            return;
        }
        const phoneNumberPattern = /^[0-9]{10}$/;
        if (!phoneNumberPattern.test(soDienThoai)) {
            Alert.alert('Số Điện Thoại Phải Là 10 Chữ Số! Hãy nhập lại.');
            return;
        }
        if (images?.length === 0) {
          Alert.alert('Hãy Chọn Ảnh!');
          return;
      }
    
        let objData = {hoten: hoTen, email: email, sodienthoai: soDienThoai, matkhau: matKhau ,anh:base64Images};

        // Đầu tiên, thực hiện một yêu cầu GET để kiểm tra xem email đã tồn tại hay chưa
        fetch(`${HOST}/nguoidung?email=${email}`, {
          method: 'GET',
          headers: {
            Accpet: 'application/json',
            'Content-type': 'application/json',
          }
        })
        .then((response) => response.json())
        .then((data) => {
          // Kiểm tra dữ liệu trả về từ yêu cầu GET
          if (data.length > 0) {
            // Email đã tồn tại, không thêm mới
            Alert.alert('Email Đã Tồn Tại!')
          } else {
            // Email chưa tồn tại, tiến hành thêm mới
            fetch(`${HOST}/nguoidung`, {
                method: 'POST',
                headers: {
                  Accpet: 'application/json',
                  'Content-type': 'application/json',
                },
              body: JSON.stringify(objData)
            })
            .then((res) => {
              if (res.status == 201) {
                // Sau khi đăng ký thành công
props.navigation.navigate('DangNhap', {
  taiKhoanParams: email, // Truyền email làm tên tài khoản
  matKhauParams: matKhau ,// Truyền mật khẩu
  anhParams: base64Images,
  hoTenParams:hoTen,
  soDienThoaiParams:soDienThoai
});

                Alert.alert('Đăng Ký Thành Công!');
              }
            })
            .catch((lỗi) => {
              console.log(lỗi);
            });
          }
        })
        .catch((lỗi) => {
          console.log(lỗi);
        });
        

    }
    return (
      <View style={{flex:1}}>
          <Image source={require('../Asset/logo2.jpg')} style={{width:412,height:120,resizeMode:'repeat'}}></Image>
      <View style={styles.khung}>
      <View style={{alignItems:'center'}}>
        <Text style={styles.txt}>Đăng Ký</Text>
        <Text style={styles.txt1}>Tạo Tài Khoản</Text>
        <TextInput placeholder='    Nhập họ tên'placeholderTextColor={'gray'} style={styles.inputTaiKhoan}onChangeText={(txt)=>{setHoTen(txt)}}></TextInput>
        <TextInput placeholder='    Nhập email'placeholderTextColor={'gray'} style={styles.inputTaiKhoan}onChangeText={(txt)=>{setEmail(txt)}}></TextInput>
        <TextInput placeholder='    Nhập số điện thoại'placeholderTextColor={'gray'} style={styles.inputTaiKhoan}onChangeText={(txt)=>{setSoDienThoai(txt)}}></TextInput>
        <TextInput placeholder='    Nhập mật khẩu'placeholderTextColor={'gray'} style={styles.inputTaiKhoan}onChangeText={(txt)=>{setMatKhau(txt)}}></TextInput>

        <View style={{flexDirection:'row',marginTop:10}}>
      <Text style={styles.txt8}>Thêm Ảnh Đại Diện    ➠ </Text>

        {images && images.map((image, index) => (
        
        <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.image}
        />
    ))}

        <TouchableOpacity style={styles.button} onPress={onOpenLibrary}>
                <Text style={styles.buttonText}>Mở Thư Viện</Text>
            </TouchableOpacity>
            </View>
        </View>
        <View style={{flexDirection:'row',paddingTop:20,marginLeft:17}}>
      <Text style={styles.txt6}>Để Đăng Ký Tài Khoản, bạn đồng ý </Text>
      <TouchableOpacity>
          <Text  style={styles.txt7}> Terms & Conditions                        </Text>
      </TouchableOpacity>
      </View>
      <View style={{flexDirection:'row',marginLeft:17,marginBottom:10}}>

      <Text style={styles.txt6}>and </Text>
      <TouchableOpacity>
          <Text  style={styles.txt7}>Privacy Policy</Text>
      </TouchableOpacity>

      </View>
        
      <TouchableOpacity style={styles.btnDangNhap} onPress={()=>dangKy()}>
          <Text style={styles.txt4}>Đăng Ký</Text>
      </TouchableOpacity>
      <View style={{flexDirection:'row',marginLeft:17,marginTop:20}}>
          <View style={{height:1,width:185,backgroundColor:'#FFF75A'}}></View>
      <View style={{height:1,width:190,backgroundColor:'#FFF75A'}}></View>
      </View>
  
      <View style={{flexDirection:'row',paddingTop:20,alignItems:'center',justifyContent:'center'}}>
      <Text style={styles.txt6}>Tôi Đã Có Tài Khoản.  </Text>
      <TouchableOpacity onPress={()=>props.navigation.navigate('DangNhap')}>
          <Text  style={styles.txt7}> Đăng Nhập</Text>
      </TouchableOpacity>
      </View>
    
  </View>
      </View>
    )
  }
  
  export default DangKy
  
  const styles = StyleSheet.create({
      khung:{backgroundColor:'#4D9BDC',flex:1},
      txt:{fontSize:30,color:'#FFF75A',fontWeight:'bold',marginTop:20},
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
      imgGG:{width:50,height:50,marginRight:50},
      imgFB:{width:50,height:50},
      txt6:{color:'#FFF75A'},
      
      txt7:{color:'#FFF75A', fontWeight:'bold'},
      txt8:{color:'#FFF75A',textAlignVertical:'center',marginRight:15,marginLeft:16},

      button: {
        backgroundColor: '#FCF4A4',
        borderRadius: 7,
        width:"30%",
        marginHorizontal:20,
        borderWidth:3,borderColor:'white',
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText: {
        color: '#8EC5F3',
        fontSize: 16,
        fontWeight: 'bold',
  
    },
  
    image: {
      width: 60,
      height: 60,
      resizeMode: 'cover',
      borderRadius:30
    },
  })