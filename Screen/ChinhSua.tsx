import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ImageLibraryOptions, ImagePickerResponse, OptionsCommon, launchImageLibrary } from 'react-native-image-picker';
import { HOST } from './config';

interface Props {
  navigation: any;
}

interface RouteProps {
  route: {
    params?: {
      item?: {
        id: string;
        hoten: string;
        email: string;
        sodienthoai: string;
        matkhau: string;
        anh:string;
      };
    };
  };
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

const ChinhSua = ({ navigation, route }: Props & RouteProps) => {
  const { item } = route.params || {};
  const [hoTen, setHoTen] = useState(item?.hoten || '');

  const [email, setEmail] = useState(item?.email || '');
  const [soDienThoai, setSoDienThoai] = useState(item?.sodienthoai || '');
  const [matKhau, setMatKhau] = useState(item?.matkhau || '');
  const [img, setImg] = useState(item?.anh || '');
  const [id, setId] = useState(item?.id || '');


  const [images, setImages] = useState<ImagePickerResponse['assets'] >(img ? [{ uri: `${img}` }] : []);
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
const capNhat=()=>{
  if(!hoTen||!email||!soDienThoai||!matKhau){
      Alert.alert('Hãy Nhập Đủ Thông Tin!');
      return;
  }
  const emailPattern=(kt:string)=>{
 const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  return emailPattern.test(kt);
  }
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
const anhData = base64Images.length > 0 ? base64Images : [img];
  let objData = {hoten: hoTen, email: email, sodienthoai: soDienThoai, matkhau: matKhau ,anh:anhData};

      fetch(`${HOST}/nguoidung/`+id, {
          method: 'PUT',
          headers: {
            Accpet: 'application/json',
            'Content-type': 'application/json',
          },
        body: JSON.stringify(objData)
      })
      .then((res) => {
        if (res.status == 200) {
          Alert.alert('Cập Nhật Thành Công!');
        }
      })
      .catch((lỗi) => {
        console.log(lỗi);
      });
    }
 


  const confirmLuu = () => {
    Alert.alert(
      'Thông Báo Cập Nhật',
      'Bạn Có Chắc Chắn Cập Nhật Không?',
      [
        { text: 'Không', style: 'cancel' },
        { text: 'Có', onPress: () => {capNhat()} }
      ]
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4D9BDC', padding: 20, alignItems: 'center' }}>
      <Image source={{uri: `${img}`}} style={styles.img} />
      <Text style={styles.txt}>Thông tin sẽ được lưu cho lần mua kế tiếp. Bấm vào thông tin chi tiết để chỉnh sửa.</Text>
      <TextInput
        style={styles.input}
        placeholder='    Nhap Ho Ten'
        placeholderTextColor={'gray'}
        value={hoTen}
        onChangeText={text => setHoTen(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='    Nhap Gmail'
        placeholderTextColor={'gray'}
        value={email}
        onChangeText={text => setEmail(text)}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder='    Nhap So Dien Thoai'
        placeholderTextColor={'gray'}
        value={soDienThoai}
        onChangeText={text => setSoDienThoai(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='    Nhap Mat Khau'
        placeholderTextColor={'gray'}
        value={matKhau}
        onChangeText={text => setMatKhau(text)}
      /> 
    <View style={{flexDirection:'row',marginTop:10}}>
      <Text style={styles.txt8}>Cập Nhật Ảnh Đại Diện ➠ </Text>

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
      <TouchableOpacity style={styles.btnLuu} onPress={()=>{confirmLuu()}}>
        <Text style={styles.txt4}>Lưu Thông Tin</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default ChinhSua

const styles = StyleSheet.create({
  img: { width: 100, height: 100, borderRadius: 50, marginTop: 90 },
  txt: { width: 370, marginVertical: 20, fontSize: 16, color: '#61EE51' },
  input: { borderWidth: 2, borderColor: '#FFF75A', fontSize: 20, borderRadius: 10, width: 370, marginBottom: 10, backgroundColor: '#F3F3F1' },
  btnLuu: { backgroundColor: '#FFF75A', width: 370, height: 50,marginTop:20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', borderRadius: 10 },
  txt4: { color: '#4D9BDC', fontSize: 25, },
  txt8:{color:'#FFF75A',textAlignVertical:'center',marginRight:6,marginLeft:16},
  image: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius:30
  },
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

})
